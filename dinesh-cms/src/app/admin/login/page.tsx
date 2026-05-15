"use client";
import { useState, useEffect, FormEvent } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const provider = new GoogleAuthProvider();

export default function AdminLogin() {
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [showPw, setShowPw]               = useState(false);
  const [error, setError]                 = useState("");
  const [signingIn, setSigningIn]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleSignedIn, setGoogleSignedIn] = useState(false); // tracks if google popup completed

  const router = useRouter();
  const { user, adminUser, loading: authLoading } = useAuth();

  useEffect(() => {
    // Only redirect if auth is fully loaded
    if (authLoading) return;

    if (user && adminUser) {
      router.replace("/admin");
      return;
    }

    // Only show "not authorised" if the user explicitly signed in via Google
    // and AuthContext has finished loading (invite check complete)
    if (user && !adminUser && googleSignedIn) {
      auth.signOut();
      setError("This Google account is not authorised. Ask your admin to add your email in Users & Roles first.");
      setGoogleLoading(false);
      setGoogleSignedIn(false);
    }
  }, [user, adminUser, authLoading, googleSignedIn, router]);

  async function handleEmailSignIn(e: FormEvent) {
    e.preventDefault();
    setSigningIn(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "adminUsers", result.user.uid));
      if (!snap.exists()) {
        await auth.signOut();
        setError("This account is not authorised to access the CMS.");
        setSigningIn(false);
        return;
      }
      router.replace("/admin");
    } catch (err: any) {
      const msg: Record<string, string> = {
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/user-not-found":     "No account found with this email.",
        "auth/wrong-password":     "Incorrect password.",
        "auth/too-many-requests":  "Too many attempts. Try again later.",
        "auth/invalid-email":      "Invalid email address.",
      };
      setError(msg[err.code] || err.message);
    }
    setSigningIn(false);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setGoogleSignedIn(false);
    setError("");
    try {
      await signInWithPopup(auth, provider);
      // Mark that google sign-in completed — useEffect will handle the rest
      // once authLoading becomes false
      setGoogleSignedIn(true);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign-in failed. Try again.");
      }
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <div className="text-xs font-mono text-[#E22D2D] uppercase tracking-widest mb-2">Admin Access</div>
          <h1 className="text-2xl font-bold text-white">Dinesh CMS</h1>
          <p className="text-sm text-white/40 mt-1">Sign in to manage your content</p>
        </div>

        {error && (
          <div className="mb-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Email / Password */}
        <form onSubmit={handleEmailSignIn} className="space-y-4 mb-5">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-mono uppercase tracking-wider">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E22D2D]/50 transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-mono uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E22D2D]/50 transition-colors pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={signingIn}
            className="w-full bg-[#E22D2D] hover:bg-[#c91f1f] disabled:opacity-50 text-white font-medium py-3 rounded-lg text-sm transition-colors"
          >
            {signingIn ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs font-mono">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || authLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 disabled:opacity-50 text-gray-900 font-medium py-3 rounded-lg text-sm transition-all"
        >
          {googleLoading ? (
            <span className="text-gray-500 text-sm">Signing in…</span>
          ) : (
            <>
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

        <p className="text-center text-white/20 text-xs mt-6">Only pre-approved accounts can access this panel.</p>
      </div>
    </div>
  );
}