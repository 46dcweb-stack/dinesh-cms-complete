"use client";
import { useEffect, useState } from "react";
import { galleryService, settingsService } from "@/lib/firebase-services";
import type { GalleryImage } from "@/lib/types";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, ImageUpload, Alert, Card, SectionTitle, StatusBadge,
} from "../components/ui";

const EMPTY: Omit<GalleryImage, "id"> = {
  src: "", title: "", category: "Speaking", span: "col-span-1", altText: "",
  sortOrder: 0, featured: false, status: "active",
};

const CATEGORIES = ["Speaking", "Ventures", "Events", "Personal", "Media", "Awards", "Travel"];
const SPANS = ["col-span-1", "col-span-2", "row-span-2", "col-span-2 row-span-2"];

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState<Omit<GalleryImage, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pageText, setPageText] = useState({ eyebrow: "Visual Protocol", heading: "Cinematic", headingItalic: "Ventures.", description: "A curated collection of visual artifacts representing our approach to architecture, technology, and the global infrastructures we are building." });
  const [savingPage, setSavingPage] = useState(false);
  const [savedPage, setSavedPage] = useState(false);

  useEffect(() => { load(); loadPageText(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadPageText() {
    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const snap = await getDoc(doc(db, "siteSettings", "galleryPage"));
      if (snap.exists()) {
        const d = snap.data();
        setPageText({ eyebrow: d.eyebrow || pageText.eyebrow, heading: d.heading || pageText.heading, headingItalic: d.headingItalic || pageText.headingItalic, description: d.description || pageText.description });
      }
    } catch (e) { console.error("loadPageText:", e); }
  }

  async function savePageText() {
    setSavingPage(true);
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const { serverTimestamp } = await import("firebase/firestore");
      await setDoc(doc(db, "siteSettings", "galleryPage"), { ...pageText, updatedAt: serverTimestamp() });
      setSavedPage(true);
      setTimeout(() => setSavedPage(false), 3000);
    } catch (e) { console.error("savePageText:", e); }
    setSavingPage(false);
  }

  async function load() {
    setLoading(true);
    setItems(await galleryService.getAll());
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

  function openEdit(item: GalleryImage) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.src) { setError("Image is required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await galleryService.update(editing.id, form);
      } else {
        await galleryService.create(form);
      }
      setSaved(true);
      setShowForm(false);
      load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    await galleryService.delete(id);
    load();
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Gallery"
        subtitle="Manage photo gallery images"
        action={
          <button onClick={openNew}
            className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Image
          </button>
        }
      />

      {/* Page Text Settings */}
      <Card className="mb-6">
        <SectionTitle>Page Text</SectionTitle>
        <div className="space-y-4">
          <Field label="Eyebrow Label" hint="Small text above the title (e.g. Visual Protocol)">
            <Input
              value={pageText.eyebrow}
              onChange={e => setPageText(p => ({ ...p, eyebrow: e.target.value }))}
              placeholder="Visual Protocol"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Field label="Heading" hint='Main heading word e.g. "Cinematic"'>
              <Input
                value={pageText.heading}
                onChange={e => setPageText(p => ({ ...p, heading: e.target.value }))}
                placeholder="Cinematic"
              />
            </Field>
            <Field label="Heading Italic Part" hint='Styled italic ending e.g. "Ventures."'>
              <Input
                value={pageText.headingItalic}
                onChange={e => setPageText(p => ({ ...p, headingItalic: e.target.value }))}
                placeholder="Ventures."
              />
            </Field>
          </div>
          <Field label="Page Description">
            <Textarea
              value={pageText.description}
              onChange={e => setPageText(p => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="A curated collection of visual artifacts..."
            />
          </Field>
          <SaveButton loading={savingPage} saved={savedPage} onClick={savePageText} />
        </div>
      </Card>

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>{editing ? "Edit Image" : "Add Image"}</SectionTitle>
          {error && <Alert message={error} className="mb-4" />}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Image" required>
                <ImageUpload
                  value={form.src}
                  onChange={v => set("src", v)}
                  folder="gallery"
                  previewImageClass="h-52 md:h-72 object-contain bg-black/20"
                />
              </Field>
            </div>
            <Field label="Title">
              <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Image caption" />
            </Field>
            <Field label="Alt Text" hint="For accessibility and SEO">
              <Input value={form.altText || ""} onChange={e => set("altText", e.target.value)} />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Grid Span" hint="Controls image size in the masonry grid">
              <Select value={form.span} onChange={e => set("span", e.target.value)}>
                {SPANS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Sort Order">
              <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </Select>
            </Field>
            <Toggle checked={form.featured} onChange={v => set("featured", v)} label="Featured Image" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
            <button onClick={() => setShowForm(false)} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Masonry preview */}
      <div className="grid grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-4 py-12 text-center text-white/30 text-sm">Loading gallery...</div>
        ) : items.length === 0 ? (
          <div className="col-span-4 py-12 text-center text-white/30 text-sm">No images yet.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 ${item.span}`}>
              {item.src ? (
                <img src={item.src} alt={item.altText || item.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-xs">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => openEdit(item)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <Pencil size={14} className="text-white" />
                </button>
                <button onClick={() => handleDelete(item.id!)} className="p-2 bg-red-400/20 hover:bg-red-400/30 rounded-lg transition-colors">
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
              <div className="px-3 py-2">
                <div className="text-xs text-white/60 truncate">{item.title || "Untitled"}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/30 font-mono">{item.category}</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}