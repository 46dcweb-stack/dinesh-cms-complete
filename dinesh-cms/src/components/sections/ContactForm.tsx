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
    headingLevel?: "h1" | "h2";
    title: string;
    subtitle: string;
    description: string;
    email?: string;
    phone?: string;
    office?: string;
    hours?: string;
}

type FormErrors = {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm({ 
    title, 
    subtitle, 
    description,
    email = "dinesh@46dc.com",
    phone = "+44 02045188119",
    office = "London, England, United Kingdom",
    hours = "Available 24/7",
    // This block is the page's main heading only on /contact. On /blog and /press
    // it is a secondary section, so it must not emit a second H1.
    headingLevel = "h1",
}: ContactFormProps) {
    const Heading = motion[headingLevel];
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errors, setErrors] = useState<FormErrors>({});
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

    const validateField = (field: keyof Omit<typeof formData, "type">, value: string): string | undefined => {
        const trimmed = value.trim();

        if (field === "name") {
            const letterCount = trimmed.replace(/[^a-zA-Z]/g, "").length;
            if (letterCount < 3) return "Name must contain at least 3 letters.";
            if (trimmed.length > 80) return "Name must be 80 characters or less.";
            return undefined;
        }

        if (field === "email") {
            if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
            const localPart = trimmed.split("@")[0] ?? "";
            const domain = trimmed.split("@")[1] ?? "";
            if (localPart.length < 2 || domain.length < 4 || !domain.includes(".")) {
                return "Enter a complete email address.";
            }
            if (trimmed.includes("..")) return "Email address is invalid.";
            return undefined;
        }

        if (field === "subject") {
            if (trimmed.length < 6) return "Subject must be at least 6 characters.";
            if (trimmed.length > 120) return "Subject must be 120 characters or less.";
            return undefined;
        }

        if (field === "message") {
            if (trimmed.length < 20) return "Message must be at least 20 characters.";
            if (trimmed.length > 2000) return "Message must be 2000 characters or less.";
            return undefined;
        }

        return undefined;
    };

    const validateAll = (): FormErrors => {
        const nextErrors: FormErrors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            subject: validateField("subject", formData.subject),
            message: validateField("message", formData.message),
        };

        Object.keys(nextErrors).forEach((key) => {
            const k = key as keyof FormErrors;
            if (!nextErrors[k]) delete nextErrors[k];
        });

        return nextErrors;
    };

    const setFieldValue = (field: keyof typeof formData, value: string) => {
        setLocalFormData((prev) => ({ ...prev, [field]: value }));

        if (field !== "type") {
            const fieldKey = field as keyof FormErrors;
            setErrors((prev) => {
                if (!prev[fieldKey]) return prev;
                const next = { ...prev };
                delete next[fieldKey];
                return next;
            });
        }
    };

    const handleFieldBlur = (field: keyof Omit<typeof formData, "type">) => {
        const message = validateField(field, formData[field]);
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nextErrors = validateAll();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            setStatus("idle");
            return;
        }

        setStatus("loading");

        try {
            // Save to Firestore
            await contactService.submit({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                type: (formData.type.toLowerCase() as any) || "general",
            });

            // Send email notification via Nodemailer
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    type: formData.type,
                    page_url: typeof window !== "undefined" ? window.location.href : "",
                }),
            });

            setStatus("success");
            setErrors({});
            setLocalFormData({ name: "", email: "", subject: "", message: "", type: "General" });
        } catch (error) {
            setStatus("error");
        }
    };

    const canSubmit =
        !validateField("name", formData.name) &&
        !validateField("email", formData.email) &&
        !validateField("subject", formData.subject) &&
        !validateField("message", formData.message);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
            {/* Left Column: Info */}
            <div>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-brand-primary font-medium tracking-widest text-sm uppercase block mb-6"
                >
                    {subtitle}
                </motion.span>
                <Heading
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl lg:text-7xl font-display leading-tight mb-6 md:mb-8 break-words"
                >
                    {title.split(' ').slice(0, -1).join(' ')} <span className="text-gradient italic">{title.split(' ').slice(-1)}</span>
                </Heading>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-secondary text-base md:text-xl mb-8 md:mb-12 max-w-lg"
                >
                    {description}
                </motion.p>

                <div className="space-y-4">
                    {contactInfo.map((info) => (
                        <div
                            key={info.id}
                            className="w-full text-left p-4 md:p-6 rounded-2xl border bg-brand-muted/50 border-white/5 hover:border-white/20 transition-all duration-300 flex items-start space-x-3 md:space-x-4 group"
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
                                        className="text-base md:text-xl font-display text-white hover:text-brand-primary transition-colors"
                                    >
                                        {info.value}
                                    </a>
                                ) : (
                                    <p className="text-base md:text-xl font-display text-white leading-relaxed">
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
                className="glass-card p-5 md:p-8 lg:p-12 relative overflow-hidden"
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
                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    minLength={3}
                                    maxLength={80}
                                    onBlur={() => handleFieldBlur("name")}
                                    onChange={(e) => setFieldValue("name", e.target.value)}
                                    className={cn(
                                        "w-full bg-white/5 border rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none transition-colors",
                                        errors.name ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-brand-primary/50"
                                    )}
                                    placeholder="Your Name"
                                />
                                {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    minLength={6}
                                    maxLength={254}
                                    onBlur={() => handleFieldBlur("email")}
                                    onChange={(e) => setFieldValue("email", e.target.value)}
                                    className={cn(
                                        "w-full bg-white/5 border rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none transition-colors",
                                        errors.email ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-brand-primary/50"
                                    )}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Inquiry Type</label>
                            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-4">
                                {inquiryTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFieldValue("type", type)}
                                        className={cn(
                                            "w-full md:w-auto px-4 md:px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-300 text-center whitespace-nowrap",
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
                                minLength={6}
                                maxLength={120}
                                onBlur={() => handleFieldBlur("subject")}
                                onChange={(e) => setFieldValue("subject", e.target.value)}
                                className={cn(
                                    "w-full bg-white/5 border rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none transition-colors",
                                    errors.subject ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-brand-primary/50"
                                )}
                                placeholder="What is this regarding?"
                            />
                            {errors.subject && <p className="text-red-400 text-xs ml-1">{errors.subject}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Message</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                minLength={20}
                                maxLength={2000}
                                onBlur={() => handleFieldBlur("message")}
                                onChange={(e) => setFieldValue("message", e.target.value)}
                                className={cn(
                                    "w-full bg-white/5 border rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none transition-colors resize-none",
                                    errors.message ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-brand-primary/50"
                                )}
                                placeholder="Tell me about your project or inquiry..."
                            />
                            {errors.message && <p className="text-red-400 text-xs ml-1">{errors.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={status === "loading" || !canSubmit}
                            className="w-full btn-premium py-3 md:py-5 text-base md:text-lg group disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none"
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