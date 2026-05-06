import HomeHero from "@/components/sections/HomeHero";
import PersonalIntro from "@/components/sections/PersonalIntro";
import AdvancedVentures from "@/components/sections/AdvancedVentures";
import EthosSection from "@/components/sections/EthosSection";
import HorizontalNewsroom from "@/components/sections/HorizontalNewsroom";
import PressLogos from "@/components/sections/PressLogos";
import ManifestoTeaser from "@/components/sections/ManifestoTeaser";
import Newsletter from "@/components/sections/Newsletter";
import FAQSection from "@/components/sections/FAQSection";
import { getHomePage, getPublishedBlogs, getPublishedFaq, getVentures } from "@/lib/firebase-data";
import { homePageData, blogPosts, faqGroups } from "@/lib/data";

export const revalidate = 0;

export default async function Home() {
    const [fbHome, fbBlogs, fbFaq, fbVentures] = await Promise.all([
        getHomePage(), getPublishedBlogs(), getPublishedFaq(), getVentures(),
    ]);

    const homeData = fbHome ?? (homePageData as any);
    const blogs = fbBlogs.length > 0 ? fbBlogs : (blogPosts as any[]);
    const faqItems = fbFaq.length > 0 ? fbFaq : faqGroups.flatMap((g) => g.questions) as any[];
    const ventures = fbVentures.length > 0 ? fbVentures : ((homeData as any).ventures ?? []);

    return (
        <div className="flex flex-col">
            <HomeHero data={homeData as any} />
            <PersonalIntro data={homeData.personalIntro} />
            <EthosSection data={homeData.ethos as any} />
            <AdvancedVentures data={ventures as any} />
            <HorizontalNewsroom posts={blogs.slice(0, 6) as any} />
            <PressLogos />
            <ManifestoTeaser />
            <FAQSection items={faqItems.slice(0, 4)} />
            <Newsletter />
        </div>
    );
}