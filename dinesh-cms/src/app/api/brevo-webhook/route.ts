import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function getAdminDb() {
  if (getApps().length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key) {
      const cleaned = key.trim().replace(/\\n/g, "\n").replace(/\r/g, "");
      let sa: object;
      try { sa = JSON.parse(cleaned); }
      catch {
        const fixedKey = cleaned.replace(
          /"private_key"\s*:\s*"([\s\S]*?)(?<!\\)"/,
          (_, pk) => `"private_key":"${pk.replace(/\n/g, "\\n").replace(/\r/g, "")}"`
        );
        sa = JSON.parse(fixedKey);
      }
      initializeApp({ credential: cert(sa) });
    } else {
      const filePath = join(process.cwd(), "service-account.json");
      if (existsSync(filePath)) {
        initializeApp({ credential: cert(JSON.parse(readFileSync(filePath, "utf-8"))) });
      } else throw new Error("No Firebase service account found.");
    }
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Brevo Webhook]", JSON.stringify(body));

    const email = body.email || body.EMAIL;
    const event = body.event;

    if (!email) return NextResponse.json({ ok: true });

    const db = getAdminDb();

    if (event === "contact.subscribed" || event === "subscribe") {
      // Contact confirmed double opt-in
      const snap = await db.collection("subscribers")
        .where("email", "==", email).limit(1).get();

      if (!snap.empty) {
        await db.collection("subscribers").doc(snap.docs[0].id).update({
          status: "confirmed",
          confirmedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log("[Webhook] Confirmed:", email);
      } else {
        // Add if doesn't exist
        await db.collection("subscribers").add({
          email, status: "confirmed",
          source: "brevo-webhook",
          confirmedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    }

    if (event === "contact.unsubscribed" || event === "unsubscribe") {
      const snap = await db.collection("subscribers")
        .where("email", "==", email).limit(1).get();
      if (!snap.empty) {
        await db.collection("subscribers").doc(snap.docs[0].id).update({
          status: "unsubscribed",
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log("[Webhook] Unsubscribed:", email);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Brevo Webhook] Error:", e);
    return NextResponse.json({ ok: true }); // Always return 200 to Brevo
  }
}

// Brevo sends GET to verify webhook URL
export async function GET() {
  return NextResponse.json({ ok: true });
}
