import HomeHero from "@/components/sections/HomeHero";
import FeaturedQuoteSection from "@/components/sections/FeaturedQuoteSection";
import PersonalIntro from "@/components/sections/PersonalIntro";
import AdvancedVentures from "@/components/sections/AdvancedVentures";
import EthosSection from "@/components/sections/EthosSection";
import HorizontalNewsroom from "@/components/sections/HorizontalNewsroom";
import PressLogos from "@/components/sections/PressLogos";
import ManifestoTeaser from "@/components/sections/ManifestoTeaser";
import Newsletter from "@/components/sections/Newsletter";
import FAQSection from "@/components/sections/FAQSection";
import { getHomePage, getPublishedBlogs, getPublishedFaq, getVentures, getPublishedPress, getSiteSettings } from "@/lib/firebase-data";
import { homePageData, blogPosts, faqGroups } from "@/lib/data";
import { fbStr, fbArr, fbVal } from "@/lib/fallback";
import type { Metadata } from "next";
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, homeData] = await Promise.all([getSiteSettings(), getHomePage()]) as any[];
  // Home-page-specific SEO takes priority over global settings
  const title       = fbStr(homeData?.seoTitle,       fbStr(settings?.seoDefaultTitle,       "Dinesh Koyyalamudi | Strategic Visionary & Venture Builder"));
  const description = fbStr(homeData?.seoDescription, fbStr(settings?.seoDefaultDescription, "Official platform of Dinesh Koyyalamudi — Founder building resilient systems and visionary companies."));
  const ogImage     = fbVal(homeData?.seoOgImage,     fbVal(settings?.seoOgImage,            "/og-image.jpg"));
  return {
    title, description,
    openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630 }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function Home() {
  const [fbHome, fbBlogs, fbFaq, fbVentures, fbPress] = await Promise.all([
    getHomePage(), getPublishedBlogs(), getPublishedFaq(), getVentures(), getPublishedPress(),
  ]);

  const static_home = homePageData as any;
  const home        = (fbHome ?? {}) as any;

  // ── Field-level fallbacks for every home section ─────────────────────────
  const homeData = {
    ...static_home,       // start with ALL static defaults
    ...home,              // overlay Firebase values
    // Then ensure nested objects also fall back field by field
    personalIntro: {
      quote:    fbStr(home.personalIntro?.quote,    static_home.personalIntro?.quote),
      body:     fbStr(home.personalIntro?.body,     static_home.personalIntro?.body),
      linkText: fbStr(home.personalIntro?.linkText, static_home.personalIntro?.linkText),
      linkUrl:  fbStr(home.personalIntro?.linkUrl,  static_home.personalIntro?.linkUrl),
    },
    ethos: {
      ...static_home.ethos,
      ...home.ethos,
      phrase:     fbStr(home.ethos?.phrase,     static_home.ethos?.phrase),
      principles: fbArr(home.ethos?.principles, static_home.ethos?.principles ?? []),
    },
    heroTitle:    fbStr(home.heroTitle,    static_home.heroTitle),
    heroName:     fbStr(home.heroName,     static_home.heroName),
    heroSubtitle: fbStr(home.heroSubtitle, static_home.heroSubtitle),
  };

  const blogs    = fbArr(fbBlogs,    blogPosts as any[]);
  const press    = fbArr(fbPress,    []);


// After (no type issues
  const ventures = (fbVentures.length > 0 ? fbVentures : (static_home.ventures ?? []));

  const faqItems = fbFaq.length > 0
    ? fbFaq.map((item: any) => ({ q: item.question, a: item.answer }))
    : faqGroups.flatMap((g) => g.questions) as any[];

  const show = {
    ventures:        fbVal(homeData.showVentures,        true),
    blog:            fbVal(homeData.showBlog,            true),
    press:           fbVal(homeData.showPress,           true),
    manifestoTeaser: fbVal(homeData.showManifestoTeaser, true),
    faq:             fbVal(homeData.showFaq,             true),
    newsletter:      fbVal(homeData.showNewsletter,      true),
  };

  return (
    <div className="flex flex-col">
      <HomeHero data={homeData} />
      <FeaturedQuoteSection
        quote={homeData.featuredQuoteText}
        source={homeData.featuredQuoteSource}
        box1Label={(homeData as any).box1Label}
        box1Title={(homeData as any).box1Title}
        box2Label={(homeData as any).box2Label}
        box2Title={(homeData as any).box2Title}
      />
      <PersonalIntro data={homeData.personalIntro} />
      <EthosSection data={homeData.ethos} />
      {show.ventures        && <AdvancedVentures data={ventures} />}
      {show.blog            && <HorizontalNewsroom posts={blogs.slice(0, 6) as any} />}
      {show.press           && <PressLogos items={press as any[]} />}
      {show.manifestoTeaser && <ManifestoTeaser />}
      {show.faq             && <FAQSection items={faqItems.slice(0, 4)} />}
      {show.newsletter      && <Newsletter />}
    </div>
  );
}