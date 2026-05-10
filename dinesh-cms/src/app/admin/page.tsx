"use client";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auditService } from "@/lib/firebase-services";
import type { AuditLog } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  FileText, Newspaper, HelpCircle, Mail,
  ClipboardList, TrendingUp, FolderOpen,
} from "lucide-react";

interface Stats {
  blogTotal: number; blogPublished: number;
  pressTotal: number;
  faqTotal: number;
  subscribers: number;
  contacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [blog, blogPub, press, faq, subs, contacts, auditLogs] = await Promise.all([
          getDocs(collection(db, "blogPosts")).then(s => s.size),
          getDocs(query(collection(db, "blogPosts"), where("status", "==", "published"))).then(s => s.size),
          getDocs(collection(db, "pressMentions")).then(s => s.size),
          getDocs(collection(db, "faqItems")).then(s => s.size),
          getDocs(query(collection(db, "subscribers"), where("status", "==", "active"))).then(s => s.size),
          getDocs(query(collection(db, "contactSubmissions"), where("status", "==", "new"))).then(s => s.size),
          auditService.getRecent(10),
        ]);
        setStats({ blogTotal: blog, blogPublished: blogPub, pressTotal: press, faqTotal: faq, subscribers: subs, contacts });
        setLogs(auditLogs);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const STAT_CARDS = [
    { label: "Blog Posts", value: stats?.blogPublished ?? "-", sub: `${stats?.blogTotal ?? 0} total`, icon: FileText, href: "/admin/blog", color: "#00AEFF" },
    { label: "Press Items", value: stats?.pressTotal ?? "-", sub: "items", icon: Newspaper, href: "/admin/press", color: "#A855F7" },
    { label: "FAQ Items", value: stats?.faqTotal ?? "-", sub: "questions", icon: HelpCircle, href: "/admin/faq", color: "#22C55E" },
    { label: "Subscribers", value: stats?.subscribers ?? "-", sub: "active", icon: Mail, href: "/admin/subscribers", color: "#EAB308" },
    { label: "New Contacts", value: stats?.contacts ?? "-", sub: "unread", icon: ClipboardList, href: "/admin/contacts", color: "#E22D2D" },
  ];

  const QUICK_LINKS = [
    { href: "/admin/blog/new", label: "New Blog Post" },
    { href: "/admin/press", label: "New Press Item" },
    { href: "/admin/faq/new", label: "New FAQ" },
    { href: "/admin/ventures", label: "Edit Ventures" },
    { href: "/admin/manifesto", label: "Edit Manifesto" },
    { href: "/admin/about", label: "Edit About Page" },
    { href: "/admin/home", label: "Edit Home Page" },
    { href: "/admin/settings", label: "Site Settings" },
    { href: "/admin/media", label: "Media Library" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-0.5">Dinesh Koyyalamudi — Content Management System</p>
      </div>

      {/* ── Stat Cards — fixed height, no overflow ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, href, color }) => (
          <Link key={href} href={href}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider leading-tight">{label}</span>
              <Icon size={14} style={{ color }} className="flex-shrink-0" />
            </div>
            <div className="text-2xl font-bold text-white leading-none mb-1">
              {loading ? "–" : value}
            </div>
            <div className="text-xs text-white/30">{sub}</div>
          </Link>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
            <TrendingUp size={12} /> Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-1.5">
            {QUICK_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-2.5 py-2 transition-colors leading-tight"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white/50">Recent Activity</h2>
            <Link href="/admin/audit" className="text-xs text-[#E22D2D] hover:underline">View all</Link>
          </div>
          {logs.length === 0 && !loading && (
            <p className="text-white/30 text-sm">No activity yet.</p>
          )}
          <div className="space-y-2.5 overflow-hidden">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  log.action === "create" ? "bg-green-400" :
                  log.action === "delete" ? "bg-red-400" :
                  log.action === "publish" ? "bg-blue-400" : "bg-white/30"
                }`} />
                <div className="min-w-0">
                  <p className="text-xs text-white/70 truncate">{log.summary}</p>
                  <p className="text-[10px] text-white/30">
                    {log.userEmail} · {log.createdAt ? formatDistanceToNow((log.createdAt as any).toDate(), { addSuffix: true }) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Media Library shortcut ── */}
      <div className="mt-4">
        <Link href="/admin/media"
          className="flex items-center gap-3 bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/15 rounded-xl px-5 py-3.5 transition-colors group"
        >
          <FolderOpen size={16} className="text-white/30 group-hover:text-white/60" />
          <div>
            <div className="text-sm text-white/60 group-hover:text-white transition-colors">Media Library</div>
            <div className="text-xs text-white/30">Upload, browse and copy URLs for all images</div>
          </div>
          <div className="ml-auto text-xs text-white/20 group-hover:text-white/40">→</div>
        </Link>
      </div>
    </div>
  );
}
