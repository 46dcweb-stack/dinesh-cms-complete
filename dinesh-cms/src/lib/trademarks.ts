// ─────────────────────────────────────────────────────────────────────────────
// Trademark display helpers.
//
// The ® / ™ symbol is DERIVED HERE and nowhere else. It is deliberately not a
// CMS field: using ® on an unregistered mark is an offence under s.107 of
// India's Trade Marks Act 1999 and s.95 of the UK Trade Marks Act 1994. If it
// were an editable dropdown, a criminal offence would be one mis-click away.
// ─────────────────────────────────────────────────────────────────────────────
import type {
  Trademark,
  TrademarkClass,
  TrademarkStatus,
  Jurisdiction,
} from "./types";

/** ® only when the registry has confirmed registration. Otherwise ™. */
export function markSymbol(status: TrademarkStatus | string): "®" | "™" {
  return status === "Registered" ? "®" : "™";
}

export function isRegistered(status: TrademarkStatus | string): boolean {
  return status === "Registered";
}

/** Statuses that mean the mark is no longer live. */
export function isClosed(status: TrademarkStatus | string): boolean {
  return status === "Lapsed" || status === "Withdrawn" || status === "Refused";
}

/** Real Nice classes, ascending, deduplicated. 99 is a filing code and is
 *  filtered out defensively in case a bad value was ever saved. */
export function classNumbers(mark: Pick<Trademark, "classes">): number[] {
  const nums = (mark.classes ?? [])
    .map(c => Number(c.classNumber))
    .filter(n => Number.isFinite(n) && n >= 1 && n <= 45);
  return Array.from(new Set(nums)).sort((a, b) => a - b);
}

export function classList(mark: Pick<Trademark, "classes">): string {
  return classNumbers(mark).join(", ");
}

/**
 * The number(s) to show for a mark.
 *  • per-class filings  → a range across the class-level numbers
 *    (Cinevenn: "7573210 – 7573213")
 *  • otherwise          → the single mark-level number
 */
export function applicationLabel(mark: Trademark): string {
  if (mark.filingType === "Separate applications per class") {
    const nums = (mark.classes ?? [])
      .map(c => (c.applicationNumber ?? "").trim())
      .filter(Boolean)
      .sort();
    if (nums.length === 0) return mark.applicationNumber ?? "";
    if (nums.length === 1) return nums[0];
    return `${nums[0]} – ${nums[nums.length - 1]}`;
  }
  return mark.applicationNumber ?? "";
}

/** Every distinct application number on a mark, for schema `identifier`. */
export function allApplicationNumbers(
  mark: Trademark
): { classNumber?: number; value: string }[] {
  if (mark.filingType === "Separate applications per class") {
    return (mark.classes ?? [])
      .filter(c => (c.applicationNumber ?? "").trim())
      .map(c => ({ classNumber: c.classNumber, value: c.applicationNumber!.trim() }));
  }
  const v = (mark.applicationNumber ?? "").trim();
  return v ? [{ value: v }] : [];
}

/** Class-level number if the filing is per-class, else the mark-level one. */
export function numberForClass(mark: Trademark, cls: TrademarkClass): string {
  if (mark.filingType === "Separate applications per class") {
    return (cls.applicationNumber ?? "").trim() || (mark.applicationNumber ?? "");
  }
  return mark.applicationNumber ?? "";
}

/**
 * Where "verify this" should point.
 * When the registry cannot deep-link (IP India's search is session-based) the
 * link goes to the search page and the caller must display the number beside
 * it for manual entry — hence `manualEntry`.
 */
export function verifyLink(
  mark: Trademark,
  jurisdiction?: Jurisdiction | null
): { url: string; manualEntry: boolean; number: string } {
  const number = applicationLabel(mark);

  if (mark.officialRecordUrl) {
    return { url: mark.officialRecordUrl, manualEntry: false, number };
  }
  if (!jurisdiction) {
    return { url: "", manualEntry: true, number };
  }
  const single =
    mark.filingType !== "Separate applications per class" &&
    (mark.applicationNumber ?? "").trim();

  if (jurisdiction.deepLinkSupported && jurisdiction.recordUrlPattern && single) {
    return {
      url: jurisdiction.recordUrlPattern.replace("{application_number}", single),
      manualEntry: false,
      number,
    };
  }
  return { url: jurisdiction.officeUrl, manualEntry: true, number };
}

/** Pending statuses render in the "in progress" style, registered in its own. */
export function statusTone(status: TrademarkStatus | string): "registered" | "pending" | "closed" {
  if (isRegistered(status)) return "registered";
  if (isClosed(status)) return "closed";
  return "pending";
}

export const TRADEMARK_STATUSES: TrademarkStatus[] = [
  "Filed",
  "Formalities check passed",
  "Ready for examination",
  "Vienna codification",
  "Under examination",
  "Objected",
  "Published",
  "Opposed",
  "Registered",
  "Lapsed",
  "Withdrawn",
  "Refused",
];

export const FILING_TYPES = [
  "Single-class",
  "Multi-class",
  "Separate applications per class",
] as const;

export const MARK_TYPES = ["Word mark", "Device mark", "Combined mark", "Series mark"] as const;

// ── Timeline ─────────────────────────────────────────────────────────────────
// Generated from status + filingDate + jurisdiction, never authored. Each
// registry has a fixed stage sequence and the current status marks the
// position, so nobody has to maintain six timelines by hand.

export type TimelineStage = {
  title: string;
  description: string;
  state: "done" | "now" | "future";
  date: string;
};

const STAGES_IN: { key: TrademarkStatus; title: string; description: string }[] = [
  { key: "Filed", title: "Application filed", description: "Form TM-A submitted to the Trade Marks Registry with the mark and its specification." },
  { key: "Formalities check passed", title: "Formalities check passed", description: "The registry confirmed the application is complete and correctly filed." },
  { key: "Vienna codification", title: "Vienna codification", description: "Device marks are assigned Vienna classification codes describing their visual elements, so the registry can search them against existing figurative marks." },
  { key: "Ready for examination", title: "Ready for examination", description: "The application is queued for substantive review by an examiner." },
  { key: "Under examination", title: "Examination", description: "The registry reviews the mark for distinctiveness and conflicts with earlier marks, then issues an examination report." },
  { key: "Published", title: "Publication in the Trade Marks Journal", description: "Once accepted, the mark is published for public inspection." },
  { key: "Opposed", title: "Opposition period", description: "A four-month window in which any third party may oppose registration." },
  { key: "Registered", title: "Registration", description: "If unopposed, the certificate issues and the mark may carry ® in India." },
];

const STAGES_GB: { key: TrademarkStatus; title: string; description: string }[] = [
  { key: "Filed", title: "Application filed", description: "Application submitted to the Intellectual Property Office with the mark and its specification." },
  { key: "Under examination", title: "Examination", description: "The IPO examines the mark for distinctiveness and searches for conflicting earlier rights." },
  { key: "Published", title: "Publication in the Trade Marks Journal", description: "The mark is published for two months so third parties can review it." },
  { key: "Opposed", title: "Opposition period", description: "A two-month window, extendable to three, in which anyone may oppose registration." },
  { key: "Registered", title: "Registration", description: "The certificate issues and the mark may carry ® in the United Kingdom." },
];

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function buildTimeline(
  mark: Pick<Trademark, "status" | "filingDate" | "registrationDate" | "markType">,
  countryCode?: string
): TimelineStage[] {
  const seq = countryCode === "GB" ? STAGES_GB : STAGES_IN;

  // Vienna codification only applies to device/combined marks.
  const stages = seq.filter(
    s => s.key !== "Vienna codification" || /Device|Combined/.test(mark.markType ?? "")
  );

  // A terminal status replaces the remaining sequence.
  if (isClosed(mark.status)) {
    return [
      { title: "Application filed", description: stages[0].description, state: "done", date: formatDate(mark.filingDate) },
      { title: mark.status, description: "This application is no longer proceeding.", state: "now", date: "Current" },
    ];
  }

  const idx = stages.findIndex(s => s.key === mark.status);
  const current = idx < 0 ? 0 : idx;

  return stages.map((s, i) => {
    const state: TimelineStage["state"] = i < current ? "done" : i === current ? "now" : "future";
    let date = "Expected";
    if (i === 0) date = formatDate(mark.filingDate);
    else if (state === "now") date = "Current";
    else if (state === "done") date = "";
    if (s.key === "Registered" && mark.registrationDate) date = formatDate(mark.registrationDate);
    return { title: s.title, description: s.description, state, date };
  });
}

export { formatDate as formatMarkDate };
