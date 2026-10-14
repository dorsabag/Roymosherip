#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Run as the hosting platform's pre-deploy step, never in web-server startup.
node lib/db/migrate-production.mjs
