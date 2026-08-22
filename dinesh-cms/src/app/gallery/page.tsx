import GalleryGrid from "@/components/sections/GalleryGrid";
import { getGallery } from "@/lib/firebase-data";
import { galleryImages, galleryPageData } from "@/lib/data";
import { fbArr, fbStr } from "@/lib/fallback";
import { PageSchema } from "@/components/seo/JsonLd";

export const revalidate = 60;
export const metadata = {
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery — Dinesh Koyyalamudi (46DC)", url: "/gallery", type: "website" },
  title: "Gallery — Dinesh Koyyalamudi (46DC)",
  description:
    "Moments from the founder journey behind FourSix46® — building Stack46, Cinevenn, Route46 Couriers and 46 Dogs, documented in frames.",
};

export default async function GalleryPage() {
  const fbGallery = await getGallery();
  const images = fbArr(fbGallery, galleryImages as any[]);

  // Read gallery page text from dedicated siteSettings/galleryPage doc
  let galleryPageText = { eyebrow: "", heading: "", headingItalic: "", description: "" };
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("siteSettings").doc("galleryPage").get();
    if (snap.exists) galleryPageText = snap.data() as any;
  } catch {}

  const pd = {
    visualProtocol:  fbStr(galleryPageText.eyebrow,       (galleryPageData as any).visualProtocol),
    heading:         fbStr(galleryPageText.heading,        "Cinematic"),
    headingItalic:   fbStr(galleryPageText.headingItalic,  "Ventures."),
    description:     fbStr(galleryPageText.description,    (galleryPageData as any).description),
  };

  return (
    <div className="pt-48 lg:pt-48 pb-24 bg-brand-dark min-h-screen">
      <PageSchema name="Gallery" description="Moments from the founder journey behind FourSix46." path="/gallery" type="CollectionPage" />
      <div className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              {pd.visualProtocol}
            </span>
            <h1 className="text-4xl md:text-6xl font-display leading-[1.1] tracking-tight">
              {pd.heading} <span className="text-gradient italic">{pd.headingItalic}</span>
            </h1>
            <p className="mt-8 text-text-secondary text-lg max-w-xl leading-relaxed">{pd.description}</p>
          </div>
          <GalleryGrid images={images as any[]} />
        </div>
      </div>
    </div>
  );
}