// Default copy for /trademarks. Overridden by trademarkPageMeta in the CMS.
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
  crossSiteHeading: "The company register",
  crossSiteBody: "The same marks are listed on the parent brand's own register, written from the company's side rather than mine.",
  crossSiteUrl: "https://foursix46.com/trademarks",
  seoTitle: "Trademarks — Dinesh Koyyalamudi (46DC) & FourSix46®",
  seoDescription: "The full register of trademarks held by Dinesh Koyyalamudi (46DC) and FourSix46 Global Ltd across the UK and India, with application numbers you can verify.",
};
