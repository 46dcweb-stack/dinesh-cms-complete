// ─────────────────────────────────────────────────────────────────────────────
// On-demand IndexNow submission.
//
// Two ways in, because two different callers need it:
//  • a signed-in admin (the CMS, via a Firebase ID token) — same check the
//    revalidate endpoint uses, so no second secret to manage in the browser;
//  • a bearer secret (INDEXNOW_ADMIN_SECRET) for the sitemap script and CI,
//    which have no Firebase session.
//
// Left open only if neither is configured and no token is sent, which would let
// a stranger burn the submission quota — so an unauthenticated call is refused.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { submitUrlsToIndexNow } from "@/lib/indexnow";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const ADMIN_SECRET = process.env.INDEXNOW_ADMIN_SECRET;

async function authorised(req: NextRequest): Promise<boolean> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return false;

  if (ADMIN_SECRET && token === ADMIN_SECRET) return true;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const doc = await getAdminDb().collection("adminUsers").doc(decoded.uid).get();
    return doc.exists;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await authorised(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const urls: string[] = body?.urls ?? (body?.url ? [body.url] : []);
  if (!urls.length) {
    return NextResponse.json({ error: "no urls provided" }, { status: 400 });
  }

  const result = await submitUrlsToIndexNow(urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
