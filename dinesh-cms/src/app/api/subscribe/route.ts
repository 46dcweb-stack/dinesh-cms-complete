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
    const { email, name, source, consent } = body;

    if (!consent) return NextResponse.json({ error: "Consent required" }, { status: 400 });
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

    const BREVO_API_KEY = (process.env.BREVO_API_KEY || "").trim();
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "3");

    if (BREVO_API_KEY) {
      try {
        // Add contact to list — Brevo automation will send confirmation email automatically
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
          body: JSON.stringify({
            email,
            attributes: {
              FIRSTNAME: name || "",
              SOURCE: source || "website",
            },
            listIds: [BREVO_LIST_ID],
            updateEnabled: true,
          }),
        });

        const resText = await res.text();
        console.log("[Brevo] Add contact status:", res.status, resText);
      } catch (e) {
        console.error("[Brevo] Error:", e);
      }
    }

    // Save to Firebase as "pending" — webhook will update to "confirmed"
    try {
      const db = getAdminDb();
      const existing = await db.collection("subscribers")
        .where("email", "==", email).limit(1).get();

      if (!existing.empty) {
        await db.collection("subscribers").doc(existing.docs[0].id).update({
          status: "pending",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await db.collection("subscribers").add({
          email,
          name: name || "",
          source: source || "homepage",
          status: "pending",
          consentTimestamp: FieldValue.serverTimestamp(),
          consentGiven: true,
          integrationFlag: BREVO_API_KEY ? "brevo" : "none",
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("[Firestore] Error:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Check your email to confirm subscription",
    });

  } catch (e: unknown) {
    console.error("[subscribe API] Error:", e);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
