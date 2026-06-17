import ContactForm from "@/components/sections/ContactForm";
import { getSiteSettings } from "@/lib/firebase-data";
import { contactPageData } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
    const settings = await getSiteSettings() as any;
    const title = settings?.contactTitle || contactPageData.title;
    return {
        title: "Contact",
        description: settings?.contactDescription || contactPageData.description,
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