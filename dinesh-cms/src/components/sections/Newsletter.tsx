"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { subscriberService } from "@/lib/firebase-services";


export default function Newsletter() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent) return;
        setStatus("loading");

        try {
            const source = typeof window !== "undefined"
                ? (window.location.pathname.includes("blog") ? "blog"
                    : window.location.pathname.includes("subscribe") ? "subscribe-page"
                    : "homepage")
                : "homepage";
            await subscriberService.subscribe(email, name || undefined, source as any);
            setStatus("success");
            setName("");
            setEmail("");
            setConsent(false);
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <section className="py-24 px-6 overflow-hidden relative">
            {/* Ambient Static Blobs */}
            <div
                className="absolute top-1/2 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,160,0,0.05)_0%,transparent_70%)] rounded-full -z-10 pointer-events-none"
            />
            <div
                className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,160,0,0.05)_0%,transparent_70%)] rounded-full -z-10 pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto glass-card p-10 md:p-20 relative overflow-hidden border-brand-primary/10"
            >
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[radial-gradient(ellipse_at_center,rgba(255,160,0,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

                <div className="text-center mb-12 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-display mb-6">Let's Stay Connected</h2>
                    <p className="text-text-secondary text-lg max-w-xl mx-auto">
                        I send occasional letters on entrepreneurship, building, and life. No fluff. Just real talk.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 max-w-lg mx-auto">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all"
                            />
                            <input
                                type="email"
                                placeholder="Your email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all"
                            />
                        </div>
                        
                        <div className="flex items-start gap-3 mt-2 mb-2 text-left">
                            <input
                                type="checkbox"
                                id="consent"
                                required
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer transition-colors flex-shrink-0 appearance-none checked:bg-brand-primary checked:border-brand-primary relative before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==')] before:bg-center before:bg-no-repeat before:bg-[length:12px_12px] checked:before:block before:hidden"
                            />
                            <label htmlFor="consent" className="text-xs text-text-muted cursor-pointer leading-relaxed">
                                I agree to receive email updates, insights, and announcements from Dinesh Koyyalamudi. I understand I can unsubscribe at any time.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="btn-premium liquid-fill flex items-center justify-center w-full sm:w-auto sm:mx-auto min-w-[200px]"
                        >
                            {status === "loading" ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : status === "success" ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                "Join the Conversation"
                            )}
                        </button>
                    </div>
                    {status === "success" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-brand-primary text-sm font-medium text-center mt-6"
                        >
                            Looking forward to connecting!
                        </motion.p>
                    )}
                </form>
            </motion.div>
        </section>
    );
}

