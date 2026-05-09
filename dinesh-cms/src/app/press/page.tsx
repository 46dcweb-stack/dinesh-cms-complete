import PressClientWrapper from "@/components/press/PressClientWrapper";
import PressHeader from "@/components/press/PressHeader";
import ContactForm from "@/components/sections/ContactForm";
import { getPublishedPress, getPressPageMeta } from "@/lib/firebase-data";
import { pressMentions, pressPageData } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
  const fbMeta = await getPressPageMeta().catch(() => null) as any;
  
  const title = fbMeta?.seoMetaTitle || "Press & Media | Dinesh Koyyalamudi";
  const description = fbMeta?.seoMetaDescription || fbMeta?.description || "Media mentions, features, and press coverage of Dinesh Koyyalamudi and FourSix46.";
  const ogImage = fbMeta?.seoOgImage || "/og-image.jpg";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://dineshkoyyalamudi.com/press",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PressPage() {
  const fbMentions = await getPublishedPress();
  const mentions = fbMentions.length > 0 ? fbMentions : (pressMentions as any[]);

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
          <a href={(pressPageData as any).mediaKitUrl} target="_blank" rel="noopener noreferrer" className="btn-premium px-12">
            {(pressPageData as any).mediaKitLabel}
          </a>
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
