"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pressService, pressPageService } from "@/lib/firebase-services";
import type { PressMention, PressPageMeta } from "@/lib/types";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, ImageUpload, Alert, Card, SectionTitle, StatusBadge,
} from "../components/ui";

const MEDIA_TYPES = ["Article", "Interview", "Podcast", "Video", "Award", "Featured", "Profile"];

const EMPTY: Omit<PressMention, "id"> = {
  title: "", outlet: "", outletLogo: "", date: Date.now(), url: "", showInFeaturedBar: false,
  thumbnail: "", description: "", mediaType: "Article",
  featured: false, pullQuote: "", downloadableAsset: "",
  sortOrder: 0, status: "published",
};

export default function PressAdmin() {
  const [items, setItems] = useState<PressMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PressMention | null>(null);
  const [form, setForm] = useState<Omit<PressMention, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Press Page Meta state
  const [pageMeta, setPageMeta] = useState<Omit<PressPageMeta, "id">>({
    title: "Media & Mentions",
    subtitle: "Validation & Visibility",
    description: "Insights and features from leading publications on venture building, leadership, and the future of technology.",
    heroBackground: "/images/press_hero.png",
    mediaKitLabel: "Download Media Kit",
    mediaKitUrl: "",
    contactTitle: "Press Enquiries?",
    contactSubtitle: "Media Contact",
    contactDescription: "For interview requests, press releases, and media collaborations, reach out directly.",
    mediaAssetsTitle: "Need Media Assets?",
    mediaAssetsDescription: "Access hi-res photos, official bios, and brand assets for speaking engagements and press coverage.",
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoOgImage: "",
  });
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [pressItems, meta] = await Promise.all([
      pressService.getAll(),
      pressPageService.get(),
    ]);
    setItems(pressItems);
    if (meta) {
      const { id: _, ...rest } = meta;
      setPageMeta(rest);
    }
    setLoading(false);
  }

  function set(key: keyof typeof form, val: any) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: items.length });
    setShowForm(true);
  }

  function openEdit(item: PressMention) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.outlet) { setError("Title and Outlet are required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await pressService.update(editing.id, form);
      } else {
        await pressService.create(form);
      }
      setSaved(true);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this press item?")) return;
    await pressService.delete(id);
    load();
  }

  async function handleSavePageMeta() {
    setSavingMeta(true);
    setError("");
    try {
      await pressPageService.save(pageMeta as PressPageMeta);
      setMetaSaved(true);
      setTimeout(() => setMetaSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
    setSavingMeta(false);
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Press & Media"
        subtitle="Manage media mentions and coverage"
        action={
          <button onClick={openNew}
            className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Press Item
          </button>
        }
      />

      {/* Press Page Meta & SEO */}
      <Card className="mb-8">
        <SectionTitle>Press Page Settings & SEO</SectionTitle>
        {error && <Alert message={error} className="mb-4" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Page Title">
            <Input
              value={pageMeta.title}
              onChange={e => setPageMeta(m => ({ ...m, title: e.target.value }))}
              placeholder="Press"
            />
          </Field>
          <Field label="Subtitle">
            <Input
              value={pageMeta.subtitle}
              onChange={e => setPageMeta(m => ({ ...m, subtitle: e.target.value }))}
              placeholder="Media Coverage"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                value={pageMeta.description}
                onChange={e => setPageMeta(m => ({ ...m, description: e.target.value }))}
                rows={2}
                placeholder="Media mentions, features, and press coverage..."
              />
            </Field>
          </div>
          <Field label="Media Kit Label">
            <Input
              value={pageMeta.mediaKitLabel}
              onChange={e => setPageMeta(m => ({ ...m, mediaKitLabel: e.target.value }))}
              placeholder="Download Media Kit"
            />
          </Field>
          <Field label="Media Kit URL">
            <Input
              value={pageMeta.mediaKitUrl}
              onChange={e => setPageMeta(m => ({ ...m, mediaKitUrl: e.target.value }))}
              placeholder="https://..."
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Hero Background Image" hint="Full-width image shown behind the press page header">
              <ImageUpload
                value={pageMeta.heroBackground || ""}
                onChange={v => setPageMeta(m => ({ ...m, heroBackground: v }))}
                folder="press"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-4">Media Assets CTA</h3>
          <div className="space-y-3">
            <Field label="CTA Heading" hint='e.g. "Need Media Assets?"'>
              <Input
                value={(pageMeta as any).mediaAssetsTitle || ""}
                onChange={e => setPageMeta(m => ({ ...m, mediaAssetsTitle: e.target.value }))}
                placeholder="Need Media Assets?"
              />
            </Field>
            <Field label="CTA Description">
              <Textarea
                value={(pageMeta as any).mediaAssetsDescription || ""}
                onChange={e => setPageMeta(m => ({ ...m, mediaAssetsDescription: e.target.value }))}
                rows={2}
                placeholder="Access hi-res photos, official bios, and brand assets for speaking engagements and press coverage."
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-4">Contact Section</h3>
          <div className="space-y-3">
            <Field label="Contact Title" hint='Heading shown in the contact CTA at the bottom e.g. "Press Enquiries?"'>
              <Input
                value={(pageMeta as any).contactTitle || ""}
                onChange={e => setPageMeta(m => ({ ...m, contactTitle: e.target.value }))}
                placeholder="Press Enquiries?"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact Subtitle" hint='Small eyebrow label e.g. "Media Contact"'>
                <Input
                  value={(pageMeta as any).contactSubtitle || ""}
                  onChange={e => setPageMeta(m => ({ ...m, contactSubtitle: e.target.value }))}
                  placeholder="Media Contact"
                />
              </Field>
            </div>
            <Field label="Contact Description">
              <Textarea
                value={(pageMeta as any).contactDescription || ""}
                onChange={e => setPageMeta(m => ({ ...m, contactDescription: e.target.value }))}
                rows={2}
                placeholder="For interview requests, press releases, and media collaborations, reach out directly."
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <Field label="SEO Title" hint="Shown in Google search results for /press page">
              <Input
                value={pageMeta.seoMetaTitle || ""}
                onChange={e => setPageMeta(m => ({ ...m, seoMetaTitle: e.target.value }))}
                placeholder="Press & Media | Dinesh Koyyalamudi"
              />
            </Field>
            <Field label="SEO Description" hint="~155 characters. Falls back to Description if empty.">
              <Textarea
                value={pageMeta.seoMetaDescription || ""}
                onChange={e => setPageMeta(m => ({ ...m, seoMetaDescription: e.target.value }))}
                rows={3}
                placeholder="Media mentions, features, and press coverage..."
              />
            </Field>
            <Field label="OG Image URL" hint="Open Graph image for social sharing (1200x630px recommended)">
              <ImageUpload
                value={pageMeta.seoOgImage || ""}
                onChange={v => setPageMeta(m => ({ ...m, seoOgImage: v }))}
                folder="seo"
              />
            </Field>
          </div>
          <p className="text-xs text-white/30 mt-3">
            Leave empty to use default SEO values. OG image is used for social media previews.
          </p>
        </div>

        <div className="mt-6">
          <SaveButton
            loading={savingMeta}
            saved={metaSaved}
            onClick={handleSavePageMeta}
            label="Save Page Settings"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">Press Items</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Press Item
        </button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>{editing ? "Edit Press Item" : "New Press Item"}</SectionTitle>
          {error && <Alert message={error} className="mb-4" />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Headline" required>
              <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Article headline" />
            </Field>
            <Field label="Media Outlet" required>
              <Input value={form.outlet} onChange={e => set("outlet", e.target.value)} placeholder="e.g. TechCrunch, Forbes" />
            </Field>
            <Field label="Media Type">
              <Select value={form.mediaType} onChange={e => set("mediaType", e.target.value)}>
                {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date"
                value={new Date(form.date).toISOString().split("T")[0]}
                onChange={e => set("date", new Date(e.target.value).getTime())}
              />
            </Field>
            <Field label="Article URL">
              <Input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Sort Order / Priority">
              <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Short Description">
                <Textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={2} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Pull Quote" hint="Highlighted sentence from the article">
                <Textarea value={form.pullQuote || ""} onChange={e => set("pullQuote", e.target.value)} rows={2} />
              </Field>
            </div>
            <Field label="Outlet Logo URL">
              <ImageUpload value={form.outletLogo || ""} onChange={v => set("outletLogo", v)} folder="press/logos" />
            </Field>
            <Field label="Show in 'As Featured In' Bar" hint="Displays the outlet logo in the homepage featured bar — requires Outlet Logo to be set">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => set("showInFeaturedBar", !(form as any).showInFeaturedBar)}
                  className={`relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 ${(form as any).showInFeaturedBar ? "bg-brand-primary border-brand-primary" : "bg-white/5 border-white/10"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${(form as any).showInFeaturedBar ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className={`text-sm transition-colors ${(form as any).showInFeaturedBar ? "text-white" : "text-white/40"}`}>
                  {(form as any).showInFeaturedBar ? "Showing in featured bar" : "Hidden from featured bar"}
                </span>
              </label>
            </Field>
            <Field label="Cover / Thumbnail Image">
              <ImageUpload value={form.thumbnail || ""} onChange={v => set("thumbnail", v)} folder="press" />
            </Field>
            <Field label="Downloadable Asset URL" hint="Press kit, PDF, screenshots">
              <ImageUpload value={form.downloadableAsset || ""} onChange={v => set("downloadableAsset", v)} folder="press/assets" allowPdf={true} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </Field>
            <div className="flex items-center gap-4 md:col-span-2">
              <Toggle checked={form.featured} onChange={v => set("featured", v)} label="Featured / Highlighted" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
            <button onClick={() => setShowForm(false)} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No press items yet. Add your first one.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
              {item.featured && <Star size={14} className="text-yellow-400 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">{item.title}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {item.outlet} · {item.mediaType} · {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
              <StatusBadge status={item.status} />
              <span className="text-xs text-white/30 font-mono">#{item.sortOrder}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(item.id!)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}