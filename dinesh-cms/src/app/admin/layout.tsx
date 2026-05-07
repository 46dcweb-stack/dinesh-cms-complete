"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  LayoutDashboard, FileText, Newspaper, BookOpen, HelpCircle,
  User, Home, Image, Settings, Users, Mail, LogOut, Layers,
  ClipboardList, Shield, UserCheck, FolderOpen, Menu, X,
} from "lucide-react";

const NAV = [
  { href: "/admin",             label: "Dashboard",         icon: LayoutDashboard, roles: ["admin","editor","author"] },
  { href: "/admin/home",        label: "Home Page",         icon: Home,            roles: ["admin","editor"] },
  { href: "/admin/about",       label: "About",             icon: User,            roles: ["admin","editor"] },
  { href: "/admin/team",        label: "Leadership & Team", icon: UserCheck,       roles: ["admin","editor"] },
  { href: "/admin/blog",        label: "Blog Posts",        icon: FileText,        roles: ["admin","editor","author"] },
  { href: "/admin/press",       label: "Press & Media",     icon: Newspaper,       roles: ["admin","editor"] },
  { href: "/admin/manifesto",   label: "Manifesto",         icon: BookOpen,        roles: ["admin","editor"] },
  { href: "/admin/ventures",    label: "Ventures",          icon: Layers,          roles: ["admin","editor"] },
  { href: "/admin/faq",         label: "FAQ",               icon: HelpCircle,      roles: ["admin","editor"] },
  { href: "/admin/gallery",     label: "Gallery",           icon: Image,           roles: ["admin","editor"] },
  { href: "/admin/media",       label: "Media Library",     icon: FolderOpen,      roles: ["admin","editor","author"] },
  { href: "/admin/subscribers", label: "Subscribers",       icon: Mail,            roles: ["admin","editor"] },
  { href: "/admin/contacts",    label: "Contact Inbox",     icon: ClipboardList,   roles: ["admin","editor"] },
  { href: "/admin/settings",    label: "Site Settings",     icon: Settings,        roles: ["admin"] },
  { href: "/admin/users",       label: "Users & Roles",     icon: Users,           roles: ["admin"] },
  { href: "/admin/audit",       label: "Audit Log",         icon: Shield,          roles: ["admin"] },
];

const ROLE_BADGE: Record<string, string> = {
  admin:  "bg-[#E22D2D]/15 text-[#E22D2D] border border-[#E22D2D]/20",
  editor: "bg-blue-400/15 text-blue-400 border border-blue-400/20",
  author: "bg-green-400/15 text-green-400 border border-green-400/20",
};

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { adminUser } = useAuth();
  const role = adminUser?.role ?? "author";

  const visibleNav = NAV.filter(item => item.roles.includes(role));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 min-h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between">
          <div className="min-w-0">
            <div className="text-xs font-mono text-[#E22D2D] uppercase tracking-widest mb-1">CMS Admin</div>
            <div className="font-bold text-white text-sm">Dinesh Portfolio</div>
            {adminUser && (
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono capitalize ${ROLE_BADGE[role]}`}>
                  {role}
                </span>
              </div>
            )}
            {adminUser && <div className="text-xs text-white/30 mt-1 truncate max-w-[160px]">{adminUser.email}</div>}
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors mt-1"><X size={18} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {visibleNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors ${active ? "bg-[#E22D2D]/15 text-[#E22D2D] font-medium" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              >
                <Icon size={16} />{label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={() => signOut(auth)} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, adminUser, loading, canAccess } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else if (user && !adminUser && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else if (user && adminUser && pathname !== "/admin/login" && !canAccess(pathname)) {
        // Redirect to a page they can access
        router.replace("/admin");
      }
    }
  }, [user, adminUser, loading, pathname, router, canAccess]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white/50 font-mono text-sm">Authenticating...</div>
    </div>
  );

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user || !adminUser) return null;

  // Show access denied for routes user can't access
  if (!canAccess(pathname)) return (
    <div className="flex min-h-screen bg-[#111]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm">You don't have permission to access this page.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#111]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <span className="text-xs font-mono text-[#E22D2D] uppercase tracking-widest">CMS Admin</span>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AdminGuard>{children}</AdminGuard></AuthProvider>;
}
