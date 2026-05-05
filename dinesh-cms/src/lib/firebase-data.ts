// ─────────────────────────────────────────────────────────────────────────────
// Firebase Data Fetcher — uses ADMIN SDK (server-side safe)
// Import this only in Server Components / page.tsx files
// ─────────────────────────────────────────────────────────────────────────────
import { getAdminDb } from "./firebase-admin";

// Re-export client services for use in admin panel (client-side only)
export {
  blogService, pressService, faqService, aboutService,
  homeService, ventureService, galleryService, settingsService,
  manifestoService, subscriberService, contactService,
} from "./firebase-services";

// ── SERIALIZATION HELPER ─────────────────────────────────────────────────────
// Converts Firestore Timestamps (and nested objects/arrays) to ISO strings
// so data is safe to pass from Server Components to Client Components.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize<T>(data: T): T {
  if (data === null || data === undefined) return data;

  // Firestore Timestamp — has toDate() method
  if (typeof (data as any)?.toDate === "function") {
    return (data as any).toDate().toISOString() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(serialize) as unknown as T;
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [k, serialize(v)])
    ) as unknown as T;
  }

  return data;
}

// ── SERVER-SIDE DATA FETCHERS (Admin SDK) ────────────────────────────────────

export async function getHomePage() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("homePage").doc("main").get();
    return snap.exists ? serialize(snap.data()) : null;
  } catch (e) { console.error("[getHomePage]", e); return null; }
}

export async function getAboutPage() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("aboutPage").doc("main").get();
    return snap.exists ? serialize(snap.data()) : null;
  } catch (e) { console.error("[getAboutPage]", e); return null; }
}

export async function getPublishedBlogs() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("blogPosts")
      .where("status", "==", "published")
      .orderBy("publishDate", "desc")
      .get();
    return snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getPublishedBlogs]", e); return []; }
}

export async function getBlogBySlug(slug: string) {
  try {
    const db = getAdminDb();
    const snap = await db.collection("blogPosts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snap.empty) return null;
    return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() });
  } catch (e) { console.error("[getBlogBySlug]", e); return null; }
}

export async function getPublishedPress() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("pressMentions")
      .where("status", "==", "published")
      .orderBy("sortOrder", "asc")
      .get();
    return snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getPublishedPress]", e); return []; }
}

export async function getPublishedFaq() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("faqItems")
      .where("status", "==", "published")
      .orderBy("sortOrder", "asc")
      .get();
    return snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getPublishedFaq]", e); return []; }
}

export async function getVentures() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("ventures")
      .where("status", "==", "active")
      .orderBy("sortOrder", "asc")
      .get();
    return snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getVentures]", e); return []; }
}

export async function getGallery() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("galleryImages")
      .where("status", "==", "active")
      .orderBy("sortOrder", "asc")
      .get();
    return snap.docs.map(d => serialize({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getGallery]", e); return []; }
}

export async function getManifesto() {
  try {
    const db = getAdminDb();
    const [metaSnap, sectionsSnap] = await Promise.all([
      db.collection("manifestoMeta").doc("main").get(),
      db.collection("manifestoSections").orderBy("order", "asc").get(),
    ]);
    return {
      meta: metaSnap.exists ? serialize(metaSnap.data()) : null,
      sections: sectionsSnap.docs.map(d => serialize({ id: d.id, ...d.data() })),
    };
  } catch (e) { console.error("[getManifesto]", e); return { meta: null, sections: [] }; }
}

export async function getSiteSettings() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("siteSettings").doc("main").get();
    return snap.exists ? serialize(snap.data()) : null;
  } catch (e) { console.error("[getSiteSettings]", e); return null; }
}