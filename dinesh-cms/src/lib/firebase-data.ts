import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminDb } from "./firebase-admin";

export {
  blogService, pressService, faqService, aboutService,
  homeService, ventureService, galleryService, settingsService,
  manifestoService, subscriberService, contactService,
} from "./firebase-services";

const SHORT_REVALIDATE_SECONDS = 60;
const MEDIUM_REVALIDATE_SECONDS = 300;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof (data as any)?.toDate === "function")
    return (data as any).toDate().toISOString() as unknown as T;
  if (typeof data === "object" && "_seconds" in (data as any) && "_nanoseconds" in (data as any))
    return new Date((data as any)._seconds * 1000).toISOString() as unknown as T;
  if (Array.isArray(data)) return data.map(serialize) as unknown as T;
  if (typeof data === "object")
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [k, serialize(v)])
    ) as unknown as T;
  return data;
}

export async function getHomePage() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("homePage").doc("main").get();
      return s.exists ? serialize(s.data()) : null;
    }, ["homePage-main"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getHomePage]", e); return null; }
}
export async function getAboutPage() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("aboutPage").doc("main").get();
      return s.exists ? serialize(s.data()) : null;
    }, ["aboutPage-main"], { revalidate: MEDIUM_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getAboutPage]", e); return null; }
}
export async function getPublishedBlogs() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("blogPosts").where("status","==","published").orderBy("publishDate","desc").get();
      return s.docs.map(d => serialize({ id: d.id, ...d.data() }));
    }, ["blogPosts-published"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getPublishedBlogs]", e); return []; }
}
export async function getBlogBySlug(slug: string) {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("blogPosts").where("slug","==",slug).where("status","==","published").limit(1).get();
      if (s.empty) return null;
      return serialize({ id: s.docs[0].id, ...s.docs[0].data() });
    }, ["blogPost-bySlug", slug], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getBlogBySlug]", e); return null; }
}
export async function getPublishedPress() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("pressMentions").where("status","==","published").orderBy("sortOrder","asc").get();
      return s.docs.map(d => serialize({ id: d.id, ...d.data() }));
    }, ["pressMentions-published"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getPublishedPress]", e); return []; }
}
export async function getPublishedFaq() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("faqItems").where("status","==","published").orderBy("sortOrder","asc").get();
      return s.docs.map(d => serialize({ id: d.id, ...d.data() }));
    }, ["faqItems-published"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getPublishedFaq]", e); return []; }
}
export async function getVentures() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("ventures").where("status","!=","inactive").orderBy("status","asc").get();
      const sorted = s.docs.map(d => serialize({ id: d.id, ...d.data() })).sort((a:any,b:any) => (a.sortOrder||0)-(b.sortOrder||0));
      return sorted;
    }, ["ventures-active"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getVentures]", e); return []; }
}
export async function getGallery() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("galleryImages").where("status","==","active").orderBy("sortOrder","asc").get();
      return s.docs.map(d => serialize({ id: d.id, ...d.data() }));
    }, ["galleryImages-active"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getGallery]", e); return []; }
}
export async function getManifesto() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const [m, s] = await Promise.all([
        db.collection("manifestoMeta").doc("main").get(),
        db.collection("manifestoSections").orderBy("order","asc").get(),
      ]);
      return { meta: m.exists ? serialize(m.data()) : null, sections: s.docs.map(d => serialize({ id: d.id, ...d.data() })) };
    }, ["manifesto-data"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getManifesto]", e); return { meta: null, sections: [] }; }
}
export async function getSiteSettings() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("siteSettings").doc("main").get();
      return s.exists ? serialize(s.data()) : null;
    }, ["siteSettings-main"], { revalidate: MEDIUM_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getSiteSettings]", e); return null; }
}
export async function getFaqPageSettings() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("faqPageMeta").doc("main").get();
      return s.exists ? serialize(s.data()) : null;
    }, ["faqPageMeta-main"], { revalidate: MEDIUM_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getFaqPageSettings]", e); return null; }
}
export async function getTeamMembers() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("teamMembers").where("status","==","active").orderBy("sortOrder","asc").get();
      return s.docs.map(d => serialize({ id: d.id, ...d.data() }));
    }, ["teamMembers-active"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getTeamMembers]", e); return []; }
}
export async function getPressPageMeta() {
  try {
    return await unstable_cache(async () => {
      const db = getAdminDb();
      const s = await db.collection("pressPageMeta").doc("main").get();
      return s.exists ? serialize(s.data()) : null;
    }, ["pressPageMeta-main"], { revalidate: SHORT_REVALIDATE_SECONDS })();
  } catch (e) { console.error("[getPressPageMeta]", e); return null; }
}