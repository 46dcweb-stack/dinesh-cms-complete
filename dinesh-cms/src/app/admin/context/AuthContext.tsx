"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
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

const ADMIN_ONLY_ROUTES = ["/admin/users", "/admin/settings", "/admin/audit"];
const AUTHOR_ROUTES = ["/admin/blog"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        let snap = await getDoc(doc(db, "adminUsers", u.uid));

        // First-time Google sign-in: check for a pending invite by email
        if (!snap.exists() && u.email) {
          try {
            const q = query(
              collection(db, "adminInvites"),
              where("email", "==", u.email.toLowerCase().trim()),
              where("status", "==", "pending")
            );
            const inviteSnap = await getDocs(q);
            const pendingDoc = inviteSnap.docs[0];

            if (pendingDoc) {
              const invite = pendingDoc.data();
              // Firestore rules allow this create because:
              //   - request.auth.uid == id  ✓
              //   - email matches token     ✓
              //   - role is editor/author   ✓  (never admin via invite flow)
              await setDoc(doc(db, "adminUsers", u.uid), {
                email:       u.email,
                displayName: u.displayName || invite.displayName || "",
                role:        invite.role || "author",
                permissions: invite.permissions || {},
                createdAt:   new Date().toISOString(),
                invitedBy:   invite.createdBy || "",
              });
              // Mark invite as accepted — rules allow update only when
              // email matches token, status→"accepted", role/permissions unchanged
              await updateDoc(pendingDoc.ref, {
                status:     "accepted",
                acceptedAt: Date.now(),
                uid:        u.uid,
              });
              // Re-fetch the newly created doc
              snap = await getDoc(doc(db, "adminUsers", u.uid));
            }
          } catch (e) {
            console.error("Invite acceptance failed:", e);
          }
        }

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
    if (adminUser.role === "editor") {
      return !ADMIN_ONLY_ROUTES.some(r => path.startsWith(r));
    }
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