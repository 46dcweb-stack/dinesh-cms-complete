import ContactForm from "@/components/sections/ContactForm";
import { contactPageData } from "@/lib/data";

export const metadata = {
    title: "Contact",
    description: "Get in touch with Dinesh Koyyalamudi.",
};

export default function ContactPage() {
    const { title, subtitle, description } = contactPageData;

    return (
        <div className="pt-20 lg:pt-12 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <ContactForm title={title} subtitle={subtitle} description={description} />
            </div>
        </div>
    );
}
