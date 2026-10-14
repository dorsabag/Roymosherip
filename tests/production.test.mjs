import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Use an isolated LOCAL development database; this suite creates and deletes
// synthetic memories. Production services must never be a test target.
const dbUrl = new URL(process.env.DATABASE_URL ?? 'http://missing.invalid');
assert.ok(['localhost', '127.0.0.1'].includes(dbUrl.hostname), 'Local database required');
assert.equal(dbUrl.pathname, '/roy_production_smoke', 'Isolated test database required');
assert.ok(process.env.TEST_ADMIN_PASSWORD, 'TEST_ADMIN_PASSWORD required');
const port = 5090;
const base = `http://127.0.0.1:${port}`;
let child;
let cookie;
let memoryId;
let logs = '';
const request = (path, method = 'GET', body, authenticated = false, headers = {}) => fetch(base + path, {
  method, headers: { 'Content-Type': 'application/json', ...(authenticated ? { Cookie: cookie } : {}), ...headers },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

before(async () => {
  child = spawn(process.execPath, ['--enable-source-maps', 'artifacts/api-server/dist/index.mjs'], {
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port), STATIC_DIR: 'artifacts/roy-memorial/dist/public' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', data => { logs += data; });
  child.stderr.on('data', data => { logs += data; });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Server exited: ${logs}`);
    try { if ((await request('/api/healthz')).status === 200) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Server readiness timeout');
});
after(async () => {
  if (memoryId && cookie) await request(`/api/admin/memories/${memoryId}`, 'DELETE', undefined, true).catch(() => {});
  if (child && child.exitCode === null) {
    const stopped = new Promise(resolve => child.once('exit', resolve));
    child.kill('SIGTERM');
    await stopped;
  }
});

test('Production serves the public SPA, direct admin route, and uncropped image asset', async () => {
  for (const path of ['/', '/admin', '/unknown-route']) {
    const r = await request(path); assert.equal(r.status, 200);
    const html = await r.text(); assert.match(html, /lang="he" dir="rtl"/); assert.doesNotMatch(html, /PLACEHOLDER|maximum-scale/);
  }
  const image = await request('/images/roy/portrait.webp'); assert.equal(image.status, 200);
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), readFileSync('artifacts/roy-memorial/public/images/roy/portrait.webp'));
});

test('Unknown API routes and missing static files stay 404, private source is inaccessible', async () => {
  assert.equal((await request('/api/not-a-route')).status, 404);
  assert.equal((await request('/assets/not-present.js')).status, 404);
  assert.equal((await request('/render.yaml')).status, 404);
  assert.equal((await request('/attached_assets/manifest.json')).status, 404);
});

test('Pending submission remains private and invalid consent is rejected', async () => {
  assert.equal((await request('/api/admin/memories')).status, 401);
  assert.equal((await request('/api/memories', 'POST', { consent: false })).status, 400);
  const data = { name: 'Production smoke test', relationship: 'Synthetic test', promptKey: 'moment', memoryText: 'This is synthetic local test data, not a memory of Roy.', consent: true, email: 'test@example.invalid', website: '' };
  assert.equal((await request('/api/memories', 'POST', data)).status, 201);
  assert.deepEqual(await (await request('/api/memories')).json(), []);
});

test('TLS proxy gives a secure session and moderation publishes only approved public fields', async () => {
  const crossSite = await request('/api/admin/session', 'POST', { password: process.env.TEST_ADMIN_PASSWORD }, false, { Origin: 'https://example.invalid' });
  assert.equal(crossSite.status, 403);
  const login = await request('/api/admin/session', 'POST', { password: process.env.TEST_ADMIN_PASSWORD }, false, { 'X-Forwarded-Proto': 'https' });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/); assert.match(setCookie, /Secure/); assert.match(setCookie, /SameSite=Strict/);
  cookie = setCookie.split(';')[0];
  const rows = await (await request('/api/admin/memories', 'GET', undefined, true)).json();
  assert.equal(rows.length, 1); assert.equal(rows[0].status, 'pending'); memoryId = rows[0].id;
  assert.equal((await request(`/api/admin/memories/${memoryId}`, 'PATCH', { status: 'approved' }, true)).status, 200);
  const approved = await (await request('/api/memories')).json();
  assert.equal(approved.length, 1);
  assert.deepEqual(Object.keys(approved[0]).sort(), ['id', 'name', 'relationship', 'promptKey', 'memoryText'].sort());
  assert.equal((await request(`/api/admin/memories/${memoryId}`, 'PATCH', { status: 'rejected' }, true)).status, 200);
  assert.deepEqual(await (await request('/api/memories')).json(), []);
});

test('Deletion and logout revoke access', async () => {
  assert.equal((await request(`/api/admin/memories/${memoryId}`, 'DELETE', undefined, true)).status, 204); memoryId = undefined;
  assert.equal((await request('/api/admin/session', 'DELETE', undefined, true)).status, 204);
  assert.equal((await request('/api/admin/memories', 'GET', undefined, true)).status, 401);
});
