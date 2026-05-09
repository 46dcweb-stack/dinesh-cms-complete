// ─────────────────────────────────────────────────────────────────────────────
// Static data — replaces all Firestore fetches.
// Edit this file to update content without a CMS.
// ─────────────────────────────────────────────────────────────────────────────

export const homePageData = {
  heroTitle: "IT'S ME",
  heroName: "Dinesh Koyyalamudi",
  heroSubtitle:
    "I've earned the trust of over 250 clients and 40 brands, all of whom are very satisfied with my service!",
  heroBackground: "/images/dinesh_hero.png",
  heroImageAlt: "Dinesh Koyyalamudi",
  primaryCtaLabel: "Schedule a Call",
  primaryCtaUrl: "/contact",
  featuredQuoteText:
    "The best companies are built not just on ideas, but on conviction.",
  featuredQuoteSource: "Dinesh Koyyalamudi",
  personalIntro: {
    quote:
      "I didn't start with a roadmap. I started with a question — what if? This site is where I share the lessons, the failures, the wins, and everything in between.",
    body: "If you're building something meaningful, you're in the right place. I believe in the power of intention, the logic of systems, and the fire of purpose.",
    linkText: "Learn More About Me",
    linkUrl: "/about",
    blogSectionEyebrow: "Thought Pulse",
  blogSectionTitle: "What's On My Mind",
  manifestoTeaserEyebrow: "The Core Conviction",
  manifestoTeaserQuote: "I believe the best companies are built not just on ideas, but on conviction.",
  faqSectionEyebrow: "Knowledge Base",
  faqSectionTitle: "Frequently Asked Questions",
  faqSectionDescription: "Quick insights into the architecture, vision, and operations of our venture studio.",
  },
  ethos: {
    phrase:
      "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech.",
    principles: [
      {
        id: "01",
        label: "PRINCIPLE 01",
        title: "NEO-BRUTALISM",
        description: "Structural clarity and raw honesty in every venture.",
        color: "#E22D2D",
      },
      {
        id: "02",
        label: "PRINCIPLE 02",
        title: "QUIET LUXURY",
        description: "Sophistication through absolute precision and poise.",
        color: "#E22D2D",
      },
      {
        id: "03",
        label: "PRINCIPLE 03",
        title: "SOVEREIGN SCALE",
        description: "Distributed, secure, and sovereign infrastructure nodes.",
        color: "#00AEFF",
      },
      {
        id: "04",
        label: "PRINCIPLE 04",
        title: "GLOBAL SYNERGY",
        description: "Unifying cross-border ventures for maximum impact.",
        color: "#00AEFF",
      },
    ],
  },
  ventures: [
    {
      name: "FourSix46",
      role: "Founder & CEO",
      description:
        "A premier venture studio dedicated to building high-impact startups at the intersection of technology and human scalability. We specialize in converting complex vision into resilient infrastructure.",
      image:
        "/gallery/venture-3.png",
      color: "#FF5A00",
      url: "https://foursix46.com",
    },
    {
      name: "TechVision",
      role: "Board Member",
      description:
        "An innovation hub focused on accelerating breakthroughs in artificial intelligence and next-generation software architectures. We provide the strategic fuel for exponential growth.",
      image:
        "/gallery/venture-2.png",
      color: "#00AEFF",
    },
    {
      name: "Quantum Logic",
      role: "Lead Strategist",
      description:
        "Developing advanced algorithmic models for predictive market analytics. We bridge the gap between abstract data and actionable commercial intelligence.",
      image:
        "/gallery/venture-1.png",
      color: "#A855F7",
    },
    {
      name: "Resilient Systems",
      role: "Venture Partner",
      description:
        "Focusing on the creation of robust, self-healing digital infrastructures for global enterprise. We build systems that thrive on volatility.",
      image:
        "/gallery/venture-6.png",
      color: "#22C55E",
    },
    {
      name: "Future Pulse",
      role: "Angel Investor",
      description:
        "Identifying and backing the next generation of storytellers and system builders. We invest in ideas that redefine the human-tech relationship.",
      image:
        "/gallery/venture-4.png",
      color: "#EAB308",
    },
  ],
};

export const blogPosts = [
  {
    id: "1",
    slug: "building-resilient-systems",
    title: "Building Resilient Systems in an Era of Polycrisis",
    excerpt:
      "In a world of cascading disruptions, the companies that survive are not those that avoid chaos—they are the ones built to thrive within it.",
    content: `<p>In a world of cascading disruptions, the companies that survive are not those that avoid chaos—they are the ones built to thrive within it.</p>
    <p>For the past decade, I've been obsessed with a single question: what separates ventures that collapse under pressure from those that emerge stronger? The answer, I've found, isn't capital, talent, or even timing. It's architecture.</p>
    <h2>The Architecture of Resilience</h2>
    <p>Resilient systems share three fundamental properties: they are distributed, they are transparent, and they are built for transformation—not just stability.</p>
    <p>Most startups are built for growth. We celebrate the hockey stick, the rapid scaling, the explosive user acquisition. But growth without structural integrity is just momentum toward a harder crash.</p>
    <h2>Building for the Long Game</h2>
    <p>The companies I admire most—and the ones I've tried to build—are designed for a 50-year horizon. Not a 5-year exit. This changes everything: how you hire, how you allocate capital, how you define success.</p>`,
    tags: ["Leadership", "Venture Building"],
    publishDate: "2024-11-15",
    featuredImage:
      "/images/blog_1.png",
    featuredPost: true,
  },
  {
    id: "2",
    slug: "sovereign-data-the-next-frontier",
    title: "Sovereign Data: The Next Frontier of Enterprise Infrastructure",
    excerpt:
      "Data sovereignty is no longer a compliance checkbox. It's becoming the defining competitive advantage of the next decade.",
    content: `<p>Data sovereignty is no longer a compliance checkbox. It's becoming the defining competitive advantage of the next decade.</p>
    <p>The companies that control their own data architecture—rather than renting it from hyperscalers—will have a structural edge that compounds over time. This isn't speculation; it's already happening in Europe, and it's coming globally.</p>`,
    tags: ["Technology", "Data"],
    publishDate: "2024-10-08",
    featuredImage:
      "/images/blog_2.png",
  },
  {
    id: "3",
    slug: "the-founder-mindset",
    title: "The Founder Mindset: Why Most Entrepreneurs Think Too Small",
    excerpt:
      "The single biggest limitation in entrepreneurship isn't resources or market conditions. It's the scope of imagination.",
    content: `<p>The single biggest limitation in entrepreneurship isn't resources or market conditions. It's the scope of imagination.</p>
    <p>I've met hundreds of founders. The ones who build lasting companies share one trait: they think at a civilizational scale, even when they're working at a startup scale. They're not building products—they're building infrastructure for the future.</p>`,
    tags: ["Entrepreneurship", "Mindset"],
    publishDate: "2024-09-20",
    featuredImage:
      "/images/blog_3.png",
  },
  {
    id: "4",
    slug: "global-logistics-transformation",
    title: "How Global Logistics Is Being Quietly Transformed",
    excerpt:
      "While the world fixates on AI and consumer tech, the most profound technological revolution is happening in an industry most people ignore.",
    content: `<p>While the world fixates on AI and consumer tech, the most profound technological revolution is happening in an industry most people ignore: global logistics.</p>
    <p>The movement of physical goods is the connective tissue of civilization. When it works, you don't notice it. When it breaks, everything breaks.</p>`,
    tags: ["Logistics", "Infrastructure"],
    publishDate: "2024-08-12",
    featuredImage:
      "/gallery/venture-5.png",
  },
];

export const pressMentions = [
  {
    id: "1",
    title: "Dinesh Koyyalamudi Raises $20M for Global Logistics Platform",
    outlet: "TechCrunch",
    mediaType: "Featured",
    description:
      "FourSix46 closes its Series A, positioning itself as a critical infrastructure player in cross-border logistics.",
    url: "#",
    date: 1709251200000,
    featured: true,
    pullQuote:
      "A founder who thinks in decades, not quarters — that's what separates FourSix46.",
  },
  {
    id: "2",
    title: "The Visionary Building Systems for the Next Century",
    outlet: "Forbes",
    mediaType: "Profile",
    description:
      "A deep-dive into Dinesh's philosophy of resilient systems and his bet on sovereign infrastructure.",
    url: "#",
    date: 1706572800000,
  },
  {
    id: "3",
    title: "30 Under 40: Entrepreneurs Redefining Global Commerce",
    outlet: "Entrepreneur",
    mediaType: "Award",
    description:
      "Dinesh Koyyalamudi named among the most impactful founders transforming how the world moves goods and data.",
    url: "#",
    date: 1703894400000,
  },
];

export const faqGroups = [
  {
    category: "Vision & Strategy",
    questions: [
      {
        q: "What is the 'Resilient Systems' manifesto?",
        a: "It's a foundational blueprint for building startups and infrastructure that are antifragile. It focuses on decentralization, structural transparency, and long-term value over short-term optimization.",
      },
      {
        q: "How do you select your ventures?",
        a: "We look for deep-tech or infrastructural problems that have global implications. If a solution can fundamentally improve the 'operating system' of a sector—be it finance, logistics, or data—it's a candidate for our portfolio.",
      },
      {
        q: "What ventures are you currently focused on?",
        a: "Currently, my primary focus is on global logistics, sovereign data infrastructure, and biophilic technology. These represent the key pillars of resilient growth for the next decade.",
      },
      {
        q: "How do you approach venture building?",
        a: "We use a 'resilient systems' framework. Instead of building for quick exits, we build for structural integrity, long-term scalability, and the ability to thrive under systemic pressure.",
      },
    ],
  },
  {
    category: "Operations & Collaboration",
    questions: [
      {
        q: "Do you invest in external startups?",
        a: "While we primarily build internally, we are open to early-stage strategic investments where our architectural expertise can act as a force multiplier for the founding team.",
      },
      {
        q: "How can I join the team?",
        a: "We are always scouting for high-agency talent. Check our contact page or follow our newsletter for announcements regarding new venture formations and role openings.",
      },
      {
        q: "Where are your global operations based?",
        a: "FourSix46 operates across 5 global hubs, facilitating cross-border innovation and infrastructure deployment. Our decentralized approach ensures local relevance and global scale.",
      },
      {
        q: "How can I collaborate with FourSix46?",
        a: "We are always looking for visionary founders, strategic investors, and domain experts. You can reach out via our contact page to start a conversation about architecture and intent.",
      },
    ],
  },
];

export const galleryImages = [
  {
    id: "1",
    src: "/images/blog_1.png",
    title: "The Architecture",
    category: "Infrastructure",
    span: "md:col-span-2",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    src: "/images/blog_2.png",
    title: "Global Nodes",
    category: "Technology",
    span: "",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    src: "/images/blog_3.png",
    title: "Vision & Data",
    category: "Innovation",
    span: "",
    updatedAt: "2024-01-03",
  },
  {
    id: "4",
    src: "/gallery/venture-5.png",
    title: "Analytical Depth",
    category: "Strategy",
    span: "md:col-span-2",
    updatedAt: "2024-01-04",
  },
  {
    id: "5",
    src: "/gallery/venture-4.png",
    title: "The Foundation",
    category: "Building",
    span: "",
    updatedAt: "2024-01-05",
  },
];

export const aboutData = {
  shortBio:
    "Dinesh Koyyalamudi is a visionary entrepreneur and thinker dedicated to restructuring how we approach innovation and leadership in the 21st century.",
  longBio:
    "His journey began with a simple observation: most systems are designed for maintenance, not transformation. Dinesh pivotally shifted his focus toward building 'resilient systems'—structures that don't just survive change but thrive because of it.",
  profileImage:
    "/images/dinesh_hero.png",
  featuredQuote: "Building Paradigms, Not Just Products.",
  proofPoints: [
    { label: "Years of Venture Building", value: "12+" },
    { label: "Global Operations", value: "05" },
    { label: "Ventures Launched", value: "15+" },
    { label: "Team Members", value: "80+" },
  ],
  currentFocusTitle: "Current Focus",
  currentFocusBody:
    "Building resilient founder infrastructure, long-horizon ventures, and systems that connect narrative, execution, and authority.",
  values: [
    {
      title: "Conviction Over Consensus",
      description:
        "True innovation rarely wins by committee. We back deep conviction, not consensus thinking.",
    },
    {
      title: "Systems Over Stories",
      description:
        "We build the underlying architecture first. Narratives are only powerful when they sit on structural truth.",
    },
    {
      title: "Long Horizons",
      description:
        "We design for 50-year legacies, not 5-year exits. Patience is our most undervalued competitive advantage.",
    },
    {
      title: "Global First",
      description:
        "Every venture is designed to operate cross-border from day one. Localism is a limitation we actively design against.",
    },
  ],
  milestones: [
    {
      year: "2012",
      title: "The First Question",
      description:
        "It started with a simple observation of systemic inefficiency. This wasn't just about business; it was about the logic of how we build things.",
    },
    {
      year: "2015",
      title: "Venture Genesis",
      description:
        "Launching the first studio focused on human-centric scalability. We didn't build products; we built the frameworks that allowed products to thrive.",
    },
    {
      year: "2018",
      title: "Global Pivoting",
      description:
        "Expanding operations to three continents. The challenge wasn't geographical—it was architectural. Scaling systems across cultures and timezones.",
    },
    {
      year: "2021",
      title: "Resilience Focused",
      description:
        "Formalizing the 'Resilient Systems' manifesto. In an era of polycrisis, building for stability isn't enough. We must build for transformation.",
    },
    {
      year: "2024",
      title: "Future Architectures",
      description:
        "Investing in next-gen software and AI that prioritize intent over automation. Building the tools for the next century of leaders.",
    },
  ],
};

export const manifestoData = {
  title: "My Manifesto",
  subtitle:
    "A blueprint for the next century of resilient building.",
  eyebrow: "The Architecture of Intent",
  introLabel: "Infrastructure for the future",
  versionTag: "2.0",
  introStats: [
    { value: "Global", label: "Impact" },
    { value: "Infinite", label: "Vision" },
    { value: "100%", label: "Resilience" },
  ],
  blocks: [
    {
      sectionType: "Essay",
      order: 1,
      type: "text" as const,
      heading: "The Architecture of Intent",
      body: "A manifesto is not a decorative essay. It is a structural document—a load-bearing wall in the architecture of an enterprise. It defines the first principles that govern every decision, every hire, every capital allocation.\n\nI did not write this to inspire. I wrote it to constrain. To draw a border around what we are and what we will never become. In a world where every startup claims to be changing the world, specificity of conviction is the ultimate differentiator.",
    },
    {
      sectionType: "Statement",
      order: 2,
      type: "quote" as const,
      text: "The future is not something we wait for; it is an infrastructure we must build today.",
      author: "Dinesh Koyyalamudi",
    },
    {
      sectionType: "Core Principles",
      order: 3,
      type: "principle" as const,
      principles: [
        {
          title: "Antifragility by Design",
          description:
            "We do not build systems that merely survive disruption. We build systems that extract value from volatility. Every venture in our portfolio must demonstrate a mechanism by which uncertainty accelerates its growth.",
        },
        {
          title: "Decentralization as Default",
          description:
            "Central points of failure are architectural failures. Every system we design—from governance to infrastructure—is built to distribute authority, data, and decision-making across a resilient network.",
        },
        {
          title: "Long-Horizon Thinking",
          description:
            "We design for 50-year legacies, not 5-year exits. This changes everything: hiring, capital allocation, partnership criteria, and the definition of success itself.",
        },
        {
          title: "Structural Transparency",
          description:
            "Clarity is not a communication style—it is a structural property. Our systems, our logic, and our intentions must be legible to all stakeholders at all times.",
        },
      ],
    },
    {
      sectionType: "Vision",
      order: 4,
      type: "vision_grid" as const,
      heading: "The Three Pillars",
      description:
        "Every venture within FourSix46 operates across three civilizational pillars:",
      items: [
        {
          icon: "🌐",
          title: "Sovereign Infrastructure",
          text: "The physical and digital systems that underpin modern civilization must be owned and governed by the communities they serve.",
        },
        {
          icon: "🔗",
          title: "Cross-Border Commerce",
          text: "The future of trade is borderless. We build the logistics and financial architecture for a seamlessly connected global economy.",
        },
        {
          icon: "🌱",
          title: "Biophilic Technology",
          text: "The next generation of technology must be designed in harmony with natural systems—not in opposition to them.",
        },
      ],
    },
  ],
};

export const contactPageData = {
  title: "Let's Start a Conversation.",
  subtitle: "Get in Touch",
  description:
    "Whether you have a visionary project in mind or just want to exchange ideas, I'm always open to connecting with fellow thinkers.",
};

export const subscribePageData = {
  title: "Join the Conversation.",
  subtitle: "Communication Protocol",
  description:
    "A direct line to my latest thoughts on venture building, global infrastructure, and the systems that will define the next decade. No noise, just signal.",
};

export const pressPageData = {
  title: "Media & Mentions",
  subtitle: "Validation & Visibility",
  description:
    "Insights and features from leading publications on venture building, leadership, and the future of technology.",
  heroBackground: "/images/press_hero.png",
  mediaKitLabel: "Download Media Kit",
  mediaKitUrl: "#",
};

export const galleryPageData = {
  visualProtocol: "Visual Protocol",
  title: "Gallery",
  description:
    "A curated collection of visual artifacts representing our approach to architecture, technology, and the global infrastructures we are building.",
};
