import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { realpathSync } from "node:fs";
import { readFile, readdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(realpathSync(path.join(root, "artifacts/sites-host/node_modules/wrangler/package.json")));
const { Miniflare } = require("miniflare");
let mf, state, id, db;
const owner = { "oai-authenticated-user-id": "test-owner", "oai-authenticated-user-email": "owner@example.invalid" };
const visitor = { "oai-authenticated-user-id": "test-visitor", "oai-authenticated-user-email": "visitor@example.invalid" };
const synthetic = { name: "Synthetic runtime test", relationship: "Test fixture", promptKey: "moment",
  memoryText: "This is isolated automated test data, never a memory of Roy.", consent: true, email: "private@example.invalid", website: "" };
const request = (route, method = "GET", body, headers = {}) => mf.dispatchFetch("https://memorial.test" + route, {
  method, redirect: "manual", headers: { "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1", ...headers },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

before(async () => {
  state = await mkdtemp(path.join(tmpdir(), "roy-sites-test-"));
  mf = new Miniflare({ modules: true, scriptPath: path.join(root, "artifacts/sites-host/dist/worker.mjs"),
    compatibilityDate: "2026-05-15", compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"], d1Persist: state,
    bindings: { ADMIN_EMAIL: "owner@example.invalid", RATE_LIMIT_SECRET: "isolated-test-key" },
    assets: {
      directory: path.join(root, "dist/client"), binding: "ASSETS",
      routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true },
      assetConfig: { html_handling: "none", not_found_handling: "none" },
    },
  });
  db = await mf.getD1Database("DB");
  const sql = await readFile(path.join(root, "drizzle/0000_aberrant_justice.sql"), "utf8");
  for (const statement of sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean)) await db.prepare(statement).run();
});
after(async () => { await mf?.dispose(); if (state) await rm(state, { recursive: true, force: true }); });

test("Memorial routing preserves Hebrew, all public media bytes, and private source isolation", async () => {
  const response = await request("/");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /lang="he" dir="rtl"/);
  assert.equal((await request("/api/healthz")).status, 200);
  assert.equal((await request("/api/missing")).status, 404);
  assert.equal((await request("/assets/missing.js")).status, 404);
  assert.equal((await request("/attached_assets/manifest.json")).status, 404);
  assert.equal((await request("/.openai/hosting.json")).status, 404);
  assert.equal((await request("/unknown-route")).status, 404);
  const publicRoot = path.join(root, "artifacts/roy-memorial/public");
  const files = await readdir(publicRoot, { recursive: true, withFileTypes: true });
  for (const file of files.filter(f => f.isFile())) {
    const absolute = path.join(file.parentPath, file.name);
    const relative = path.relative(publicRoot, absolute);
    const asset = await request("/" + relative);
    assert.equal(asset.status, 200, relative);
    assert.deepEqual(Buffer.from(await asset.arrayBuffer()), await readFile(absolute), relative);
  }
});

test("Administration requires the configured owner's dispatch identity, on pages and every API", async () => {
  const page = await request("/admin");
  assert.equal(page.status, 302);
  assert.equal(page.headers.get("Location"), "/signin-with-chatgpt?return_to=%2Fadmin");
  assert.equal((await request("/admin", "GET", undefined, visitor)).status, 403);
  const authorized = await request("/admin", "GET", undefined, owner);
  assert.equal(authorized.status, 200);
  assert.match(authorized.headers.get("Cache-Control"), /no-store/);
  assert.equal(authorized.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.deepEqual(await (await request("/api/admin/session")).json(), { authenticated: false, configured: true });
  assert.deepEqual(await (await request("/api/admin/session", "GET", undefined, owner)).json(), { authenticated: true, configured: true });
  for (const headers of [{}, visitor, { "oai-authenticated-user-email": owner["oai-authenticated-user-email"] }]) {
    assert.equal((await request("/api/admin/memories", "GET", undefined, headers)).status, 401);
    assert.equal((await request("/api/admin/memories/1", "PATCH", { status: "approved" }, headers)).status, 401);
    assert.equal((await request("/api/admin/memories/1", "DELETE", undefined, headers)).status, 401);
  }
  assert.equal((await request("/api/admin/memories/1", "PATCH", { status: "approved" }, { ...owner, Origin: "https://other.test" })).status, 403);
});

test("Consent, honeypot, types, field bounds, and body size are enforced before storage", async () => {
  const invalid = [{ ...synthetic, consent: false }, { ...synthetic, website: "spam.test" },
    { ...synthetic, name: "x" }, { ...synthetic, email: "invalid" }, { ...synthetic, promptKey: "invented" },
    { ...synthetic, memoryText: "x".repeat(20000) }];
  for (const [index, body] of invalid.entries()) {
    assert.equal((await request("/api/memories", "POST", body, { "CF-Connecting-IP": `192.0.2.${10 + index}` })).status, 400);
  }
  assert.equal((await request("/api/memories", "POST", synthetic, { Origin: "https://other.test" })).status, 403);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM memories").first()).n, 0);
});

test("Pending storage survives requests; moderation exposes only approved public fields", async () => {
  assert.equal((await request("/api/memories", "POST", { ...synthetic, name: "  " + synthetic.name + "  " })).status, 201);
  assert.deepEqual(await (await request("/api/memories")).json(), []);
  const rows = await (await request("/api/admin/memories", "GET", undefined, owner)).json();
  assert.equal(rows.length, 1); id = rows[0].id;
  assert.equal(rows[0].status, "pending");
  assert.equal(rows[0].email, synthetic.email);
  assert.equal(rows[0].name, synthetic.name);
  assert.equal((await request(`/api/admin/memories/${id}`, "PATCH", { status: "approved" }, owner)).status, 200);
  const approved = await (await request("/api/memories")).json();
  assert.equal(approved.length, 1);
  assert.deepEqual(Object.keys(approved[0]).sort(), ["id", "name", "relationship", "promptKey", "memoryText"].sort());
  assert.equal((await request(`/api/admin/memories/${id}`, "PATCH", { status: "rejected" }, owner)).status, 200);
  assert.deepEqual(await (await request("/api/memories")).json(), []);
  assert.equal((await request(`/api/admin/memories/${id}`, "DELETE", undefined, owner)).status, 204);
  assert.equal((await request(`/api/admin/memories/${id}`, "DELETE", undefined, owner)).status, 404);
});

test("Durable abuse protection rejects the sixth request and stores no raw IP", async () => {
  for (let i = 0; i < 5; i++) assert.equal((await request("/api/memories", "POST", { consent: false }, { "CF-Connecting-IP": "192.0.2.200" })).status, 400);
  const response = await request("/api/memories", "POST", synthetic, { "CF-Connecting-IP": "192.0.2.200" });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "900");
  const { results } = await db.prepare("SELECT key FROM rate_limits").all();
  for (const row of results) assert.match(row.key, /^[a-f0-9]{64}$/);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM memories").first()).n, 0);
});
