"use client";
import { useEffect, useState } from "react";
import { homeService } from "@/lib/firebase-services";
import type { HomePage } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, SaveButton,
  Alert, Card, SectionTitle, ImageUpload, Toggle,
} from "../components/ui";

const DEFAULT: Omit<HomePage, "id"> = {
  heroTitle: "IT'S ME", heroName: "Dinesh Koyyalamudi",
  heroSubtitle: "", heroBackground: "", heroBackgroundVideo: "",
  heroImageAlt: "Dinesh Koyyalamudi",
  primaryCtaLabel: "Schedule a Call", primaryCtaUrl: "/contact",
  secondaryCtaLabel: "", secondaryCtaUrl: "",
  featuredQuoteText: "", featuredQuoteSource: "Dinesh Koyyalamudi",
  personalIntro: { quote: "", body: "", linkText: "Learn More About Me", linkUrl: "/about" },
  ethos: {
    phrase: "",
    principles: [
      { id: "01", label: "PRINCIPLE 01", title: "", description: "", color: "#E22D2D" },
    ],
  },
  venturesEyebrow: "Portfolio Showcase",
  venturesHeading: "Building the",
  venturesHeadingItalic: "Invisible",
  showVentures: true, showBlog: true, showPress: true,
  showManifestoTeaser: true, showFaq: true, showNewsletter: true,
  seoTitle: "", seoDescription: "", seoOgImage: "",
};

export default function HomeAdmin() {
  const [form, setForm] = useState<Omit<HomePage, "id">>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    homeService.get().then(data => {
      if (data) { const { id: _, ...rest } = data; setForm(rest); }
      setLoading(false);
    });
  }, []);

  function set(key: keyof typeof form, val: any) {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await homeService.save(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <AdminPageHeader
        title="Home Page"
        subtitle="Edit hero, CTAs, intro, ethos and section visibility"
        action={<SaveButton loading={saving} saved={saved} onClick={handleSave} />}
      />
      {error && <Alert message={error} className="mb-6" />}

      <div className="space-y-6">
        {/* Hero */}
        <Card>
          <SectionTitle>Hero Section</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hero Title (eyebrow)">
              <Input value={form.heroTitle} onChange={e => set("heroTitle", e.target.value)} placeholder="IT'S ME" />
            </Field>
            <Field label="Hero Name">
              <Input value={form.heroName} onChange={e => set("heroName", e.target.value)} />
            </Field>
            <div className="col-span-2">
              <Field label="Hero Subtitle / Mission">
                <Textarea value={form.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} rows={2} />
              </Field>
            </div>
            <Field label="Primary CTA Label">
              <Input value={form.primaryCtaLabel} onChange={e => set("primaryCtaLabel", e.target.value)} />
            </Field>
            <Field label="Primary CTA URL">
              <Input value={form.primaryCtaUrl} onChange={e => set("primaryCtaUrl", e.target.value)} />
            </Field>
            <Field label="Secondary CTA Label">
              <Input value={form.secondaryCtaLabel || ""} onChange={e => set("secondaryCtaLabel", e.target.value)} />
            </Field>
            <Field label="Secondary CTA URL">
              <Input value={form.secondaryCtaUrl || ""} onChange={e => set("secondaryCtaUrl", e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Hero Background Image">
              <ImageUpload value={form.heroBackground} onChange={v => set("heroBackground", v)} folder="hero" />
            </Field>
          </div>
        </Card>


        {/* Featured Quote */}
        <Card>
          <SectionTitle>Featured Quote</SectionTitle>
          <div className="space-y-4">
            <Field label="Quote Text">
              <Textarea value={form.featuredQuoteText} onChange={e => set("featuredQuoteText", e.target.value)} rows={2} />
            </Field>
            <Field label="Quote Source">
              <Input value={form.featuredQuoteSource} onChange={e => set("featuredQuoteSource", e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Personal Intro */}
        <Card>
          <SectionTitle>Personal Intro Block</SectionTitle>
          <div className="space-y-4">
            <Field label="Intro Quote">
              <Textarea value={form.personalIntro.quote} onChange={e => set("personalIntro", { ...form.personalIntro, quote: e.target.value })} rows={3} />
            </Field>
            <Field label="Body Text">
              <Textarea value={form.personalIntro.body} onChange={e => set("personalIntro", { ...form.personalIntro, body: e.target.value })} rows={3} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Link Text">
                <Input value={form.personalIntro.linkText} onChange={e => set("personalIntro", { ...form.personalIntro, linkText: e.target.value })} />
              </Field>
              <Field label="Link URL">
                <Input value={form.personalIntro.linkUrl} onChange={e => set("personalIntro", { ...form.personalIntro, linkUrl: e.target.value })} />
              </Field>
            </div>
          </div>
        </Card>

        {/* Ethos / Principles */}
        <Card>
          <SectionTitle>Ethos Section</SectionTitle>
          <Field label="Ethos Phrase">
            <Textarea value={form.ethos.phrase} onChange={e => set("ethos", { ...form.ethos, phrase: e.target.value })} rows={3} />
          </Field>
          <div className="mt-4">
            <p className="text-xs text-white/40 mb-3 font-mono uppercase tracking-wider">Principles</p>
            {form.ethos.principles.map((p, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40 font-mono">Principle {i + 1}</span>
                  <button onClick={() => set("ethos", { ...form.ethos, principles: form.ethos.principles.filter((_, j) => j !== i) })}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  ><Trash2 size={12} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ID"><Input value={p.id} onChange={e => { const ps = [...form.ethos.principles]; ps[i] = { ...ps[i], id: e.target.value }; set("ethos", { ...form.ethos, principles: ps }); }} /></Field>
                  <Field label="Label"><Input value={p.label} onChange={e => { const ps = [...form.ethos.principles]; ps[i] = { ...ps[i], label: e.target.value }; set("ethos", { ...form.ethos, principles: ps }); }} /></Field>
                  <Field label="Title"><Input value={p.title} onChange={e => { const ps = [...form.ethos.principles]; ps[i] = { ...ps[i], title: e.target.value }; set("ethos", { ...form.ethos, principles: ps }); }} /></Field>
                  <Field label="Color (hex)"><Input value={p.color} onChange={e => { const ps = [...form.ethos.principles]; ps[i] = { ...ps[i], color: e.target.value }; set("ethos", { ...form.ethos, principles: ps }); }} /></Field>
                  <div className="col-span-2"><Field label="Description"><Input value={p.description} onChange={e => { const ps = [...form.ethos.principles]; ps[i] = { ...ps[i], description: e.target.value }; set("ethos", { ...form.ethos, principles: ps }); }} /></Field></div>
                </div>
              </div>
            ))}
            <button onClick={() => set("ethos", { ...form.ethos, principles: [...form.ethos.principles, { id: `0${form.ethos.principles.length + 1}`, label: "", title: "", description: "", color: "#E22D2D" }] })}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            ><Plus size={14} /> Add Principle</button>
          </div>
        </Card>

        {/* Ventures Section Text */}
        <Card>
          <SectionTitle>Ventures Section</SectionTitle>
          <div className="space-y-3">
            <Field label="Eyebrow Label" hint="Small text above heading e.g. Portfolio Showcase">
              <Input value={(form as any).venturesEyebrow || ""} onChange={e => set("venturesEyebrow" as any, e.target.value)} placeholder="Portfolio Showcase" />
            </Field>
            <Field label="Heading" hint="Main heading e.g. Building the">
              <Input value={(form as any).venturesHeading || ""} onChange={e => set("venturesHeading" as any, e.target.value)} placeholder="Building the" />
            </Field>
            <Field label="Heading Italic Part" hint="Styled part e.g. Invisible">
              <Input value={(form as any).venturesHeadingItalic || ""} onChange={e => set("venturesHeadingItalic" as any, e.target.value)} placeholder="Invisible" />
            </Field>
          </div>
        </Card>

        {/* Section Visibility */}
        <Card>
          <SectionTitle>Section Visibility Toggles</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Toggle checked={form.showVentures} onChange={v => set("showVentures", v)} label="Show Ventures Section" />
            <Toggle checked={form.showBlog} onChange={v => set("showBlog", v)} label="Show Blog Section" />
            <Toggle checked={form.showPress} onChange={v => set("showPress", v)} label="Show Press Logos" />
            <Toggle checked={form.showManifestoTeaser} onChange={v => set("showManifestoTeaser", v)} label="Show Manifesto Teaser" />
            <Toggle checked={form.showFaq} onChange={v => set("showFaq", v)} label="Show FAQ Preview" />
            <Toggle checked={form.showNewsletter} onChange={v => set("showNewsletter", v)} label="Show Newsletter" />
          </div>
        </Card>
        {/* Blog Section Headings */}
<Card>
  <SectionTitle>Blog Section Headings</SectionTitle>
  <div className="space-y-4">
    <Field label="Eyebrow (Thought Pulse)">
      <Input value={form.blogSectionEyebrow || ""} onChange={e => set("blogSectionEyebrow", e.target.value)} placeholder="Thought Pulse" />
    </Field>
    <Field label="Title (What's On My Mind)">
      <Input value={form.blogSectionTitle || ""} onChange={e => set("blogSectionTitle", e.target.value)} placeholder="What's On My Mind" />
    </Field>
  </div>
</Card>

{/* Manifesto Teaser */}
<Card>
  <SectionTitle>Manifesto Teaser Section</SectionTitle>
  <div className="space-y-4">
    <Field label="Eyebrow">
      <Input value={form.manifestoTeaserEyebrow || ""} onChange={e => set("manifestoTeaserEyebrow", e.target.value)} placeholder="The Core Conviction" />
    </Field>
    <Field label="Quote">
      <Textarea value={form.manifestoTeaserQuote || ""} onChange={e => set("manifestoTeaserQuote", e.target.value)} rows={3} placeholder="I believe the best companies are built..." />
    </Field>
  </div>
</Card>

{/* FAQ Section Headings */}
<Card>
  <SectionTitle>FAQ Section Headings</SectionTitle>
  <div className="space-y-4">
    <Field label="Eyebrow">
      <Input value={form.faqSectionEyebrow || ""} onChange={e => set("faqSectionEyebrow", e.target.value)} placeholder="Knowledge Base" />
    </Field>
    <Field label="Title">
      <Input value={form.faqSectionTitle || ""} onChange={e => set("faqSectionTitle", e.target.value)} placeholder="Frequently Asked Questions" />
    </Field>
    <Field label="Description">
      <Textarea value={form.faqSectionDescription || ""} onChange={e => set("faqSectionDescription", e.target.value)} rows={2} placeholder="Quick insights into..." />
    </Field>
  </div>
</Card>

        {/* Home Page SEO */}
        <Card>
          <SectionTitle>Page SEO</SectionTitle>
          <p className="text-xs text-white/40 mb-4">Overrides the global SEO defaults for the home page specifically.</p>
          <div className="space-y-4">
            <Field label="SEO Title" hint="Shown in browser tab and Google search results">
              <Input
                value={(form as any).seoTitle || ""}
                onChange={e => set("seoTitle" as any, e.target.value)}
                placeholder="Dinesh Koyyalamudi | Strategic Visionary & Venture Builder"
              />
            </Field>
            <Field label="SEO Description" hint="~155 characters shown under title in Google">
              <Textarea
                value={(form as any).seoDescription || ""}
                onChange={e => set("seoDescription" as any, e.target.value)}
                rows={3}
                placeholder="Official platform of Dinesh Koyyalamudi..."
              />
            </Field>
            <Field label="OG Image" hint="Preview image when shared on social media">
              <ImageUpload
                value={(form as any).seoOgImage || ""}
                onChange={v => set("seoOgImage" as any, v)}
                folder="seo"
              />
            </Field>
          </div>
        </Card>

        <SaveButton loading={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}
