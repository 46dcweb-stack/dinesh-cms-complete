// ─────────────────────────────────────────────────────────────────────────────
// On-demand revalidation.
//
// Pages are ISR-cached, so a CMS edit would otherwise take up to ~2 minutes to
// appear. The admin calls this straight after saving so the change is live
// immediately.
//
// Access is gated on the caller's Firebase ID token belonging to a user in
// `adminUsers` — this endpoint must not be open, or it could be used to force
// constant cache misses.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { submitUrlsToIndexNow } from "@/lib/indexnow";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const decoded = await getAdminAuth().verifyIdToken(token);
    const adminDoc = await getAdminDb().collection("adminUsers").doc(decoded.uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json({ error: "Not an admin user" }, { status: 403 });
    }

    const { paths = [], tags = [], layout = false } = (await req.json()) as {
      paths?: string[];
      tags?: string[];
      layout?: boolean;
    };

    for (const t of tags) revalidateTag(t);
    // Note: sitemap.xml and llms.txt are metadata routes. revalidatePath does
    // not drop them, so they refresh on their own 60-second window instead.
    for (const p of paths) revalidatePath(p);

    // Site settings feed the root layout (nav, footer, metadata), so a change
    // there has to drop every page, not just the one being edited.
    if (layout) revalidatePath("/", "layout");

    // Tell search engines what changed. This is the only place that knows the
    // exact pages a CMS save touched, so every admin screen gets IndexNow for
    // free rather than each one having to remember to call it.
    //
    // Machine-readable routes are excluded: IndexNow wants the pages a crawler
    // should fetch, not the files that list them.
    const pageUrls = paths.filter(p => p.startsWith("/") && !p.includes("."));
    const indexnow = await submitUrlsToIndexNow(pageUrls);
    if (!indexnow.ok) {
      // Never fail the save over this — the revalidation already succeeded.
      console.error("[revalidate] IndexNow submission failed", indexnow.status, indexnow.body);
    }

    return NextResponse.json({ revalidated: true, paths, tags, layout, indexnow });
  } catch (err: any) {
    console.error("[revalidate]", err);
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 });
  }
}
