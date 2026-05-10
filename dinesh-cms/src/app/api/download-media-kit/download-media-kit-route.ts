import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow Firebase Storage URLs for security
  const isFirebase =
    url.startsWith("https://firebasestorage.googleapis.com") ||
    url.startsWith("https://storage.googleapis.com");

  if (!isFirebase) {
    return new NextResponse("URL not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(url);

    if (!upstream.ok) {
      return new NextResponse("Failed to fetch file", { status: 502 });
    }

    const contentType  = upstream.headers.get("content-type")  || "application/octet-stream";
    const buffer       = await upstream.arrayBuffer();

    // Derive a clean filename from the URL
    const rawName      = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "media-kit");
    const filename     = rawName.replace(/[^a-zA-Z0-9._-]/g, "_");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":        contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (err) {
    console.error("download-media-kit error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
