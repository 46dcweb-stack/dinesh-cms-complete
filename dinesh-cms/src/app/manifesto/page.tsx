import ManifestoHeader from "@/components/manifesto/ManifestoHeader";
import ManifestoContent from "@/components/manifesto/ManifestoContent";
import ManifestoCTA from "@/components/manifesto/ManifestoCTA";
import { getManifesto } from "@/lib/firebase-data";
import { manifestoData } from "@/lib/data";

export const revalidate = 60;

export default async function ManifestoPage() {
  const fbManifesto = await getManifesto();

  // Use Firebase data if available, otherwise fall back to static
  const meta = fbManifesto.meta ?? null;
  const sections = fbManifesto.sections ?? [];

  const title        = (meta as any)?.title        ?? manifestoData.title;
  const subtitle     = (meta as any)?.subtitle     ?? manifestoData.subtitle;
  const eyebrow      = (meta as any)?.eyebrow      ?? manifestoData.eyebrow;
  const introLabel   = (meta as any)?.introLabel   ?? manifestoData.introLabel;
  const versionTag   = (meta as any)?.versionTag   ?? manifestoData.versionTag;
  const introStats   = (meta as any)?.introStats   ?? manifestoData.introStats;
  const blocks       = sections.length > 0 ? sections : manifestoData.blocks;

  return (
    <div className="pt-20 lg:pt-12 pb-48 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <ManifestoHeader
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          introLabel={introLabel}
          introStats={introStats}
          versionTag={versionTag}
        />
        <ManifestoContent blocks={blocks as any} />
        <ManifestoCTA />
      </div>
    </div>
  );
}
