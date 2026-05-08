"use client";
import { useEffect, useState } from "react";
import { aboutService } from "@/lib/firebase-services";
import type { AboutPage } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, SaveButton,
  Alert, Card, SectionTitle, ImageUpload,
} from "../components/ui";

const DEFAULT: Omit<AboutPage, "id"> = {
  shortBio: "", longBio: "", profileImage: "", featuredQuote: "",
  downloadableBio: "", currentFocusTitle: "Current Focus", currentFocusBody: "",
  proofPoints: [
    { label: "Years of Venture Building", value: "12+" },
    { label: "Global Operations", value: "05" },
    { label: "Ventures Launched", value: "15+" },
    { label: "Team Members", value: "80+" },
  ],
  values: [{ title: "", description: "" }],
  milestones: [{ year: "", title: "", description: "" }],
};

export default function AboutAdmin() {
  const [form, setForm] = useState<Omit<AboutPage, "id">>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    aboutService.get().then(data => {
      if (data) { const { id: _, ...rest } = data; setForm(rest); }
      setLoading(false);
    });
  }, []);

  function setField(key: keyof typeof form, val: any) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await aboutService.save(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <AdminPageHeader
        title="About Page"
        subtitle="Edit biography, milestones, values, and proof points"
        action={<SaveButton loading={saving} saved={saved} onClick={handleSave} />}
      />
      {error && (
  <div className="mb-6">
    <Alert message={error} />
  </div>
)}

      <div className="space-y-6">
        {/* Bio */}
        <Card>
          <SectionTitle>Biography</SectionTitle>
          <div className="space-y-4">
            <Field label="Short Bio (summary — shown in listings)">
              <Textarea value={form.shortBio} onChange={e => setField("shortBio", e.target.value)} rows={3} />
            </Field>
            <Field label="Long Bio (full story — shown on About page)">
              <Textarea value={form.longBio} onChange={e => setField("longBio", e.target.value)} rows={8} />
            </Field>
            <Field label="Featured Quote">
              <Input value={form.featuredQuote} onChange={e => setField("featuredQuote", e.target.value)} placeholder="Your signature quote" />
            </Field>
          </div>
        </Card>

        {/* Profile Image */}
        <Card>
          <SectionTitle>Profile Image</SectionTitle>
          <div className="max-w-xs">
            <ImageUpload value={form.profileImage} onChange={v => setField("profileImage", v)} folder="about" />
          </div>
          <div className="mt-4">
            <Field label="Downloadable Bio PDF (URL or upload link)">
              <Input value={form.downloadableBio || ""} onChange={e => setField("downloadableBio", e.target.value)} placeholder="https://..." />
            </Field>
          </div>
        </Card>

        {/* Proof Points */}
        <Card>
          <SectionTitle>Proof Points / Stats</SectionTitle>
          <div className="space-y-3">
            {form.proofPoints.map((pp, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 items-end">
                <Field label={`Stat ${i + 1} Label`}>
                  <Input value={pp.label} onChange={e => {
                    const p = [...form.proofPoints];
                    p[i] = { ...p[i], label: e.target.value };
                    setField("proofPoints", p);
                  }} />
                </Field>
                <div className="flex gap-2">
                  <Field label="Value">
                    <Input value={pp.value} onChange={e => {
                      const p = [...form.proofPoints];
                      p[i] = { ...p[i], value: e.target.value };
                      setField("proofPoints", p);
                    }} />
                  </Field>
                  <button onClick={() => setField("proofPoints", form.proofPoints.filter((_, j) => j !== i))}
                    className="mb-0 mt-auto p-2.5 text-white/30 hover:text-red-400 transition-colors"
                  ><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            <button onClick={() => setField("proofPoints", [...form.proofPoints, { label: "", value: "" }])}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mt-2"
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>
        </Card>

        {/* Current Focus */}
        <Card>
          <SectionTitle>Current Focus / Now Section</SectionTitle>
          <div className="space-y-4">
            <Field label="Section Title">
              <Input value={form.currentFocusTitle} onChange={e => setField("currentFocusTitle", e.target.value)} />
            </Field>
            <Field label="Body Text">
              <Textarea value={form.currentFocusBody} onChange={e => setField("currentFocusBody", e.target.value)} rows={4} />
            </Field>
          </div>
        </Card>

        {/* Values */}
        <Card>
          <SectionTitle>Values (repeatable)</SectionTitle>
          <div className="space-y-4">
            {form.values.map((v, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/40">Value {i + 1}</span>
                  <button onClick={() => setField("values", form.values.filter((_, j) => j !== i))}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  ><Trash2 size={12} /></button>
                </div>
                <div className="space-y-3">
                  <Field label="Title">
                    <Input value={v.title} onChange={e => {
                      const vals = [...form.values];
                      vals[i] = { ...vals[i], title: e.target.value };
                      setField("values", vals);
                    }} placeholder="e.g. Conviction Over Consensus" />
                  </Field>
                  <Field label="Description">
                    <Textarea value={v.description} onChange={e => {
                      const vals = [...form.values];
                      vals[i] = { ...vals[i], description: e.target.value };
                      setField("values", vals);
                    }} rows={2} />
                  </Field>
                </div>
              </div>
            ))}
            <button onClick={() => setField("values", [...form.values, { title: "", description: "" }])}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <Plus size={14} /> Add Value
            </button>
          </div>
        </Card>

        {/* Milestones */}
        <Card>
          <SectionTitle>Timeline / Milestones (repeatable)</SectionTitle>
          <div className="space-y-4">
            {form.milestones.map((m, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/40">Milestone {i + 1}</span>
                  <button onClick={() => setField("milestones", form.milestones.filter((_, j) => j !== i))}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  ><Trash2 size={12} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Year">
                    <Input value={m.year} onChange={e => {
                      const ms = [...form.milestones];
                      ms[i] = { ...ms[i], year: e.target.value };
                      setField("milestones", ms);
                    }} placeholder="2024" />
                  </Field>
                  <Field label="Title">
                    <Input value={m.title} onChange={e => {
                      const ms = [...form.milestones];
                      ms[i] = { ...ms[i], title: e.target.value };
                      setField("milestones", ms);
                    }} placeholder="Milestone name" />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Description">
                      <Textarea value={m.description} onChange={e => {
                        const ms = [...form.milestones];
                        ms[i] = { ...ms[i], description: e.target.value };
                        setField("milestones", ms);
                      }} rows={2} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setField("milestones", [...form.milestones, { year: "", title: "", description: "" }])}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>
        </Card>

        {/* SEO */}
        <Card>
          <SectionTitle>SEO — About Page</SectionTitle>
          <div className="space-y-4">
            <Field label="SEO Title" hint="Shown in Google search results for /about page">
              <Input
                value={(form as any).seoMetaTitle || ""}
                onChange={e => setField("seoMetaTitle" as any, e.target.value)}
                placeholder="About Dinesh Koyyalamudi — Founder & Strategic Visionary"
              />
            </Field>
            <Field label="SEO Description" hint="~155 characters. Falls back to Short Bio if empty.">
              <Textarea
                value={(form as any).seoMetaDescription || ""}
                onChange={e => setField("seoMetaDescription" as any, e.target.value)}
                rows={3}
                placeholder="The story, values, and founder journey of Dinesh Koyyalamudi..."
              />
            </Field>
          </div>
          <p className="text-xs text-white/30 mt-3">
            Leave empty to use Short Bio as SEO description automatically.
          </p>
        </Card>

        <SaveButton loading={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}