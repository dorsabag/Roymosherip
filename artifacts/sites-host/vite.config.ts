import path from "node:path";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "./build/sites-vite-plugin";

const root = path.resolve(import.meta.dirname, "../..");
export default defineConfig({
  root,
  publicDir: "artifacts/roy-memorial/dist/public",
  plugins: [
    sites({ mockAuth: false }),
    cloudflare({ viteEnvironment: { name: "server" }, configPath: ".openai/worker.jsonc", inspectorPort: false }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: { input: "artifacts/sites-host/client-entry.js" },
  },
});
