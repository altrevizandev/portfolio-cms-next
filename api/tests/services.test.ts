import assert from "node:assert/strict";
import { test } from "node:test";
import { compare, hash } from "bcryptjs";
import type { Account, Role } from "../prisma/generated/prisma/client.js";
import type { AccountContract } from "../src/contracts/AccountContract.js";
import type { AccountRoleContract } from "../src/contracts/AccountRoleContract.js";
import type { LoginCodeContract } from "../src/contracts/LoginCodeContract.js";
import type { MailContract, SendMailDTO } from "../src/contracts/MailContract.js";
import type { ProjectContract } from "../src/contracts/ProjectContract.js";
import type { RoleContract } from "../src/contracts/RoleContract.js";
import type { ExperienceContract } from "../src/contracts/ExperienceContract.js";
import type { TestimonialContract } from "../src/contracts/TestimonialContract.js";
import type { ProjectDetails } from "../src/entities/Project.js";
import { CreateAccountService } from "../src/services/account/Create-service.js";
import { SignInService } from "../src/services/auth/Sign-in-service.js";
import { ChangePasswordService } from "../src/services/auth/Change-password-service.js";
import { ProjectUpdateService } from "../src/services/project/Update-service.js";
import { ProjectReorderImagesService } from "../src/services/project/Reorder-images-service.js";
import { ExperienceCreateService } from "../src/services/experience/Create-service.js";
import { TestimonialCreateService } from "../src/services/testimonial/Create-service.js";
import { SendContactService } from "../src/services/contact/Send-contact-service.js";
import { ApiError } from "../src/utils/ApiError.js";

function stub<T extends object>(methods: Partial<T>): T {
  return new Proxy(methods as T, {
    get(target, key, receiver) {
      if (!(key in target)) return () => { throw new Error(`Unexpected dependency call: ${String(key)}`); };
      return Reflect.get(target, key, receiver);
    },
  });
}

const now = new Date("2026-09-21T12:00:00Z");
const role: Role = { id: 1, name: "Admin", slug: "admin", created_at: now, updated_at: now };
const account = (id: number, password = "hashed"): Account => ({
  id, name: `User ${id}`, email: `user${id}@example.com`, password,
  created_at: now, updated_at: now,
});
const expectStatus = (status: number) => (error: unknown) => error instanceof ApiError && error.statusCode === status;

test("account creation rejects an unknown role before persisting or sending mail", async () => {
  const service = new CreateAccountService(
    stub<AccountContract>({ findByEmail: async () => null }),
    stub<RoleContract>({ findBySlug: async () => null }),
    stub<MailContract>({}),
  );
  await assert.rejects(service.execute({ name: "User", email: "user@example.com", role: "missing" }), expectStatus(404));
});

test("account creation hashes the password and persists the role with the account", async () => {
  let saved: Parameters<AccountContract["create"]>[0] | undefined;
  let sent: SendMailDTO | undefined;
  const service = new CreateAccountService(
    stub<AccountContract>({ findByEmail: async () => null, create: async input => { saved = input; return account(1); } }),
    stub<RoleContract>({ findBySlug: async () => role }),
    { execute: async input => { sent = input; } },
  );
  service.generatePassword = async () => "Example-password!9";
  await service.execute({ name: "User", email: "user@example.com", role: "admin" });
  assert.ok(saved);
  assert.equal(saved.role_id, role.id);
  assert.notEqual(saved.password, "Example-password!9");
  assert.equal(await compare("Example-password!9", saved.password), true);
  assert.equal(sent?.to, "user@example.com");
  assert.equal(sent?.templateData?.password, "Example-password!9");
});

test("concurrent sign-ins on one service keep each account, password and code isolated", async () => {
  const accounts = [account(1, await hash("first-password", 4)), account(2, await hash("second-password", 4))];
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let lookups = 0;
  const codes: Parameters<LoginCodeContract["create"]>[0][] = [];
  const messages: SendMailDTO[] = [];
  const invalidated: number[] = [];
  const service = new SignInService(
    stub<AccountContract>({ findByEmail: async ({ email }) => {
      if (++lookups === 2) release();
      await gate;
      return accounts.find(a => a.email === email) ?? null;
    } }),
    stub<AccountRoleContract>({ findByAccountId: async ({ account_id }) => ({
      id: account_id, account_id, role_id: role.id, account: accounts[account_id - 1]!, role,
      created_at: now, updated_at: now,
    }) }),
    stub<LoginCodeContract>({
      invalidateAccountCodes: async ({ account_id }) => { invalidated.push(account_id); },
      create: async input => { codes.push(input); return { ...input, id: input.account_id, used_at: null, created_at: now, updated_at: now }; },
    }),
    { execute: async input => { messages.push(input); } },
  );
  const results = await Promise.all([
    service.execute({ email: accounts[0]!.email, password: "first-password" }),
    service.execute({ email: accounts[1]!.email, password: "second-password" }),
  ]);
  assert.deepEqual(results.map(r => r.email), accounts.map(a => a.email));
  assert.deepEqual(invalidated.sort(), [1, 2]);
  for (const a of accounts) {
    const code = codes.find(c => c.account_id === a.id)!;
    const message = messages.find(m => m.to === a.email)!;
    assert.ok(code.expires_at.getTime() > Date.now());
    assert.equal(await compare(String(message.templateData?.code), code.code_hash), true);
  }
});

test("invalid credentials never issue a login code or send mail", async () => {
  const service = new SignInService(
    stub<AccountContract>({ findByEmail: async () => account(1, await hash("correct", 4)) }),
    stub<AccountRoleContract>({}), stub<LoginCodeContract>({}), stub<MailContract>({}),
  );
  await assert.rejects(service.execute({ email: "user1@example.com", password: "wrong" }), expectStatus(404));
});

test("password changes pass a hash to persistence", async () => {
  let saved = "";
  const service = new ChangePasswordService(stub<AccountContract>({
    findById: async () => account(1),
    changePassword: async input => { saved = input.password; return account(1, saved); },
  }));
  await service.execute({ account_id: 1, password: "new-password" });
  assert.equal(await compare("new-password", saved), true);
});

const project: ProjectDetails = {
  id: "project-1", thumbnail: "/uploads/old.webp", title: "Project", slug: "project",
  is_public: false, application_url: null,
  description: "Description", objective: "Objective", challenge: null,
  status: "PUBLISHED", published_at: now, featured: false, sort_order: 0,
  created_at: now, updated_at: now, stacks: [],
  images: [{ id: "image-1", project_id: "project-1", path: "/uploads/one.webp", alt_text: null, sort_order: 4, created_at: now, updated_at: now }],
};

test("project updates preserve publication date, deduplicate stacks and append gallery order", async () => {
  let saved: Parameters<ProjectContract["update"]>[0] | undefined;
  const service = new ProjectUpdateService(stub<ProjectContract>({
    findById: async () => project, findBySlug: async () => ({ id: project.id }),
    countStacks: async ({ stack_ids }) => { assert.deepEqual(stack_ids, ["stack-1"]); return 1; },
    update: async input => { saved = input; return { ...project, ...input.data }; },
  }));
  const result = await service.execute({ project_id: project.id, data: {
    title: " Project ", description: " Description ", objective: " Objective ",
    status: "PUBLISHED", featured: false, sort_order: 0, stack_ids: ["stack-1", "stack-1"],
    thumbnail: "/uploads/new.webp", images: [{ path: "/uploads/two.webp", alt_text: null, sort_order: 0 }],
  } });
  assert.equal(saved?.data.published_at, now);
  assert.equal(saved?.data.title, "Project");
  assert.equal(saved?.images[0]?.sort_order, 5);
  assert.equal(result.replaced_thumbnail, project.thumbnail);
});

test("gallery reorder rejects missing, duplicate and foreign image IDs", async () => {
  const service = new ProjectReorderImagesService(stub<ProjectContract>({ findById: async () => project }));
  for (const image_ids of [[], ["image-1", "image-1"], ["foreign-image"]]) {
    await assert.rejects(service.execute({ project_id: project.id, image_ids }), expectStatus(400));
  }
});

test("career date validation rejects an end date before the start without persisting", async () => {
  const service = new ExperienceCreateService(stub<ExperienceContract>({}));
  assert.throws(() => service.execute({ data: {
    company: "Company", role: "Developer", description: "Description",
    start_date: "2026-01-01", end_date: "2025-01-01", current: false, sort_order: 0, published: true,
  } }), expectStatus(400));
});

test("testimonial creation stops when reCAPTCHA rejects the submission", async () => {
  const service = new TestimonialCreateService(stub<TestimonialContract>({}), {
    execute: async input => { assert.equal(input.expected_action, "submit_testimonial"); throw new ApiError("Rejected", 400); },
  });
  await assert.rejects(service.execute({ data: { author_name: "User", content: "Content", recaptcha_token: "bad" } }), expectStatus(400));
});

test("contact preserves reply address and attachment after reCAPTCHA verification", async () => {
  let verified = false;
  let message: SendMailDTO | undefined;
  const service = new SendContactService({ execute: async input => {
    assert.equal(input.expected_action, "send_contact"); verified = true; return 0.9;
  } }, { execute: async input => { assert.equal(verified, true); message = input; } });
  const attachment = { filename: "cv.pdf", content: Buffer.from("test"), contentType: "application/pdf" };
  await service.execute({ data: { name: "User", email: "user@example.com", subject: "Contact", message: "A message", recaptcha_token: "valid" }, attachment });
  assert.equal(message?.replyTo, "user@example.com");
  assert.deepEqual(message?.attachments, [attachment]);
});
