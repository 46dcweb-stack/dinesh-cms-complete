"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface NewsletterProps { buttonText?: string; }

export default function Newsletter({ buttonText = "Subscribe" }: NewsletterProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent) {
            setErrorMsg("Please agree to receive emails before subscribing.");
            return;
        }
        setStatus("loading");
        setErrorMsg("");

        try {
            const source =
                window.location.pathname.includes("blog") ? "blog"
                : window.location.pathname.includes("subscribe") ? "subscribe-page"
                : "homepage";

            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name: name || undefined, source, consent }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setErrorMsg(data.error || "Something went wrong. Please try again.");
                return;
            }

            setStatus("success");
            setName("");
            setEmail("");
            setConsent(false);
        } catch {
            setStatus("error");
            setErrorMsg("Network error. Please check your connection and try again.");
        }
    };

    return (
        <div className="w-full">
                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <CheckCircle2 size={48} className="text-brand-primary mx-auto mb-4" />
                        <h3 className="text-2xl font-display text-white mb-2">You're in!</h3>
                        <p className="text-text-secondary">
                            Check your inbox — a welcome note is on its way.
                        </p>
                        <p className="text-xs text-white/30 mt-3">
                            You'll only receive emails you agreed to. Unsubscribe any time.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-white/30"
                                />
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-white/30"
                                />
                            </div>

                            {/* GDPR consent checkbox — required */}
                            <div className="flex items-start gap-3 mt-1">
                                <div className="relative flex-shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        id="newsletter-consent"
                                        checked={consent}
                                        onChange={e => {
                                            setConsent(e.target.checked);
                                            if (e.target.checked) setErrorMsg("");
                                        }}
                                        className="sr-only peer"
                                    />
                                    <label
                                        htmlFor="newsletter-consent"
                                        className="w-4 h-4 border border-white/30 rounded bg-white/5 flex items-center justify-center cursor-pointer peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-colors block"
                                    >
                                        {consent && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </label>
                                </div>
                                <label htmlFor="newsletter-consent" className="text-xs text-text-muted cursor-pointer leading-relaxed">
                                    I agree to receive email updates, insights, and announcements from Dinesh Koyyalamudi.
                                    I understand I can unsubscribe at any time. My data will be handled in accordance with
                                    the <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                                </label>
                            </div>

                            {/* Error message */}
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
                                >
                                    <AlertCircle size={14} />
                                    {errorMsg}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading" || !consent}
                                className="btn-premium liquid-fill flex items-center justify-center w-full sm:w-auto sm:mx-auto min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                {status === "loading" ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Join the Conversation"
                                )}
                            </button>

                            <p className="text-xs text-white/20 text-center">
                                No spam. Only content you agreed to. Unsubscribe any time.
                            </p>
                        </div>
                    </form>
                )}
        </div>
    );
}