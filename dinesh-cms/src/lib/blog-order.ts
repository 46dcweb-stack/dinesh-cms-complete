// Pinned posts sit above everything else on /blog, whatever their date.
//
// Sorted here rather than in the Firestore query: ordering by `pinned` then
// `publishDate` would need a composite index and would drop every post written
// before the field existed, since Firestore skips documents missing an ordered
// field.
export type OrderablePost = {
  pinned?: boolean;
  pinnedOrder?: number;
  publishDate?: any;
};

function time(v: any): number {
  if (!v) return 0;
  const d = new Date(typeof v === "object" && "toDate" in v ? v.toDate() : v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export function sortPinnedFirst<T extends OrderablePost>(posts: T[]): T[] {
  return posts.slice().sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    if (ap === 1) {
      const ao = a.pinnedOrder ?? 0;
      const bo = b.pinnedOrder ?? 0;
      if (ao !== bo) return ao - bo;
    }
    return time(b.publishDate) - time(a.publishDate);
  });
}
