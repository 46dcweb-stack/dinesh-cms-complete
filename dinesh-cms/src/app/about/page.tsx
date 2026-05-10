import NextImage from "next/image";
import StoryTimeline from "@/components/sections/StoryTimeline";
import LeadershipTeam from "@/components/sections/LeadershipTeam";
import { getAboutPage, getTeamMembers } from "@/lib/firebase-data";
import { aboutData } from "@/lib/data";

export const revalidate = 60;

// Renders HTML if content starts with <tag>, otherwise plain paragraphs
function renderContent(text: string) {
  if (!text) return null;
  const isHtml = text.trimStart().startsWith("<");
  if (isHtml) {
    return (
      <div
        className="prose prose-invert prose-lg max-w-none prose-p:text-text-secondary prose-p:leading-relaxed prose-headings:text-white prose-a:text-brand-primary prose-strong:text-white prose-ul:text-text-secondary prose-li:text-text-secondary"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }
  return (
    <>
      {text.split("\n\n").map((para: string, i: number) => (
        <p key={i} className="text-text-secondary leading-relaxed mb-4">{para}</p>
      ))}
    </>
  );
}


// ADD THIS INSTEAD:
export async function generateMetadata() {
    const fbAbout = await getAboutPage().catch(() => null) as any;
    const title       = fbAbout?.seoMetaTitle       || "About Dinesh Koyyalamudi — Founder & Strategic Visionary";
    const description = fbAbout?.seoMetaDescription || fbAbout?.shortBio || "The story, values, and journey of Dinesh Koyyalamudi — Founder of FourSix46.";
    const ogImage     = fbAbout?.profileImage       || "/og-image.jpg";
    return {
        title,
        description,
        openGraph: { title, description, url: "https://dineshkoyyalamudi.com/about", images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
        twitter: { card: "summary_large_image" as const, title, description, images: [ogImage] },
    };
}
export default async function AboutPage() {
    const [fbAbout, fbTeam] = await Promise.all([
        getAboutPage(),
        getTeamMembers(),
    ]);
    const raw = fbAbout ?? aboutData;

    // Team members fetched via Admin SDK above (fbTeam)
    const teamMembers: any[] = Array.isArray(fbTeam) ? fbTeam : [];

    // Safe fallbacks — if Firebase field is empty/missing, use static data
    const downloadableBio   = (raw as any).downloadableBio  || null;
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
        <div className="pt-28 lg:pt-28 pb-24">
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
                            {shortBio && renderContent(shortBio)}
                            {longBio && renderContent(longBio)}
                            {downloadableBio && (
                              <a
                                href={downloadableBio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 px-6 py-3 border border-brand-primary/30 text-brand-primary text-sm font-mono uppercase tracking-wider rounded-full hover:bg-brand-primary/10 transition-colors"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download Bio PDF
                              </a>
                            )}

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
