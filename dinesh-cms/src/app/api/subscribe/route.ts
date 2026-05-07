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
      try {
        sa = JSON.parse(cleaned);
      } catch {
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

    if (!consent) return NextResponse.json({ error: "Consent required" }, { status: 400 });
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

    const BREVO_API_KEY             = (process.env.BREVO_API_KEY || "").trim();
    const BREVO_LIST_ID             = parseInt(process.env.BREVO_LIST_ID || "1");
    const BREVO_WELCOME_TEMPLATE_ID = parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID || "0");

    console.log("[Brevo] API key present:", !!BREVO_API_KEY);
    console.log("[Brevo] List ID:", BREVO_LIST_ID);
    console.log("[Brevo] Template ID:", BREVO_WELCOME_TEMPLATE_ID);

    let brevoSuccess = false;

    if (BREVO_API_KEY) {
      // Step 1: Add/update contact in Brevo list
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

        const contactBody = await contactRes.text();
        console.log("[Brevo] Contact status:", contactRes.status, contactBody);

        // 201 = created, 204 = already exists (updated)
        if (contactRes.status === 201 || contactRes.status === 204) {
          brevoSuccess = true;
        } else {
          console.error("[Brevo] Contact add failed:", contactRes.status, contactBody);
        }
      } catch (e) {
        console.error("[Brevo] Network error:", e);
      }

      // Step 2: Send welcome email via template (only if template ID is set)
      if (BREVO_WELCOME_TEMPLATE_ID > 0) {
        console.log("[Brevo] Sending welcome email template:", BREVO_WELCOME_TEMPLATE_ID);
        try {
          const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
            body: JSON.stringify({
              templateId: BREVO_WELCOME_TEMPLATE_ID,
              to: [{ email, name: name || email }],
              params: { FIRSTNAME: name || "Friend" },
            }),
          });
          const emailBody = await emailRes.text();
          console.log("[Brevo] Email send status:", emailRes.status, emailBody);
        } catch (e) {
          console.error("[Brevo] Welcome email failed:", e);
        }
      } else if (brevoSuccess) {
        // No template — send a simple transactional email directly
        console.log("[Brevo] No template set, sending simple confirmation email");
        try {
          const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
            body: JSON.stringify({
              sender: { name: "Dinesh Koyyalamudi", email: "46dcweb@gmail.com" },
              to: [{ email, name: name || email }],
              subject: "You're subscribed — Welcome.",
              htmlContent: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0a;color:#fff;">
                  <h2 style="color:#E22D2D;">Welcome, ${name || "Friend"}.</h2>
                  <p style="color:#aaa;line-height:1.8;">You're now subscribed to updates from Dinesh Koyyalamudi.</p>
                  <p style="color:#aaa;line-height:1.8;">Expect insights on venture building, strategy, and the future — straight to your inbox.</p>
                  <hr style="border-color:#333;margin:30px 0;" />
                  <p style="color:#555;font-size:12px;">You subscribed at dineshkoyyalamudi.com. <a href="https://dineshkoyyalamudi.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#E22D2D;">Unsubscribe</a></p>
                </div>
              `,
            }),
          });
          const emailBody = await emailRes.text();
          console.log("[Brevo] Simple email status:", emailRes.status, emailBody);
        } catch (e) {
          console.error("[Brevo] Simple email failed:", e);
        }
      }
    }

    // Save to Firestore
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
          email, name: name || "",
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
    }

    return NextResponse.json({ success: true, brevoConnected: !!BREVO_API_KEY });

  } catch (e: unknown) {
    console.error("[subscribe API] Error:", e);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
