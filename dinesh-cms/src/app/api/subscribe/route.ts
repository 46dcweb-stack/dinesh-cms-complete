import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function getAdminDb() {
  if (getApps().length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key) {
      const cleaned = key.trim().replace(/\\n/g, "\n");
      const sa = JSON.parse(cleaned);
      initializeApp({ credential: cert(sa) });
    } else {
      const filePath = join(process.cwd(), "service-account.json");
      if (existsSync(filePath)) {
        const sa = JSON.parse(readFileSync(filePath, "utf-8"));
        initializeApp({ credential: cert(sa) });
      } else {
        throw new Error("No Firebase service account found.");
      }
    }
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source, consent } = body;

    if (!consent) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const BREVO_API_KEY = (process.env.BREVO_API_KEY || "").trim();
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "1");
    const BREVO_WELCOME_TEMPLATE_ID = parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID || "0");
    let brevoSuccess = false;

    if (BREVO_API_KEY) {
      try {
        const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
          body: JSON.stringify({
            email,
            attributes: { FIRSTNAME: name || "", SOURCE: source || "website" },
            listIds: [BREVO_LIST_ID],
            updateEnabled: true,
          }),
        });
        if (contactRes.status === 201 || contactRes.status === 204) {
          brevoSuccess = true;
        } else {
          const err = await contactRes.json();
          console.error("[Brevo] Add contact failed:", err);
        }
      } catch (e) { console.error("[Brevo] Network error:", e); }

      if (brevoSuccess && BREVO_WELCOME_TEMPLATE_ID > 0) {
        try {
          await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
            body: JSON.stringify({
              templateId: BREVO_WELCOME_TEMPLATE_ID,
              to: [{ email, name: name || email }],
              params: {
                FIRSTNAME: name || "Friend",
                UNSUBSCRIBE_LINK: `https://dineshkoyyalamudi.com/unsubscribe?email=${encodeURIComponent(email)}`,
              },
            }),
          });
        } catch (e) { console.error("[Brevo] Welcome email failed:", e); }
      }
    }

    try {
      const db = getAdminDb();
      const existing = await db.collection("subscribers")
        .where("email", "==", email).limit(1).get();

      if (!existing.empty) {
        await db.collection("subscribers").doc(existing.docs[0].id).update({
          status: "active",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await db.collection("subscribers").add({
          email,
          name: name || "",
          source: source || "homepage",
          status: "active",
          consentTimestamp: FieldValue.serverTimestamp(),
          consentGiven: true,
          integrationFlag: BREVO_API_KEY ? "brevo" : "none",
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (e) { console.error("[Firestore] Save subscriber failed:", e); }

    return NextResponse.json({ success: true, brevoConnected: !!BREVO_API_KEY });

  } catch (e: unknown) {
    console.error("[subscribe API] Error:", e);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}