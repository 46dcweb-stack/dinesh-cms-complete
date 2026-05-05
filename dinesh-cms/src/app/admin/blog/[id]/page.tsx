"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { blogService } from "@/lib/firebase-services";
import type { BlogPost } from "@/lib/types";
import {
  AdminPageHeader, Field, Input, Textarea, Select, Toggle,
  SaveButton, DeleteButton, ImageUpload, TagsInput, Alert, Card, SectionTitle,
} from "../../components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const EMPTY: Omit<BlogPost, "id"> = {
  title: "", slug: "", excerpt: "", content: "",
  tags: [], categories: [], publishDate: new Date().toISOString().split("T")[0],
  featuredImage: "", featuredPost: false,
  status: "draft", readingTime: 5, canonicalUrl: "",
  language: "en", series: "",
  seoMetaTitle: "", seoMetaDescription: "", author: "Dinesh Koyyalamudi",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogEditor() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState<Omit<BlogPost, "id">>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      blogService.getById(id).then(post => {
        if (post) {
          const { id: _id, ...rest } = post;
          setForm(rest);
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function set(key: keyof typeof form, val: any) {
    setForm(f => ({ ...f, [key]: val }));
    if (key === "title" && isNew) {
      setForm(f => ({ ...f, title: val, slug: slugify(val) }));
    }
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug) {
      setError("Title and Slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        const newId = await blogService.create(form);
        router.replace(`/admin/blog/${newId}`);
      } else {
        await blogService.update(id, form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save");
    }
    setSaving(false);
  }

  async function handleDelete() {
    await blogService.delete(id);
    router.replace("/admin/blog");
  }

  if (loading) {
    return <div className="p-8 text-white/40 text-sm">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/admin/blog" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Blog Posts
        </Link>
      </div>

      <AdminPageHeader
        title={isNew ? "New Blog Post" : "Edit Blog Post"}
        subtitle={isNew ? "Create a new thought leadership article" : `Editing: ${form.title}`}
        action={
          <div className="flex items-center gap-3">
            {!isNew && (
              <DeleteButton onClick={handleDelete} />
            )}
            <select
              value={form.status}
              onChange={e => set("status", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <SaveButton loading={saving} saved={saved} onClick={() => handleSubmit({ preventDefault: () => {} } as any)} />
          </div>
        }
      />

      {error && <Alert message={error} className="mb-6" />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <SectionTitle>Content</SectionTitle>
              <div className="space-y-4">
                <Field label="Title" required>
                  <Input
                    value={form.title}
                    onChange={e => set("title", e.target.value)}
                    placeholder="Post title"
                  />
                </Field>
                <Field label="Slug (URL)" required hint="Auto-generated from title. e.g. building-resilient-systems">
                  <Input
                    value={form.slug}
                    onChange={e => set("slug", slugify(e.target.value))}
                    placeholder="post-slug"
                  />
                </Field>
                <Field label="Excerpt" hint="Short summary for listings and SEO">
                  <Textarea
                    value={form.excerpt}
                    onChange={e => set("excerpt", e.target.value)}
                    placeholder="Brief description of this post..."
                    rows={3}
                  />
                </Field>
                <Field label="Content (HTML)" hint="Full rich text content — supports HTML tags">
                  <Textarea
                    value={form.content}
                    onChange={e => set("content", e.target.value)}
                    placeholder="<p>Your article content here...</p>"
                    rows={20}
                    className="font-mono text-xs"
                  />
                </Field>
              </div>
            </Card>

            <Card>
              <SectionTitle>SEO</SectionTitle>
              <div className="space-y-4">
                <Field label="SEO Meta Title">
                  <Input value={form.seoMetaTitle || ""} onChange={e => set("seoMetaTitle", e.target.value)} placeholder="Overrides page title for SEO" />
                </Field>
                <Field label="SEO Meta Description">
                  <Textarea value={form.seoMetaDescription || ""} onChange={e => set("seoMetaDescription", e.target.value)} rows={2} placeholder="155 characters max" />
                </Field>
                <Field label="Canonical URL" hint="Optional — for republished content">
                  <Input value={form.canonicalUrl || ""} onChange={e => set("canonicalUrl", e.target.value)} placeholder="https://original-source.com/article" />
                </Field>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <SectionTitle>Featured Image</SectionTitle>
              <ImageUpload value={form.featuredImage} onChange={v => set("featuredImage", v)} folder="blog" />
            </Card>

            <Card>
              <SectionTitle>Metadata</SectionTitle>
              <div className="space-y-4">
                <Field label="Publish Date">
                  <Input type="date" value={form.publishDate} onChange={e => set("publishDate", e.target.value)} />
                </Field>
                <Field label="Author">
                  <Input value={form.author} onChange={e => set("author", e.target.value)} />
                </Field>
                <Field label="Reading Time (mins)">
                  <Input type="number" value={form.readingTime} onChange={e => set("readingTime", Number(e.target.value))} min={1} />
                </Field>
                <Field label="Language">
                  <Select value={form.language} onChange={e => set("language", e.target.value)}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                  </Select>
                </Field>
                <Field label="Series / Collection">
                  <Input value={form.series || ""} onChange={e => set("series", e.target.value)} placeholder="Optional series name" />
                </Field>
              </div>
            </Card>

            <Card>
              <SectionTitle>Tags &amp; Categories</SectionTitle>
              <div className="space-y-4">
                <Field label="Tags">
                  <TagsInput value={form.tags} onChange={v => set("tags", v)} />
                </Field>
                <Field label="Categories">
                  <TagsInput value={form.categories} onChange={v => set("categories", v)} placeholder="Add category, press Enter" />
                </Field>
              </div>
            </Card>

            <Card>
              <SectionTitle>Options</SectionTitle>
              <div className="space-y-3">
                <Toggle checked={form.featuredPost} onChange={v => set("featuredPost", v)} label="Featured Post" />
              </div>
            </Card>

            <SaveButton loading={saving} saved={saved} />
          </div>
        </div>
      </form>
    </div>
  );
}
