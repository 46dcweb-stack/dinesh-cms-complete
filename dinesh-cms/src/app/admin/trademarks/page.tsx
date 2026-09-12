"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  trademarkService, trademarkPageService, proprietorService, jurisdictionService,
} from "@/lib/firebase-services";
import { publish, publishNote } from "@/lib/cms-publish";
import type {
  Trademark, TrademarkClass, TrademarkPageMeta, Proprietor, Jurisdiction,
} from "@/lib/types";
import {
  markSymbol, TRADEMARK_STATUSES, FILING_TYPES, MARK_TYPES, applicationLabel,
  SEED_STAGES_GB, SEED_STAGES_IN,
} from "@/lib/trademarks";
import { TRADEMARK_PAGE_DEFAULTS } from "@/lib/trademark-defaults";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, ExternalLink, Lock, AlertTriangle, RotateCcw,
} from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, ImageUpload, Alert, Card, SectionTitle,
} from "../components/ui";

type Tab = "marks" | "page" | "refs";

const EMPTY_CLASS: TrademarkClass = {
  classNumber: 35, classHeading: "", specification: "", applicationNumber: "", classStatus: "",
};

const EMPTY: Omit<Trademark, "id"> = {
  markName: "", slug: "", markType: "Word mark", markImage: "", markImageBg: "Dark",
  ventureName: "", ventureUrl: "",
  jurisdictionId: "", proprietorId: "", filingType: "Multi-class",
  applicationNumber: "", registrationNumber: "",
  filingDate: new Date().toISOString().split("T")[0], registrationDate: "", renewalDue: "",
  officialRecordUrl: "", journalUrl: "",
  status: "Filed", statusUpdated: new Date().toISOString().split("T")[0], statusNote: "",
  classes: [{ ...EMPTY_CLASS }],
  summary: "", story: "", classNote: "",
  usageEnabled: false, usageIntro: "", usageCorrect: "", usageIncorrect: "",
  faqs: [],
  seoTitle: "", seoDescription: "", ogImage: "",
  isPrimary: false, sortOrder: 0, showOnSite: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function TrademarksAdmin() {
  const [tab, setTab] = useState<Tab>("marks");
  const [items, setItems] = useState<Trademark[]>([]);
  const [props, setProps] = useState<Proprietor[]>([]);
  const [juris, setJuris] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Trademark | null>(null);
  const [form, setForm] = useState<Omit<Trademark, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const [page, setPage] = useState<TrademarkPageMeta>(TRADEMARK_PAGE_DEFAULTS);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageSaved, setPageSaved] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [m, p, j, pg] = await Promise.all([
        trademarkService.getAll(), proprietorService.getAll(),
        jurisdictionService.getAll(), trademarkPageService.get(),
      ]);
      setItems(m); setProps(p); setJuris(j);
      if (pg) setPage({ ...TRADEMARK_PAGE_DEFAULTS, ...pg });
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  }

  function set(key: keyof typeof form, val: any) {
    setForm(f => {
      if (key === "markName" && !editing) return { ...f, markName: val, slug: slugify(val) };
      return { ...f, [key]: val };
    });
    setSaved(false);
  }

  // ── Class rows ────────────────────────────────────────────────────────────
  const classes = form.classes ?? [];
  function setClass(i: number, key: keyof TrademarkClass, val: any) {
    set("classes", classes.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));
  }
  function addClass() { set("classes", [...classes, { ...EMPTY_CLASS }]); }
  function removeClass(i: number) { set("classes", classes.filter((_, idx) => idx !== i)); }

  // ── FAQ rows ──────────────────────────────────────────────────────────────
  const faqs = form.faqs ?? [];
  function setFaq(i: number, key: "question" | "answer", val: string) {
    set("faqs", faqs.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)));
  }
  function addFaq() { set("faqs", [...faqs, { question: "", answer: "" }]); }
  function removeFaq(i: number) { set("faqs", faqs.filter((_, idx) => idx !== i)); }

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: items.length,
      jurisdictionId: juris[0]?.id ?? "", proprietorId: props[0]?.id ?? "" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(item: Trademark) {
    setEditing(item);
    const { id: _, ...rest } = item;
    setForm({ ...EMPTY, ...rest, classes: rest.classes?.length ? rest.classes : [{ ...EMPTY_CLASS }] });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const perClass = form.filingType === "Separate applications per class";
  const needsImage = /Device|Combined/.test(form.markType);

  function validate(): string {
    if (!form.markName.trim()) return "Mark name is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!form.jurisdictionId) return "Choose a jurisdiction.";
    if (!form.proprietorId) return "Choose a proprietor.";
    if (!form.filingDate) return "Filing date is required.";
    if (needsImage && !form.markImage) return `A ${form.markType.toLowerCase()} must have the artwork exactly as filed.`;
    if (classes.length === 0) return "Add at least one class.";
    for (const [i, c] of classes.entries()) {
      const n = Number(c.classNumber);
      if (!Number.isFinite(n) || n < 1 || n > 45)
        return `Class ${i + 1}: the class number must be 1–45. 99 is a filing code, not a Nice class — enter the real classes.`;
      if (!c.specification.trim()) return `Class ${i + 1}: the specification as filed is required.`;
      if (perClass && !(c.applicationNumber ?? "").trim())
        return `Class ${i + 1}: this filing type needs an application number on every class.`;
    }
    if (!perClass && !(form.applicationNumber ?? "").trim())
      return "An application number is required for single- and multi-class filings.";
    return "";
  }

  async function handleSave() {
    const v = validate();
    if (v) { setError(v); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSaving(true); setError(""); setNote("");
    try {
      const clean: Omit<Trademark, "id"> = {
        ...form,
        slug: slugify(form.slug),
        classes: classes.map(c => ({
          ...c,
          classNumber: Number(c.classNumber),
          // Mark-level filings must not carry stray class-level numbers
          applicationNumber: perClass ? (c.applicationNumber ?? "").trim() : "",
        })),
        faqs: faqs.filter(f => f.question.trim() && f.answer.trim()),
        applicationNumber: perClass ? "" : (form.applicationNumber ?? "").trim(),
      };
      if (editing?.id) await trademarkService.update(editing.id, clean);
      else await trademarkService.create(clean);

      setNote(publishNote(await publish("trademarks", [`/trademarks/${clean.slug}`])));
      setSaved(true); setShowForm(false);
      load();
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this trademark record? This cannot be undone.")) return;
    const gone = items.find(m => m.id === id)?.slug;
    await trademarkService.delete(id);
    await publish("trademarks", gone ? [`/trademarks/${gone}`] : []);
    load();
  }

  async function move(index: number, dir: "up" | "down") {
    const arr = [...items];
    const t = dir === "up" ? index - 1 : index + 1;
    if (t < 0 || t >= arr.length) return;
    [arr[index], arr[t]] = [arr[t], arr[index]];
    for (let i = 0; i < arr.length; i++) await trademarkService.update(arr[i].id!, { sortOrder: i });
    await publish("trademarks", markPaths);
    load();
  }

  async function savePage() {
    setPageSaving(true); setError("");
    try {
      await trademarkPageService.save(page);
      await publish("trademarks", markPaths);
      setPageSaved(true); setTimeout(() => setPageSaved(false), 3000);
    } catch (err: any) { setError(err.message); }
    setPageSaving(false);
  }

  // Every published mark page. Page settings, ordering and reference data all
  // change what these render, so they are dropped alongside the index.
  const markPaths = items.filter(m => m.slug).map(m => `/trademarks/${m.slug}`);

  const jName = (id: string) => juris.find(j => j.id === id)?.countryName ?? "—";
  const pName = (id: string) => props.find(p => p.id === id)?.legalName ?? "—";

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Trademarks"
        subtitle="The public register at /trademarks and every mark record"
        action={
          <div className="flex items-center gap-3">
            <Link href="/trademarks" target="_blank"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ExternalLink size={14} /> View register
            </Link>
            {tab === "marks" && (
              <button onClick={openNew}
                className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                <Plus size={14} /> New mark
              </button>
            )}
          </div>
        }
      />

      {error && <Alert message={error} className="mb-6" />}
      {note && <Alert type="success" message={note} className="mb-6" />}

      <div className="flex flex-wrap gap-2 mb-6">
        {([["marks", "Marks"], ["page", "Page Settings"], ["refs", "Proprietors & Registries"]] as [Tab, string][])
          .map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                tab === k ? "bg-[#E22D2D] border-[#E22D2D] text-white"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"}`}>
              {label}
            </button>
          ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-white/30 text-sm">Loading…</div>
      ) : tab === "marks" ? (
        <>
          {showForm && (
            <Card className="mb-8">
              <SectionTitle>{editing ? `Edit ${editing.markName}` : "New mark"}</SectionTitle>

              {/* Derived symbol — deliberately read-only */}
              <div className="flex items-start gap-3 mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                <Lock size={15} className="text-amber-400 mt-0.5 shrink-0" />
                <div className="text-xs text-white/60 leading-relaxed">
                  This mark currently displays as{" "}
                  <span className="text-white font-mono">{form.markName || "…"}{markSymbol(form.status)}</span>.
                  The symbol is derived from Status and cannot be set by hand — using ® before a mark is
                  registered is an offence under s.107 of India&apos;s Trade Marks Act 1999 and s.95 of the
                  UK Trade Marks Act 1994. Change Status and the symbol follows.
                </div>
              </div>

              {/* Identity */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mark name" required>
                  <Input value={form.markName} onChange={e => set("markName", e.target.value)} placeholder="FourSix46" />
                </Field>
                <Field label="Slug" required hint="/trademarks/{slug} — include the type where a brand has both">
                  <Input value={form.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="46dogs-device-mark" />
                </Field>
                <Field label="Mark type" required>
                  <Select value={form.markType} onChange={e => set("markType", e.target.value)}>
                    {MARK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field label="Venture name" hint="Leave empty for a personal brand">
                  <Input value={form.ventureName ?? ""} onChange={e => set("ventureName", e.target.value)} placeholder="46 Dogs" />
                </Field>
                <Field label="Venture URL">
                  <Input value={form.ventureUrl ?? ""} onChange={e => set("ventureUrl", e.target.value)} placeholder="https://46dogs.com" />
                </Field>
                <Field label="Artwork background" hint="How the specimen box should sit behind the artwork">
                  <Select value={form.markImageBg ?? "Dark"} onChange={e => set("markImageBg", e.target.value)}>
                    <option value="Dark">Dark</option>
                    <option value="Light">Light</option>
                    <option value="Transparent">Transparent</option>
                  </Select>
                </Field>
              </div>

              {needsImage ? (
                <div className="mt-4">
                  <Field label="Mark artwork" required
                    hint="The artwork EXACTLY as filed — not a current logo variant.">
                    <ImageUpload value={form.markImage ?? ""} onChange={v => set("markImage", v)}
                      folder="trademarks" previewImageClass="h-48 object-contain bg-black/30" />
                  </Field>
                </div>
              ) : (
                <p className="text-xs text-white/30 mt-4 leading-relaxed">
                  Word marks need no image. The page renders the name in the display face with a caption
                  explaining that a word mark protects the name in any typeface.
                </p>
              )}

              {/* Registry particulars */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <SectionTitle>Registry particulars</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Jurisdiction" required>
                    <Select value={form.jurisdictionId} onChange={e => set("jurisdictionId", e.target.value)}>
                      <option value="">Choose…</option>
                      {juris.map(j => <option key={j.id} value={j.id}>{j.countryName} — {j.officeShort}</option>)}
                    </Select>
                  </Field>
                  <Field label="Proprietor" required hint="Both sites list all marks, so ownership is stated per record">
                    <Select value={form.proprietorId} onChange={e => set("proprietorId", e.target.value)}>
                      <option value="">Choose…</option>
                      {props.map(p => <option key={p.id} value={p.id}>{p.legalName}</option>)}
                    </Select>
                  </Field>
                  <Field label="Filing type" required
                    hint="Per-class puts the number on each class instead of the mark">
                    <Select value={form.filingType} onChange={e => set("filingType", e.target.value)}>
                      {FILING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </Field>
                  {!perClass && (
                    <Field label="Application number" required>
                      <Input value={form.applicationNumber ?? ""} onChange={e => set("applicationNumber", e.target.value)}
                        placeholder="UK00004301358" />
                    </Field>
                  )}
                  <Field label="Registration number" hint="Where the office issues a separate one">
                    <Input value={form.registrationNumber ?? ""} onChange={e => set("registrationNumber", e.target.value)} />
                  </Field>
                  <Field label="Filing date" required>
                    <Input type="date" value={form.filingDate} onChange={e => set("filingDate", e.target.value)} />
                  </Field>
                  <Field label="Registration date" hint="Empty until registered">
                    <Input type="date" value={form.registrationDate ?? ""} onChange={e => set("registrationDate", e.target.value)} />
                  </Field>
                  <Field label="Renewal due" hint="Internal only — never shown on the site">
                    <Input type="date" value={form.renewalDue ?? ""} onChange={e => set("renewalDue", e.target.value)} />
                  </Field>
                  <Field label="Official record URL" hint="Direct link, where the registry supports one">
                    <Input value={form.officialRecordUrl ?? ""} onChange={e => set("officialRecordUrl", e.target.value)} />
                  </Field>
                  <Field label="Journal URL">
                    <Input value={form.journalUrl ?? ""} onChange={e => set("journalUrl", e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Status */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <SectionTitle>Status</SectionTitle>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Status" required hint="Drives the ® / ™ symbol and the timeline">
                    <Select value={form.status} onChange={e => set("status", e.target.value)}>
                      {TRADEMARK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </Field>
                  <Field label="Status updated" required hint="Feeds 'Register last updated'">
                    <Input type="date" value={form.statusUpdated} onChange={e => set("statusUpdated", e.target.value)} />
                  </Field>
                  <Field label="Status note">
                    <Input value={form.statusNote ?? ""} onChange={e => set("statusNote", e.target.value)}
                      placeholder="multi-class application" />
                  </Field>
                </div>
              </div>

              {/* Classes */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <SectionTitle>Classes</SectionTitle>
                  <button type="button" onClick={addClass}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                    <Plus size={14} /> Add class
                  </button>
                </div>
                <div className="flex items-start gap-3 mb-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                  <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-white/60 leading-relaxed">
                    The specification is a legal instrument, not marketing copy. Paste the exact wording as
                    filed — never paraphrase or tidy it. A well-meaning edit changes what this page claims is
                    protected. Enter real Nice classes (1–45); never 99, which is a filing code.
                  </div>
                </div>

                <div className="space-y-5">
                  {classes.map((c, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                          Class {i + 1}
                        </span>
                        <button type="button" onClick={() => removeClass(i)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-2">
                          <Field label="Class no.">
                            <Input type="number" min={1} max={45} value={c.classNumber}
                              onChange={e => setClass(i, "classNumber", Number(e.target.value))} />
                          </Field>
                        </div>
                        <div className={perClass ? "col-span-6" : "col-span-10"}>
                          <Field label="Nice heading">
                            <Input value={c.classHeading} onChange={e => setClass(i, "classHeading", e.target.value)}
                              placeholder="Insurance; financial affairs; monetary affairs" />
                          </Field>
                        </div>
                        {perClass && (
                          <div className="col-span-4">
                            <Field label="Application no." required>
                              <Input value={c.applicationNumber ?? ""}
                                onChange={e => setClass(i, "applicationNumber", e.target.value)} placeholder="7573210" />
                            </Field>
                          </div>
                        )}
                        <div className="col-span-12">
                          <Field label="Specification as filed" required>
                            <Textarea value={c.specification} rows={4}
                              onChange={e => setClass(i, "specification", e.target.value)}
                              className="font-mono text-xs" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <SectionTitle>Narrative</SectionTitle>
                <div className="space-y-4">
                  <Field label="Summary" hint="The lede under the mark name">
                    <Textarea value={form.summary ?? ""} onChange={e => set("summary", e.target.value)} rows={2} />
                  </Field>
                  <Field label="Story" hint="Why this mark exists — 2–4 paragraphs, blank line between each">
                    <Textarea value={form.story ?? ""} onChange={e => set("story", e.target.value)} rows={8} />
                  </Field>
                  <Field label="Class note" hint="Explains the filing structure, e.g. why Cinevenn has four numbers">
                    <Textarea value={form.classNote ?? ""} onChange={e => set("classNote", e.target.value)} rows={2} />
                  </Field>
                </div>
              </div>

              {/* Usage */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <SectionTitle>Usage block</SectionTitle>
                <Toggle checked={form.usageEnabled ?? false} onChange={v => set("usageEnabled", v)}
                  label="Show the correct / incorrect usage block (device marks)" />
                {form.usageEnabled && (
                  <div className="space-y-4 mt-4">
                    <Field label="Usage intro">
                      <Textarea value={form.usageIntro ?? ""} onChange={e => set("usageIntro", e.target.value)} rows={2} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Correct">
                        <Textarea value={form.usageCorrect ?? ""} onChange={e => set("usageCorrect", e.target.value)} rows={3} />
                      </Field>
                      <Field label="Not permitted">
                        <Textarea value={form.usageIncorrect ?? ""} onChange={e => set("usageIncorrect", e.target.value)} rows={3} />
                      </Field>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQs */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <SectionTitle>FAQs</SectionTitle>
                  <button type="button" onClick={addFaq}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                    <Plus size={14} /> Add FAQ
                  </button>
                </div>
                <p className="text-xs text-white/30 mb-4 leading-relaxed">
                  4–6 per mark. Shown on the page and published as FAQPage structured data.
                </p>
                {faqs.length === 0 ? (
                  <p className="text-sm text-white/30">No FAQs on this mark.</p>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((f, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">FAQ {i + 1}</span>
                          <button type="button" onClick={() => removeFaq(i)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <Field label="Question">
                            <Input value={f.question} onChange={e => setFaq(i, "question", e.target.value)} />
                          </Field>
                          <Field label="Answer">
                            <Textarea value={f.answer} rows={3} onChange={e => setFaq(i, "answer", e.target.value)} />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEO + display */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <SectionTitle>SEO &amp; display</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Meta title" hint="Leave empty to build it from the mark, symbol and jurisdiction">
                    <Input value={form.seoTitle ?? ""} onChange={e => set("seoTitle", e.target.value)} />
                  </Field>
                  <Field label="Meta description">
                    <Input value={form.seoDescription ?? ""} onChange={e => set("seoDescription", e.target.value)} />
                  </Field>
                  <Field label="Sort order">
                    <Input type="number" min={0} value={form.sortOrder}
                      onChange={e => set("sortOrder", Number(e.target.value))} />
                  </Field>
                  <div className="flex flex-col gap-3 justify-end pb-1">
                    <Toggle checked={form.isPrimary ?? false} onChange={v => set("isPrimary", v)}
                      label="Primary mark (shown in the register hero panel)" />
                    <Toggle checked={form.showOnSite !== false} onChange={v => set("showOnSite", v)}
                      label="Show on the site" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <SaveButton loading={saving} saved={saved} onClick={handleSave} />
                <button onClick={() => { setShowForm(false); setError(""); }}
                  className="text-sm text-white/40 hover:text-white transition-colors">Cancel</button>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-12 text-center text-white/30 text-sm">No marks yet.</div>
            ) : items.map((m, i) => (
              <div key={m.id}
                className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors">
                <div className="flex flex-col gap-0.5 text-white/20">
                  <button onClick={() => move(i, "up")} disabled={i === 0}
                    className="hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
                  <button onClick={() => move(i, "down")} disabled={i === items.length - 1}
                    className="hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <div className="font-medium text-white text-sm">
                    {m.markName}<span className="text-white/40 font-mono text-xs ml-0.5">{markSymbol(m.status)}</span>
                    {m.isPrimary && <span className="ml-2 text-[9px] uppercase tracking-wider text-[#E22D2D]">Primary</span>}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{m.markType} · {jName(m.jurisdictionId)}</div>
                </div>
                <div className="text-xs text-white/40 font-mono min-w-[130px]">{applicationLabel(m)}</div>
                <div className="text-xs text-white/40 min-w-[150px] truncate">{pName(m.proprietorId)}</div>
                <div className="text-xs text-white/60 min-w-[150px]">{m.status}</div>
                {m.showOnSite === false && <span className="text-[10px] uppercase text-white/30">Hidden</span>}
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(m)}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(m.id!)}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : tab === "page" ? (
        <PageSettings page={page} setPage={setPage} onSave={savePage} saving={pageSaving} saved={pageSaved} />
      ) : (
        <RefData props={props} juris={juris} markPaths={markPaths} reload={load} />
      )}
    </div>
  );
}

// ── Page settings tab ────────────────────────────────────────────────────────
function PageSettings({ page, setPage, onSave, saving, saved }: {
  page: TrademarkPageMeta;
  setPage: (p: TrademarkPageMeta) => void;
  onSave: () => void; saving: boolean; saved: boolean;
}) {
  const set = (k: keyof TrademarkPageMeta, v: any) => setPage({ ...page, [k]: v });
  const cols = page.whyColumns ?? [];
  const rules = page.usageRules ?? [];
  const faqs = page.pageFaqs ?? [];

  return (
    <>
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Page header</SectionTitle>
          <SaveButton loading={saving} saved={saved} onClick={onSave} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow"><Input value={page.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} /></Field>
          <Field label="Heading"><Input value={page.heading ?? ""} onChange={e => set("heading", e.target.value)} /></Field>
          <Field label="Heading italic suffix"><Input value={page.headingItalic ?? ""} onChange={e => set("headingItalic", e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Lede"><Textarea value={page.lede ?? ""} onChange={e => set("lede", e.target.value)} rows={2} /></Field>
          </div>
          <div className="col-span-2">
            <Field label="Second lede"><Textarea value={page.lede2 ?? ""} onChange={e => set("lede2", e.target.value)} rows={2} /></Field>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Why section</SectionTitle>
          <button onClick={() => set("whyColumns", [...cols, { heading: "", body: "" }])}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <Plus size={14} /> Add column
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Heading"><Input value={page.whyHeading ?? ""} onChange={e => set("whyHeading", e.target.value)} /></Field>
          <Field label="Intro"><Textarea value={page.whyIntro ?? ""} onChange={e => set("whyIntro", e.target.value)} rows={2} /></Field>
        </div>
        <div className="space-y-3">
          {cols.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-start rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="col-span-4"><Field label="Heading">
                <Input value={c.heading} onChange={e => set("whyColumns", cols.map((x, ix) => ix === i ? { ...x, heading: e.target.value } : x))} />
              </Field></div>
              <div className="col-span-7"><Field label="Body">
                <Textarea rows={2} value={c.body} onChange={e => set("whyColumns", cols.map((x, ix) => ix === i ? { ...x, body: e.target.value } : x))} />
              </Field></div>
              <div className="col-span-1 pt-7">
                <button onClick={() => set("whyColumns", cols.filter((_, ix) => ix !== i))}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <SectionTitle>Register section</SectionTitle>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Heading"><Input value={page.registerHeading ?? ""} onChange={e => set("registerHeading", e.target.value)} /></Field>
            <Field label="Intro"><Textarea rows={2} value={page.registerIntro ?? ""} onChange={e => set("registerIntro", e.target.value)} /></Field>
          </div>
          <Field label="Empty-state text" hint="Shown when no marks are published"><Input value={page.registerEmpty ?? ""} onChange={e => set("registerEmpty", e.target.value)} /></Field>
          <Field label="Last-updated label" hint="Precedes the date under the register"><Input value={page.lastUpdatedLabel ?? ""} onChange={e => set("lastUpdatedLabel", e.target.value)} /></Field>
          <Field label="Footnote" hint="The ™ / ® legal note shown under the register">
            <Textarea rows={3} value={page.registerFootnote ?? ""} onChange={e => set("registerFootnote", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Usage section</SectionTitle>
          <button onClick={() => set("usageRules", [...rules, { lead: "", body: "" }])}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <Plus size={14} /> Add rule
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Heading"><Input value={page.usageHeading ?? ""} onChange={e => set("usageHeading", e.target.value)} /></Field>
          <Field label="Intro"><Textarea rows={2} value={page.usageIntro ?? ""} onChange={e => set("usageIntro", e.target.value)} /></Field>
        </div>
        <div className="space-y-3 mb-5">
          {rules.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-start rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="col-span-4"><Field label="Lead">
                <Input value={r.lead} onChange={e => set("usageRules", rules.map((x, ix) => ix === i ? { ...x, lead: e.target.value } : x))} />
              </Field></div>
              <div className="col-span-7"><Field label="Body">
                <Textarea rows={2} value={r.body} onChange={e => set("usageRules", rules.map((x, ix) => ix === i ? { ...x, body: e.target.value } : x))} />
              </Field></div>
              <div className="col-span-1 pt-7">
                <button onClick={() => set("usageRules", rules.filter((_, ix) => ix !== i))}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Correct examples" hint="One per line">
            <Textarea rows={4} value={(page.usageCorrect ?? []).join("\n")}
              onChange={e => set("usageCorrect", e.target.value.split("\n").filter(Boolean))} />
          </Field>
          <Field label="Incorrect examples" hint="One per line">
            <Textarea rows={4} value={(page.usageIncorrect ?? []).join("\n")}
              onChange={e => set("usageIncorrect", e.target.value.split("\n").filter(Boolean))} />
          </Field>
        </div>
      </Card>

      <Card className="mb-6">
        <Field label="FAQ section heading"><Input value={page.faqHeading ?? ""} onChange={e => set("faqHeading", e.target.value)} /></Field>
        <div className="flex items-center justify-between mb-4 mt-6">
          <SectionTitle>Register-wide FAQs</SectionTitle>
          <button onClick={() => set("pageFaqs", [...faqs, { question: "", answer: "" }])}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <Plus size={14} /> Add FAQ
          </button>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">FAQ {i + 1}</span>
                <button onClick={() => set("pageFaqs", faqs.filter((_, ix) => ix !== i))}
                  className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
              </div>
              <div className="space-y-3">
                <Field label="Question">
                  <Input value={f.question} onChange={e => set("pageFaqs", faqs.map((x, ix) => ix === i ? { ...x, question: e.target.value } : x))} />
                </Field>
                <Field label="Answer">
                  <Textarea rows={3} value={f.answer} onChange={e => set("pageFaqs", faqs.map((x, ix) => ix === i ? { ...x, answer: e.target.value } : x))} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Shared wording for every /trademarks/{slug} page. Kept here rather than
          on each mark so the headings stay identical across the register. */}
      <Card className="mb-6">
        <SectionTitle>Individual mark pages</SectionTitle>
        <p className="text-xs text-white/30 mb-4 leading-relaxed">
          Section headings used on every mark page. Leave a field empty to keep the built-in wording.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Story heading"><Input value={page.markStoryHeading ?? ""} onChange={e => set("markStoryHeading", e.target.value)} /></Field>
          <Field label="Classes heading"><Input value={page.markClassesHeading ?? ""} onChange={e => set("markClassesHeading", e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Classes intro"><Textarea rows={2} value={page.markClassesIntro ?? ""} onChange={e => set("markClassesIntro", e.target.value)} /></Field>
          </div>
          <Field label="Timeline heading"><Input value={page.markTimelineHeading ?? ""} onChange={e => set("markTimelineHeading", e.target.value)} /></Field>
          <Field label="Usage heading"><Input value={page.markUsageHeading ?? ""} onChange={e => set("markUsageHeading", e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Timeline intro"><Textarea rows={2} value={page.markTimelineIntro ?? ""} onChange={e => set("markTimelineIntro", e.target.value)} /></Field>
          </div>
          <Field label="Verification heading"><Input value={page.markVerifyHeading ?? ""} onChange={e => set("markVerifyHeading", e.target.value)} /></Field>
          <Field label="Related-marks heading"><Input value={page.markRelatedHeading ?? ""} onChange={e => set("markRelatedHeading", e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Verification intro"><Textarea rows={2} value={page.markVerifyIntro ?? ""} onChange={e => set("markVerifyIntro", e.target.value)} /></Field>
          </div>
          <Field label="Mark FAQ heading"><Input value={page.markFaqHeading ?? ""} onChange={e => set("markFaqHeading", e.target.value)} /></Field>
          <div />
          <div className="col-span-2">
            <Field label="Word mark caption" hint="Shown under the specimen on word marks">
              <Textarea rows={2} value={page.wordMarkNote ?? ""} onChange={e => set("wordMarkNote", e.target.value)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Device mark caption" hint="Shown under the specimen on device and combined marks">
              <Textarea rows={2} value={page.deviceMarkNote ?? ""} onChange={e => set("deviceMarkNote", e.target.value)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Missing specification note" hint="Shown for a class whose filed wording has not been entered yet">
              <Textarea rows={2} value={page.specificationFallback ?? ""} onChange={e => set("specificationFallback", e.target.value)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Manual-search note" hint="Registries without a direct link. {number} is replaced by the application number">
              <Textarea rows={2} value={page.manualSearchNote ?? ""} onChange={e => set("manualSearchNote", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <SectionTitle>Verification cards</SectionTitle>
          <p className="text-xs text-white/30 mb-4 leading-relaxed">
            The three &ldquo;check this for yourself&rdquo; cards. Use{" "}
            <code className="text-white/60">{"{office}"}</code>,{" "}
            <code className="text-white/60">{"{venture}"}</code> and{" "}
            <code className="text-white/60">{"{proprietor}"}</code> — each is replaced with the value on the mark being viewed.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Register card title"><Input value={page.verifyRegisterTitle ?? ""} onChange={e => set("verifyRegisterTitle", e.target.value)} /></Field>
            <Field label="Register card body"><Input value={page.verifyRegisterBody ?? ""} onChange={e => set("verifyRegisterBody", e.target.value)} /></Field>
            <Field label="Venture card title"><Input value={page.verifyVentureTitle ?? ""} onChange={e => set("verifyVentureTitle", e.target.value)} /></Field>
            <Field label="Venture card body"><Input value={page.verifyVentureBody ?? ""} onChange={e => set("verifyVentureBody", e.target.value)} /></Field>
            <Field label="Proprietor card title"><Input value={page.verifyProprietorTitle ?? ""} onChange={e => set("verifyProprietorTitle", e.target.value)} /></Field>
            <Field label="Proprietor card body"><Input value={page.verifyProprietorBody ?? ""} onChange={e => set("verifyProprietorBody", e.target.value)} /></Field>
          </div>
        </div>
      </Card>

      {/* Short labels. Nothing on the public pages is hardcoded, so these are
          the words on the register table, the panels and the buttons. */}
      <Card className="mb-6">
        <SectionTitle>Register table &amp; panel labels</SectionTitle>
        <p className="text-xs text-white/30 mb-4 leading-relaxed">
          Column headings on the register, and the field labels used on the summary panels.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Column: mark"><Input value={page.colMark ?? ""} onChange={e => set("colMark", e.target.value)} /></Field>
          <Field label="Column: proprietor"><Input value={page.colProprietor ?? ""} onChange={e => set("colProprietor", e.target.value)} /></Field>
          <Field label="Column: status"><Input value={page.colStatus ?? ""} onChange={e => set("colStatus", e.target.value)} /></Field>
          <Field label="Column: application"><Input value={page.colApplication ?? ""} onChange={e => set("colApplication", e.target.value)} /></Field>
          <Field label="Column: classes"><Input value={page.colClasses ?? ""} onChange={e => set("colClasses", e.target.value)} /></Field>
          <Field label="Row action button"><Input value={page.colAction ?? ""} onChange={e => set("colAction", e.target.value)} /></Field>
          <Field label="Count word (one)"><Input value={page.countOne ?? ""} onChange={e => set("countOne", e.target.value)} /></Field>
          <Field label="Count word (many)"><Input value={page.countMany ?? ""} onChange={e => set("countMany", e.target.value)} /></Field>
          <Field label="Primary panel label"><Input value={page.primaryPanelLabel ?? ""} onChange={e => set("primaryPanelLabel", e.target.value)} /></Field>
          <Field label="Counter: total marks"><Input value={page.statMarksLabel ?? ""} onChange={e => set("statMarksLabel", e.target.value)} /></Field>
          <Field label="Counter: registered"><Input value={page.statRegisteredLabel ?? ""} onChange={e => set("statRegisteredLabel", e.target.value)} /></Field>
          <Field label="Counter: offices"><Input value={page.statOfficesLabel ?? ""} onChange={e => set("statOfficesLabel", e.target.value)} /></Field>
          <Field label="Usage examples label"><Input value={page.usageExamplesLabel ?? ""} onChange={e => set("usageExamplesLabel", e.target.value)} /></Field>
          <Field label="Particulars panel label"><Input value={page.particularsLabel ?? ""} onChange={e => set("particularsLabel", e.target.value)} /></Field>
          <Field label="Specification label"><Input value={page.specificationLabel ?? ""} onChange={e => set("specificationLabel", e.target.value)} /></Field>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <SectionTitle>Field labels</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Mark"><Input value={page.labelMark ?? ""} onChange={e => set("labelMark", e.target.value)} /></Field>
            <Field label="Type"><Input value={page.labelType ?? ""} onChange={e => set("labelType", e.target.value)} /></Field>
            <Field label="Number"><Input value={page.labelNumber ?? ""} onChange={e => set("labelNumber", e.target.value)} /></Field>
            <Field label="Office"><Input value={page.labelOffice ?? ""} onChange={e => set("labelOffice", e.target.value)} /></Field>
            <Field label="Classes"><Input value={page.labelClasses ?? ""} onChange={e => set("labelClasses", e.target.value)} /></Field>
            <Field label="Status"><Input value={page.labelStatus ?? ""} onChange={e => set("labelStatus", e.target.value)} /></Field>
            <Field label="Registration"><Input value={page.labelRegistration ?? ""} onChange={e => set("labelRegistration", e.target.value)} /></Field>
            <Field label="Proprietor"><Input value={page.labelProprietor ?? ""} onChange={e => set("labelProprietor", e.target.value)} /></Field>
            <Field label="Filed"><Input value={page.labelFiled ?? ""} onChange={e => set("labelFiled", e.target.value)} /></Field>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <SectionTitle>Mark page buttons &amp; breadcrumb</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Verify button prefix" hint="Followed by the office short name">
              <Input value={page.verifyButtonPrefix ?? ""} onChange={e => set("verifyButtonPrefix", e.target.value)} />
            </Field>
            <Field label="Open register prefix"><Input value={page.openRegisterPrefix ?? ""} onChange={e => set("openRegisterPrefix", e.target.value)} /></Field>
            <Field label="Visit venture prefix"><Input value={page.visitVenturePrefix ?? ""} onChange={e => set("visitVenturePrefix", e.target.value)} /></Field>
            <Field label="Proprietor button"><Input value={page.proprietorCtaLabel ?? ""} onChange={e => set("proprietorCtaLabel", e.target.value)} /></Field>
            <Field label="Correct heading"><Input value={page.correctLabel ?? ""} onChange={e => set("correctLabel", e.target.value)} /></Field>
            <Field label="Not-permitted heading"><Input value={page.notPermittedLabel ?? ""} onChange={e => set("notPermittedLabel", e.target.value)} /></Field>
            <Field label="Breadcrumb: home"><Input value={page.breadcrumbHome ?? ""} onChange={e => set("breadcrumbHome", e.target.value)} /></Field>
            <Field label="Breadcrumb: register"><Input value={page.breadcrumbRegister ?? ""} onChange={e => set("breadcrumbRegister", e.target.value)} /></Field>
            <Field label="Closed-application note" hint="Shown on the timeline for a lapsed, withdrawn or refused mark">
              <Input value={page.closedStageNote ?? ""} onChange={e => set("closedStageNote", e.target.value)} />
            </Field>
            <div className="col-span-3">
              <Field label="Specification fallback suffix" hint="Appended when a registry link exists">
                <Input value={page.specificationFallbackSuffix ?? ""} onChange={e => set("specificationFallbackSuffix", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <SectionTitle>Cross-site &amp; SEO</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Cross-site heading"><Input value={page.crossSiteHeading ?? ""} onChange={e => set("crossSiteHeading", e.target.value)} /></Field>
          <Field label="Cross-site URL"><Input value={page.crossSiteUrl ?? ""} onChange={e => set("crossSiteUrl", e.target.value)} /></Field>
          <Field label="Cross-site button label"><Input value={page.crossSiteCta ?? ""} onChange={e => set("crossSiteCta", e.target.value)} /></Field>
          <div />
          <div className="col-span-2">
            <Field label="Cross-site body"><Textarea rows={2} value={page.crossSiteBody ?? ""} onChange={e => set("crossSiteBody", e.target.value)} /></Field>
          </div>
          <Field label="Meta title"><Input value={page.seoTitle ?? ""} onChange={e => set("seoTitle", e.target.value)} /></Field>
          <Field label="Meta description"><Input value={page.seoDescription ?? ""} onChange={e => set("seoDescription", e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Mark page title pattern" hint="Used when a mark has no meta title of its own. {mark}, {symbol} and {country} are substituted.">
              <Input value={page.markTitlePattern ?? ""} onChange={e => set("markTitlePattern", e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <SaveButton loading={saving} saved={saved} onClick={onSave} />
    </>
  );
}

// ── Reference data tab ───────────────────────────────────────────────────────
function RefData({ props, juris, markPaths, reload }: {
  props: Proprietor[]; juris: Jurisdiction[]; markPaths: string[]; reload: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [pForm, setPForm] = useState<Proprietor | null>(null);
  const [jForm, setJForm] = useState<Jurisdiction | null>(null);

  async function saveP() {
    if (!pForm) return;
    setBusy(true);
    await proprietorService.save(pForm.id || slugify(pForm.displayName), pForm);
    await publish("trademarks", markPaths);
    setPForm(null); setBusy(false); reload();
  }
  async function saveJ() {
    if (!jForm) return;
    setBusy(true);
    await jurisdictionService.save(jForm.id || jForm.countryCode.toLowerCase(), jForm);
    await publish("trademarks", markPaths);
    setJForm(null); setBusy(false); reload();
  }

  return (
    <>
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Proprietors</SectionTitle>
          <button onClick={() => setPForm({ legalName: "", displayName: "", entityType: "Company", sortOrder: props.length })}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <Plus size={14} /> Add proprietor
          </button>
        </div>
        <p className="text-xs text-white/30 mb-4 leading-relaxed">
          Keep the legal name and display name distinct. Indian filings are recorded as
          &ldquo;Koyyalamudi Dinesh Chandra&rdquo;, not Dinesh Koyyalamudi. Records show the legal name so
          anyone cross-checking the register finds a match; prose uses the display name.
        </p>

        {pForm && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Legal name" required hint="EXACTLY as recorded at the registry">
                <Input value={pForm.legalName} onChange={e => setPForm({ ...pForm, legalName: e.target.value })} />
              </Field>
              <Field label="Display name" required hint="Readable form used in prose">
                <Input value={pForm.displayName} onChange={e => setPForm({ ...pForm, displayName: e.target.value })} />
              </Field>
              <Field label="Entity type">
                <Select value={pForm.entityType} onChange={e => setPForm({ ...pForm, entityType: e.target.value as any })}>
                  {["Company", "Individual", "Charity", "Trust"].map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Registration number" hint="Companies House / charity number">
                <Input value={pForm.registrationNumber ?? ""} onChange={e => setPForm({ ...pForm, registrationNumber: e.target.value })} />
              </Field>
              <Field label="Verify URL">
                <Input value={pForm.verifyUrl ?? ""} onChange={e => setPForm({ ...pForm, verifyUrl: e.target.value })} />
              </Field>
              <Field label="Short bio">
                <Input value={pForm.bioShort ?? ""} onChange={e => setPForm({ ...pForm, bioShort: e.target.value })} />
              </Field>
            </div>
            <div className="flex gap-3 mt-4">
              <SaveButton loading={busy} saved={false} onClick={saveP} />
              <button onClick={() => setPForm(null)} className="text-sm text-white/40 hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {props.map(p => (
            <div key={p.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <div className="flex-1">
                <div className="text-white text-sm font-mono">{p.legalName}</div>
                <div className="text-white/40 text-xs mt-0.5">{p.displayName} · {p.entityType}{p.registrationNumber ? ` · ${p.registrationNumber}` : ""}</div>
              </div>
              <button onClick={() => setPForm(p)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10"><Pencil size={14} /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Registry offices</SectionTitle>
          <button onClick={() => setJForm({ countryName: "", countryCode: "", officeName: "", officeShort: "", officeUrl: "", deepLinkSupported: false, sortOrder: juris.length })}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <Plus size={14} /> Add registry
          </button>
        </div>

        {jForm && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country" required><Input value={jForm.countryName} onChange={e => setJForm({ ...jForm, countryName: e.target.value })} /></Field>
              <Field label="Country code" required hint="ISO alpha-2 — GB, IN">
                <Input value={jForm.countryCode} onChange={e => setJForm({ ...jForm, countryCode: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Office name" required><Input value={jForm.officeName} onChange={e => setJForm({ ...jForm, officeName: e.target.value })} /></Field>
              <Field label="Office short" required hint="Used on buttons — UK IPO"><Input value={jForm.officeShort} onChange={e => setJForm({ ...jForm, officeShort: e.target.value })} /></Field>
              <Field label="Office URL" required><Input value={jForm.officeUrl} onChange={e => setJForm({ ...jForm, officeUrl: e.target.value })} /></Field>
              <Field label="Record URL pattern" hint="Use {application_number} as the placeholder">
                <Input value={jForm.recordUrlPattern ?? ""} onChange={e => setJForm({ ...jForm, recordUrlPattern: e.target.value })} />
              </Field>
              <div className="col-span-2">
                <Toggle checked={jForm.deepLinkSupported} onChange={v => setJForm({ ...jForm, deepLinkSupported: v })}
                  label="Registry supports direct record links" />
                <p className="text-xs text-white/30 mt-2 leading-relaxed">
                  Leave this OFF for IP India — their public search is session-based, so the verify button
                  points at the search page and the page shows the number for manual entry.
                </p>
              </div>
            </div>

            {/* Stage sequence — this is what the timeline on every mark page is
                built from. Each stage's status must match a status option on a
                mark, which is how the current position is found. */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <SectionTitle>Application stages</SectionTitle>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setJForm({ ...jForm, stages: jForm.countryCode === "GB" ? [...SEED_STAGES_GB] : [...SEED_STAGES_IN] })}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                    <RotateCcw size={14} /> Load standard sequence
                  </button>
                  <button
                    onClick={() => setJForm({ ...jForm, stages: [...(jForm.stages ?? []), { status: "Filed", title: "", description: "" }] })}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                    <Plus size={14} /> Add stage
                  </button>
                </div>
              </div>
              <p className="text-xs text-white/30 mb-4 leading-relaxed">
                In order, earliest first. A mark sits at the stage matching its status; everything
                before is shown complete and everything after is shown as expected. Vienna
                codification is skipped automatically for anything that is not a device or combined mark.
              </p>
              <div className="space-y-3">
                {(jForm.stages ?? []).map((st, i) => (
                  <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Stage {i + 1}</span>
                      <button
                        onClick={() => setJForm({ ...jForm, stages: (jForm.stages ?? []).filter((_, ix) => ix !== i) })}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Status it maps to">
                        <Select value={st.status}
                          onChange={e => setJForm({ ...jForm, stages: (jForm.stages ?? []).map((x, ix) => ix === i ? { ...x, status: e.target.value } : x) })}>
                          {TRADEMARK_STATUSES.map(o => <option key={o} value={o}>{o}</option>)}
                        </Select>
                      </Field>
                      <Field label="Stage title">
                        <Input value={st.title}
                          onChange={e => setJForm({ ...jForm, stages: (jForm.stages ?? []).map((x, ix) => ix === i ? { ...x, title: e.target.value } : x) })} />
                      </Field>
                      <div className="col-span-2">
                        <Field label="What happens at this stage">
                          <Textarea rows={2} value={st.description}
                            onChange={e => setJForm({ ...jForm, stages: (jForm.stages ?? []).map((x, ix) => ix === i ? { ...x, description: e.target.value } : x) })} />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
                {(jForm.stages ?? []).length === 0 && (
                  <p className="text-white/30 text-sm py-4">
                    No stages yet — mark pages for this office will show no timeline.
                    Use &ldquo;Load standard sequence&rdquo; to start from the published process.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <SaveButton loading={busy} saved={false} onClick={saveJ} />
              <button onClick={() => setJForm(null)} className="text-sm text-white/40 hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {juris.map(j => (
            <div key={j.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <div className="flex-1">
                <div className="text-white text-sm">{j.countryName} <span className="text-white/30 font-mono text-xs">{j.countryCode}</span></div>
                <div className="text-white/40 text-xs mt-0.5">
                  {j.officeName} · {j.deepLinkSupported ? "direct links" : "manual search"} · {(j.stages ?? []).length} stages
                </div>
              </div>
              <button onClick={() => setJForm(j)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10"><Pencil size={14} /></button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
