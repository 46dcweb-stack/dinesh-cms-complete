import NextImage from "next/image";
import StoryTimeline from "@/components/sections/StoryTimeline";
import LeadershipTeam from "@/components/sections/LeadershipTeam";
import { getAboutPage, getTeamMembers } from "@/lib/firebase-data";
import { aboutData } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
    title: "About",
    description: "The story, values, and journey of Dinesh Koyyalamudi.",
};

export default async function AboutPage() {
    const [fbAbout, fbTeam] = await Promise.all([
        getAboutPage(),
        getTeamMembers(),
    ]);
    const raw = fbAbout ?? aboutData;

    // Team members fetched via Admin SDK above (fbTeam)
    const teamMembers: any[] = Array.isArray(fbTeam) ? fbTeam : [];

    // Safe fallbacks — if Firebase field is empty/missing, use static data
    const shortBio          = (raw as any).shortBio          ?? aboutData.shortBio;
    const longBio           = (raw as any).longBio           ?? aboutData.longBio;
    const profileImage      = (raw as any).profileImage      || aboutData.profileImage;
    const featuredQuote     = (raw as any).featuredQuote     ?? aboutData.featuredQuote;
    const currentFocusTitle = (raw as any).currentFocusTitle ?? aboutData.currentFocusTitle;
    const currentFocusBody  = (raw as any).currentFocusBody  ?? aboutData.currentFocusBody;
    const proofPoints: any[] = Array.isArray((raw as any).proofPoints) && (raw as any).proofPoints.length > 0
                                ? (raw as any).proofPoints : aboutData.proofPoints;
    const values: any[]     = Array.isArray((raw as any).values) && (raw as any).values.length > 0
                                ? (raw as any).values : aboutData.values;
    const milestones: any[] = Array.isArray((raw as any).milestones) && (raw as any).milestones.length > 0
                                ? (raw as any).milestones : aboutData.milestones;

    return (
        <div className="pt-20 lg:pt-12 pb-24">
            <div className="px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-24">
                        <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
                            Behind the Vision
                        </span>
                        <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">
                            A Journey of Purpose, Scale, and{" "}
                            <span className="text-gradient italic">Impact.</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-20">
                        <div className="relative aspect-[4/5] glass-card overflow-hidden group shadow-2xl shadow-brand-primary/10">
                            {profileImage && (
                                <NextImage
                                    src={profileImage}
                                    alt="Dinesh Koyyalamudi"
                                    fill
                                    className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-1000 ease-out"
                                    unoptimized
                                    priority
                                />
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/20 to-transparent z-10" />
                            <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-colors duration-700" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -z-10" />
                        </div>

                        <div className="space-y-10 text-text-secondary text-lg md:text-xl leading-relaxed">
                            {featuredQuote && (
                                <h3 className="text-3xl md:text-4xl font-display text-white mb-6 leading-tight">
                                    {featuredQuote}
                                </h3>
                            )}
                            {shortBio && <p>{shortBio}</p>}
                            {longBio && <p>{longBio}</p>}

                            {proofPoints.length > 0 && (
                                <div className="grid grid-cols-2 gap-12 pt-10 border-t border-white/5">
                                    {proofPoints.map((point: any) => (
                                        <div key={point.label}>
                                            <span className="text-4xl font-display text-brand-primary block mb-2 font-bold tracking-tighter">
                                                {point.value}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono font-bold">
                                                {point.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 mb-32">
                        <div className="glass-card p-10">
                            <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">
                                Now
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display text-white mb-5">
                                {currentFocusTitle}
                            </h2>
                            <p className="text-text-secondary text-lg leading-relaxed">
                                {currentFocusBody}
                            </p>
                        </div>

                        {values.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {values.map((value: any) => (
                                    <div key={value.title} className="glass-card p-8">
                                        <h3 className="text-2xl font-display text-white mb-4">{value.title}</h3>
                                        <p className="text-text-secondary leading-relaxed">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {milestones.length > 0 && <StoryTimeline milestones={milestones} />}
            <LeadershipTeam members={teamMembers} />
        </div>
    );
}
