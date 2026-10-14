#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="${TMPDIR:-/tmp}/roy-build-tools/node_modules/.bin:$PATH"
npm install --prefix "${TMPDIR:-/tmp}/roy-build-tools" --no-audit --no-fund pnpm@10.34.4
export CI=true
pnpm install --frozen-lockfile --prod=false
export BASE_PATH=/
export PORT="${PORT:-10000}"
pnpm run build
node scripts/build-password-tool.mjs
