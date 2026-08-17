"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { homeService } from "@/lib/firebase-services";
import type { HomePage } from "@/lib/types";
import { Plus, Trash2, Globe, ArrowRight } from "lucide-react";
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
  featuredBlogSlug: "", featuredBlogTitle: "",
  featuredPressUrl: "", featuredPressTitle: "",
  box1Label: "Featured Journal", box1Title: "",
  box2Label: "Featured Press", box2Title: "",
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
  stat1Value: "600+", stat1Label: "Projects Done",
  stat2Value: "50+", stat2Label: "Brand Partnerships",
  stat3Value: "12+", stat3Label: "Years Experience",
  manifestoTeaserEyebrow: "The Core Conviction",
  manifestoTeaserQuote: "I believe the best companies are built not just on ideas, but on conviction.",
  manifestoTeaserCtaLabel: "Read My Manifesto",
  manifestoTeaserCtaUrl: "/manifesto",
  faqSectionEyebrow: "Knowledge Base",
  faqSectionHeading: "Frequently Asked",
  faqSectionHeadingItalic: "Questions.",
  faqSectionSubtext: "Quick insights into the architecture, vision, and operations of our venture studio.",
  blogSectionEyebrow: "Thought Pulse",
  blogSectionHeading: "What's On My",
  blogSectionHeadingItalic: "Mind",
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
              <ImageUpload
                value={form.heroBackground}
                onChange={v => set("heroBackground", v)}
                folder="hero"
                previewImageClass="h-52 md:h-72 object-contain bg-black/20"
              />
            </Field>
          </div>
        </Card>

        {/* Featured Quote Section */}
        <Card>
          <SectionTitle>Featured Quote Section</SectionTitle>
          <p className="text-xs text-white/40 mb-4">
            Standalone section between Hero and Personal Intro. The quote appears large and centred with decorative marks. The two cards below it link to featured content.
          </p>
          <div className="space-y-4">
            <Field label="Quote Text" hint="Shown large and italic — leave empty to hide the section">
              <Textarea
                value={form.featuredQuoteText}
                onChange={e => set("featuredQuoteText", e.target.value)}
                rows={2}
                placeholder='"The best companies are built not just on ideas, but on conviction."'
              />
            </Field>
            <Field label="Quote Source" hint="Attribution line e.g. Dinesh Koyyalamudi">
              <Input
                value={form.featuredQuoteSource}
                onChange={e => set("featuredQuoteSource", e.target.value)}
                placeholder="Dinesh Koyyalamudi"
              />
            </Field>
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Info Cards (shown below quote — no links)</p>
              <div className="grid grid-cols-1 gap-4">
                {/* Box 1 */}
                <div className="border border-white/10 rounded-lg p-4">
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-3">Box 1</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Eyebrow Label" hint="Small label at the top e.g. Featured Journal">
                      <Input
                        value={(form as any).box1Label || ""}
                        onChange={e => set("box1Label" as any, e.target.value)}
                        placeholder="Featured Journal"
                      />
                    </Field>
                    <Field label="Title / Info" hint="Main text displayed in the card">
                      <Input
                        value={(form as any).box1Title || ""}
                        onChange={e => set("box1Title" as any, e.target.value)}
                        placeholder="e.g. Building Resilient Systems"
                      />
                    </Field>
                  </div>
                </div>
                {/* Box 2 */}
                <div className="border border-white/10 rounded-lg p-4">
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-3">Box 2</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Eyebrow Label" hint="Small label at the top e.g. Featured Press">
                      <Input
                        value={(form as any).box2Label || ""}
                        onChange={e => set("box2Label" as any, e.target.value)}
                        placeholder="Featured Press"
                      />
                    </Field>
                    <Field label="Title / Info" hint="Main text displayed in the card">
                      <Input
                        value={(form as any).box2Title || ""}
                        onChange={e => set("box2Title" as any, e.target.value)}
                        placeholder="e.g. Forbes — Entrepreneur of the Year"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Intro */}
        <Card>
          <SectionTitle>Personal Intro Block</SectionTitle>
          <div className="space-y-4">
            <Field label="Intro Quote">
              <Textarea value={form.personalIntro.quote} onChange={e => set("personalIntro", { ...form.personalIntro, quote: e.target.value })} rows={3} />
            </Field>
            <Field label="Body Text" hint="Plain text or paste HTML for rich formatting">
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

        {/* Hero Stats */}
        <Card>
          <SectionTitle>Hero Stats</SectionTitle>
          <p className="text-xs text-white/40 mb-4">The three numbers displayed below the hero (e.g. 600+ Projects Done).</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stat 1 — Value">
              <Input value={(form as any).stat1Value || ""} onChange={e => set("stat1Value" as any, e.target.value)} placeholder="600+" />
            </Field>
            <Field label="Stat 1 — Label">
              <Input value={(form as any).stat1Label || ""} onChange={e => set("stat1Label" as any, e.target.value)} placeholder="Projects Done" />
            </Field>
            <Field label="Stat 2 — Value">
              <Input value={(form as any).stat2Value || ""} onChange={e => set("stat2Value" as any, e.target.value)} placeholder="50+" />
            </Field>
            <Field label="Stat 2 — Label">
              <Input value={(form as any).stat2Label || ""} onChange={e => set("stat2Label" as any, e.target.value)} placeholder="Brand Partnerships" />
            </Field>
            <Field label="Stat 3 — Value">
              <Input value={(form as any).stat3Value || ""} onChange={e => set("stat3Value" as any, e.target.value)} placeholder="12+" />
            </Field>
            <Field label="Stat 3 — Label">
              <Input value={(form as any).stat3Label || ""} onChange={e => set("stat3Label" as any, e.target.value)} placeholder="Years Experience" />
            </Field>
          </div>
        </Card>

        {/* Manifesto Teaser */}
        <Card>
          <SectionTitle>Manifesto Teaser Section</SectionTitle>
          <div className="space-y-3">
            <Field label="Eyebrow Label" hint="Small uppercase label e.g. The Core Conviction">
              <Input value={(form as any).manifestoTeaserEyebrow || ""} onChange={e => set("manifestoTeaserEyebrow" as any, e.target.value)} placeholder="The Core Conviction" />
            </Field>
            <Field label="Quote / Headline" hint="The large italic quote displayed in the card">
              <Textarea value={(form as any).manifestoTeaserQuote || ""} onChange={e => set("manifestoTeaserQuote" as any, e.target.value)} rows={3} placeholder="I believe the best companies are built not just on ideas, but on conviction." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CTA Button Label">
                <Input value={(form as any).manifestoTeaserCtaLabel || ""} onChange={e => set("manifestoTeaserCtaLabel" as any, e.target.value)} placeholder="Read My Manifesto" />
              </Field>
              <Field label="CTA Button URL">
                <Input value={(form as any).manifestoTeaserCtaUrl || ""} onChange={e => set("manifestoTeaserCtaUrl" as any, e.target.value)} placeholder="/manifesto" />
              </Field>
            </div>
          </div>
        </Card>

        {/* FAQ Section (homepage preview) */}
        <Card>
          <SectionTitle>FAQ Section (Homepage Preview)</SectionTitle>
          <div className="space-y-3">
            <Field label="Eyebrow Label" hint="Small uppercase label e.g. Knowledge Base">
              <Input value={(form as any).faqSectionEyebrow || ""} onChange={e => set("faqSectionEyebrow" as any, e.target.value)} placeholder="Knowledge Base" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Heading" hint="Main heading text e.g. Frequently Asked">
                <Input value={(form as any).faqSectionHeading || ""} onChange={e => set("faqSectionHeading" as any, e.target.value)} placeholder="Frequently Asked" />
              </Field>
              <Field label="Heading Italic Part" hint="Styled part e.g. Questions.">
                <Input value={(form as any).faqSectionHeadingItalic || ""} onChange={e => set("faqSectionHeadingItalic" as any, e.target.value)} placeholder="Questions." />
              </Field>
            </div>
            <Field label="Subtext" hint="Description shown below heading">
              <Textarea value={(form as any).faqSectionSubtext || ""} onChange={e => set("faqSectionSubtext" as any, e.target.value)} rows={2} placeholder="Quick insights into the architecture, vision, and operations of our venture studio." />
            </Field>
          </div>
        </Card>

        {/* Blog / Newsroom Section */}
        <Card>
          <SectionTitle>Blog Section (Thought Pulse / Newsroom)</SectionTitle>
          <div className="space-y-3">
            <Field label="Eyebrow Label" hint="Small uppercase label e.g. Thought Pulse">
              <Input value={(form as any).blogSectionEyebrow || ""} onChange={e => set("blogSectionEyebrow" as any, e.target.value)} placeholder="Thought Pulse" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Heading" hint="Main heading text e.g. What's On My">
                <Input value={(form as any).blogSectionHeading || ""} onChange={e => set("blogSectionHeading" as any, e.target.value)} placeholder="What's On My" />
              </Field>
              <Field label="Heading Italic Part" hint="Styled italic part e.g. Mind">
                <Input value={(form as any).blogSectionHeadingItalic || ""} onChange={e => set("blogSectionHeadingItalic" as any, e.target.value)} placeholder="Mind" />
              </Field>
            </div>
          </div>
        </Card>

        {/* Ecosystem Section — managed from the Ecosystem Page admin */}
        <Card>
          <SectionTitle>Ecosystem Section</SectionTitle>
          <div className="flex items-start gap-3">
            <Globe size={16} className="text-[#E22D2D] mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <p className="text-sm text-white/50 leading-relaxed">
                The Ecosystem section heading, its visibility, and the venture cards are all managed
                in one place, so the home section and the <code className="text-white/70">/ecosystem</code>{" "}
                page always match.
              </p>
              <Link href="/admin/ecosystem"
                className="inline-flex items-center gap-2 text-sm text-white hover:text-[#E22D2D] transition-colors underline underline-offset-4"
              >
                Edit the Ecosystem <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Card>

        {/* Section Visibility */}
        <Card>
          <SectionTitle>Section Visibility Toggles</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Toggle checked={form.showBlog} onChange={v => set("showBlog", v)} label="Show Blog Section" />
            <Toggle checked={form.showPress} onChange={v => set("showPress", v)} label="Show Press Logos" />
            <Toggle checked={form.showManifestoTeaser} onChange={v => set("showManifestoTeaser", v)} label="Show Manifesto Teaser" />
            <Toggle checked={form.showFaq} onChange={v => set("showFaq", v)} label="Show FAQ Preview" />
            <Toggle checked={form.showNewsletter} onChange={v => set("showNewsletter", v)} label="Show Newsletter" />
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
                previewImageClass="h-52 md:h-72 object-contain bg-black/20"
              />
            </Field>
          </div>
        </Card>

        <SaveButton loading={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}