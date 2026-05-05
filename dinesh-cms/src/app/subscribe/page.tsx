import Newsletter from "@/components/sections/Newsletter";
import { subscribePageData } from "@/lib/data";

export const metadata = {
    title: "Subscribe",
    description: "Join Dinesh Koyyalamudi's newsletter on venture building and the future.",
};

export default function SubscribePage() {
    const { title, subtitle, description } = subscribePageData;

    return (
        <div className="pt-20 lg:pt-12 pb-24 bg-brand-dark min-h-screen">
            <div className="px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="max-w-3xl mb-24">
                        <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
                            {subtitle}
                        </span>
                        <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">
                            Join the{" "}
                            <span className="text-gradient italic">Conversation.</span>
                        </h1>
                        <p className="mt-8 text-text-secondary text-lg max-w-xl leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Newsletter Component */}
                    <div className="glass-card bg-brand-muted/20 border-brand-primary/10">
                        <Newsletter />
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
                        <div className="space-y-4">
                            <h3 className="text-xl font-display text-white tracking-tight">Signal, Not Noise.</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                I only send updates when I have something fundamental to share.
                                Quality over quantity, always.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-display text-white tracking-tight">Venture Insights.</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Get behind-the-scenes looks at the architecture and logic of our
                                latest ventures at FourSix46.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-display text-white tracking-tight">Global Network.</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Be the first to hear about new global operations and infrastructure
                                deployments across our 5 hubs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
