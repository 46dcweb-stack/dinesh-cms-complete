"use client";
import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const provider = new GoogleAuthProvider();

export default function AdminLogin() {
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, adminUser } = useAuth();

  useEffect(() => {
    if (user && adminUser) router.replace("/admin");
  }, [user, adminUser, router]);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      // Check if this Google account is an approved admin user
      const snap = await getDoc(doc(db, "adminUsers", result.user.uid));
      if (!snap.exists()) {
        // Not an approved admin — sign them out immediately
        await auth.signOut();
        setError("This Google account is not authorised to access the CMS. Contact the site admin.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Sign in failed. Try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-xs font-mono text-[#E22D2D] uppercase tracking-widest mb-2">
            Admin Access
          </div>
          <h1 className="text-2xl font-bold text-white">Dinesh CMS</h1>
          <p className="text-sm text-white/40 mt-1">Sign in with your Google account</p>
        </div>

        {error && (
          <div className="mb-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 disabled:opacity-50 text-gray-900 font-medium py-3.5 rounded-xl text-sm transition-all shadow-lg"
        >
          {loading ? (
            <span className="text-gray-600">Signing in…</span>
          ) : (
            <>
              {/* Google G logo */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p className="text-center text-white/20 text-xs mt-6">
          Only pre-approved Google accounts can access this panel.
        </p>
      </div>
    </div>
  );
}