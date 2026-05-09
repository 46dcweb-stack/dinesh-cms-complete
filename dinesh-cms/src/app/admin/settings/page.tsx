"use client";
import { useEffect, useState } from "react";
import { settingsService } from "@/lib/firebase-services";
import type { SiteSettings } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminPageHeader, Field, Input, Textarea, SaveButton,
  Alert, Card, SectionTitle,
} from "../components/ui";

const DEFAULT: Omit<SiteSettings, "id"> = {
  siteName: "Dinesh Koyyalamudi",
  seoDefaultTitle: "Dinesh Koyyalamudi — Founder, FourSix46",
  seoDefaultDescription: "Founder of FourSix46. Building resilient systems across global markets.",
  seoOgImage: "",
  socialLinks: {
    linkedin: "", twitter: "", instagram: "", youtube: "",
  },
  footerCopyright: "© 2025 Dinesh Koyyalamudi. All rights reserved.",
  footerTagline: "",
  navItems: [
    { label: "About", url: "/about", order: 1 },
    { label: "Blog", url: "/blog", order: 2 },
    { label: "Press", url: "/press", order: 3 },
    { label: "Manifesto", url: "/manifesto", order: 4 },
    { label: "Contact", url: "/contact", order: 5 },
  ],
  mediaKitUrl: "",
  googleAnalyticsId: "",
};

export default function SettingsAdmin() {
  const [form, setForm] = useState<Omit<SiteSettings, "id">>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    settingsService.get().then(data => {
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
        subtitle="Global SEO, social links, navigation and footer"
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
                value={(form as any).mediaKitUrl || ""}
                onChange={v => set("mediaKitUrl" as any, v)}
                folder="press"
              />
            </Field>
          </div>
        </Card>

        {/* Social Links */}
        <Card>
          <SectionTitle>Social Media Links</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {(["linkedin", "twitter", "instagram", "youtube"] as const).map(key => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <Input
                  value={form.socialLinks[key] || ""}
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
            <Field label="Footer Tagline">
              <Input value={form.footerTagline || ""} onChange={e => set("footerTagline", e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Navigation */}
        <Card>
          <SectionTitle>Navigation Menu Items</SectionTitle>
          <div className="space-y-2">
            {form.navItems
              .sort((a, b) => a.order - b.order)
              .map((nav, i) => (
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
                      onClick={() => set("navItems", form.navItems.filter((_, j) => j !== i))}
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
