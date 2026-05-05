"use client";
import { useEffect, useState } from "react";
import { faqService } from "@/lib/firebase-services";
import type { FaqItem } from "@/lib/types";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, Alert, Card, SectionTitle, StatusBadge,
} from "../components/ui";

const CATEGORIES: FaqItem["category"][] = [
  "About Dinesh", "FourSix46 & Ventures", "Speaking & Media",
  "Collaboration & Advisory", "Vision & Strategy", "Operations & Collaboration",
];

const EMPTY: Omit<FaqItem, "id"> = {
  question: "", answer: "", category: "About Dinesh",
  sortOrder: 0, featured: false, status: "published",
};

export default function FaqAdmin() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [form, setForm] = useState<Omit<FaqItem, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setItems(await faqService.getAll());
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(item: FaqItem) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm(rest);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave() {
    if (!form.question || !form.answer) { setError("Question and Answer are required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await faqService.update(editing.id, form);
      } else {
        await faqService.create(form);
      }
      setSaved(true);
      setShowForm(false);
      load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await faqService.delete(id);
    load();
  }

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  return (
    <div className="p-8">
      <AdminPageHeader
        title="FAQ"
        subtitle="Manage frequently asked questions"
        action={
          <button onClick={openNew}
            className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> New FAQ
          </button>
        }
      />

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>{editing ? "Edit FAQ" : "New FAQ"}</SectionTitle>
          {error && <Alert message={error} className="mb-4" />}
          <div className="space-y-4">
            <Field label="Question" required>
              <Input value={form.question} onChange={e => set("question", e.target.value)} placeholder="What is your question?" />
            </Field>
            <Field label="Answer" required>
              <Textarea value={form.answer} onChange={e => set("answer", e.target.value)} rows={5} placeholder="Detailed answer..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Select value={form.category} onChange={e => set("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Sort Order">
                <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} />
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={e => set("status", e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Select>
              </Field>
            </div>
            <Toggle checked={form.featured} onChange={v => set("featured", v)} label="Featured FAQ" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
            <button onClick={() => setShowForm(false)} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading FAQs...</div>
        ) : (
          CATEGORIES.map(cat => {
            const catItems = grouped[cat];
            if (!catItems?.length) return null;
            return (
              <div key={cat}>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#E22D2D] mb-3">{cat}</h2>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div
                        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id!)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm">{item.question}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} />
                          {item.featured && (
                            <span className="text-xs bg-yellow-400/15 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/20">Featured</span>
                          )}
                          <span className="text-xs text-white/30 font-mono">#{item.sortOrder}</span>
                          <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id!); }} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                            <Trash2 size={12} />
                          </button>
                          {expandedId === item.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                        </div>
                      </div>
                      {expandedId === item.id && (
                        <div className="px-5 pb-4 text-sm text-white/50 border-t border-white/5 pt-3">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
