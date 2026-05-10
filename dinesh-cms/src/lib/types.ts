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
  sortOrder: number;
  status: "draft" | "published";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ── MANIFESTO SECTIONS ───────────────────────────────────────────────────────
export interface ManifestoSection {
  id?: string;
  sectionType: "Principle" | "Essay" | "Statement" | "Vision";
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
  updatedAt?: Timestamp;
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqItem {
  id?: string;
  question: string;
  answer: string; // rich text
  category: "About Dinesh" | "FourSix46 & Ventures" | "Speaking & Media" | "Collaboration & Advisory" | "Vision & Strategy" | "Operations & Collaboration";
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
  // Hero Stats
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  // Manifesto Teaser
  manifestoTeaserEyebrow?: string;
  manifestoTeaserQuote?: string;
  manifestoTeaserCtaLabel?: string;
  manifestoTeaserCtaUrl?: string;
  // FAQ Section (homepage preview)
  faqSectionEyebrow?: string;
  faqSectionHeading?: string;
  faqSectionHeadingItalic?: string;
  faqSectionSubtext?: string;
  // Blog Section (Horizontal Newsroom)
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
  status: "active" | "inactive";
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
  };
  footerCopyright: string;
  footerTagline?: string;
  navItems: { label: string; url: string; order: number }[];
  mediaKitUrl?: string;
  googleAnalyticsId?: string;
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

