import assert from "node:assert/strict";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

test("HTTP routes preserve response schemas and authentication", async t => {
  const uploads = await mkdtemp(join(tmpdir(), "portfolio-api-test-"));
  process.env.UPLOAD_DIR = uploads;
  process.env.JWT_SECRET = "portfolio-test-secret-only";
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  process.env.PASS_CHARS = "abcdefghijklmnopqrstuvwxyz";
  process.env.PASS_NUMBERS = "0123456789";
  process.env.PASS_SPECIAL_CHARS = "!@#$";
  const { App } = await import("../src/app.js");
  const { ProjectRepository } = await import("../src/repositories/Project-repository.js");
  const { StackRepository } = await import("../src/repositories/Stack-repository.js");
  const { ExperienceRepository } = await import("../src/repositories/Experience-repository.js");
  const { EducationRepository } = await import("../src/repositories/Education-repository.js");
  const { TestimonialRepository } = await import("../src/repositories/Testimonial-repository.js");
  const { AccountRepository } = await import("../src/repositories/Account-repository.js");
  const { RoleRepository } = await import("../src/repositories/Role-repository.js");
  const { SendEmailService } = await import("../src/services/email/send-email-service.js");
  const app = new App();
  t.after(async () => { await app.app.close(); await rm(uploads, { recursive: true, force: true }); });
  t.mock.method(ProjectRepository.prototype, "listPublished", async () => []);
  t.mock.method(StackRepository.prototype, "list", async () => []);
  t.mock.method(ExperienceRepository.prototype, "listPublic", async () => []);
  t.mock.method(EducationRepository.prototype, "listPublic", async () => []);
  t.mock.method(TestimonialRepository.prototype, "listPublic", async () => []);
  t.mock.method(ProjectRepository.prototype, "findPublishedBySlug", async () => null);
  t.mock.method(AccountRepository.prototype, "findByEmail", async () => null);
  const now = new Date("2026-09-21T12:00:00Z");
  t.mock.method(RoleRepository.prototype, "findBySlug", async () => ({ id: 1, slug: "admin", name: "Admin", created_at: now, updated_at: now }));
  t.mock.method(AccountRepository.prototype, "create", async (input: { name: string; email: string }) => ({ id: 1, name: input.name, email: input.email, created_at: now, updated_at: now }));
  t.mock.method(SendEmailService.prototype, "execute", async () => {});
  await app.build();

  await t.test("public content endpoints keep their response envelopes", async () => {
    for (const [url, key] of [["/projects", "projects"], ["/stacks", "stacks"], ["/experiences", "experiences"], ["/education", "education"], ["/testimonials", "testimonials"]]) {
      const response = await app.app.inject({ method: "GET", url: url! });
      assert.equal(response.statusCode, 200, `${url}: ${response.body}`);
      assert.deepEqual(response.json(), { [key!]: [] });
    }
  });

  await t.test("admin content still requires authentication", async () => {
    const response = await app.app.inject({ method: "GET", url: "/admin/projects" });
    assert.equal(response.statusCode, 401);
    assert.equal(response.json().status, "ERROR");
  });

  await t.test("missing public projects retain the 404 error envelope", async () => {
    const response = await app.app.inject({ method: "GET", url: "/projects/missing" });
    assert.equal(response.statusCode, 404);
    assert.equal(response.json().status, "ERROR");
  });

  await t.test("account creation serializes only fields present in the portfolio schema", async () => {
    const response = await app.app.inject({ method: "POST", url: "/account", payload: { name: "User", email: "user@example.com", role: "admin" } });
    assert.equal(response.statusCode, 201, response.body);
    assert.deepEqual(response.json(), { account: { id: 1, name: "User", email: "user@example.com", created_at: now.toISOString(), updated_at: now.toISOString() } });
  });

  await t.test("invalid request bodies still fail schema validation", async () => {
    const response = await app.app.inject({ method: "POST", url: "/account", payload: { name: "User", role: "unknown" } });
    assert.equal(response.statusCode, 400);
  });

  await t.test("failed project creation removes files uploaded by that request", async () => {
    t.mock.method(ProjectRepository.prototype, "findBySlug", async () => ({ id: "existing-project" }));
    const boundary = "portfolio-test-boundary";
    const fields = { title: "Existing project", description: "Description", objective: "Objective" };
    const body = Object.entries(fields).map(([name, value]) =>
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    ).join("") + `--${boundary}\r\nContent-Disposition: form-data; name="thumbnail"; filename="test.png"\r\nContent-Type: image/png\r\n\r\ntest-image\r\n--${boundary}--\r\n`;
    const response = await app.app.inject({
      method: "POST", url: "/projects",
      headers: {
        authorization: `Bearer ${app.app.jwt.sign({ sub: 1, role: "admin" })}`,
        "content-type": `multipart/form-data; boundary=${boundary}`,
      },
      payload: body,
    });
    assert.equal(response.statusCode, 409, response.body);
    assert.deepEqual(await readdir(join(uploads, "projects", "thumbnails")), []);
  });
});
