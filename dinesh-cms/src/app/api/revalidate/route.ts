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

    const { paths = [], tags = [] } = (await req.json()) as {
      paths?: string[];
      tags?: string[];
    };

    for (const t of tags) revalidateTag(t);
    for (const p of paths) revalidatePath(p);

    return NextResponse.json({ revalidated: true, paths, tags });
  } catch (err: any) {
    console.error("[revalidate]", err);
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 });
  }
}
