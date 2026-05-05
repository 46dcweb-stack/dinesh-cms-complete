import ManifestoHeader from "@/components/manifesto/ManifestoHeader";
import ManifestoContent from "@/components/manifesto/ManifestoContent";
import ManifestoCTA from "@/components/manifesto/ManifestoCTA";
import { manifestoData } from "@/lib/data";

export const metadata = {
    title: "Manifesto",
    description: "The core conviction and blueprint of Dinesh Koyyalamudi.",
};

export default function ManifestoPage() {
    const { title, subtitle, eyebrow, introLabel, versionTag, introStats, blocks } = manifestoData;

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
