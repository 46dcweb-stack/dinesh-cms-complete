// ─────────────────────────────────────────────────────────────────────────────
// POST /api/subscribe
// 1. Validates consent (required — GDPR)
// 2. Adds contact to Brevo list
// 3. Sends welcome email via Brevo transactional API
// 4. Saves subscriber to Firestore
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ── Firebase Admin init (for server-side Firestore write) ────────────────────
function getAdminDb() {
  if (getApps().length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key) {
      const sa = JSON.parse(key.replace(/\\n/g, "\n"));
      initializeApp({ credential: cert(sa) });
    } else {
      // Try service-account.json in dev
      const { readFileSync, existsSync } = require("fs");
      const path = require("path");
      const filePath = path.join(process.cwd(), "service-account.json");
      if (existsSync(filePath)) {
        const sa = JSON.parse(readFileSync(filePath, "utf-8"));
        initializeApp({ credential: cert(sa) });
      } else {
        throw new Error("No Firebase service account found");
      }
    }
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source, consent } = body;

    // ── Consent required — do nothing if not given ───────────────────────────
    if (!consent) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "1");
    const BREVO_WELCOME_TEMPLATE_ID = parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID || "0");

    let brevoSuccess = false;

    // ── Step 1: Add to Brevo contact list ────────────────────────────────────
    if (BREVO_API_KEY) {
      try {
        const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": BREVO_API_KEY,
          },
          body: JSON.stringify({
            email,
            attributes: {
              FIRSTNAME: name || "",
              SOURCE: source || "website",
            },
            listIds: [BREVO_LIST_ID],
            updateEnabled: true, // update if already exists
          }),
        });

        // 201 = created, 204 = updated (already existed)
        if (contactRes.status === 201 || contactRes.status === 204) {
          brevoSuccess = true;
        } else {
          const err = await contactRes.json();
          console.error("[Brevo] Add contact failed:", err);
        }
      } catch (e) {
        console.error("[Brevo] Network error adding contact:", e);
      }

      // ── Step 2: Send welcome email via template ───────────────────────────
      if (brevoSuccess && BREVO_WELCOME_TEMPLATE_ID > 0) {
        try {
          await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
              templateId: BREVO_WELCOME_TEMPLATE_ID,
              to: [{ email, name: name || email }],
              params: {
                FIRSTNAME: name || "Friend",
                UNSUBSCRIBE_LINK: `https://dineshkoyyalamudi.com/unsubscribe?email=${encodeURIComponent(email)}`,
              },
            }),
          });
        } catch (e) {
          console.error("[Brevo] Welcome email failed (non-fatal):", e);
          // Don't fail the whole subscribe if email fails
        }
      }
    }

    // ── Step 3: Save to Firestore (only if consent given — already checked) ─
    try {
      const db = getAdminDb();
      
      // Check if already subscribed
      const existing = await db.collection("subscribers")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!existing.empty) {
        // Reactivate if unsubscribed
        await db.collection("subscribers").doc(existing.docs[0].id).update({
          status: "active",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        // New subscriber
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
    } catch (e) {
      console.error("[Firestore] Save subscriber failed:", e);
      // Still return success if Brevo worked
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
      brevoConnected: !!BREVO_API_KEY,
    });

  } catch (e: any) {
    console.error("[subscribe API] Error:", e);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
