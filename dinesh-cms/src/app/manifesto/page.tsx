import ManifestoHeader from "@/components/manifesto/ManifestoHeader";
import ManifestoContent from "@/components/manifesto/ManifestoContent";
import ManifestoCTA from "@/components/manifesto/ManifestoCTA";
import { getManifesto } from "@/lib/firebase-data";
import { manifestoData } from "@/lib/data";

export const revalidate = 60;

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
