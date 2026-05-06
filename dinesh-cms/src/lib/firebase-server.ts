// ─────────────────────────────────────────────────────────────────────────────
// Firebase Firestore Lite — Server + Browser compatible
// Uses REST (HTTP) instead of WebSockets/gRPC — works in Next.js Server Components
// No service account needed — uses the same API key from .env.local
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Use a separate app instance name to avoid conflict with the browser client SDK
const SERVER_APP_NAME = "server-lite";

function getServerApp() {
  const existing = getApps().find((a) => a.name === SERVER_APP_NAME);
  if (existing) return existing;
  return initializeApp(firebaseConfig, SERVER_APP_NAME);
}

function getDb() {
  return getFirestore(getServerApp());
}

// ── PUBLIC DATA FETCHERS ──────────────────────────────────────────────────────

export async function getHomePage() {
  try {
    const snap = await getDoc(doc(getDb(), "homePage", "main"));
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.error("[getHomePage]", e); return null; }
}

export async function getAboutPage() {
  try {
    const snap = await getDoc(doc(getDb(), "aboutPage", "main"));
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.error("[getAboutPage]", e); return null; }
}

export async function getPublishedBlogs() {
  try {
    const q = query(
      collection(getDb(), "blogPosts"),
      where("status", "==", "published"),
      orderBy("publishDate", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getPublishedBlogs]", e); return []; }
}

export async function getBlogBySlug(slug: string) {
  try {
    const q = query(
      collection(getDb(), "blogPosts"),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (e) { console.error("[getBlogBySlug]", e); return null; }
}

export async function getPublishedPress() {
  try {
    const q = query(
      collection(getDb(), "pressMentions"),
      where("status", "==", "published"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getPublishedPress]", e); return []; }
}

export async function getPublishedFaq() {
  try {
    const q = query(
      collection(getDb(), "faqItems"),
      where("status", "==", "published"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getPublishedFaq]", e); return []; }
}

export async function getVentures() {
  try {
    const q = query(
      collection(getDb(), "ventures"),
      where("status", "==", "active"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getVentures]", e); return []; }
}

export async function getGallery() {
  try {
    const q = query(
      collection(getDb(), "galleryImages"),
      where("status", "==", "active"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getGallery]", e); return []; }
}

export async function getManifesto() {
  try {
    const [metaSnap, sectionsSnap] = await Promise.all([
      getDoc(doc(getDb(), "manifestoMeta", "main")),
      getDocs(query(collection(getDb(), "manifestoSections"), orderBy("order", "asc"))),
    ]);
    return {
      meta: metaSnap.exists() ? metaSnap.data() : null,
      sections: sectionsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
  } catch (e) { console.error("[getManifesto]", e); return { meta: null, sections: [] }; }
}

export async function getSiteSettings() {
  try {
    const snap = await getDoc(doc(getDb(), "siteSettings", "main"));
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.error("[getSiteSettings]", e); return null; }
}

export async function getTeamMembers() {
  try {
    const q = query(
      collection(getDb(), "teamMembers"),
      where("status", "==", "active"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("[getTeamMembers]", e); return []; }
}
