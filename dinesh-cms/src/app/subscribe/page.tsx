import Newsletter from "@/components/sections/Newsletter";

export const metadata = {
  title: "Subscribe",
  description: "Thoughts when something's worth writing. Updates when something happens. No schedule, no noise — just the real story of building FourSix46® from the ground up.",
};

const CARDS = [
  {
    title: "Real Thoughts.",
    description: "When something's worth writing about — a decision, a lesson, a moment in the build — you'll get it first.",
  },
  {
    title: "Real Updates.",
    description: "Launches, milestones, and honest progress reports from inside FourSix46® and its ventures.",
  },
  {
    title: "No Noise.",
    description: "I don't send for the sake of sending. Every message means something happened or something was worth saying.",
  },
];

export default function SubscribePage() {
  return (
    <div className="pt-36 pb-24 bg-brand-dark min-h-screen">
      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="max-w-3xl mb-20">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              From the Desk of 46DC
            </span>
            <h1 className="text-5xl md:text-7xl font-display leading-[1.1] tracking-tight">
              Join the{" "}
              <span className="text-gradient italic">Build.</span>
            </h1>
            <p className="mt-8 text-text-secondary text-lg max-w-xl leading-relaxed">
              Thoughts when something's worth writing. Updates when something happens. No schedule, no noise — just the real story of building FourSix46® from the ground up.
            </p>
          </div>

          {/* Newsletter Form Card */}
          <div className="max-w-2xl mb-24">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-display text-white mb-3">
                Follow the Build
              </h2>
              <p className="text-text-secondary text-base mb-8 leading-relaxed">
                I write when I have something real to say. You'll hear from me when it matters.
              </p>
              <Newsletter />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS.map((card, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
                <h3 className="text-xl font-display text-white tracking-tight">{card.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}