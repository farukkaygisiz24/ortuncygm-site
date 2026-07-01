#!/usr/bin/env node
/**
 * Build öncesi mevzuat senkronu + sunucu API route hazırlığı.
 * SERVER_DEPLOY=1 → liste + tüm eksik detaylar + on-demand API
 * varsayılan → sadece liste (Vercel/statik build)
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const serverDeploy =
  process.env.SERVER_DEPLOY === "1" || process.env.VERCEL_DEPLOY === "1";

const API_SRC = path.join(ROOT, "server-routes/api");
const API_DEST = path.join(ROOT, "app/api");

function prepareApiRoutes() {
  fs.rmSync(API_DEST, { recursive: true, force: true });

  if (serverDeploy && fs.existsSync(API_SRC)) {
    fs.cpSync(API_SRC, API_DEST, { recursive: true });
    console.log("API route'lar etkin (Vercel/sunucu modu)");
  }
}

prepareApiRoutes();

if (process.env.SKIP_MEVZUAT_SYNC === "1") {
  process.exit(0);
}

const syncArgs = serverDeploy
  ? ["scripts/sync-mevzuat-guncellemeleri.mjs", "--list-only", "--force"]
  : ["scripts/sync-mevzuat-guncellemeleri.mjs", "--list-only"];

if (serverDeploy) {
  console.log("Sunucu/Vercel modu → liste senkronu (detaylar API ile)");
} else {
  console.log("Statik build → yalnızca mevzuat listesi güncelleniyor…");
}

const result = spawnSync("node", syncArgs, { cwd: ROOT, stdio: "inherit" });
process.exit(result.status ?? 1);
