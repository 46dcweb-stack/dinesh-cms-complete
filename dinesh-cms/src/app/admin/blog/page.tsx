"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { blogService } from "@/lib/firebase-services";
import type { BlogPost } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search, Eye, Pencil, Trash2, Globe, FileText } from "lucide-react";
import { AdminPageHeader, StatusBadge, Card, SectionTitle, Field, Input, Textarea, SaveButton, Alert } from "../components/ui";

const HERO_DEFAULTS = {
  subtitle:      "Thought Leadership & Insights",
  heading:       "The",
  headingItalic: "Journal",
  description:   "Exploring the intersection of venture capital, logistics, and the philosophies that drive global impact.",
  contactTitle:       "Have a Story Idea?",
  contactSubtitle:    "Get in Touch",
  contactDescription: "Want to collaborate on an article, interview, or guest post? Let's connect.",
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // Blog page hero settings
  const [hero, setHero] = useState(HERO_DEFAULTS);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroError, setHeroError] = useState("");

  useEffect(() => {
    load();
    loadHero();
  }, []);

  async function loadHero() {
    try {
      const snap = await getDoc(doc(db, "siteSettings", "blogPage"));
      if (snap.exists()) {
        const d = snap.data() as any;
        setHero({
          subtitle:      d.subtitle      || HERO_DEFAULTS.subtitle,
          heading:       d.heading       || HERO_DEFAULTS.heading,
          headingItalic: d.headingItalic || HERO_DEFAULTS.headingItalic,
          description:   d.description   || HERO_DEFAULTS.description,
          contactTitle:       d.contactTitle       || HERO_DEFAULTS.contactTitle,
          contactSubtitle:    d.contactSubtitle    || HERO_DEFAULTS.contactSubtitle,
          contactDescription: d.contactDescription || HERO_DEFAULTS.contactDescription,
        });
      }
    } catch (e) { console.error(e); }
  }

  async function saveHero() {
    setHeroSaving(true);
    setHeroError("");
    try {
      await setDoc(doc(db, "siteSettings", "blogPage"), { ...hero, updatedAt: serverTimestamp() });
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } catch (err: any) { setHeroError(err.message); }
    setHeroSaving(false);
  }

  async function load() {
    setLoading(true);
    const data = await blogService.getAll();
    setPosts(data);
    setFiltered(data);
    setLoading(false);
  }

  useEffect(() => {
    let f = posts;
    if (statusFilter !== "all") f = f.filter(p => p.status === statusFilter);
    if (search) f = f.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, statusFilter, posts]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await blogService.delete(id);
    load();
  }

  async function handlePublish(id: string, current: BlogPost["status"]) {
    if (current === "published") {
      await blogService.unpublish(id);
    } else {
      await blogService.publish(id);
    }
    load();
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Blog Posts"
        subtitle="Manage thought leadership articles and essays"
        action={
          <Link href="/admin/blog/new"
            className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> New Post
          </Link>
        }
      />

      {/* Blog Page Hero Settings */}
      <Card className="mb-6">
        <SectionTitle>Blog Page Heading</SectionTitle>
        <p className="text-xs text-white/40 mb-4">Controls the heading and description shown at the top of the /blog page.</p>
        {heroError && <Alert message={heroError} className="mb-4" />}
        <div className="space-y-3">
          <Field label="Eyebrow / Subtitle" hint='Small label above the title e.g. "Thought Leadership & Insights"'>
            <Input
              value={(hero as any).subtitle}
              onChange={e => setHero(h => ({ ...h, subtitle: e.target.value }))}
              placeholder="Thought Leadership & Insights"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Heading" hint='Main part e.g. "The"'>
              <Input
                value={(hero as any).heading}
                onChange={e => setHero(h => ({ ...h, heading: e.target.value }))}
                placeholder="The"
              />
            </Field>
            <Field label="Heading — Italic Part" hint='Gradient-styled word e.g. "Journal"'>
              <Input
                value={(hero as any).headingItalic}
                onChange={e => setHero(h => ({ ...h, headingItalic: e.target.value }))}
                placeholder="Journal"
              />
            </Field>
          </div>
          <Field label="Description" hint="One or two sentences shown below the heading">
            <Textarea
              value={hero.description}
              onChange={e => setHero(h => ({ ...h, description: e.target.value }))}
              rows={2}
              placeholder="Exploring the intersection of venture capital, logistics, and the philosophies that drive global impact."
            />
          </Field>
        </div>
        <div className="mt-4">
          <SaveButton loading={heroSaving} saved={heroSaved} onClick={saveHero} />
        </div>
      </Card>

      {/* Contact Section CMS */}
      <Card className="mb-6">
        <SectionTitle>Contact Section</SectionTitle>
        <p className="text-xs text-white/40 mb-4">Controls the "Get in Touch" block shown at the bottom of the blog page.</p>
        <div className="space-y-3">
          <Field label="Subtitle / Eyebrow">
            <Input
              value={(hero as any).contactSubtitle || ""}
              onChange={e => setHero(h => ({ ...h, contactSubtitle: e.target.value }))}
              placeholder="Get in Touch"
            />
          </Field>
          <Field label="Title">
            <Input
              value={(hero as any).contactTitle || ""}
              onChange={e => setHero(h => ({ ...h, contactTitle: e.target.value }))}
              placeholder="Have a Story Idea?"
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={(hero as any).contactDescription || ""}
              onChange={e => setHero(h => ({ ...h, contactDescription: e.target.value }))}
              rows={2}
              placeholder="Want to collaborate on an article, interview, or guest post?"
            />
          </Field>
        </div>
        <div className="mt-4">
          <SaveButton loading={heroSaving} saved={heroSaved} onClick={saveHero} />
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20"
          />
        </div>
        {["all", "published", "draft", "archived"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? "bg-white/15 text-white border-white/20"
                : "text-white/40 border-white/10 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-white/30 text-sm">Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No posts found</p>
            <Link href="/admin/blog/new" className="text-[#E22D2D] text-sm hover:underline mt-2 inline-block">
              Create your first post →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Title</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Date</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Tags</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white text-sm">{post.title}</div>
                    <div className="text-xs text-white/30 mt-0.5">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={post.status} />
                    {post.featuredPost && (
                      <span className="ml-2 text-xs bg-yellow-400/15 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/20">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-white/40">
                    {post.publishDate}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map(t => (
                        <span key={t} className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handlePublish(post.id!, post.status)}
                        title={post.status === "published" ? "Unpublish" : "Publish"}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Globe size={14} />
                      </button>
                      <Link href={`/admin/blog/${post.id}`}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id!)}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <p className="text-xs text-white/30 mt-4">{filtered.length} of {posts.length} posts</p>
      )}
    </div>
  );
}