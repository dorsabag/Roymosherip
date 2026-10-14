# Continue the Roy Moshe memorial deployment with Sites

## Owner's request

Migrate the existing family memorial website and publish it using the Sites hosting used for the owner's other `dorsabag.chatgpt.site` projects. Maintain it through Codex with cloud-hosted source and media. Render was proposed prematurely and is not the selected destination. No Render account, subscription, deployment, or database was created.

The public memorial should be accessible to visitors; only `/admin` and private moderation data require authentication. The previous reference projects used `sites.save_version_and_deploy_private`. Do not assume that private publication is suitable for the memorial. Inspect the current Sites skill and tools to establish supported publication visibility before deploying.

## Source and requirements

- GitHub: `https://github.com/dorsabag/Roymosherip`, branch `main`.
- Detailed owner-supplied PRD: `docs/product-requirements.html`.
- Current architecture and content guidance: `replit.md`, `docs/migration-status.md`, and `artifacts/roy-memorial/docs/content-guide.md`.
- Frontend: `artifacts/roy-memorial` (React/Vite, Hebrew RTL).
- Backend: `artifacts/api-server` (Express).
- API contract: `lib/api-spec/openapi.yaml`; generated validators/client are in `lib/api-zod` and `lib/api-client-react`.
- Database: `lib/db`, PostgreSQL/Drizzle, checked-in migrations for memories and administrator sessions.
- Optimized public assets: `artifacts/roy-memorial/public` (48 files).
- Original images and sanitized copy reference: `attached_assets` (49 images, one copy reference, README and checksum manifest).

The unredacted original copy includes a written family-home address and is retained privately in the earlier cloud workspace, outside GitHub. That address must remain absent from the published site, nonvisual labels, and public source documents. Preserve the family-approved map pin according to the PRD. Never invent personal facts, images, quotations, or replacement stories. Keep existing approved site wording; the earlier copy reference differs in places and is not an instruction to overwrite it.

## Required next work

1. Read the actual Sites plugin skill and inspect its supported runtimes, database bindings, publication visibility, secret configuration, and deployment/source-registration workflow.
2. Use this repository's source and media; do not reuse credentials, project IDs, databases, or deployments from the owner's other projects.
3. Determine whether the current Express/PostgreSQL application can run on the supported Sites runtime. Previous projects used Worker deployments with D1, but this is historical evidence, not confirmation of the current runtime contract. If adaptation is required, preserve the same API, moderation, privacy, session, and abuse-protection behavior. A static-only publication must not be presented as a complete migration.
4. Provision persistence and administrator authentication through the platform's supported secure configuration. Do not reuse the earlier cloud workspace's generated development credentials in production. Do not ask for passwords, hashes, database URLs, or tokens in chat.
5. Build and validate the supported artifact, register the exact source commit using the Sites workflow, and publish with the owner-requested public visibility when supported. If public hosting is unsupported, report that precise blocker instead of silently publishing privately or switching providers.
6. Verify the actual public URL, direct `/admin` routing, public/API functionality, persistence, protected moderation, external media behavior, and mobile/desktop layout. Do not claim deployment until the platform reports success and live checks pass.

The owner already authorized building and deployment. Continue ordinary implementation and validation without requesting the same authorization again. Obtain only genuinely missing credentials or required platform approvals through supported secure flows.

## Verified work to retain

- Node 24.19.0, pnpm 10.34.4, frozen-lockfile installation, full workspace type checking and production builds pass. Package declarations and lockfile match the originals.
- Combined same-origin Node hosting is supported when `STATIC_DIR` points to the frontend build. API routes stay distinct from SPA routes; unknown API/static paths return 404 and source files are not served.
- Five local production-server tests in `tests/production.test.mjs` cover routing, pending submissions, login, HTTPS-proxy secure cookies, approval, public email exclusion, rejection, deletion, and logout. They require a local isolated `roy_production_smoke` PostgreSQL database and refuse remote databases. Adapt or supplement tests when the actual hosting runtime changes.
- Desktop/mobile Chromium checks passed for RTL, overflow, navigation, gallery lightbox/focus restoration, memory dialog, direct admin route, three-column desktop tributes, and rendering with third-party services blocked. Live Spotify/YouTube/map availability still needs verification.
- `scripts/build-password-tool.mjs` generates a self-contained browser-only bcrypt setup page. It does not configure server credentials by itself. Use it only if compatible with the actual platform's secure secret flow.
- Browser zoom restriction removed, navigation toggle label localized to Hebrew, approved hero wording used for metadata descriptions.
- Unfinished dictionary explanation, legacy card, and closing sentence omitted without inventing replacements. The supplied dictionary quote, closing heading, name, and dates remain.
- Non-failing build warnings remain for source-map reporting and frontend bundle size. Canonical/social URLs depend on the actual final public URL.

## Existing visitor submissions

No production database export was supplied, and no existing Replit visitor memories have been migrated. If real submissions exist, arrange a private export/import before retiring the original site. Never put private submissions or contact details into public source control. The original Replit deployment remains unchanged.

## Current blocker

The onboarding task exposes cloud-environment configuration tools, but no Sites publication tool, Sites skill, plugin activation tool for Sites, or task-handoff command. The source and PRD are ready for a task with the Sites plugin available. Previous Sites-enabled task titles include `Bucket List Migration` and `Knowledge Base Migration`; these establish the user's hosting precedent only and are not deployment targets for the memorial.
