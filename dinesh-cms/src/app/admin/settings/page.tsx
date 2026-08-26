"use client";
import { useEffect, useState } from "react";
import { settingsService } from "@/lib/firebase-services";
import type { SiteSettings } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, SaveButton, ImageUpload,
  Alert, Card, SectionTitle,
} from "../components/ui";

const DEFAULT: Omit<SiteSettings, "id"> = {
  siteName: "Dinesh Koyyalamudi",
  seoDefaultTitle: "Dinesh Koyyalamudi — Founder, FourSix46",
  seoDefaultDescription: "Founder of FourSix46. Building resilient systems across global markets.",
  seoOgImage: "",
  socialLinks: {
    linkedin: "", twitter: "", instagram: "", youtube: "", facebook: "",
  },
  footerCopyright: "© 2025 Dinesh Koyyalamudi. All rights reserved.",
  footerTagline: "",
  footerEmail: "",
  footerLocation: "",
  footerQuote: "",
  navItems: [
    { label: "About", url: "/about", order: 1 },
    { label: "Ecosystem", url: "/ecosystem", order: 2 },
    { label: "Blog", url: "/blog", order: 3 },
    { label: "Press", url: "/press", order: 4 },
    { label: "Gallery", url: "/gallery", order: 5 },
    { label: "FAQs", url: "/faq", order: 6 },
    { label: "Manifesto", url: "/manifesto", order: 7 },
    { label: "Subscribe", url: "/subscribe", order: 8 },
    { label: "Contact", url: "/contact", order: 9 },
  ],
  mediaKitUrl: "",
  googleAnalyticsId: "",
  // Contact defaults
  contactTitle: "Let's Start a Conversation.",
  contactSubtitle: "Get in Touch",
  contactDescription: "Whether you have a visionary project in mind or just want to exchange ideas, I'm always open to connecting with fellow thinkers.",
  contactEmail: "dinesh@46dc.com",
  contactPhone: "+44 02045188119",
  contactOffice: "London, England, United Kingdom",
  contactHours: "Available 24/7",
} as any;

export default function SettingsAdmin() {
  const [form, setForm] = useState<any>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    settingsService.get().then(data => {
      if (data) { const { id: _, ...rest } = data; setForm({ ...DEFAULT, ...rest }); }
      setLoading(false);
    });
  }, []);

  function set(key: string, val: any) {
    setForm((f: any) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await settingsService.save(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message); }
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <AdminPageHeader
        title="Site Settings"
        subtitle="Global SEO, social links, navigation, contact info and footer"
        action={<SaveButton loading={saving} saved={saved} onClick={handleSave} />}
      />
      {error && <Alert message={error} className="mb-6" />}

      <div className="space-y-6">
        {/* General */}
        <Card>
          <SectionTitle>General</SectionTitle>
          <div className="space-y-4">
            <Field label="Site Name">
              <Input value={form.siteName} onChange={e => set("siteName", e.target.value)} />
            </Field>
            <Field label="Default SEO Title" hint="Shown in browser tab and Google">
              <Input value={form.seoDefaultTitle} onChange={e => set("seoDefaultTitle", e.target.value)} />
            </Field>
            <Field label="Default SEO Description" hint="~155 characters">
              <Textarea value={form.seoDefaultDescription} onChange={e => set("seoDefaultDescription", e.target.value)} rows={3} />
            </Field>
            <Field label="Default OG Image URL" hint="Used for social sharing previews">
              <Input value={form.seoOgImage || ""} onChange={e => set("seoOgImage", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Google Analytics ID">
              <Input value={form.googleAnalyticsId || ""} onChange={e => set("googleAnalyticsId", e.target.value)} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Media Kit File" hint="Upload your press kit PDF or zip — shown as download on Press page">
              <ImageUpload
                value={form.mediaKitUrl || ""}
                onChange={v => set("mediaKitUrl", v)}
                folder="press"
                allowPdf={true}
              />
            </Field>
          </div>
        </Card>

        {/* Contact Page Settings */}
        <Card>
          <SectionTitle>Contact Page Settings</SectionTitle>
          <div className="space-y-4">
            <Field label="Page Title" hint="Main heading on contact page">
              <Input
                value={form.contactTitle || ""}
                onChange={e => set("contactTitle", e.target.value)}
                placeholder="Let's Start a Conversation."
              />
            </Field>
            <Field label="Page Subtitle" hint="Eyebrow text above title">
              <Input
                value={form.contactSubtitle || ""}
                onChange={e => set("contactSubtitle", e.target.value)}
                placeholder="Get in Touch"
              />
            </Field>
            <Field label="Page Description" hint="Description below title">
              <Textarea
                value={form.contactDescription || ""}
                onChange={e => set("contactDescription", e.target.value)}
                rows={3}
                placeholder="Whether you have a visionary project in mind..."
              />
            </Field>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-4 uppercase tracking-wider">Contact Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Email Address">
                  <Input
                    value={form.contactEmail || ""}
                    onChange={e => set("contactEmail", e.target.value)}
                    placeholder="dinesh@46dc.com"
                    type="email"
                  />
                </Field>
                <Field label="Phone Number">
                  <Input
                    value={form.contactPhone || ""}
                    onChange={e => set("contactPhone", e.target.value)}
                    placeholder="+44 02045188119"
                  />
                </Field>
                <Field label="Office Location">
                  <Input
                    value={form.contactOffice || ""}
                    onChange={e => set("contactOffice", e.target.value)}
                    placeholder="London, England, United Kingdom"
                  />
                </Field>
                <Field label="Working Hours">
                  <Input
                    value={form.contactHours || ""}
                    onChange={e => set("contactHours", e.target.value)}
                    placeholder="Available 24/7"
                  />
                </Field>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card>
          <SectionTitle>Social Media Links</SectionTitle>
          <p className="text-xs text-white/40 mb-4">These appear as icons in the footer. Leave blank to hide.</p>
          <div className="grid grid-cols-2 gap-4">
            {(["linkedin", "twitter", "instagram", "youtube", "facebook"] as const).map(key => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <Input
                  value={form.socialLinks?.[key] || ""}
                  onChange={e => set("socialLinks", { ...form.socialLinks, [key]: e.target.value })}
                  placeholder={`https://${key}.com/...`}
                />
              </Field>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <Card>
          <SectionTitle>Footer</SectionTitle>
          <div className="space-y-4">
            <Field label="Copyright Text">
              <Input value={form.footerCopyright} onChange={e => set("footerCopyright", e.target.value)} />
            </Field>
            <Field label="Footer Tagline" hint="Shown beside the copyright text">
              <Input
                value={form.footerTagline || ""}
                onChange={e => set("footerTagline", e.target.value)}
                placeholder="Built with intention. Shared with purpose."
              />
            </Field>
            <Field label="Footer Email" hint="Contact email shown in the Frequency column">
              <Input
                value={form.footerEmail || ""}
                onChange={e => set("footerEmail", e.target.value)}
                placeholder="dinesh@46dc.com"
                type="email"
              />
            </Field>
            <Field label="Footer Location" hint="Location shown in the Frequency column">
              <Input
                value={form.footerLocation || ""}
                onChange={e => set("footerLocation", e.target.value)}
                placeholder="Global Base"
              />
            </Field>
            <Field label="Intention Quote" hint="Italic quote shown in the Intention column">
              <Textarea
                value={form.footerQuote || ""}
                onChange={e => set("footerQuote", e.target.value)}
                rows={2}
                placeholder="The best companies are built not just on ideas, but on conviction."
              />
            </Field>
          </div>
        </Card>

        {/* Navigation */}
        <Card>
          <SectionTitle>Navigation Menu Items</SectionTitle>
          <div className="space-y-2">
            {form.navItems
              .slice()
              .sort((a: any, b: any) => a.order - b.order)
              .map((nav: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-1">
                    <Field label="Order">
                      <Input
                        type="number"
                        value={nav.order}
                        onChange={e => {
                          const n = [...form.navItems];
                          n[i] = { ...n[i], order: Number(e.target.value) };
                          set("navItems", n);
                        }}
                        className="text-center"
                      />
                    </Field>
                  </div>
                  <div className="col-span-4">
                    <Field label="Label">
                      <Input
                        value={nav.label}
                        onChange={e => {
                          const n = [...form.navItems];
                          n[i] = { ...n[i], label: e.target.value };
                          set("navItems", n);
                        }}
                      />
                    </Field>
                  </div>
                  <div className="col-span-6">
                    <Field label="URL">
                      <Input
                        value={nav.url}
                        onChange={e => {
                          const n = [...form.navItems];
                          n[i] = { ...n[i], url: e.target.value };
                          set("navItems", n);
                        }}
                      />
                    </Field>
                  </div>
                  <div className="col-span-1 pb-0.5">
                    <button
                      onClick={() => set("navItems", form.navItems.filter((_: any, j: number) => j !== i))}
                      className="w-full p-2.5 text-white/30 hover:text-red-400 transition-colors flex justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            <button
              onClick={() => set("navItems", [...form.navItems, { label: "", url: "/", order: form.navItems.length + 1 }])}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mt-2"
            >
              <Plus size={14} /> Add Nav Item
            </button>
          </div>
        </Card>

        <SaveButton loading={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}