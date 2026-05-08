import GalleryGrid from "@/components/sections/GalleryGrid";
import { getGallery, getSiteSettings } from "@/lib/firebase-data";
import { galleryImages, galleryPageData } from "@/lib/data";
import { fbArr, fbStr } from "@/lib/fallback";

export const revalidate = 60;
export const metadata = {
  title: "Gallery",
  description: "A visual collection of ventures, moments, and architectures.",
};

export default async function GalleryPage() {
  const [fbGallery, settings] = await Promise.all([getGallery(), getSiteSettings()]);
  const images = fbArr(fbGallery, galleryImages as any[]);
  const settingsAny = settings as any;
  const pd = {
    visualProtocol: fbStr(settingsAny?.galleryPage?.eyebrow, (galleryPageData as any).visualProtocol),
    description:    fbStr(settingsAny?.galleryPage?.description, (galleryPageData as any).description),
  };

  return (
    <div className="pt-28 lg:pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              {pd.visualProtocol}
            </span>
            <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">
              Cinematic <span className="text-gradient italic">Ventures.</span>
            </h1>
            <p className="mt-8 text-text-secondary text-lg max-w-xl leading-relaxed">{pd.description}</p>
          </div>
          <GalleryGrid images={images as any[]} />
        </div>
      </div>
    </div>
  );
}
