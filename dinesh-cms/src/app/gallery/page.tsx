import GalleryGrid from "@/components/sections/GalleryGrid";
import { getGallery } from "@/lib/firebase-data";
import { galleryImages, galleryPageData } from "@/lib/data";

export const revalidate = 60;

export const metadata = { title: "Gallery", description: "A visual collection of ventures, moments, and architectures." };

export default async function GalleryPage() {
  const { visualProtocol, description } = galleryPageData as any;
  const fbGallery = await getGallery();
  const images = fbGallery.length > 0 ? fbGallery : galleryImages;
  return (
    <div className="pt-20 lg:pt-12 pb-24 bg-brand-dark min-h-screen">
      <div className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">{visualProtocol}</span>
            <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">Cinematic <span className="text-gradient italic">Ventures.</span></h1>
            <p className="mt-8 text-text-secondary text-lg max-w-xl leading-relaxed">{description}</p>
          </div>
          <GalleryGrid images={images as any[]} />
        </div>
      </div>
    </div>
  );
}
