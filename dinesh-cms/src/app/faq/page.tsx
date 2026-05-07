import FAQSection from "@/components/sections/FAQSection";
import FAQGrid from "@/components/sections/FAQGrid";
import { getPublishedFaq } from "@/lib/firebase-data";
import { faqGroups } from "@/lib/data";

export const revalidate = 60;
export const metadata = { title: "FAQ", description: "Frequently asked questions about Dinesh Koyyalamudi and FourSix46." };

export default async function FAQPage() {
  const fbFaq = await getPublishedFaq();
  const faqGroupsData = fbFaq.length > 0
    ? Object.entries(fbFaq.reduce((acc: any, item: any) => {
        const cat = item.category ?? "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({ q: item.question, a: item.answer });
        return acc;
      }, {})).map(([category, questions]) => ({ category, questions }))
    : faqGroups;

  return (
    <div className="pt-28 lg:pt-28 pb-24">
      <div className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">Knowledge Protocol</span>
            <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">Frequently Asked <span className="text-gradient italic">Questions.</span></h1>
          </div>
          <div className="space-y-24 mb-32">
            {faqGroupsData.map((group: any, idx: number) => (
              <div key={idx}>
                <h2 className="text-brand-primary font-mono text-sm uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-4">{group.category}</h2>
                <FAQGrid questions={group.questions as any} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-32 border-t border-white/5"><FAQSection /></div>
    </div>
  );
}
