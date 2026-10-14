# Cloud migration status

The selected production target is Sites, documented in [Sites deployment](sites-deployment.md).
The Workers/D1 adaptation preserves the existing memorial frontend, media, moderated memories,
and private submission details. Administration uses Sites' ChatGPT sign-in restricted to the owner.
The original imported version and Express/PostgreSQL implementation remain in Git history.

The original Replit project was imported from owner-supplied archives without changing its application source, package declarations, or lockfile. macOS metadata, previous build output, and compiler caches were omitted. The memorial's 48 public assets are included.

## Verified in the Codex cloud workspace

- Node.js 24.19.0 and pnpm 10.34.4, using frozen-lockfile installation.
- Full workspace type checking and production builds.
- PostgreSQL 17 development database with checked-in Drizzle migrations.
- Same-origin frontend/API gateway: port 8080, frontend 5173, API 5000.
- Public and admin document routing, API health, pending submissions, authentication, approval, rejection, private-field exclusion, deletion of synthetic records, and logout.
- All 48 public files served byte-for-byte.

Build warnings: frontend source-map diagnostics and a frontend JavaScript chunk above 500 kB. Browser interaction/accessibility and external Spotify, YouTube, and map service behavior have not yet been verified.

## Operations

Use the existing checkout in each isolated Codex task; no additional worktree is needed. The cloud environment's saved install script and startup skill contain runtime instructions. Development tooling and private runtime configuration are outside this source checkout under `/workspace/tooling` and `/workspace/runtime/roy`; credentials are not committed. Those directories belong to the cloud environment snapshot, not the Git repository.

## Before public deployment

Sites provides public hosting and D1 persistence. `ADMIN_EMAIL` and `RATE_LIMIT_SECRET`
are configured as Sites secrets; development credentials are not reused. `/api` uses the
Worker, and `/admin` has server-side authentication and authorization.

The ZIP imports do not establish that existing visitor memories were transferred. If live submissions exist, export and migrate the production database through a private, controlled process. Preserve the existing site until the new deployment and data are verified.

Remaining original root configuration (such as `.replit`, `.npmrc`, and the original `.gitignore`) and additional original media can be reconciled when supplied. Do not overwrite restored source or introduce unapproved biography content.
