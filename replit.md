# Roy Moshe Memorial

Hebrew-first RTL memorial, with family-approved curated content and moderated visitor memories.
The authoritative PRD is in `.local/conversation-workspace/files/attached_assets/Roy_Moshe_Memorial_Website_—_Master_PRD_&_Replit_Build_Specific_1790237111349.md`.
Never invent personal information, dates, quotations, locations, music, photographs, relationships or circumstances about Roy. Missing content must remain explicitly marked descriptive placeholders. Never substitute stock or generated people/photos.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm --filter @workspace/roy-memorial run dev` — memorial frontend, managed workflow supplies its port/base path.
- `pnpm --filter @workspace/db run db:generate` and `db:migrate` — checked-in migrations for development; production schema changes use Replit Publish, not startup DDL.
- Admin requires `SESSION_SECRET` and `ADMIN_PASSWORD_HASH` (bcrypt hash) in Replit Secrets. No default credentials. `/admin` is intentionally not in public navigation.
- Generate a bcrypt hash locally without displaying the password: use a trusted password manager/bcrypt tool, or invoke bcryptjs locally with password read from a hidden terminal prompt. Only place the resulting hash in the secret form; never send credentials in chat.
- `lib/db/dev-memory-fixtures.json` contains explicit development-only placeholders; it is not imported or inserted at runtime and must never become public content.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

Keep the original PRD sections in order. Place the family-curated "הנצחה" media and website tributes section after October 7 and before the closing continuation. The family sends files and links to add through project updates; no self-service CMS, on-site uploads, analytics or visitor accounts.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
