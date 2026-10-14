# Roy Moshe memorial on Sites

The production target is https://roy-moshe-memorial.dorsabag.chatgpt.site.
The Site ID is tracked in `.openai/hosting.json`; reuse it for future deployments.
The memorial is public. `/admin` redirects anonymous visitors through Sites' ChatGPT sign-in.
Only the owner's verified email, configured in the secret `ADMIN_EMAIL`, grants moderation access.
Signing in with another ChatGPT account does not grant administration.
Sign out uses Sites' top-level `/signout-with-chatgpt` navigation.

## Runtime and storage

`artifacts/sites-host` adapts the existing API to Cloudflare Workers and D1. The approved
React/Vite memorial and its public photographs remain in `artifacts/roy-memorial`.
The original Express/PostgreSQL implementation is retained for historical/local use;
production does not require a Node server, PostgreSQL, Render, a password hash, or the old development secrets.

The Workers API keeps the existing memory, moderation, and health routes and validators.
`GET /api/admin/session` reports the platform-authenticated owner's access. Production login
and logout are top-level Sites navigation, not password-based API calls. Every private API
operation independently checks the configured owner. Cross-origin writes are rejected.
Private API and administrator responses use `Cache-Control: private, no-store`.
The source, configuration, originals, and private copy reference are never served as assets.

Sites provisions the `DB` D1 binding and applies the generated schema-only migrations in
`drizzle/`. Pending/rejected memories and optional contributor email stay private. The
public query selects only approved memories and the five approved public fields.
Submissions enforce consent, honeypot, input validation, a streaming body limit, and a
durable five-request/15-minute per-IP limit. Rate-limit storage contains salted HMAC
digests rather than raw IP addresses. `RATE_LIMIT_SECRET` is a separately generated Sites
secret. No runtime secrets belong in Git, hosting.json, browser bundles, or chat.

## Build and verification

From the repository root with the frozen workspace dependencies installed:

```sh
pnpm run typecheck
pnpm --filter @workspace/sites-host run build
node --test tests/sites-worker.test.mjs
```

The build first builds the original frontend, then uses Cloudflare's Vite plugin and the
official vendored Sites `sites()` integration to produce `dist/server`, `dist/client`, and
`dist/.openai` with D1 migrations. The tests run the Worker against isolated real D1/SQLite
in Miniflare, with synthetic identity and submissions that never reach production.

Publish the exact pushed source commit and its matching `dist` archive through Sites.
Use public `save_site_version` / `deploy_site_version` after confirming public access;
do not use the owner-private publication operation. Keep the version and deployment IDs
returned by Sites when continuing a deployment.

No previous Replit visitor-memory export was supplied. The original deployment remains
unchanged. Import any existing visitor submissions privately before retiring it; never
place submissions or contact details in public source control.
