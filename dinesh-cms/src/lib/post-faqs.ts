// ─────────────────────────────────────────────────────────────────────────────
// Per-post FAQ schema data
//
// Google requires every Q&A published as FAQPage schema to be VISIBLE on the
// page itself. Only add a slug here once the post body actually contains those
// questions and answers, otherwise the markup breaks structured-data guidelines
// and can earn a manual action.
//
// Tech debt: this is a code-side map because blogPosts has no FAQ field in the
// CMS yet. Adding a repeatable FAQ group to the blog admin would let editors
// manage this per post without a deploy.
// ─────────────────────────────────────────────────────────────────────────────

export type PostFaq = { q: string; a: string };

const POST_FAQS: Record<string, PostFaq[]> = {
  "why-people-call-me-46dc": [
    {
      q: "What does 46DC stand for?",
      a: "46 comes from the registration number of Dinesh Koyyalamudi's Royal Enfield motorcycle in 2018. DC comes from his middle name, Chandra — his full name is Dinesh Chandra Koyyalamudi, and a friend shortened it to DC in conversation.",
    },
    {
      q: "What is 46DC's real name?",
      a: "46DC is Dinesh Koyyalamudi, a London-based founder. His full legal name is Dinesh Chandra Koyyalamudi.",
    },
    {
      q: "Is 46 a lucky number for 46DC?",
      a: "No. The number 46 had no significance before 2018, when it appeared as his motorcycle registration. He chose to make it meaningful through consistent use rather than inheriting any existing meaning.",
    },
    {
      q: "Which came first, 46DC or FourSix46?",
      a: "46DC came first. The personal handle was in common use by 2020, and FourSix46 Global Ltd was registered in the United Kingdom in 2025 and named after it.",
    },
    {
      q: "What is FourSix46 Global Ltd?",
      a: "FourSix46 Global Ltd is a UK-registered parent brand, Company No. 16712658, founded by Dinesh Koyyalamudi. It builds multiple ventures under a single identity, including Route46, Stack46, Cinevenn and 46Dogs.",
    },
    {
      q: "Where is 46DC based?",
      a: "Dinesh Koyyalamudi (46DC) is based in the United Kingdom. He moved to the UK in 2022.",
    },
  ],
};

export function getPostFaqs(slug: string): PostFaq[] {
  return POST_FAQS[slug] ?? [];
}
