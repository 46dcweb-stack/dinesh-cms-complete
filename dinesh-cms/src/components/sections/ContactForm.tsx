"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Phone, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { contactService } from "@/lib/firebase-services";

interface ContactInfo {
    id: string;
    label: string;
    value: string;
    href?: string;
    icon: React.ReactNode;
}

interface ContactFormProps {
    title: string;
    subtitle: string;
    description: string;
    email?: string;
    phone?: string;
    office?: string;
    hours?: string;
}

export default function ContactForm({ 
    title, 
    subtitle, 
    description,
    email = "dinesh@46dc.com",
    phone = "+44 02045188119",
    office = "London, England, United Kingdom",
    hours = "Available 24/7"
}: ContactFormProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setLocalFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "General"
    });

    // Build contact info array from props
    const contactInfo: ContactInfo[] = [
        {
            id: "email",
            label: "EMAIL US",
            value: email,
            href: `mailto:${email}`,
            icon: <Mail size={20} />,
        },
        {
            id: "phone",
            label: "CALL US",
            value: phone,
            href: `tel:${phone.replace(/\s/g, '')}`,
            icon: <Phone size={20} />,
        },
        {
            id: "office",
            label: "HEAD OFFICE",
            value: office,
            icon: <MapPin size={20} />,
        },
        {
            id: "hours",
            label: "WORKING HOURS",
            value: hours,
            icon: <Clock size={20} />,
        }
    ];

    const inquiryTypes = ["General", "Speaking", "Media", "Collaboration"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("email", formData.email);
        fd.append("subject", formData.subject);
        fd.append("message", formData.message);
        fd.append("type", formData.type);
        fd.append("page_url", typeof window !== "undefined" ? window.location.href : "");

        try {
            await contactService.submit({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                type: (formData.type.toLowerCase() as any) || "general",
            });
            setStatus("success");
            setLocalFormData({ name: "", email: "", subject: "", message: "", type: "General" });
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Column: Info */}
            <div>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-brand-primary font-medium tracking-widest text-sm uppercase block mb-6"
                >
                    {subtitle}
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-display leading-tight mb-8"
                >
                    {title.split(' ').slice(0, -1).join(' ')} <span className="text-gradient italic">{title.split(' ').slice(-1)}</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-secondary text-xl mb-12 max-w-lg"
                >
                    {description}
                </motion.p>

                <div className="space-y-4">
                    {contactInfo.map((info) => (
                        <div
                            key={info.id}
                            className="w-full text-left p-6 rounded-2xl border bg-brand-muted/50 border-white/5 hover:border-white/20 transition-all duration-300 flex items-start space-x-4 group"
                        >
                            <div className="p-3 rounded-xl bg-white/5 text-white/40 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                {info.icon}
                            </div>
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1 block">
                                    {info.label}
                                </span>
                                {info.href ? (
                                    <a
                                        href={info.href}
                                        className="text-xl font-display text-white hover:text-brand-primary transition-colors"
                                    >
                                        {info.value}
                                    </a>
                                ) : (
                                    <p className="text-xl font-display text-white leading-relaxed">
                                        {info.value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 md:p-12 relative overflow-hidden"
            >
                {status === "success" ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <CheckCircle2 size={64} className="text-brand-primary mb-6" />
                        <h2 className="text-3xl font-display mb-4">Message Sent</h2>
                        <p className="text-text-secondary max-w-sm mx-auto">
                            Thank you for reaching out. I've received your inquiry and will
                            get back to you within 48 hours.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-10 text-brand-primary font-semibold hover:underline"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setLocalFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setLocalFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Inquiry Type</label>
                            <div className="flex flex-wrap gap-2 md:gap-4">
                                {inquiryTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setLocalFormData({ ...formData, type })}
                                        className={cn(
                                            "flex-1 md:flex-none px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-300 text-center",
                                            formData.type === type
                                                ? "bg-brand-primary border-brand-primary text-white"
                                                : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Subject</label>
                            <input
                                required
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setLocalFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                                placeholder="What is this regarding?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Message</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setLocalFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors resize-none"
                                placeholder="Tell me about your project or inquiry..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full btn-premium py-5 text-lg group"
                        >
                            {status === "loading" ? "Sending..." : (
                                <>
                                    Send Message
                                    <ArrowRight size={20} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-text-muted/50 text-center uppercase tracking-[0.2em] mt-8 leading-relaxed">
                            Your information is handled securely. No spam. No sharing.<br />
                            Protected under UK GDPR.
                        </p>

                        {status === "error" && (
                            <p className="text-red-500 text-sm text-center mt-4">Failed to send message. Please try again.</p>
                        )}
                    </form>
                )}

                {/* Decorative element */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px]" />
            </motion.div>
        </div>
    );
}