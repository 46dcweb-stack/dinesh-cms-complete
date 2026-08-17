"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ecosystemPageService } from "@/lib/firebase-services";
import type { EcosystemPageMeta } from "@/lib/types";
import { Plus, Trash2, ExternalLink, Layers } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea,
  SaveButton, ImageUpload, Alert, Card, SectionTitle,
} from "../components/ui";

const DEFAULTS: EcosystemPageMeta = {
  eyebrow: "The Ecosystem",
  heading: "Building the",
  headingItalic: "Invisible.",
  description:
    "We do not just build companies. We engineer ecosystems — a portfolio of ventures spanning global logistics, sovereign data, and biophilic tech.",
  introTitle: "One parent brand. Many frontiers.",
  introBody:
    "Every venture in the FourSix46 ecosystem is built on the same foundation: structural clarity, quiet precision, and infrastructure that thrives on volatility.",
  stats: [],
  ctaTitle: "Want to build with us?",
  ctaDescription: "Whether you are founding, funding, or partnering — the conversation starts here.",
  ctaLabel: "Start a Conversation",
  ctaUrl: "/contact",
  seoMetaTitle: "",
  seoMetaDescription: "",
  seoOgImage: "",
};

export default function EcosystemAdmin() {
  const [form, setForm] = useState<EcosystemPageMeta>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await ecosystemPageService.get();
      if (data) setForm({ ...DEFAULTS, ...data, stats: data.stats ?? [] });
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  }

  function set(key: keyof EcosystemPageMeta, val: any) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }

  // ── Stats helpers ───────────────────────────────────────────────
  const stats = form.stats ?? [];

  function setStat(index: number, key: "value" | "label", val: string) {
    const next = [...stats];
    next[index] = { ...next[index], [key]: val };
    set("stats", next);
  }

  function addStat() { set("stats", [...stats, { value: "", label: "" }]); }

  function removeStat(index: number) { set("stats", stats.filter((_, i) => i !== index)); }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      // Drop empty stat rows so the public page never renders blank tiles
      const cleaned: EcosystemPageMeta = {
        ...form,
        stats: stats.filter(s => (s.value ?? "").trim() || (s.label ?? "").trim()),
      };
      await ecosystemPageService.save(cleaned);
      setForm(cleaned);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  if (loading) {
    return <div className="p-8 text-white/30 text-sm">Loading ecosystem page...</div>;
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Ecosystem Page"
        subtitle="Edit the content of the public /ecosystem page"
        action={
          <div className="flex items-center gap-3">
            <Link href="/ecosystem" target="_blank"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <ExternalLink size={14} /> View page
            </Link>
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
          </div>
        }
      />

      {error && <Alert message={error} className="mb-6" />}

      {/* ── Where the venture cards come from ───────────────────── */}
      <Card className="mb-8">
        <div className="flex items-start gap-3">
          <Layers size={16} className="text-[#E22D2D] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-white/50 leading-relaxed">
            The venture cards on this page are pulled from the shared{" "}
            <Link href="/admin/ventures" className="text-white underline underline-offset-4 hover:text-[#E22D2D] transition-colors">
              Ventures
            </Link>{" "}
            list — the same ventures shown in the Ecosystem section on the home page. Add, edit,
            reorder, or hide ventures there. The fields below only control this page&apos;s own copy.
          </p>
        </div>
      </Card>

      {/* ── Header ──────────────────────────────────────────────── */}
      <Card className="mb-8">
        <SectionTitle>Page Header</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow" hint="Small uppercase label above the title">
            <Input value={form.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} placeholder="The Ecosystem" />
          </Field>
          <Field label="Heading" hint="Main heading text">
            <Input value={form.heading ?? ""} onChange={e => set("heading", e.target.value)} placeholder="Building the" />
          </Field>
          <Field label="Heading Italic Suffix" hint="Italic gradient portion at the end of the heading">
            <Input value={form.headingItalic ?? ""} onChange={e => set("headingItalic", e.target.value)} placeholder="Invisible." />
          </Field>
          <div className="col-span-2">
            <Field label="Description" hint="Short paragraph shown under the heading">
              <Textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)} rows={3} />
            </Field>
          </div>
        </div>
      </Card>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Stats Bar</SectionTitle>
          <button onClick={addStat}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            <Plus size={14} /> Add stat
          </button>
        </div>
        {stats.length === 0 ? (
          <p className="text-sm text-white/30">No stats — the stats bar is hidden on the page.</p>
        ) : (
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-3">
                  <Field label="Value">
                    <Input value={s.value ?? ""} onChange={e => setStat(i, "value", e.target.value)} placeholder="12+" />
                  </Field>
                </div>
                <div className="col-span-8">
                  <Field label="Label">
                    <Input value={s.label ?? ""} onChange={e => setStat(i, "label", e.target.value)} placeholder="Ventures Built" />
                  </Field>
                </div>
                <div className="col-span-1 pb-2">
                  <button onClick={() => removeStat(i)}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Intro ───────────────────────────────────────────────── */}
      <Card className="mb-8">
        <SectionTitle>Intro Block</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Intro Title" hint="Leave both fields empty to hide this block">
            <Input value={form.introTitle ?? ""} onChange={e => set("introTitle", e.target.value)} placeholder="One parent brand. Many frontiers." />
          </Field>
          <Field label="Intro Body">
            <Textarea value={form.introBody ?? ""} onChange={e => set("introBody", e.target.value)} rows={3} />
          </Field>
        </div>
      </Card>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <Card className="mb-8">
        <SectionTitle>Bottom CTA</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Title" hint="Leave empty to hide the CTA block">
            <Input value={form.ctaTitle ?? ""} onChange={e => set("ctaTitle", e.target.value)} placeholder="Want to build with us?" />
          </Field>
          <Field label="CTA Description">
            <Input value={form.ctaDescription ?? ""} onChange={e => set("ctaDescription", e.target.value)} placeholder="The conversation starts here." />
          </Field>
          <Field label="Button Label">
            <Input value={form.ctaLabel ?? ""} onChange={e => set("ctaLabel", e.target.value)} placeholder="Start a Conversation" />
          </Field>
          <Field label="Button URL">
            <Input value={form.ctaUrl ?? ""} onChange={e => set("ctaUrl", e.target.value)} placeholder="/contact" />
          </Field>
        </div>
      </Card>

      {/* ── SEO ─────────────────────────────────────────────────── */}
      <Card className="mb-8">
        <SectionTitle>SEO</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Meta Title">
            <Input value={form.seoMetaTitle ?? ""} onChange={e => set("seoMetaTitle", e.target.value)} placeholder="The Ecosystem | FourSix46 Ventures" />
          </Field>
          <Field label="Meta Description">
            <Input value={form.seoMetaDescription ?? ""} onChange={e => set("seoMetaDescription", e.target.value)} placeholder="Falls back to the page description" />
          </Field>
          <div className="col-span-2">
            <Field label="OG Image">
              <ImageUpload value={form.seoOgImage ?? ""} onChange={v => set("seoOgImage", v)} folder="ecosystem" />
            </Field>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SaveButton loading={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}
