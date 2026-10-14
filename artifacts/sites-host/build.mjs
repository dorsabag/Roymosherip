import { spawnSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { build } from "esbuild";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const frontend = path.join(root, "artifacts/roy-memorial");
const frontendBuild = spawnSync(process.execPath, [path.join(frontend, "node_modules/vite/bin/vite.js"), "build"], {
  cwd: frontend, stdio: "inherit", env: { ...process.env, PORT: "5173", BASE_PATH: "/", NODE_ENV: "production" },
});
if (frontendBuild.status !== 0) process.exit(frontendBuild.status ?? 1);
await rm(path.join(root, "dist"), { recursive: true, force: true });
// Bundle the existing generated validator implementation for isolated Node tests.
await build({ entryPoints: [path.join(import.meta.dirname, "worker/index.ts")], bundle: true,
  platform: "browser", format: "esm", outfile: path.join(import.meta.dirname, "dist/worker.mjs") });
const result = spawnSync(process.execPath, [path.join(import.meta.dirname, "node_modules/vite/bin/vite.js"), "build", "--config", path.join(import.meta.dirname, "vite.config.ts")], {
  cwd: root, stdio: "inherit", env: { ...process.env, CLOUDFLARE_CF_FETCH_ENABLED: "false", WRANGLER_SEND_METRICS: "false" },
});
if (result.status !== 0) process.exit(result.status ?? 1);
const config = JSON.parse(await readFile(path.join(root, "dist/server/wrangler.json"), "utf8"));
if (!config.assets?.directory || !config.d1_databases?.some(b => b.binding === "DB")) throw new Error("Incomplete Sites Worker artifact");
// Copy the generated migration journal unchanged; sites() handles this at build end.
console.log("Sites Worker and memorial assets built successfully");
