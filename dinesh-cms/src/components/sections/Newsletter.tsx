"use client";

import { useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface NewsletterProps {
  buttonText?: string;
  /** "box" = full two-panel home page section (default)
   *  "form" = plain form only, for use inside other page layouts */
  variant?: "box" | "form";
}

export default function Newsletter({ buttonText = "Join the Conversation", variant = "box" }: NewsletterProps) {
  const consentId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [consent, setConsent]   = useState(false);
  const [status, setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});

  const validateName = (value: string) => {
    const trimmed = value.trim();
    const letterCount = trimmed.replace(/[^a-zA-Z]/g, "").length;
    if (!trimmed) return "Please enter your first name.";
    if (letterCount < 3) return "Name must contain at least 3 letters.";
    if (trimmed.length > 80) return "Name must be 80 characters or less.";
    return "";
  };

  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!trimmed) return "Please enter your email address.";
    if (!emailRegex.test(trimmed)) return "Enter a valid email address.";
    if (trimmed.includes("..")) return "Email address is invalid.";
    return "";
  };

  const getValues = () => ({
    name: nameInputRef.current?.value?.trim() ?? "",
    email: emailInputRef.current?.value?.trim() ?? "",
  });

  const validateAll = () => {
    const values = getValues();
    const nextErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
    };

    setFieldErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInputRef.current?.value?.trim() ?? "";
    const email = emailInputRef.current?.value?.trim() ?? "";

    if (!validateAll()) {
      setStatus("idle");
      return;
    }

    if (!consent) { setErrorMsg("Please agree to receive emails before subscribing."); return; }
    setStatus("loading");
    setErrorMsg("");
    try {
      const source = window.location.pathname.includes("blog") ? "blog"
        : window.location.pathname.includes("subscribe") ? "subscribe-page" : "homepage";
      const res  = await fetch("/api/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, source, consent }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); setErrorMsg(data.error || "Something went wrong."); return; }
      setStatus("success");
      formRef.current?.reset();
      setConsent(false);
      setFieldErrors({});
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  // ── Shared success JSX ────────────────────────────────────────────────────
  const successJSX = (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-brand-primary" />
      </div>
      <h3 className="text-2xl font-display text-white mb-3">You're in!</h3>
      <p className="text-text-secondary text-sm">Check your inbox — a welcome note is on its way.</p>
      <p className="text-xs text-white/20 mt-3">Unsubscribe any time. No questions asked.</p>
    </motion.div>
  );

  // ── Shared form JSX ────────────────────────────────────────────────────────
  const formJSX = (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className={variant === "form" ? "flex flex-col sm:flex-row gap-4" : ""}>
        <div className={variant === "form" ? "flex-1" : ""}>
          {variant === "box" && (
            <label className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted block mb-2">First Name</label>
          )}
          <input
            ref={nameInputRef}
            type="text"
            name="firstName"
            autoComplete="given-name"
            placeholder="First Name"
            minLength={3}
            maxLength={80}
            onBlur={() => setFieldErrors((prev) => ({ ...prev, name: validateName(nameInputRef.current?.value ?? "") }))}
            onChange={() => {
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-white/20"
          />
          {fieldErrors.name && <p className="mt-2 text-xs text-red-400">{fieldErrors.name}</p>}
        </div>
        <div className={variant === "form" ? "flex-1" : ""}>
          {variant === "box" && (
            <label className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted block mb-2">
              Email Address <span className="text-brand-primary">*</span>
            </label>
          )}
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your email address"
            required
            minLength={6}
            maxLength={254}
            onBlur={() => setFieldErrors((prev) => ({ ...prev, email: validateEmail(emailInputRef.current?.value ?? "") }))}
            onChange={() => {
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={`w-full bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-white/20 ${variant === "form" ? "rounded-full px-6 py-4" : "rounded-xl px-5 py-3.5"} ${variant === "form" ? "mt-0" : ""}`}
          />
          {fieldErrors.email && <p className="mt-2 text-xs text-red-400">{fieldErrors.email}</p>}
        </div>
      </div>

      {/* GDPR */}
      <div className="flex items-start gap-3 pt-1">
        <div className="relative flex-shrink-0 mt-0.5">
          <input type="checkbox" id={consentId} checked={consent}
            onChange={e => { setConsent(e.target.checked); if (e.target.checked) setErrorMsg(""); }}
            className="sr-only peer"
          />
          <label htmlFor={consentId}
            className="w-4 h-4 border border-white/30 rounded bg-white/5 flex items-center justify-center cursor-pointer peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-colors block"
          >
            {consent && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
        </div>
        <label htmlFor={consentId} className="text-xs text-text-muted cursor-pointer leading-relaxed">
          I agree to receive email updates, insights, and announcements from Dinesh Koyyalamudi.
          I understand I can unsubscribe at any time. My data will be handled in accordance with
          the <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
        </label>
      </div>

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
        >
          <AlertCircle size={14} /> {errorMsg}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !consent}
        className={`flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-300 group
          ${variant === "box"
            ? "w-full bg-brand-primary hover:bg-brand-primary/90 px-6 py-4 rounded-xl mt-2"
            : "btn-premium liquid-fill w-full sm:w-auto sm:mx-auto min-w-[200px]"
          }`}
      >
        {status === "loading" ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {buttonText}
            {variant === "box" && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </>
        )}
      </button>

      <p className="text-xs text-white/20 text-center pt-1">
        No spam. Only content you agreed to. Unsubscribe any time.
      </p>
    </form>
  );

  // ── variant="form" — plain form, used inside subscribe page ───────────────
  if (variant === "form") {
    return (
      <div className="w-full">
        {status === "success" ? successJSX : formJSX}
      </div>
    );
  }

  // ── variant="box" — full two-panel section, used on home page ─────────────
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto"
      >
        <div className="relative rounded-3xl border border-white/10 overflow-hidden bg-white/[0.03]">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/60 to-transparent" />
          {/* Ambient glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left — copy */}
            <div className="relative p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/8 flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-primary/40 rounded-tl-3xl" />
              <div>
                <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.4em] block mb-6">Stay Connected</span>
                <h2 className="text-4xl md:text-5xl font-display leading-[1.1] mb-6">
                  Follow the<br /><span className="text-gradient italic">Build.</span>
                </h2>
                <p className="text-text-secondary text-base leading-relaxed max-w-xs">
                  I write when I have something real to say. You'll hear from me when it matters.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              {status === "success" ? successJSX : formJSX}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}