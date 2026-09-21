import assert from "node:assert/strict";
import { test } from "node:test";
import { buildProjectData } from "../src/services/project/Project-data.js";
import { ApiError } from "../src/utils/ApiError.js";

const input = {
  title: "Aplicação", description: "Descrição", objective: "Objetivo",
  status: "PUBLISHED" as const, featured: false, sort_order: 0, stack_ids: [],
};

test("existing projects default to private without exposing an internal URL", () => {
  const result = buildProjectData({ ...input, application_url: "http://intranet.local" }, "/image.webp");
  assert.equal(result.is_public, false);
  assert.equal(result.application_url, null);
  assert.equal(result.status, "PUBLISHED");
});

test("public application links accept HTTP and HTTPS and trim whitespace", () => {
  for (const url of ["https://example.com/app", "http://example.com"]) {
    const result = buildProjectData({ ...input, is_public: true, application_url: ` ${url} ` }, "/image.webp");
    assert.equal(result.application_url, url);
    assert.equal(result.is_public, true);
  }
});

test("public applications require a valid web link without credentials", () => {
  for (const url of [null, "", "example.com", "javascript:alert(1)", "data:text/html,test", "ftp://example.com", "https://user:password@example.com"]) {
    assert.throws(() => buildProjectData({ ...input, is_public: true, application_url: url }, "/image.webp"),
      (error: unknown) => error instanceof ApiError && error.statusCode === 400);
  }
});

test("switching an application to private clears its previously public link", () => {
  const result = buildProjectData({ ...input, is_public: false, application_url: "https://example.com" }, "/image.webp");
  assert.equal(result.application_url, null);
});
