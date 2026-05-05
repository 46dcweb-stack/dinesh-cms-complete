"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pressService, pressPageService } from "@/lib/firebase-services";
import type { PressMention } from "@/lib/types";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, ImageUpload, Alert, Card, SectionTitle, StatusBadge,
} from "../components/ui";

const MEDIA_TYPES = ["Article", "Interview", "Podcast", "Video", "Award", "Featured", "Profile"];

const EMPTY: Omit<PressMention, "id"> = {
  title: "", outlet: "", outletLogo: "", date: Date.now(), url: "",
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

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setItems(await pressService.getAll());
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
              <Input value={form.outletLogo || ""} onChange={e => set("outletLogo", e.target.value)} placeholder="Logo image URL" />
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
