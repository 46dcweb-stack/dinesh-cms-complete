"use client";

import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Settings,
    LayoutDashboard,
    Terminal,
    Users,
    Globe,
    Zap,
    Star,
    ArrowUpRight,
    PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import CinematicImage from "@/components/ui/CinematicImage";

export default function DashboardHero() {
    return (
        <section className="pt-20 lg:pt-12 pb-12 px-6 spotlight-hero">
            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.05)_0%,transparent_70%)] rounded-full pointer-events-none -z-10" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Welcome Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-7 glass-card border-beam p-10 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,160,0,0.05)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.4em]">Decade of Visionary Ventures</span>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-display leading-[1.1] mb-8 text-white">
                                Building <span className="text-gradient italic">meaningful</span> companies.
                            </h1>
                            <p className="text-text-secondary text-lg max-w-xl mb-12 leading-relaxed">
                                Empowering the next generation of founders to build resilient systems
                                at the nexus of technology and purposeful design.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 relative z-10">
                            <button className="btn-premium group">
                                Explore Ventures
                                <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                            </button>
                            <button className="btn-outline">
                                Our Manifesto
                            </button>
                        </div>
                    </motion.div>

                    {/* Hero Visionary Image */}
                    <div className="lg:col-span-5 h-[500px] lg:h-auto">
                        <CinematicImage
                            src="/images/hero_visionary.png"
                            alt="Visionary Founder Workspace"
                            animationType="hero"
                            priority
                            wrapperClassName="h-full"
                            className="grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>

                    {/* Quick Stats & Developer Pulse */}
                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard label="Ventures Built" value="12+" icon={<Globe size={18} />} />
                            <StatCard label="Impact Created" value="$50M" icon={<Zap size={18} />} />
                            <StatCard label="Collaborators" value="500+" icon={<Users size={18} />} />
                            <StatCard label="Global Reach" value="30+" icon={<Globe size={18} />} />
                        </div>

                        <div className="glass-card p-6 flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Terminal size={20} />
                                </div>
                                <div>
                                    <h4 className="text-text-primary font-medium">Developer Pulse</h4>
                                    <p className="text-[10px] text-text-muted font-mono tracking-tighter uppercase">Status: Live Node Connected</p>
                                </div>
                            </div>
                            <ArrowUpRight className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                    </div>


                    {/* Featured Sections Bento Grid */}
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                        <BentoItem
                            title="The Journal"
                            desc="Weekly insights on leadership, logic, and long-term systems thinking."
                            icon={<PenTool size={20} />}
                            delay={0.3}
                        />
                        <BentoItem
                            title="Media Kit"
                            desc="Access high-resolution assets, bio, and visual identity for press coverage."
                            icon={<Globe size={20} />}
                            delay={0.4}
                        />
                        <BentoItem
                            title="Speaking"
                            desc="Enquire for dynamic keynote presentations, panels, and guest lectures."
                            icon={<Users size={20} />}
                            delay={0.5}
                        />
                        <BentoItem
                            title="Governance"
                            desc="Transparency reports and decentralized impact tracking protocols."
                            icon={<Zap size={20} />}
                            delay={0.6}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="glass-card p-6 flex flex-col justify-between hover:border-brand-primary/30 group">
            <div className="text-text-muted group-hover:text-brand-primary transition-colors mb-4">{icon}</div>
            <div>
                <p className="text-2xl font-mono text-text-primary mb-1 tracking-tight">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-medium">{label}</p>
            </div>
        </div>
    );
}

function BentoItem({ title, desc, icon, delay }: { title: string; desc: string; icon: React.ReactNode; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="glass-card p-8 group cursor-pointer hover:border-brand-primary/30"
        >
            <div className="w-10 h-10 rounded-lg bg-brand-muted flex items-center justify-center text-text-muted border border-white/5 group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-all mb-6">
                {icon}
            </div>
            <h3 className="text-text-primary font-display text-xl mb-2">{title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}

