import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/cookies' },
  openGraph: { title: 'Cookie Policy — Dinesh Koyyalamudi (46DC)', url: '/cookies', type: 'website' },
  title: 'Cookie Policy — Dinesh Koyyalamudi (46DC)',
  description:
    'How 46dc.com uses cookies and similar technologies, what each category does, and how you can manage or disable them in your browser at any time.',
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 lg:pt-28 pb-24 font-body">
      <div className="px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              Legal Protocol
            </span>
            <h1 className="text-5xl md:text-7xl font-display leading-[1.1] tracking-tight mb-8">
              Cookie <span className="text-gradient italic">Policy.</span>
            </h1>
            <p className="text-text-secondary text-sm font-mono tracking-widest uppercase mb-2">
              Dinesh Koyyalamudi
            </p>
            <p className="text-text-muted text-xs font-mono tracking-widest uppercase">
              Last Updated: March 23, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12 text-text-secondary font-body leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">1. Introduction</h2>
              <p>This Cookie Policy explains how Dinesh Koyyalamudi (“I”, “me”, or “my”) uses cookies and similar technologies when you visit my websites.</p>
              <p>This policy applies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>www.46dc.com</li>
                <li>www.dineshkoyyalamudi.com</li>
              </ul>
              <p className="mt-4">It should be read alongside the Privacy Policy, which explains how personal data is processed.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">2. What Are Cookies?</h2>
              <p>Cookies are small text files placed on your device when you visit a website. They help websites function properly and provide information about how visitors use the site.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-6">
              <h2 className="text-2xl font-display text-white mb-4">3. Types of Cookies Used</h2>
              <p>I use the following categories of cookies:</p>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">a) Strictly Necessary Cookies</h3>
                <p>These cookies are essential for the operation of the website.</p>
                <p>They include:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>Security-related functions</li>
                  <li>Cookie preference storage (your consent choices)</li>
                </ul>
                <p className="mt-4">These cookies do not require your consent.</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">b) Analytics Cookies</h3>
                <p>I use Google Analytics (GA4) to understand how visitors interact with the website.</p>
                <p>These cookies may collect:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>IP address (processed in a limited form)</li>
                  <li>Device and browser information</li>
                  <li>Pages visited and time spent</li>
                  <li>Interaction data</li>
                </ul>
                
                <p className="font-semibold text-white mt-4">Purpose:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>To analyse website performance</li>
                  <li>To improve user experience</li>
                </ul>
                
                <p className="font-semibold text-white mt-4">Legal basis:</p>
                <p>These cookies are only set after you provide your consent.</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">c) Communication and Marketing Technologies</h3>
                <p>I use Brevo to manage newsletter communications.</p>
                <p>Emails may include tracking technologies (such as pixels) that allow me to understand:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>whether an email has been opened</li>
                  <li>whether links have been clicked</li>
                </ul>
                <p className="mt-4">This helps improve content and communication relevance.</p>
                <p>These technologies operate only where you have provided consent to receive communications.</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">d) Third-Party Content</h3>
                <p>The website may include embedded content such as YouTube videos.</p>
                <p>These services may:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>Set cookies on your device</li>
                  <li>Collect usage data</li>
                  <li>Track interaction</li>
                </ul>
                <p className="mt-4">These cookies are only used with your consent.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">4. How Cookies Are Used</h2>
              <p>Cookies are used to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Ensure the website functions correctly</li>
                <li>Understand how visitors use the website</li>
                <li>Improve performance and usability</li>
                <li>Support communication and content delivery</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">5. Managing Your Cookie Preferences</h2>
              <p>When you first visit the website, you are presented with a cookie banner allowing you to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Manage your preferences</li>
              </ul>
              <p className="mt-4">Non-essential cookies are only set after your consent.</p>
              <p>You can withdraw or change your preferences at any time through the cookie settings on the website.</p>
              <p>You can also control cookies through your browser settings.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">6. Third-Party Providers</h2>
              <p>I use trusted third-party providers who may set cookies or process data, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Google (Google Analytics)</li>
                <li>Brevo (email communication services)</li>
                <li>YouTube (Google)</li>
              </ul>
              <p className="mt-4">These providers may process data, including outside the United Kingdom, in accordance with their own privacy policies.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">7. Cookie Duration</h2>
              <p>Some cookies are session-based and expire when you close your browser, while others remain on your device for a defined period unless deleted.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">8. Changes to This Policy</h2>
              <p>I may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated “Last Updated” date.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
