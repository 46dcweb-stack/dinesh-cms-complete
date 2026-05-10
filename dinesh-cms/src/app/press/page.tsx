import PressClientWrapper from "@/components/press/PressClientWrapper";
import PressHeader from "@/components/press/PressHeader";
import ContactForm from "@/components/sections/ContactForm";
import { getPublishedPress, getPressPageMeta } from "@/lib/firebase-data";
import { pressMentions, pressPageData } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
  const fbMeta = await getPressPageMeta().catch(() => null) as any;
  
  // If custom SEO title exists, use it as-is (absolute). Otherwise use default.
  const hasCustomTitle = fbMeta?.seoMetaTitle && fbMeta.seoMetaTitle.trim() !== "";
  const title = fbMeta?.seoMetaTitle || "Press & Media";
  const description = fbMeta?.seoMetaDescription || fbMeta?.description || "Media mentions, features, and press coverage of Dinesh Koyyalamudi and FourSix46.";
  const ogImage = fbMeta?.seoOgImage || "/og-image.jpg";
  
  return {
    title: hasCustomTitle ? { absolute: title } : title,
    description,
    openGraph: {
      title: hasCustomTitle ? title : `${title} | Dinesh Koyyalamudi`,
      description,
      url: "https://dineshkoyyalamudi.com/press",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: hasCustomTitle ? title : `${title} | Dinesh Koyyalamudi`,
      description,
      images: [ogImage],
    },
  };
}

export default async function PressPage() {
  const [fbMentions, fbMeta] = await Promise.all([
    getPublishedPress(),
    getPressPageMeta().catch(() => null),
  ]);
  const mentions = fbMentions.length > 0 ? fbMentions : (pressMentions as any[]);

  // Merge Firebase meta over static fallbacks
  const headerData = {
    title:       (fbMeta as any)?.title           || pressPageData.title,
    subtitle:    (fbMeta as any)?.subtitle         || pressPageData.subtitle,
    description: (fbMeta as any)?.description      || pressPageData.description,
    heroBackground:      (fbMeta as any)?.heroBackground || pressPageData.heroBackground,
    heroBackgroundImage: (fbMeta as any)?.heroBackground || pressPageData.heroBackground,
    mediaKitLabel: (fbMeta as any)?.mediaKitLabel  || pressPageData.mediaKitLabel,
    mediaKitUrl:   (fbMeta as any)?.mediaKitUrl    || pressPageData.mediaKitUrl,
  };

  return (
    <div className="pb-24">
      <PressHeader data={headerData} />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <PressClientWrapper mentions={mentions as any} />

        {/* Media Kit CTA */}
        <div className="mt-24 p-12 glass-card text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-3xl md:text-4xl font-display mb-6">
            {(fbMeta as any)?.mediaAssetsTitle || "Need Media Assets?"}
          </h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg">
            {(fbMeta as any)?.mediaAssetsDescription || "Access hi-res photos, official bios, and brand assets for speaking engagements and press coverage."}
          </p>
          <a href={headerData.mediaKitUrl} target="_blank" rel="noopener noreferrer" className="btn-premium px-12">
            {headerData.mediaKitLabel}
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-24 border-t border-white/5">
        <ContactForm
          title={(fbMeta as any)?.contactTitle || "Press Enquiries?"}
          subtitle={(fbMeta as any)?.contactSubtitle || "Media Contact"}
          description={(fbMeta as any)?.contactDescription || "For interview requests, press releases, and media collaborations, reach out directly."}
        />
      </div>
    </div>
  );
}
