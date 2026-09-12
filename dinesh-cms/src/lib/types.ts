// ─────────────────────────────────────────────────────────────────────────────
// Firestore Collection Types — Dinesh Portfolio CMS
// Each interface maps 1:1 to a Firestore collection
// ─────────────────────────────────────────────────────────────────────────────

import { Timestamp } from "firebase/firestore";

// ── BLOG POSTS ──────────────────────────────────────────────────────────────
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // rich HTML
  tags: string[];
  categories: string[];
  publishDate: string; // ISO date string
  featuredImage: string;
  featuredPost: boolean;
  status: "draft" | "published" | "archived";
  readingTime: number; // minutes
  canonicalUrl?: string;
  language: string;
  series?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  author: string;
  /** Per-post FAQs. Rendered visibly on the post AND emitted as FAQPage
   *  schema — Google requires the Q&A to be visible, so the two are tied
   *  together deliberately. */
  faqs?: { question: string; answer: string }[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
}

// ── PRESS MENTIONS ───────────────────────────────────────────────────────────
export interface PressMention {
  id?: string;
  title: string;
  outlet: string;
  outletLogo?: string;
  date: number; // timestamp ms
  url: string;
  thumbnail?: string;
  description?: string;
  mediaType: "Article" | "Interview" | "Podcast" | "Video" | "Award" | "Featured" | "Profile";
  featured: boolean;
  pullQuote?: string;
  downloadableAsset?: string;
  showInFeaturedBar?: boolean;
  sortOrder: number;
  status: "draft" | "published";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ── MANIFESTO SECTIONS ───────────────────────────────────────────────────────
export interface ManifestoSection {
  id?: string;
  // Rendered verbatim as the public label above each manifesto section.
  // Legacy values ("Principle", "Statement", "Vision") remain valid so existing
  // documents stay editable until they are migrated.
  sectionType:
    | "Principle 46" | "Statement 46" | "Vision 46" | "Rule 46" | "Reason 46"
    | "Suggestion 46" | "Lesson 46" | "Note 46" | "Essay"
    | "Principle" | "Statement" | "Vision";
  order: number;
  type: "text" | "quote" | "principle" | "vision_grid";
  // text type
  heading?: string;
  body?: string;
  // quote type
  text?: string;
  authorAttr?: string;
  // principle type
  principles?: { title: string; description: string }[];
  // vision_grid type
  description?: string;
  items?: { icon: string; title: string; text: string }[];
  highlightStyle: "normal" | "emphasized";
  backgroundImage?: string;
  pullQuote?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ManifestoMeta {
  id?: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  introLabel: string;
  versionTag: string;
  introStats: { value: string; label: string }[];
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoOgImage?: string;
  globeMarkers?: { lat: number; lng: number; label: string }[];
  globeConnections?: { from: [number, number]; to: [number, number] }[];
  updatedAt?: Timestamp;
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqPageSettings {
  id?: string;
  pageLabel?: string;
  pageTitle?: string;
  pageTitleItalic?: string;
  pageDescription?: string;
  updatedAt?: Timestamp;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string; // rich text
  category: "About Dinesh Koyyalamudi" | "FourSix46 & Ventures" | "Speaking & Media" | "Collaboration & Advisory" | "Vision & Strategy" | "Operations & Collaboration";
  sortOrder: number;
  featured: boolean;
  status: "draft" | "published";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ── ABOUT PAGE ───────────────────────────────────────────────────────────────
export interface AboutPage {
  id?: string;
  heroEyebrow?: string;
  heroHeading?: string;
  heroHeadingItalic?: string;
  shortBio: string;
  longBio: string;
  profileImage: string;
  featuredQuote: string;
  downloadableBio?: string; // PDF URL
  currentFocusTitle: string;
  currentFocusBody: string;
  proofPoints: { label: string; value: string }[];
  values: { title: string; description: string }[];
  milestones: { year: string; title: string; description: string }[];
  updatedAt?: Timestamp;

}
// ── HOME PAGE ─────────────────────────────────────────────────────────────────
export interface HomePage {
  
  id?: string;
  heroTitle: string;
  heroName: string;
  heroSubtitle: string;
  heroBackground: string;
  heroBackgroundVideo?: string;
  heroImageAlt: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  featuredQuoteText: string;
  featuredQuoteSource: string;
  personalIntro: {
    quote: string;
    body: string;
    linkText: string;
    linkUrl: string;
  };
  ethos: {
    phrase: string;
    principles: {
      id: string;
      label: string;
      title: string;
      description: string;
      color: string;
    }[];
  };
  venturesEyebrow?: string;
  venturesHeading?: string;
  venturesHeadingItalic?: string;
  // Hero stats
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  // Featured Quote Section — Box cards (no links)
  featuredBlogSlug?: string;
  featuredBlogTitle?: string;
  featuredPressUrl?: string;
  featuredPressTitle?: string;
  box1Label?: string;
  box1Title?: string;
  box2Label?: string;
  box2Title?: string;
  // Manifesto Teaser
  manifestoTeaserEyebrow?: string;
  manifestoTeaserQuote?: string;
  manifestoTeaserCtaLabel?: string;
  manifestoTeaserCtaUrl?: string;
  // FAQ Section
  faqSectionEyebrow?: string;
  faqSectionHeading?: string;
  faqSectionHeadingItalic?: string;
  faqSectionSubtext?: string;
  // Blog Section
  blogSectionEyebrow?: string;
  blogSectionHeading?: string;
  blogSectionHeadingItalic?: string;
  showVentures: boolean;
  showBlog: boolean;
  showPress: boolean;
  showManifestoTeaser: boolean;
  showFaq: boolean;
  showNewsletter: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: string;
  updatedAt?: Timestamp;
}

// ── VENTURES ──────────────────────────────────────────────────────────────────
export interface Venture {
  id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  color: string;
  url?: string;
  sortOrder: number;
  featured: boolean;
  status: "active" | "inactive" | "pre-launch" | "coming-soon" | "building";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ── SUBSCRIBERS ───────────────────────────────────────────────────────────────
export interface Subscriber {
  id?: string;
  email: string;
  name?: string;
  source: "homepage" | "blog" | "footer" | "subscribe-page" | "other";
  consentTimestamp: Timestamp;
  status: "active" | "unsubscribed";
  integrationFlag?: string; // "mailchimp" | "brevo" | etc.
  createdAt?: Timestamp;
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
export interface GalleryImage {
  id?: string;
  src: string;
  title: string;
  category: string;
  span: string;
  altText?: string;
  sortOrder: number;
  featured: boolean;
  status: "active" | "hidden";
  updatedAt?: Timestamp;
}

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
export interface SiteSettings {
  id?: string;
  siteName: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoOgImage?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  footerEmail?: string;
  footerCopyright: string;
  footerTagline?: string;
  navItems: { label: string; url: string; order: number }[];
  mediaKitUrl?: string;
  googleAnalyticsId?: string;
  footerLocation?: string;
  
  contactTitle?: string;
  contactSubtitle?: string;
  contactDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactOffice?: string;
  contactHours?: string;
  updatedAt?: Timestamp;
}

// ── CONTACT FORM SUBMISSIONS ───────────────────────────────────────────────────
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  type: "general" | "speaking" | "media" | "investment" | "collaboration";
  status: "new" | "read" | "replied" | "archived";
  createdAt?: Timestamp;
}

// ── ADMIN USERS ────────────────────────────────────────────────────────────────
export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "editor" | "author";
  createdAt?: Timestamp;
}

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────
export interface AuditLog {
  id?: string;
  userEmail: string;
  userId: string;
  collection: string;
  docId: string;
  action: "create" | "update" | "delete" | "publish" | "unpublish";
  fieldChanged?: string;
  summary: string;
  createdAt: Timestamp;
}

// ── PRESS PAGE META ────────────────────────────────────────────────────────────
export interface PressPageMeta {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  heroBackground: string;
  mediaKitLabel: string;
  mediaKitUrl: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoOgImage?: string;
  updatedAt?: Timestamp;
   contactTitle?: string;
  contactSubtitle?: string;
  contactDescription?: string;
  mediaAssetsTitle: string;
  mediaAssetsDescription: string;
}

// ── LEADERSHIP / TEAM MEMBERS ─────────────────────────────────────────────────
export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn?: string;
  twitter?: string;
  sortOrder: number;
  featured: boolean;
  status: "active" | "hidden";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
// ── ECOSYSTEM PAGE META ───────────────────────────────────────────────────────
export interface EcosystemPageMeta {
  id?: string;
  // Heading fields drive BOTH the home page Ecosystem section and the /ecosystem page
  eyebrow?: string;
  heading?: string;
  headingItalic?: string;
  description?: string;
  introTitle?: string;
  introBody?: string;
  stats?: { value: string; label: string }[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  // Controls whether the Ecosystem section renders on the home page
  showOnHome?: boolean;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoOgImage?: string;
  updatedAt?: Timestamp;
}

// ── LEGAL PAGES (/terms, /privacy, /cookies) ─────────────────────────────────
export interface LegalPage {
  id?: string;              // "terms" | "privacy" | "cookies"
  eyebrow?: string;
  title?: string;
  titleItalic?: string;
  entityName?: string;
  lastUpdated?: string;
  /** Rich HTML, or plain text where blank lines become paragraphs. */
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRADEMARKS
//
// Model notes (from the trademarks CMS specification):
//  • `symbol` is DERIVED, never stored or editable. Using ® on an unregistered
//    mark is an offence under s.107 of India's Trade Marks Act 1999 and s.95 of
//    the UK Trade Marks Act 1994, so it must not be a field an editor can set.
//    See markSymbol() in lib/trademarks.ts.
//  • `filingType` decides where the application number lives: at mark level for
//    single/multi-class filings, at class level when each class was filed
//    separately (Cinevenn: 7573210–7573213).
//  • `classNumber` stores the real Nice class (9, 35, 41…), never 99 — that is
//    a filing code, not a class.
// ─────────────────────────────────────────────────────────────────────────────

/** The legally recorded owner. Separate from the mark so a mark can be
 *  reassigned without rewriting its record. */
export interface Proprietor {
  id?: string;
  /** EXACTLY as recorded at the registry, e.g. "KOYYALAMUDI DINESH CHANDRA". */
  legalName: string;
  /** Readable form used in prose, e.g. "Dinesh Koyyalamudi". */
  displayName: string;
  entityType: "Company" | "Individual" | "Charity" | "Trust";
  registrationNumber?: string;
  registeredCountry?: string;
  verifyUrl?: string;
  bioShort?: string;
  sortOrder?: number;
  updatedAt?: Timestamp;
}

/** A registry office. Adding a country later is one row here. */
export interface Jurisdiction {
  id?: string;
  countryName: string;
  /** ISO alpha-2 — GB, IN */
  countryCode: string;
  officeName: string;
  /** Short form used on buttons, e.g. "UK IPO". */
  officeShort: string;
  officeUrl: string;
  /** e.g. "https://…/{application_number}" — builds a direct verify link. */
  recordUrlPattern?: string;
  /** FALSE for IP India: their search is session-based, so the button must
   *  point at the search page with the number shown for manual entry. */
  deepLinkSupported: boolean;
  symbolRuleNote?: string;
  /** The stage sequence this office runs an application through, in order.
   *  `status` matches a Trademark.status value and marks the current position.
   *  Held here rather than in code so a registry's process can be corrected
   *  from the admin without a deploy. */
  stages?: { status: string; title: string; description: string }[];
  sortOrder: number;
  updatedAt?: Timestamp;
}

export type TrademarkStatus =
  | "Filed"
  | "Formalities check passed"
  | "Ready for examination"
  | "Vienna codification"
  | "Under examination"
  | "Objected"
  | "Published"
  | "Opposed"
  | "Registered"
  | "Lapsed"
  | "Withdrawn"
  | "Refused";

export type TrademarkFilingType =
  | "Single-class"
  | "Multi-class"
  | "Separate applications per class";

/** One Nice class covered by a mark. */
export interface TrademarkClass {
  /** 1–45. Never 99. */
  classNumber: number;
  /** Official Nice heading. */
  classHeading: string;
  /** The EXACT wording as filed. Never paraphrase or tidy — this is a legal
   *  instrument and defines what the page claims is protected. */
  specification: string;
  /** Required only when filingType is "Separate applications per class". */
  applicationNumber?: string;
  classStatus?: TrademarkStatus | "";
}

export interface Trademark {
  id?: string;
  // ── Identity
  markName: string;
  slug: string;
  markType: "Word mark" | "Device mark" | "Combined mark" | "Series mark";
  /** Required for Device/Combined: the artwork exactly as filed, not a current
   *  logo variant. Word marks need no image — the specimen renders the name. */
  markImage?: string;
  markImageBg?: "Light" | "Dark" | "Transparent";
  ventureName?: string;
  ventureUrl?: string;

  // ── Registry particulars
  jurisdictionId: string;
  proprietorId: string;
  filingType: TrademarkFilingType;
  /** Mark-level number. Empty when filingType is per-class. */
  applicationNumber?: string;
  registrationNumber?: string;
  filingDate: string;
  registrationDate?: string;
  /** Internal only — never rendered. */
  renewalDue?: string;
  officialRecordUrl?: string;
  journalUrl?: string;

  // ── Status
  status: TrademarkStatus;
  statusUpdated: string;
  statusNote?: string;

  classes: TrademarkClass[];

  // ── Narrative (this site's voice)
  summary?: string;
  story?: string;
  classNote?: string;
  usageEnabled?: boolean;
  usageIntro?: string;
  usageCorrect?: string;
  usageIncorrect?: string;
  faqs?: { question: string; answer: string }[];

  // ── SEO + display
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  isPrimary?: boolean;
  sortOrder: number;
  showOnSite?: boolean;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Singleton copy for the /trademarks index page. */
export interface TrademarkPageMeta {
  id?: string;
  eyebrow?: string;
  heading?: string;
  headingItalic?: string;
  lede?: string;
  lede2?: string;
  whyHeading?: string;
  whyIntro?: string;
  whyColumns?: { heading: string; body: string }[];
  registerHeading?: string;
  registerIntro?: string;
  registerFootnote?: string;
  usageHeading?: string;
  usageIntro?: string;
  usageRules?: { lead: string; body: string }[];
  usageCorrect?: string[];
  usageIncorrect?: string[];
  pageFaqs?: { question: string; answer: string }[];
  faqHeading?: string;
  crossSiteHeading?: string;
  crossSiteBody?: string;
  crossSiteUrl?: string;
  crossSiteCta?: string;
  registerEmpty?: string;
  lastUpdatedLabel?: string;
  // Labels shared by every /trademarks/{slug} page. They live here rather than
  // on each mark so the wording stays consistent across the register.
  markStoryHeading?: string;
  markClassesHeading?: string;
  markClassesIntro?: string;
  markTimelineHeading?: string;
  markTimelineIntro?: string;
  markUsageHeading?: string;
  markVerifyHeading?: string;
  markVerifyIntro?: string;
  markRelatedHeading?: string;
  markFaqHeading?: string;
  wordMarkNote?: string;
  deviceMarkNote?: string;
  specificationFallback?: string;
  // Verification cards. {office}, {venture} and {proprietor} are substituted
  // with the values on the mark being viewed.
  verifyRegisterTitle?: string;
  verifyRegisterBody?: string;
  verifyVentureTitle?: string;
  verifyVentureBody?: string;
  verifyProprietorTitle?: string;
  verifyProprietorBody?: string;
  manualSearchNote?: string;
  // Register table column headings
  colMark?: string;
  colProprietor?: string;
  colStatus?: string;
  colApplication?: string;
  colClasses?: string;
  colAction?: string;
  // Hero panel and counters
  primaryPanelLabel?: string;
  statMarksLabel?: string;
  statRegisteredLabel?: string;
  statOfficesLabel?: string;
  usageExamplesLabel?: string;
  // Field labels on the hero panel and the mark-page particulars panel
  labelMark?: string;
  labelType?: string;
  labelNumber?: string;
  labelOffice?: string;
  labelClasses?: string;
  labelStatus?: string;
  labelRegistration?: string;
  labelProprietor?: string;
  labelFiled?: string;
  // Mark page chrome
  particularsLabel?: string;
  specificationLabel?: string;
  verifyButtonPrefix?: string;
  openRegisterPrefix?: string;
  visitVenturePrefix?: string;
  proprietorCtaLabel?: string;
  correctLabel?: string;
  notPermittedLabel?: string;
  breadcrumbHome?: string;
  breadcrumbRegister?: string;
  closedStageNote?: string;
  countOne?: string;
  countMany?: string;
  specificationFallbackSuffix?: string;
  /** Title pattern for a mark with no meta title of its own.
   *  {mark}, {symbol} and {country} are substituted. */
  markTitlePattern?: string;
  /** Wording on the "registered" stamp. Whether it shows is derived from the
   *  mark's status, never from a setting. */
  stampLabel?: string;
  stampSublabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: Timestamp;
}
