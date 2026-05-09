"use client";
import { useEffect, useState } from "react";
import { manifestoService } from "@/lib/firebase-services";
import type { ManifestoMeta, ManifestoSection } from "@/lib/types";
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil, GripVertical } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, SaveButton,
  Alert, Card, SectionTitle, Toggle,
} from "../components/ui";

const EMPTY_META: Omit<ManifestoMeta, "id"> = {
  title: "My Manifesto", subtitle: "A blueprint for resilient building.",
  eyebrow: "The Architecture of Intent", introLabel: "Infrastructure for the future",
  versionTag: "2.0", introStats: [
    { value: "Global", label: "Impact" },
    { value: "Infinite", label: "Vision" },
    { value: "100%", label: "Resilience" },
  ],
};

export default function ManifestoAdmin() {
  const [meta, setMeta] = useState<Omit<ManifestoMeta, "id">>(EMPTY_META);
  const [sections, setSections] = useState<ManifestoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);
  const [error, setError] = useState("");
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState<ManifestoSection | null>(null);
  const [sectionForm, setSectionForm] = useState<Omit<ManifestoSection, "id">>({
    sectionType: "Essay", order: 0, type: "text", heading: "", body: "",
    highlightStyle: "normal",
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [m, s] = await Promise.all([
      manifestoService.getMeta(),
      manifestoService.getSections(),
    ]);
    if (m) { const { id: _, ...rest } = m; setMeta(rest); }
    setSections(s);
    setLoading(false);
  }

  async function saveMeta() {
    setSavingMeta(true);
    await manifestoService.saveMeta(meta);
    setMetaSaved(true);
    setTimeout(() => setMetaSaved(false), 3000);
    setSavingMeta(false);
  }

  function setS(key: keyof typeof sectionForm, val: any) {
    setSectionForm(f => ({ ...f, [key]: val }));
  }

  async function saveSection() {
    if (!sectionForm.sectionType) { setError("Section type required."); return; }
    try {
      if (editingSection?.id) {
        await manifestoService.updateSection(editingSection.id, sectionForm);
      } else {
        await manifestoService.createSection({ ...sectionForm, order: sections.length });
      }
      setShowSectionForm(false);
      setEditingSection(null);
      load();
    } catch (err: any) { setError(err.message); }
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section?")) return;
    await manifestoService.deleteSection(id);
    load();
  }

  async function moveSection(index: number, dir: "up" | "down") {
    const newSections = [...sections];
    const swapWith = dir === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= newSections.length) return;
    [newSections[index], newSections[swapWith]] = [newSections[swapWith], newSections[index]];
    const reordered = newSections.map((s, i) => ({ id: s.id!, order: i }));
    await manifestoService.reorderSections(reordered);
    load();
  }

  function editSection(s: ManifestoSection) {
    setEditingSection(s);
    const { id: _, ...rest } = s;
    setSectionForm(rest);
    setShowSectionForm(true);
  }

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading manifesto...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <AdminPageHeader title="Manifesto" subtitle="Edit your manifesto metadata and sections" />

      {error && <Alert message={error} className="mb-6" />}

      {/* Meta */}
      <Card className="mb-8">
        <SectionTitle>Manifesto Metadata</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">
            <Input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} />
          </Field>
          <Field label="Version Tag">
            <Input value={meta.versionTag} onChange={e => setMeta(m => ({ ...m, versionTag: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Subtitle">
              <Input value={meta.subtitle} onChange={e => setMeta(m => ({ ...m, subtitle: e.target.value }))} />
            </Field>
          </div>
          <Field label="Eyebrow Text">
            <Input value={meta.eyebrow} onChange={e => setMeta(m => ({ ...m, eyebrow: e.target.value }))} />
          </Field>
          <Field label="Intro Label">
            <Input value={meta.introLabel} onChange={e => setMeta(m => ({ ...m, introLabel: e.target.value }))} />
          </Field>
        </div>

        <div className="mt-4">
          <SectionTitle>Intro Stats (3 items)</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            {meta.introStats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <Field label={`Stat ${i + 1} Value`}>
                  <Input value={stat.value} onChange={e => {
                    const s = [...meta.introStats];
                    s[i] = { ...s[i], value: e.target.value };
                    setMeta(m => ({ ...m, introStats: s }));
                  }} />
                </Field>
                <Field label="Label">
                  <Input value={stat.label} onChange={e => {
                    const s = [...meta.introStats];
                    s[i] = { ...s[i], label: e.target.value };
                    setMeta(m => ({ ...m, introStats: s }));
                  }} />
                </Field>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <SaveButton loading={savingMeta} saved={metaSaved} onClick={saveMeta} label="Save Metadata" />
        </div>
      </Card>

      {/* SEO Section */}
      <Card className="mb-8">
        <SectionTitle>SEO — Manifesto Page</SectionTitle>
        <div className="space-y-4">
          <Field label="SEO Title" hint="Shown in Google search results for /manifesto page">
            <Input
              value={(meta as any).seoMetaTitle || ""}
              onChange={e => setMeta(m => ({ ...m, seoMetaTitle: e.target.value } as any))}
              placeholder="My Manifesto — A Blueprint for Resilient Building"
            />
          </Field>
          <Field label="SEO Description" hint="~155 characters. Falls back to Subtitle if empty.">
            <Textarea
              value={(meta as any).seoMetaDescription || ""}
              onChange={e => setMeta(m => ({ ...m, seoMetaDescription: e.target.value } as any))}
              rows={3}
              placeholder="The architecture of intent, infrastructure for the future..."
            />
          </Field>
          <Field label="OG Image URL" hint="Open Graph image for social sharing (1200x630px recommended)">
            <ImageUpload
              value={(meta as any).seoOgImage || ""}
              onChange={v => setMeta(m => ({ ...m, seoOgImage: v } as any))}
              folder="seo"
            />
          </Field>
        </div>
        <p className="text-xs text-white/30 mt-3">
          Leave empty to use default SEO values. OG image is used for social media previews.
        </p>
      </Card>

      {/* Sections */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">
          Sections ({sections.length})
        </h2>
        <button onClick={() => { setEditingSection(null); setSectionForm({ sectionType: "Essay", order: sections.length, type: "text", heading: "", body: "", highlightStyle: "normal" }); setShowSectionForm(true); }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>

      {showSectionForm && (
        <Card className="mb-6">
          <SectionTitle>{editingSection ? "Edit Section" : "New Section"}</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Section Type">
              <Select value={sectionForm.sectionType} onChange={e => setS("sectionType", e.target.value)}>
                <option value="Essay">Essay</option>
                <option value="Principle">Principle</option>
                <option value="Statement">Statement</option>
                <option value="Vision">Vision</option>
              </Select>
            </Field>
            <Field label="Display Type">
              <Select value={sectionForm.type} onChange={e => setS("type", e.target.value)}>
                <option value="text">Text / Essay</option>
                <option value="quote">Quote</option>
                <option value="principle">Principles Grid</option>
                <option value="vision_grid">Vision Grid</option>
              </Select>
            </Field>
            <Field label="Highlight Style">
              <Select value={sectionForm.highlightStyle} onChange={e => setS("highlightStyle", e.target.value)}>
                <option value="normal">Normal</option>
                <option value="emphasized">Emphasized</option>
              </Select>
            </Field>
          </div>

          {(sectionForm.type === "text" || sectionForm.type === "vision_grid") && (
            <div className="mt-4 space-y-4">
              <Field label="Heading">
                <Input value={sectionForm.heading || ""} onChange={e => setS("heading", e.target.value)} />
              </Field>
              <Field label="Body Text">
                <Textarea value={sectionForm.body || ""} onChange={e => setS("body", e.target.value)} rows={6} />
              </Field>
            </div>
          )}

          {sectionForm.type === "quote" && (
            <div className="mt-4 space-y-4">
              <Field label="Quote Text">
                <Textarea value={sectionForm.text || ""} onChange={e => setS("text", e.target.value)} rows={3} />
              </Field>
              <Field label="Author Attribution">
                <Input value={sectionForm.authorAttr || ""} onChange={e => setS("authorAttr", e.target.value)} />
              </Field>
            </div>
          )}

          <div className="mt-4">
            <Field label="Pull Quote (optional)">
              <Input value={sectionForm.pullQuote || ""} onChange={e => setS("pullQuote", e.target.value)} />
            </Field>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <SaveButton onClick={saveSection} label={editingSection ? "Update Section" : "Add Section"} />
            <button onClick={() => { setShowSectionForm(false); setEditingSection(null); }} className="text-sm text-white/40 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {sections.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
            <div className="text-white/20 flex flex-col gap-0.5">
              <button onClick={() => moveSection(i, "up")} disabled={i === 0} className="hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
              <button onClick={() => moveSection(i, "down")} disabled={i === sections.length - 1} className="hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
            </div>
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-xs font-mono text-white/40">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{s.heading || s.text?.slice(0, 60) || `${s.sectionType} — ${s.type}`}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.sectionType} · {s.type} · {s.highlightStyle}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => editSection(s)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => deleteSection(s.id!)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">No sections yet. Add your first manifesto section.</div>
        )}
      </div>
    </div>
  );
}
