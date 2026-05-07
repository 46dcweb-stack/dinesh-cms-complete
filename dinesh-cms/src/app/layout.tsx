import type { Metadata } from "next";
import { spaceGrotesk, inter } from "./fonts";
import "./globals.css";
import CurveLoader from "@/components/ui/CurveLoader";
import LenisProvider from "@/components/providers/LenisProvider";
import SiteChrome from "@/components/providers/SiteChrome";
import { PersonSchema, OrganizationSchema, WebsiteSchema } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/firebase-data";

const BASE_URL = "https://dineshkoyyalamudi.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings() as any;
  const title       = settings?.seoDefaultTitle       ?? "Dinesh Koyyalamudi | Strategic Visionary & Venture Builder";
  const description = settings?.seoDefaultDescription ?? "Official platform of Dinesh Koyyalamudi — Founder, thinker, and leader focused on building resilient systems.";
  const ogImage     = settings?.seoOgImage            || "/og-image.jpg";
  const siteName    = settings?.siteName              ?? "Dinesh Koyyalamudi";
  return {
    metadataBase: new URL(BASE_URL),
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords: ["Dinesh Koyyalamudi","Founder","Venture Builder","Strategic Leadership","Technology Visionary"],
    authors: [{ name: "Dinesh Koyyalamudi" }],
    creator: "Dinesh Koyyalamudi",
    openGraph: { type:"website", locale:"en_US", url:BASE_URL, siteName, title, description, images:[{ url:ogImage, width:1200, height:630, alt:siteName }] },
    twitter: { card:"summary_large_image", title, description, creator:"@dineshkoyya", images:[ogImage] },
    robots: { index:true, follow:true },
    icons: { icon:"/logo.png", shortcut:"/logo.png", apple:"/logo.png" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-brand-dark selection:bg-brand-primary/30">
        <PersonSchema />
        <OrganizationSchema />
        <WebsiteSchema />
        <LenisProvider>
          <CurveLoader />
          <SiteChrome>{children}</SiteChrome>
        </LenisProvider>
      </body>
    </html>
  );
}
