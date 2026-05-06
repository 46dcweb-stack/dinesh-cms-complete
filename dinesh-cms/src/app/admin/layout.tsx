"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  LayoutDashboard, FileText, Newspaper, BookOpen, HelpCircle,
  User, Home, Image, Settings, Users, Mail, LogOut, Layers,
  ClipboardList, Shield, UserCheck, FolderOpen,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home", label: "Home Page", icon: Home },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/team", label: "Leadership & Team", icon: UserCheck },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/press", label: "Press & Media", icon: Newspaper },
  { href: "/admin/manifesto", label: "Manifesto", icon: BookOpen },
  { href: "/admin/ventures", label: "Ventures", icon: Layers },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/media", label: "Media Library", icon: FolderOpen },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/contacts", label: "Contact Inbox", icon: ClipboardList },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/users", label: "Users & Roles", icon: Users },
  { href: "/admin/audit", label: "Audit Log", icon: Shield },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { adminUser } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-xs font-mono text-[#E22D2D] uppercase tracking-widest mb-1">CMS Admin</div>
        <div className="font-bold text-white text-sm">Dinesh Portfolio</div>
        {adminUser && (
          <div className="text-xs text-white/40 mt-1">{adminUser.email} · {adminUser.role}</div>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors ${
                active
                  ? "bg-[#E22D2D]/15 text-[#E22D2D] font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, adminUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else if (user && !adminUser && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    }
  }, [user, adminUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/50 font-mono text-sm">Authenticating...</div>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user || !adminUser) return null;

  return (
    <div className="flex min-h-screen bg-[#111]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
