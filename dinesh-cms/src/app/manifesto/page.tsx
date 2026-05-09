import ManifestoHeader from "@/components/manifesto/ManifestoHeader";
import ManifestoContent from "@/components/manifesto/ManifestoContent";
import ManifestoCTA from "@/components/manifesto/ManifestoCTA";
import { getManifesto } from "@/lib/firebase-data";
import { manifestoData } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
  const fbManifesto = await getManifesto();
  const meta = fbManifesto.meta as any ?? null;
  
  // If custom SEO title exists, use it as-is (absolute). Otherwise use default.
  const hasCustomTitle = meta?.seoMetaTitle && meta.seoMetaTitle.trim() !== "";
  const title = meta?.seoMetaTitle || meta?.title || "My Manifesto";
  const description = meta?.seoMetaDescription || meta?.subtitle || "The architecture of intent, infrastructure for the future.";
  const ogImage = meta?.seoOgImage || "/og-image.jpg";
  
  return {
    title: hasCustomTitle ? { absolute: title } : title,
    description,
    openGraph: {
      title: hasCustomTitle ? title : `${title} | Dinesh Koyyalamudi`,
      description,
      url: "https://dineshkoyyalamudi.com/manifesto",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: hasCustomTitle ? title : `${title} | Dinesh Koyyalamudi`,
      description,
      images: [ogImage],
    },
  };
}

export default async function ManifestoPage() {
  const fbManifesto = await getManifesto();
  const meta     = fbManifesto.meta as any ?? null;
  const sections = fbManifesto.sections ?? [];

  const title      = meta?.title      ?? (manifestoData as any).title;
  const subtitle   = meta?.subtitle   ?? (manifestoData as any).subtitle;
  const eyebrow    = meta?.eyebrow    ?? (manifestoData as any).eyebrow;
  const introLabel = meta?.introLabel ?? (manifestoData as any).introLabel;
  const versionTag = meta?.versionTag ?? (manifestoData as any).versionTag;
  const introStats = meta?.introStats ?? (manifestoData as any).introStats;
  const blocks     = sections.length > 0 ? sections : (manifestoData as any).blocks;

  return (
    <div className="pt-28 lg:pt-28 pb-48 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <ManifestoHeader title={title} subtitle={subtitle} eyebrow={eyebrow} introLabel={introLabel} introStats={introStats} versionTag={versionTag} />
        <ManifestoContent blocks={blocks as any} />
        <ManifestoCTA />
      </div>
    </div>
  );
}
