// ─────────────────────────────────────────────────────────────────────────────
// Firebase Services — Full CRUD for all Firestore collections
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit, Timestamp, serverTimestamp,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "firebase/storage";
import { db, storage, auth } from "./firebase";
import type {
  BlogPost, PressMention, ManifestoSection, ManifestoMeta, FaqItem,
  AboutPage, HomePage, Venture, Subscriber, GalleryImage, SiteSettings,
  ContactSubmission, AuditLog, PressPageMeta,
} from "./types";

// ── UTILITY: Strip undefined values (Firestore rejects them) ──────────────────
function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

// ── AUDIT LOGGING ─────────────────────────────────────────────────────────────
async function writeAudit(
  col: string, docId: string,
  action: AuditLog["action"], summary: string, fieldChanged?: string
) {
  const user = auth.currentUser;
  if (!user) return;
  // Firestore rejects undefined values — build object conditionally
  const logEntry: Record<string, any> = {
    userEmail: user.email ?? "",
    userId: user.uid,
    collection: col,
    docId,
    action,
    summary,
    createdAt: serverTimestamp(),
  };
  if (fieldChanged !== undefined && fieldChanged !== "") {
    logEntry.fieldChanged = fieldChanged;
  }
  await addDoc(collection(db, "auditLogs"), logEntry);
}

// ── BLOG POSTS ────────────────────────────────────────────────────────────────
export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const q = query(collection(db, "blogPosts"), orderBy("publishDate", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  },

  async getPublished(): Promise<BlogPost[]> {
    const q = query(
      collection(db, "blogPosts"),
      where("status", "==", "published"),
      orderBy("publishDate", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
  },

  async getById(id: string): Promise<BlogPost | null> {
    const snap = await getDoc(doc(db, "blogPosts", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as BlogPost;
  },

  async create(data: Omit<BlogPost, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "blogPosts"), stripUndefined({ ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await writeAudit("blogPosts", ref.id, "create", `Created blog: "${data.title}"`);
    return ref.id;
  },

  async update(id: string, data: Partial<BlogPost>): Promise<void> {
    await updateDoc(doc(db, "blogPosts", id), stripUndefined({ ...data, updatedAt: serverTimestamp() }));
    await writeAudit("blogPosts", id, "update", `Updated blog: "${data.title || id}"`,
      Object.keys(data).join(", "));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "blogPosts", id));
    await writeAudit("blogPosts", id, "delete", `Deleted blog ID: ${id}`);
  },

  async publish(id: string): Promise<void> {
    await updateDoc(doc(db, "blogPosts", id), { status: "published", updatedAt: serverTimestamp() });
    await writeAudit("blogPosts", id, "publish", `Published blog ID: ${id}`);
  },

  async unpublish(id: string): Promise<void> {
    await updateDoc(doc(db, "blogPosts", id), { status: "draft", updatedAt: serverTimestamp() });
    await writeAudit("blogPosts", id, "unpublish", `Unpublished blog ID: ${id}`);
  },
};

// ── PRESS MENTIONS ────────────────────────────────────────────────────────────
export const pressService = {
  async getAll(): Promise<PressMention[]> {
    const q = query(collection(db, "pressMentions"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PressMention));
  },

  async getPublished(): Promise<PressMention[]> {
    const q = query(
      collection(db, "pressMentions"),
      where("status", "==", "published"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PressMention));
  },

  async create(data: Omit<PressMention, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "pressMentions"), stripUndefined({ ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await writeAudit("pressMentions", ref.id, "create", `Created press: "${data.title}"`);
    return ref.id;
  },

  async update(id: string, data: Partial<PressMention>): Promise<void> {
    await updateDoc(doc(db, "pressMentions", id), stripUndefined({ ...data, updatedAt: serverTimestamp() }));
    await writeAudit("pressMentions", id, "update", `Updated press: "${data.title || id}"`);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "pressMentions", id));
    await writeAudit("pressMentions", id, "delete", `Deleted press ID: ${id}`);
  },
};

// ── MANIFESTO ─────────────────────────────────────────────────────────────────
export const manifestoService = {
  async getMeta(): Promise<ManifestoMeta | null> {
    const snap = await getDoc(doc(db, "manifestoMeta", "main"));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as ManifestoMeta;
  },

  async saveMeta(data: Omit<ManifestoMeta, "id">): Promise<void> {
    await setDoc(doc(db, "manifestoMeta", "main"), { ...data, updatedAt: serverTimestamp() });
    await writeAudit("manifestoMeta", "main", "update", "Updated manifesto metadata");
  },

  async getSections(): Promise<ManifestoSection[]> {
    const q = query(collection(db, "manifestoSections"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ManifestoSection));
  },

  async createSection(data: Omit<ManifestoSection, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "manifestoSections"), {
      ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    await writeAudit("manifestoSections", ref.id, "create", `Created manifesto section: "${data.type}"`);
    return ref.id;
  },

  async updateSection(id: string, data: Partial<ManifestoSection>): Promise<void> {
    await updateDoc(doc(db, "manifestoSections", id), { ...data, updatedAt: serverTimestamp() });
    await writeAudit("manifestoSections", id, "update", `Updated manifesto section ID: ${id}`);
  },

  async deleteSection(id: string): Promise<void> {
    await deleteDoc(doc(db, "manifestoSections", id));
    await writeAudit("manifestoSections", id, "delete", `Deleted manifesto section ID: ${id}`);
  },

  async reorderSections(sections: { id: string; order: number }[]): Promise<void> {
    for (const s of sections) {
      await updateDoc(doc(db, "manifestoSections", s.id), { order: s.order, updatedAt: serverTimestamp() });
    }
  },
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const faqService = {
  async getAll(): Promise<FaqItem[]> {
    const q = query(collection(db, "faqItems"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FaqItem));
  },

  async getPublished(): Promise<FaqItem[]> {
    const q = query(
      collection(db, "faqItems"),
      where("status", "==", "published"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FaqItem));
  },

  async create(data: Omit<FaqItem, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "faqItems"), stripUndefined({ ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await writeAudit("faqItems", ref.id, "create", `Created FAQ: "${data.question.slice(0, 40)}..."`);
    return ref.id;
  },

  async update(id: string, data: Partial<FaqItem>): Promise<void> {
    await updateDoc(doc(db, "faqItems", id), { ...data, updatedAt: serverTimestamp() });
    await writeAudit("faqItems", id, "update", `Updated FAQ ID: ${id}`);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "faqItems", id));
    await writeAudit("faqItems", id, "delete", `Deleted FAQ ID: ${id}`);
  },
};

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────
export const aboutService = {
  async get(): Promise<AboutPage | null> {
    const snap = await getDoc(doc(db, "aboutPage", "main"));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as AboutPage;
  },

  async save(data: Omit<AboutPage, "id">): Promise<void> {
    await setDoc(doc(db, "aboutPage", "main"), { ...data, updatedAt: serverTimestamp() });
    await writeAudit("aboutPage", "main", "update", "Updated About page");
  },
};

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
export const homeService = {
  async get(): Promise<HomePage | null> {
    const snap = await getDoc(doc(db, "homePage", "main"));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as HomePage;
  },

  async save(data: Omit<HomePage, "id">): Promise<void> {
    await setDoc(doc(db, "homePage", "main"), { ...data, updatedAt: serverTimestamp() });
    await writeAudit("homePage", "main", "update", "Updated Home page");
  },
};

// ── VENTURES ──────────────────────────────────────────────────────────────────
export const ventureService = {
  async getAll(): Promise<Venture[]> {
    const q = query(collection(db, "ventures"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Venture));
  },

  async create(data: Omit<Venture, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "ventures"), stripUndefined({ ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await writeAudit("ventures", ref.id, "create", `Created venture: "${data.name}"`);
    return ref.id;
  },

  async update(id: string, data: Partial<Venture>): Promise<void> {
    await updateDoc(doc(db, "ventures", id), stripUndefined({ ...data, updatedAt: serverTimestamp() }));
    await writeAudit("ventures", id, "update", `Updated venture: "${data.name || id}"`);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "ventures", id));
    await writeAudit("ventures", id, "delete", `Deleted venture ID: ${id}`);
  },
};

// ── SUBSCRIBERS ───────────────────────────────────────────────────────────────
export const subscriberService = {
  async getAll(): Promise<Subscriber[]> {
    const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Subscriber));
  },

  async subscribe(email: string, name?: string, source: Subscriber["source"] = "other"): Promise<string> {
    // Check duplicate
    const q = query(collection(db, "subscribers"), where("email", "==", email), limit(1));
    const existing = await getDocs(q);
    if (!existing.empty) {
      const docId = existing.docs[0].id;
      await updateDoc(doc(db, "subscribers", docId), { status: "active" });
      return docId;
    }
    const ref = await addDoc(collection(db, "subscribers"), {
      email, name: name || "", source,
      consentTimestamp: serverTimestamp(),
      status: "active",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async unsubscribe(id: string): Promise<void> {
    await updateDoc(doc(db, "subscribers", id), { status: "unsubscribed" });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "subscribers", id));
  },
};

// ── GALLERY ───────────────────────────────────────────────────────────────────
export const galleryService = {
  async getAll(): Promise<GalleryImage[]> {
    const q = query(collection(db, "galleryImages"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage));
  },

  async create(data: Omit<GalleryImage, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "galleryImages"), {
      ...data, updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<GalleryImage>): Promise<void> {
    await updateDoc(doc(db, "galleryImages", id), { ...data, updatedAt: serverTimestamp() });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "galleryImages", id));
  },
};

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    const snap = await getDoc(doc(db, "siteSettings", "main"));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as SiteSettings;
  },

  async save(data: Omit<SiteSettings, "id">): Promise<void> {
    await setDoc(doc(db, "siteSettings", "main"), { ...data, updatedAt: serverTimestamp() });
    await writeAudit("siteSettings", "main", "update", "Updated site settings");
  },
};

// ── CONTACT SUBMISSIONS ────────────────────────────────────────────────────────
export const contactService = {
  async getAll(): Promise<ContactSubmission[]> {
    const q = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactSubmission));
  },

  async submit(data: Omit<ContactSubmission, "id" | "status" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "contactSubmissions"), {
      ...data, status: "new", createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async updateStatus(id: string, status: ContactSubmission["status"]): Promise<void> {
    await updateDoc(doc(db, "contactSubmissions", id), { status });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "contactSubmissions", id));
  },
};

// ── AUDIT LOGS ────────────────────────────────────────────────────────────────
export const auditService = {
  async getRecent(limitN = 50): Promise<AuditLog[]> {
    const q = query(
      collection(db, "auditLogs"),
      orderBy("createdAt", "desc"),
      limit(limitN)
    );

    const snap = await getDocs(q);

    return snap.docs.map(
      d => ({ id: d.id, ...d.data() } as AuditLog)
    );
  },

  async revert(log: any): Promise<void> {
    if (!log.previousData) {
      throw new Error("No previous state available");
    }

    const targetRef = doc(db, log.collection, log.docId);

    // restore previous document state
    await setDoc(targetRef, {
      ...log.previousData,
      updatedAt: serverTimestamp(),
    });

    // create revert audit log
    await addDoc(collection(db, "auditLogs"), {
      action: "revert",
      collection: log.collection,
      docId: log.docId,
      summary: `Reverted ${log.collection}/${log.docId}`,
      previousData: null,
      createdAt: serverTimestamp(),
      userEmail: auth.currentUser?.email || "",
      userId: auth.currentUser?.uid || "",
    });
  },
};

// ── PRESS PAGE META ────────────────────────────────────────────────────────────
export const pressPageService = {
  async get(): Promise<PressPageMeta | null> {
    const snap = await getDoc(doc(db, "pressPageMeta", "main"));
    if (!snap.exists()) return null;
    return snap.data() as PressPageMeta;
  },

  async save(data: PressPageMeta): Promise<void> {
    await setDoc(doc(db, "pressPageMeta", "main"), { ...data, updatedAt: serverTimestamp() });
  },
};

// ── MEDIA / STORAGE UPLOAD ─────────────────────────────────────────────────────
export const mediaService = {
  async upload(file: File, folder: string = "uploads"): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async delete(url: string): Promise<void> {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  },
};

// ── TEAM MEMBERS ──────────────────────────────────────────────────────────────
import type { TeamMember } from "./types";

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    const q = query(collection(db, "teamMembers"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
  },

  async getActive(): Promise<TeamMember[]> {
    const q = query(
      collection(db, "teamMembers"),
      where("status", "==", "active"),
      orderBy("sortOrder", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
  },

  async create(data: Omit<TeamMember, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "teamMembers"),
      stripUndefined({ ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    );
    await writeAudit("teamMembers", ref.id, "create", `Added team member: "${data.name}"`);
    return ref.id;
  },

  async update(id: string, data: Partial<TeamMember>): Promise<void> {
    await updateDoc(doc(db, "teamMembers", id),
      stripUndefined({ ...data, updatedAt: serverTimestamp() })
    );
    await writeAudit("teamMembers", id, "update", `Updated team member: "${data.name || id}"`);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "teamMembers", id));
    await writeAudit("teamMembers", id, "delete", `Deleted team member ID: ${id}`);
  },
};
