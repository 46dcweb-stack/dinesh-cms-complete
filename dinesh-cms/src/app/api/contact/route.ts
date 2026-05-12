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

    // ── Email to the site owner(s) ────────────────────────────────────────────
    const ownerMail = {
      from: `"Dinesh Site Contact" <${process.env.NODEMAILER_USER}>`,
      to: NOTIFY_EMAILS.join(", "),
      replyTo: email,
      subject: `[Contact] ${subject || "New message"} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0B0B0D;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:#FF5A00;padding:24px 32px;">
            <h1 style="margin:0;font-size:20px;color:#fff;">New Contact Form Submission</h1>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#999;width:120px;">Name</td><td style="padding:8px 0;color:#fff;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#FF5A00;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#999;">Subject</td><td style="padding:8px 0;color:#fff;">${subject || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#999;">Type</td><td style="padding:8px 0;color:#fff;">${type || "General"}</td></tr>
              <tr><td style="padding:8px 0;color:#999;">Page</td><td style="padding:8px 0;color:#999;font-size:12px;">${page_url || "—"}</td></tr>
            </table>
            <div style="margin-top:24px;padding:20px;background:#1a1a1a;border-radius:8px;border-left:3px solid #FF5A00;">
              <p style="margin:0;color:#ccc;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <div style="margin-top:24px;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your message')}" style="display:inline-block;background:#FF5A00;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${name}</a>
            </div>
          </div>
          <div style="padding:16px 32px;background:#111;text-align:center;">
            <p style="margin:0;color:#555;font-size:12px;">Sent from dineshkoyyalamudi.com contact form</p>
          </div>
        </div>
      `,
    };

    // ── Auto-reply to the sender ───────────────────────────────────────────────
    const autoReply = {
      from: `"Dinesh Koyyalamudi" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: `Got your message, ${name.split(" ")[0]} — I'll be in touch`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0B0B0D;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:#FF5A00;padding:24px 32px;">
            <h1 style="margin:0;font-size:20px;color:#fff;">Message Received</h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#ccc;line-height:1.7;">Hi ${name.split(" ")[0]},</p>
            <p style="color:#ccc;line-height:1.7;">Thanks for reaching out. I've received your message and will get back to you as soon as possible.</p>
            <div style="margin:24px 0;padding:20px;background:#1a1a1a;border-radius:8px;border-left:3px solid #FF5A00;">
              <p style="margin:0 0 8px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Your message</p>
              <p style="margin:0;color:#ccc;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="color:#ccc;line-height:1.7;">— Dinesh</p>
          </div>
          <div style="padding:16px 32px;background:#111;text-align:center;">
            <p style="margin:0;color:#555;font-size:12px;">dineshkoyyalamudi.com</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(ownerMail);
    await transporter.sendMail(autoReply);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}