import type { Metadata } from "next";
import Script from "next/script";
import { spaceGrotesk, inter } from "./fonts";
import "./globals.css";

import LenisProvider from "@/components/providers/LenisProvider";
import SiteChrome from "@/components/providers/SiteChrome";

import {
  PersonSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/seo/JsonLd";

import { getSiteSettings } from "@/lib/firebase-data";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings() as any;

  const title =
    settings?.seoDefaultTitle ??
    "Dinesh Koyyalamudi | Strategic Visionary & Venture Builder";

  const description =
    settings?.seoDefaultDescription ??
    "Official platform of Dinesh Koyyalamudi — Founder, thinker, and leader focused on building resilient systems.";

  const ogImage = settings?.seoOgImage || "/og-image.jpg";

  const siteName = settings?.siteName ?? "Dinesh Koyyalamudi";

  return {
    metadataBase: new URL(BASE_URL),

    // Plain string, not a template: pages set their own complete title. The previous
    // `%s | ${siteName}` template appended the site name to titles that already
    // contained it, producing ~100-char duplicates in search results.
    title,

    description,

    keywords: [
      "Dinesh Koyyalamudi",
      "Founder",
      "Venture Builder",
      "Strategic Leadership",
      "Technology Visionary",
    ],

    authors: [{ name: "Dinesh Koyyalamudi" }],

    creator: "Dinesh Koyyalamudi",

    verification: {
      google: "TGvCTVYTY6xlh5pw2KA-vNWZUSiOaAtjP9AYRMj0fl0",
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@dineshkoyya",
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
    },

    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <Script
  id="cookieyes"
  src="https://cdn-cookieyes.com/client_data/91a8605ad0c3c4e915f73c9cfd7c1a54/script.js"
  strategy="lazyOnload"
/>
{/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W83P0Y4EX8"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W83P0Y4EX8');
          `}
        </Script>
      </head>

      <body className="antialiased min-h-screen flex flex-col bg-brand-dark selection:bg-brand-primary/30">
        <PersonSchema />
        <OrganizationSchema />
        <WebsiteSchema />

        <LenisProvider>
          <SiteChrome>{children}</SiteChrome>
        </LenisProvider>
      </body>
    </html>
  );
}