import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Recipients — add/change emails here ──────────────────────────────────────
const NOTIFY_EMAILS = [
  process.env.NODEMAILER_USER!, // primary (sender inbox gets a copy)
  process.env.CONTACT_NOTIFY_EMAIL_2 || "", // optional second address via env
].filter(Boolean);

function buildTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS, // Gmail App Password
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, type, page_url } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = buildTransporter();

    const timestamp = new Date().toLocaleString("en-GB", {
      dateStyle: "full", timeStyle: "long", timeZone: "Europe/London",
    });
    const userAgent = req.headers.get("user-agent") || "—";

    // ── Email to the site owner(s) ────────────────────────────────────────────
    const ownerMail = {
      from: `"46DC Website" <${process.env.NODEMAILER_USER}>`,
      to: NOTIFY_EMAILS.join(", "),
      replyTo: email,
      subject: `[${type || "General"}] ${subject || "New message"} — ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Admin Notification</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background-color:#0a0a0a;padding:28px 36px;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#FF5A00;font-weight:600;">Internal Notification</p>
            <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:700;">New Contact Form Submission</h1>
            <p style="margin:6px 0 0;font-size:13px;color:#888888;">Received via the 46DC website contact form.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">

            <!-- Contact Details -->
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FF5A00;font-weight:700;">Contact Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:28px;">
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;width:140px;border-bottom:1px solid #e8e8e8;">Name</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;font-weight:600;border-bottom:1px solid #e8e8e8;">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#666666;border-bottom:1px solid #e8e8e8;">Email</td>
                <td style="padding:12px 16px;font-size:13px;border-bottom:1px solid #e8e8e8;"><a href="mailto:${email}" style="color:#FF5A00;text-decoration:none;font-weight:600;">${email}</a></td>
              </tr>
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;border-bottom:1px solid #e8e8e8;">Inquiry Type</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;border-bottom:1px solid #e8e8e8;">${type || "General"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#666666;">Subject</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;">${subject || "—"}</td>
              </tr>
            </table>

            <!-- Message -->
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FF5A00;font-weight:700;">Message</p>
            <div style="background-color:#f9f9f9;border:1px solid #e8e8e8;border-left:4px solid #FF5A00;border-radius:6px;padding:20px;margin-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#333333;line-height:1.8;white-space:pre-wrap;">${message}</p>
            </div>

            <!-- Submission Metadata -->
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FF5A00;font-weight:700;">Submission Metadata</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:28px;">
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;width:140px;border-bottom:1px solid #e8e8e8;">Submitted At</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;border-bottom:1px solid #e8e8e8;">${timestamp}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#666666;border-bottom:1px solid #e8e8e8;">Source Page</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;border-bottom:1px solid #e8e8e8;">${page_url || "—"}</td>
              </tr>
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;">User Agent</td>
                <td style="padding:12px 16px;font-size:13px;color:#666666;font-size:12px;">${userAgent}</td>
              </tr>
            </table>

            <!-- Reply CTA -->
            <p style="margin:0 0 20px;font-size:13px;color:#555555;">Please review and respond as appropriate.</p>
            <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject || "Your enquiry")}" style="display:inline-block;background-color:#FF5A00;color:#ffffff;padding:13px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.3px;">Reply to ${name}</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f0f0f0;padding:20px 36px;border-top:1px solid #e0e0e0;">
            <p style="margin:0 0 6px;font-size:12px;color:#888888;font-weight:600;">Internal Notification — 46DC Website</p>
            <p style="margin:0 0 10px;font-size:12px;color:#aaaaaa;line-height:1.6;">This message contains information submitted via a public contact form.<br>Handle all personal data in accordance with UK GDPR and internal data handling practices.</p>
            <p style="margin:0;font-size:11px;color:#bbbbbb;line-height:1.6;">46DC is part of the FourSix46 ecosystem.<br>Registered correspondence address: 66 Paul Street, London, EC2A 4NA, United Kingdom</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };

    // ── Auto-reply to the sender ───────────────────────────────────────────────
    const autoReply = {
      from: `"46DC Team" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: `Your message has been received — 46DC Team`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Message Received</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background-color:#0a0a0a;padding:28px 36px;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#FF5A00;font-weight:600;">Confirmation</p>
            <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:700;">Message Received</h1>
            <p style="margin:6px 0 0;font-size:13px;color:#888888;">46DC · FourSix46 Ecosystem</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:15px;color:#111111;font-weight:600;">Dear ${name},</p>
            <p style="margin:0 0 16px;font-size:14px;color:#444444;line-height:1.8;">Thank you for reaching out.</p>
            <p style="margin:0 0 28px;font-size:14px;color:#444444;line-height:1.8;">Your message has been received successfully and will be reviewed. If relevant, you will receive a response shortly.</p>

            <!-- Submission Summary -->
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FF5A00;font-weight:700;">Submission Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:28px;">
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;width:140px;border-bottom:1px solid #e8e8e8;">Name</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;font-weight:600;border-bottom:1px solid #e8e8e8;">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#666666;border-bottom:1px solid #e8e8e8;">Email</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;border-bottom:1px solid #e8e8e8;">${email}</td>
              </tr>
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;border-bottom:1px solid #e8e8e8;">Inquiry Type</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;border-bottom:1px solid #e8e8e8;">${type || "General"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#666666;border-bottom:1px solid #e8e8e8;">Subject</td>
                <td style="padding:12px 16px;font-size:13px;color:#111111;border-bottom:1px solid #e8e8e8;">${subject || "—"}</td>
              </tr>
              <tr style="background-color:#f9f9f9;">
                <td style="padding:12px 16px;font-size:13px;color:#666666;">Message</td>
                <td style="padding:12px 16px;font-size:13px;color:#444444;line-height:1.7;white-space:pre-wrap;">${message}</td>
              </tr>
            </table>

            <!-- Signature -->
            <p style="margin:0 0 4px;font-size:14px;color:#111111;font-weight:700;">Dinesh Koyyalamudi</p>
            <p style="margin:0 0 2px;font-size:13px;color:#555555;">Founder</p>
            <p style="margin:0 0 2px;font-size:13px;color:#555555;">46DC</p>
            <p style="margin:4px 0 2px;font-size:13px;color:#555555;">Email: <a href="mailto:dinesh@46dc.com" style="color:#FF5A00;text-decoration:none;">dinesh@46dc.com</a></p>
            <p style="margin:0;font-size:13px;color:#555555;">Website: <a href="https://www.46dc.com" style="color:#FF5A00;text-decoration:none;">https://www.46dc.com</a></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f0f0f0;padding:20px 36px;border-top:1px solid #e0e0e0;">
            <p style="margin:0 0 8px;font-size:12px;color:#888888;">This is an automated confirmation email.</p>
            <p style="margin:0 0 8px;font-size:11px;color:#aaaaaa;line-height:1.6;">46DC is part of the FourSix46 ecosystem.<br>Registered correspondence address: 66 Paul Street, London, EC2A 4NA, United Kingdom</p>
            <p style="margin:0 0 8px;font-size:11px;color:#aaaaaa;line-height:1.6;">All communications are handled in accordance with applicable UK data protection laws, including the UK GDPR.</p>
            <p style="margin:0;font-size:11px;color:#bbbbbb;line-height:1.6;font-style:italic;"><strong style="font-style:normal;color:#aaaaaa;">Confidentiality Notice:</strong> This email and any attachments are intended solely for the recipient. If you have received this message in error, please delete it and notify the sender. Unauthorized use, disclosure, or distribution is prohibited.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };

    await transporter.sendMail(ownerMail);
    await transporter.sendMail(autoReply);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}