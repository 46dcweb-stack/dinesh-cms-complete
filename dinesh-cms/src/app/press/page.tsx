import PressClientWrapper from "@/components/press/PressClientWrapper";
import PressHeader from "@/components/press/PressHeader";
import ContactForm from "@/components/sections/ContactForm";
import { getPublishedPress, getSiteSettings } from "@/lib/firebase-data";
import { pressMentions, pressPageData } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
  const s = await getSiteSettings() as any;
  const title       = s?.pressSeoTitle       || "Press & Media | Dinesh Koyyalamudi";
  const description = s?.pressSeoDescription || "Media mentions, features, and press coverage of Dinesh Koyyalamudi.";
  const ogImage     = s?.pressSeoOgImage     || "/og-image.jpg";
  return {
    title, description,
    openGraph: { title, description, images: [{ url: ogImage }], type: "website" as const },
  };
}

export default async function PressPage() {
  const [fbMentions, settings] = await Promise.all([
    getPublishedPress(),
    getSiteSettings(),
  ]);

  const mentions   = fbMentions.length > 0 ? fbMentions : (pressMentions as any[]);
  const s          = settings as any;

  // Media kit from Firebase Site Settings — falls back to static data
  const mediaKitUrl   = s?.mediaKitUrl   || (pressPageData as any).mediaKitUrl   || "";
  const mediaKitLabel = s?.mediaKitLabel || (pressPageData as any).mediaKitLabel || "Download Media Kit";

  return (
    <div className="pb-24">
      <PressHeader data={pressPageData} />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <PressClientWrapper mentions={mentions as any} />

        {/* Media Kit CTA */}
        <div className="mt-24 p-12 glass-card text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-3xl md:text-4xl font-display mb-6">Need Media Assets?</h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg">
            Access hi-res photos, official bios, and brand assets for speaking engagements and press coverage.
          </p>
          {mediaKitUrl ? (
            <a
              href={mediaKitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium px-12"
            >
              {mediaKitLabel}
            </a>
          ) : (
            <span className="opacity-40 btn-premium px-12 cursor-default">
              {mediaKitLabel}
            </span>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-24 border-t border-white/5">
        <ContactForm
          title="Press Enquiries?"
          subtitle="Media Contact"
          description="For interview requests, press releases, and media collaborations, reach out directly."
        />
      </div>
    </div>
  );
}
