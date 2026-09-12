// Seed copy for /trademarks.
//
// The public pages do NOT read this file — every string they render comes from
// the `trademarkPageMeta` document. This is the wording the admin offers when a
// field has never been filled in, and the source the seed script writes from,
// so there is one place to restore known-good copy from and exactly one place
// the live site reads.
import type { TrademarkPageMeta } from "./types";

export const TRADEMARK_PAGE_DEFAULTS: TrademarkPageMeta = {
  eyebrow: "The Register",
  heading: "Everything I've put my",
  headingItalic: "name to.",
  lede: "Marks across two countries — some held by the company I founded, some held by me personally. This is the full list, with the ownership stated on each one.",
  lede2: "I build in public, and that has to include the paperwork. Every record links to the government register it sits on, so none of this rests on my word for it.",
  whyHeading: "Why I register everything",
  whyIntro: "Filing a trademark is the least glamorous thing I do and one of the few I would refuse to skip. A name you have not registered is a name you are only borrowing.",
  whyColumns: [
    { heading: "Name it, then own it", body: "I registered FourSix46 before there was much of an ecosystem to protect. It is the reason every venture since has launched under a name that was already secure." },
    { heading: "File early, not eventually", body: "Each venture gets filed where it actually trades, in the classes matching what it actually does. Filing early is cheap. Buying your own name back from someone who filed first is not." },
    { heading: "Numbers, not claims", body: "Anyone can call themselves a founder. Fewer can hand you an application number and invite you to go and check it. That is why this page leads with registry numbers rather than adjectives." },
  ],
  registerHeading: "The register",
  registerIntro: "Every mark I hold or have filed, grouped by registry office, with the proprietor named on each. Status reflects the latest update from that office.",
  registerFootnote: "Marks shown as registered carry the ® symbol. Marks still in examination carry ™ until the registry confirms registration — using ® before a mark is registered is an offence in both the United Kingdom and India, so this page tracks status rather than assuming it.",
  usageHeading: "Referring to my work",
  usageIntro: "Journalists, podcasters and directories are welcome to write about me and the ventures. A few conventions make it easier to get right.",
  usageRules: [
    { lead: "Keep the spelling and casing.", body: "46DC is one word, both letters capital. FourSix46 takes a capital F and S — not Four Six 46, not Foursix46." },
    { lead: "Use the right symbol.", body: "® for registered marks, ™ for the ones still in examination. The register above shows which is which." },
    { lead: "Word marks protect the word.", body: "My word marks cover the name in any typeface. The device marks cover the logos exactly as filed." },
    { lead: "Don't alter the logos.", body: "No recolouring, stretching, cropping, or rebuilding a mark inside another lockup." },
    { lead: "Don't imply endorsement.", body: "Writing about the work is fine. Suggesting I have partnered with or approved something when I have not is not." },
  ],
  usageCorrect: [
    "Dinesh Koyyalamudi (46DC™)",
    "46DOGS™, founded by Dinesh Koyyalamudi",
  ],
  usageIncorrect: [
    "46 DC / FourSix46 DC",
    "46DC®",
    "Dinesh Koyyalamudi of 46 Dogs Ltd",
  ],
  pageFaqs: [
    { question: "Is 46DC a registered trademark?", answer: "Not yet. 46DC is filed with the Indian Trade Marks Registry under application 7970222 in Classes 35 and 41, and is currently ready for examination. Until registration completes it is written as 46DC™ rather than 46DC®. FourSix46, the parent brand, is fully registered in the United Kingdom." },
    { question: "Which marks do you own personally?", answer: "46DC and both 46DOGS marks are held by me as an individual — recorded at the registry under my full legal name, Koyyalamudi Dinesh Chandra. The FourSix46 marks and Cinevenn are held by FourSix46 Global Ltd." },
    { question: "Why is your personal name trademarked at all?", answer: "46DC is not a vanity mark. It is the name I consult, write, speak and publish under, which makes it a working brand with commercial services attached — and that is exactly what the trademark system exists to protect." },
    { question: "Why does 46DOGS appear twice?", answer: "Once as a word mark and once as a device mark. The word mark protects the name in any styling; the device mark protects the logo as filed. Filing both is what stops someone using the name with a different logo, or the logo with a different name." },
    { question: "Why is your registry name different from the name you use?", answer: "Registries record full legal names. Mine is Koyyalamudi Dinesh Chandra, which is what appears on the Indian applications. It is the same person as the Dinesh Koyyalamudi on this site." },
    { question: "Will you file in more countries?", answer: "Filings follow the work. As a venture starts trading in a new territory, the mark gets filed there and this register gains a record. India and the United Kingdom are simply where the work is today." },
  ],
  faqHeading: "Questions I get asked",
  registerEmpty: "No marks published yet.",
  lastUpdatedLabel: "Register last updated",

  // Shared labels for every individual mark page
  markStoryHeading: "Why this mark exists",
  markClassesHeading: "What this mark covers",
  markClassesIntro: "The exact goods and services specification filed with the registry. This wording, not the venture description, defines the legal scope of protection.",
  markTimelineHeading: "Where this application stands",
  markTimelineIntro: "Applications move through fixed stages. This record updates as the registry advances it.",
  markUsageHeading: "Using this mark",
  markVerifyHeading: "Check this for yourself",
  markVerifyIntro: "Nothing on this page needs to be taken on trust. Every claim traces to a source you can open.",
  markRelatedHeading: "Other marks in the ecosystem",
  markFaqHeading: "Questions about this mark",
  wordMarkNote: "A word mark protects the name itself, in any typeface — not the styling shown here.",
  deviceMarkNote: "The mark exactly as filed. A device mark protects this artwork, not the words inside it.",
  specificationFallback: "The full specification for this class is held on the official register.",
  verifyRegisterTitle: "Official register",
  verifyRegisterBody: "The application record held by {office}, searchable by application number.",
  verifyVentureTitle: "The venture",
  verifyVentureBody: "{venture}'s own site, where the work this mark protects is described in full.",
  verifyProprietorTitle: "The proprietor",
  verifyProprietorBody: "{proprietor}, as recorded on the application.",
  manualSearchNote: "This registry's search is session-based and cannot be linked to directly. Search for {number} once the page opens.",

  // Register table
  colMark: "Mark",
  colProprietor: "Proprietor",
  colStatus: "Status",
  colApplication: "Application",
  colClasses: "Classes",
  colAction: "View record",

  // Hero panel and counters
  primaryPanelLabel: "Primary mark",
  statMarksLabel: "Marks on record",
  statRegisteredLabel: "Registered",
  statOfficesLabel: "Registry offices",
  usageExamplesLabel: "In running text",

  // Field labels
  labelMark: "Mark",
  labelType: "Type",
  labelNumber: "Number",
  labelOffice: "Office",
  labelClasses: "Classes",
  labelStatus: "Status",
  labelRegistration: "Registration",
  labelProprietor: "Proprietor",
  labelFiled: "Filed",

  // Mark page chrome
  particularsLabel: "Registry particulars",
  specificationLabel: "Specification as filed",
  verifyButtonPrefix: "Verify on",
  openRegisterPrefix: "Open",
  visitVenturePrefix: "Visit",
  proprietorCtaLabel: "About the proprietor",
  correctLabel: "Correct",
  notPermittedLabel: "Not permitted",
  breadcrumbHome: "Home",
  breadcrumbRegister: "Trademarks",
  closedStageNote: "This application is no longer proceeding.",
  countOne: "mark",
  countMany: "marks",
  specificationFallbackSuffix: "Open the registry record above to read it in full.",
  markTitlePattern: "{mark}{symbol} Trademark — {country} — 46DC",
  stampLabel: "Registered",
  stampSublabel: "{country}",

  crossSiteHeading: "The company register",
  crossSiteBody: "The same marks are listed on the parent brand's own register, written from the company's side rather than mine.",
  crossSiteUrl: "https://foursix46.com/trademarks",
  crossSiteCta: "Open the company register",
  seoTitle: "Trademarks — Dinesh Koyyalamudi (46DC) & FourSix46®",
  seoDescription: "The full register of trademarks held by Dinesh Koyyalamudi (46DC) and FourSix46 Global Ltd across the UK and India, with application numbers you can verify.",
};
