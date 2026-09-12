"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { legalPageService } from "@/lib/firebase-services";
import { revalidate } from "@/lib/revalidate";
import { formatHtml } from "@/lib/format-html";
import type { LegalPage } from "@/lib/types";
import { LEGAL_DEFAULTS, LEGAL_SLUGS, type LegalSlug } from "@/lib/legal-defaults";
import { ExternalLink, RotateCcw, Wand2 } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea,
  SaveButton, Alert, Card, SectionTitle,
} from "../components/ui";

function defaultsFor(slug: LegalSlug): LegalPage {
  const d = LEGAL_DEFAULTS[slug];
  return {
    eyebrow: d.eyebrow,
    title: d.title,
    titleItalic: d.titleItalic,
    entityName: d.entityName,
    lastUpdated: d.lastUpdated,
    content: d.content,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
  };
}

export default function LegalAdmin() {
  const [slug, setSlug] = useState<LegalSlug>("terms");
  const [form, setForm] = useState<LegalPage>(defaultsFor("terms"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [fromDefaults, setFromDefaults] = useState(false);
  const [liveNote, setLiveNote] = useState("");

  // `load` is defined below and only depends on the slug argument.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(slug); }, [slug]);

  async function load(s: LegalSlug) {
    setLoading(true);
    setError("");
    setSaved(false);
    setLiveNote("");
    try {
      const data = await legalPageService.get(s);
      if (data) {
        // Fill any blank field from the defaults so nothing renders empty
        const merged = { ...defaultsFor(s), ...stripEmpty(data) };
        setForm({ ...merged, content: formatHtml(merged.content ?? "") });
        setFromDefaults(false);
      } else {
        setForm(defaultsFor(s));
        setFromDefaults(true);
      }
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  }

  function stripEmpty(o: LegalPage): LegalPage {
    return Object.fromEntries(
      Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ) as LegalPage;
  }

  function set(key: keyof LegalPage, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function resetToDefault() {
    if (!confirm("Replace the fields below with the original built-in wording? Nothing is saved until you press Save.")) return;
    setForm(defaultsFor(slug));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await legalPageService.save(slug, form);
      // Push the change live now rather than waiting for the ISR window.
      const pushed = await revalidate({ paths: [`/${slug}`], tags: [`legalPage-${slug}`] });
      setLiveNote(pushed
        ? "Saved and published — refresh the live page to see it."
        : "Saved. The live page will update within about two minutes.");
      setSaved(true);
      setFromDefaults(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Legal Pages"
        subtitle="Edit the Terms of Use, Privacy Policy and Cookie Policy pages"
        action={
          <div className="flex items-center gap-3">
            <Link href={`/${slug}`} target="_blank"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ExternalLink size={14} /> View page
            </Link>
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
          </div>
        }
      />

      {error && <Alert message={error} className="mb-6" />}
      {liveNote && <Alert type="success" message={liveNote} className="mb-6" />}

      {/* Which page ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {LEGAL_SLUGS.map(s => (
          <button
            key={s}
            onClick={() => setSlug(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              slug === s
                ? "bg-[#E22D2D] border-[#E22D2D] text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            {LEGAL_DEFAULTS[s].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-white/30 text-sm">Loading…</div>
      ) : (
        <>
          {fromDefaults && (
            <Alert
              type="success"
              className="mb-6"
              message="This page has not been edited yet, so the fields below show the wording currently live on the site. Change what you need and press Save."
            />
          )}

          <Card className="mb-8">
            <SectionTitle>Page Header</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Eyebrow" hint="Small label above the title">
                <Input value={form.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} placeholder="Legal Protocol" />
              </Field>
              <Field label="Title" hint="First part of the heading">
                <Input value={form.title ?? ""} onChange={e => set("title", e.target.value)} placeholder="Privacy" />
              </Field>
              <Field label="Title Italic Suffix" hint="Italic gradient part of the heading">
                <Input value={form.titleItalic ?? ""} onChange={e => set("titleItalic", e.target.value)} placeholder="Policy." />
              </Field>
              <Field label="Entity Name" hint="Shown under the heading">
                <Input value={form.entityName ?? ""} onChange={e => set("entityName", e.target.value)} placeholder="Dinesh Koyyalamudi" />
              </Field>
              <div className="col-span-2">
                <Field label="Last Updated" hint="Free text — remember to change this whenever you edit the content">
                  <Input value={form.lastUpdated ?? ""} onChange={e => set("lastUpdated", e.target.value)} placeholder="Last Updated: March 23, 2026" />
                </Field>
              </div>
            </div>
          </Card>

          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Page Content</SectionTitle>
              <div className="flex items-center gap-4">
                <button onClick={() => set("content", formatHtml(form.content ?? ""))}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                  title="Re-indent the HTML. Does not change the published page.">
                  <Wand2 size={14} /> Tidy HTML
                </button>
                <button onClick={resetToDefault}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <RotateCcw size={14} /> Restore original wording
                </button>
              </div>
            </div>
            <p className="text-xs text-white/30 mb-4 leading-relaxed">
              HTML. Use <code className="text-white/60">&lt;h2&gt;</code> for numbered sections,
              <code className="text-white/60"> &lt;h3&gt;</code> for sub-headings,
              <code className="text-white/60"> &lt;p&gt;</code> for paragraphs and
              <code className="text-white/60"> &lt;ul&gt;&lt;li&gt;</code> for bullet lists.
              Styling is applied automatically — do not add classes.
            </p>
            <Field label="Content">
              <Textarea
                value={form.content ?? ""}
                onChange={e => set("content", e.target.value)}
                rows={30}
                spellCheck={false}
                className="font-mono text-xs leading-relaxed whitespace-pre"
              />
            </Field>
          </Card>

          <Card className="mb-8">
            <SectionTitle>SEO</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Meta Title">
                <Input value={form.seoTitle ?? ""} onChange={e => set("seoTitle", e.target.value)} />
              </Field>
              <Field label="Meta Description" hint="Aim for 140–160 characters">
                <Input value={form.seoDescription ?? ""} onChange={e => set("seoDescription", e.target.value)} />
              </Field>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <SaveButton loading={saving} saved={saved} onClick={handleSave} />
          </div>
        </>
      )}
    </div>
  );
}
