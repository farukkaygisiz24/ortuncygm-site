import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const root = process.cwd();
  const script = path.join(root, "scripts/sync-mevzuat-guncellemeleri.mjs");

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [script, "--list-only", "--force"],
      { cwd: root, stdio: "inherit" },
    );
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Senkron çıkış kodu: ${code}`));
    });
  });

  return NextResponse.json({
    ok: true,
    message: "Liste senkronu tamamlandı (Vercel Pro cron). Detaylar API ile veya GitHub Actions ile.",
  });
}
