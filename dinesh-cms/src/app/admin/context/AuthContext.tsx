"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AdminUser } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthor: boolean;
  canAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, adminUser: null, loading: true,
  isAdmin: false, isEditor: false, isAuthor: false,
  canAccess: () => false,
});

// ── Route permission map ──────────────────────────────────────────────────────
// admin  → all routes
// editor → all content routes, NOT users/settings/audit
// author → only /admin/blog (own drafts only)

const ADMIN_ONLY_ROUTES = ["/admin/users", "/admin/settings", "/admin/audit"];
const EDITOR_AND_ADMIN_ROUTES = [
  "/admin/home", "/admin/about", "/admin/team", "/admin/press",
  "/admin/manifesto", "/admin/ventures", "/admin/faq", "/admin/gallery",
  "/admin/media", "/admin/subscribers", "/admin/contacts",
];
const AUTHOR_ROUTES = ["/admin/blog"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "adminUsers", u.uid));
        setAdminUser(snap.exists() ? ({ uid: u.uid, ...snap.data() } as AdminUser) : null);
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const isAdmin  = adminUser?.role === "admin";
  const isEditor = adminUser?.role === "admin" || adminUser?.role === "editor";
  const isAuthor = adminUser?.role === "admin" || adminUser?.role === "editor" || adminUser?.role === "author";

  function canAccess(path: string): boolean {
    if (!adminUser) return false;
    if (isAdmin) return true;
    // Editor: blocked from admin-only routes
    if (adminUser.role === "editor") {
      return !ADMIN_ONLY_ROUTES.some(r => path.startsWith(r));
    }
    // Author: only /admin, /admin/blog, /admin/media
    if (adminUser.role === "author") {
      return (
        path === "/admin" ||
        path.startsWith("/admin/blog") ||
        path.startsWith("/admin/media")
      );
    }
    return false;
  }

  return (
    <AuthContext.Provider value={{ user, adminUser, loading, isAdmin, isEditor, isAuthor, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
