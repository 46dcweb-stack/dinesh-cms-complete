import ContactForm from "@/components/sections/ContactForm";
import { getSiteSettings } from "@/lib/firebase-data";
import { contactPageData } from "@/lib/data";
import { PageSchema } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateMetadata() {
    const settings = await getSiteSettings() as any;
    const title = settings?.contactTitle || contactPageData.title;
    return {
        title: "Contact — Dinesh Koyyalamudi (46DC)",
        description: settings?.contactDescription || contactPageData.description,
        alternates: { canonical: "/contact" },
        openGraph: { title: "Contact — Dinesh Koyyalamudi (46DC)", url: "/contact", type: "website" as const },
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings() as any;

    // Use Firebase settings if available, fallback to static data
    const title = settings?.contactTitle || contactPageData.title;
    const subtitle = settings?.contactSubtitle || contactPageData.subtitle;
    const description = settings?.contactDescription || contactPageData.description;
    const email = settings?.contactEmail || "dinesh@46dc.com";
    const phone = settings?.contactPhone || "+44 02045188119";
    const office = settings?.contactOffice || "London, England, United Kingdom";
    const hours = settings?.contactHours || "Available 24/7";

    return (
        <div className="pt-36 md:pt-40 lg:pt-44 pb-24 px-6">
      <PageSchema name="Contact" description="Enquiries and collaboration with Dinesh Koyyalamudi (46DC)." path="/contact" type="ContactPage" />
            <div className="max-w-7xl mx-auto">
                <ContactForm 
                    title={title} 
                    subtitle={subtitle} 
                    description={description}
                    email={email}
                    phone={phone}
                    office={office}
                    hours={hours}
                />
            </div>
        </div>
    );
}