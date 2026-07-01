import { NextResponse } from "next/server";
import { getOrFetchMevzuatDetail, readCachedMevzuatDetail } from "@/lib/ugmMevzuatSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    return NextResponse.json({ error: "Geçersiz slug" }, { status: 400 });
  }

  try {
    const cached = readCachedMevzuatDetail(slug);
    if (cached?.bodyHtml) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
      });
    }

    const detail = await getOrFetchMevzuatDetail(slug);
    if (!detail) {
      return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(detail, {
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Detay alınamadı";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
