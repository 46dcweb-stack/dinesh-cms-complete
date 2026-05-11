import ManifestoHeader from "@/components/manifesto/ManifestoHeader";
import ManifestoContent from "@/components/manifesto/ManifestoContent";
import ManifestoCTA from "@/components/manifesto/ManifestoCTA";
import { getManifesto } from "@/lib/firebase-data";
import { manifestoData } from "@/lib/data";
import { fbStr } from "@/lib/fallback";

export const revalidate = 60;

export async function generateMetadata() {
  const fbManifesto = await getManifesto();
  const meta = fbManifesto.meta as any;
  const title       = meta?.seoTitle       || "Manifesto | Dinesh Koyyalamudi";
  const description = meta?.seoDescription || "The core conviction and blueprint of Dinesh Koyyalamudi.";
  const ogImage     = meta?.seoOgImage     || "/og-image.jpg";
  return {
    title, description,
    openGraph: { title, description, images: [{ url: ogImage }] },
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
        <ManifestoCTA
          heading={fbStr(meta?.ctaHeading, "Will you build")}
          headingItalic={fbStr(meta?.ctaHeadingItalic, "the future with us?")}
          description={fbStr(meta?.ctaDescription, "We are actively looking for visionary collaborators, strategic investors, and relentless system-builders who share our core principles and want to engineer the next decade of resilient technology.")}
          btn1Label={fbStr(meta?.ctaBtn1Label, "Join the Collective")}
          btn2Label={fbStr(meta?.ctaBtn2Label, "Read the Vision Paper")}
        />
      </div>
    </div>
  );
}