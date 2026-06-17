import PressClientWrapper from "@/components/press/PressClientWrapper";
import PressHeader from "@/components/press/PressHeader";
import MediaKitButton from "@/components/press/MediaKitButton";
import ContactForm from "@/components/sections/ContactForm";
import { getPublishedPress, getSiteSettings, getPressPageMeta } from "@/lib/firebase-data";
import { pressMentions, pressPageData } from "@/lib/data";

export const revalidate = 10;

export async function generateMetadata() {
  const fbMeta = await getPressPageMeta().catch(() => null) as any;
  const hasCustomTitle = fbMeta?.seoMetaTitle && fbMeta.seoMetaTitle.trim() !== "";
  const title       = fbMeta?.seoMetaTitle       || "Press & Media";
  const description = fbMeta?.seoMetaDescription || fbMeta?.description || "Media mentions, features, and press coverage of Dinesh Koyyalamudi and FourSix46.";
  const ogImage     = fbMeta?.seoOgImage         || "/og-image.jpg";
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
  const [fbMentions, settings, fbMeta] = await Promise.all([
    getPublishedPress(),
    getSiteSettings(),
    getPressPageMeta().catch(() => null),
  ]);

  const mentions = fbMentions.length > 0 ? fbMentions : (pressMentions as any[]);
  const s        = settings as any;
  const m        = fbMeta   as any;

  // Header data
  const headerData = {
    title:               m?.title            || pressPageData.title,
    subtitle:            m?.subtitle         || pressPageData.subtitle,
    description:         m?.description      || pressPageData.description,
    heroBackground:      m?.heroBackground   || pressPageData.heroBackground,
    heroBackgroundImage: m?.heroBackground   || pressPageData.heroBackground,
    mediaKitLabel:       m?.mediaKitLabel    || pressPageData.mediaKitLabel,
    mediaKitUrl:         m?.mediaKitUrl      || pressPageData.mediaKitUrl,
  };

  // Media kit
  const rawMediaKitUrl      = s?.mediaKitUrl   || m?.mediaKitUrl   || (pressPageData as any).mediaKitUrl   || "";
  const mediaKitLabel       = m?.mediaKitLabel || s?.mediaKitLabel || (pressPageData as any).mediaKitLabel || "Download Media Kit";
  // Media Assets CTA
  const mediaAssetsTitle       = m?.mediaAssetsTitle       || "Need Media Assets?";
  const mediaAssetsDescription = m?.mediaAssetsDescription || "Access hi-res photos, official bios, and brand assets for speaking engagements and press coverage.";

  // Contact section — titles from press page meta, details from site settings
  const contactTitle       = m?.contactTitle       || "Press Enquiries?";
  const contactSubtitle    = m?.contactSubtitle    || "Media Contact";
  const contactDescription = m?.contactDescription || "For interview requests, press releases, and media collaborations, reach out directly.";
  const contactEmail       = s?.contactEmail       || "dinesh@46dc.com";
  const contactPhone       = s?.contactPhone       || "+44 02045188119";
  const contactOffice      = s?.contactOffice      || "London, England, United Kingdom";
  const contactHours       = s?.contactHours       || "Available 24/7";

  return (
    <div className="pb-24">
      <PressHeader data={headerData} />

      <div className="max-w-7xl mx-auto px-6">
        <PressClientWrapper mentions={mentions as any} />

        {/* Media Kit CTA */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-zinc-900/60 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-3xl md:text-4xl font-display mb-6">{mediaAssetsTitle}</h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg">
            {mediaAssetsDescription}
          </p>
          <MediaKitButton url={rawMediaKitUrl} label={mediaKitLabel} />
        </div>
      </div>

      {/* Compact centred contact block */}
      <div className="px-6 mt-20 mb-8">
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/60 overflow-hidden p-5 md:p-10 lg:p-16">
          <ContactForm
            title={contactTitle}
            subtitle={contactSubtitle}
            description={contactDescription}
            email={contactEmail}
            phone={contactPhone}
            office={contactOffice}
            hours={contactHours}
          />
        </div>
      </div>
    </div>
  );
}
