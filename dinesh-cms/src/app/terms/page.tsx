import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for Dinesh Koyyalamudi',
};

export default function TermsOfUsePage() {
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
              Terms of <span className="text-gradient italic">Use.</span>
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
              <p>These Terms of Use (“Terms”) govern your access to and use of the websites operated by Dinesh Koyyalamudi.</p>
              <p>By accessing or using these websites, you agree to comply with these Terms. If you do not agree, you must not use the websites.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">2. About Me</h2>
              <p>These websites are operated by:</p>
              <p className="font-semibold text-white">Dinesh Koyyalamudi</p>
              <div className="text-text-muted">
                <p>66 Paul Street</p>
                <p>London, England</p>
                <p>EC2A 4NA</p>
                <p>United Kingdom</p>
              </div>
              <p className="mt-4 text-text-muted">📧 dinesh@46dc.com</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">3. Scope of These Terms</h2>
              <p>These Terms apply to your use of the websites, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>General browsing and interaction</li>
                <li>Contact form enquiries</li>
                <li>Speaking, collaboration, and business enquiries</li>
                <li>Newsletter signup and communications</li>
                <li>Blog articles and content consumption</li>
                <li>Downloading media kits and documents</li>
                <li>Social media links and external navigation</li>
                <li>Links to FourSix46 ventures and related platforms</li>
                <li>Embedded content (such as YouTube videos)</li>
                <li>Future features such as booking or scheduling tools</li>
              </ul>
              <p className="mt-4">Certain services, tools, or external platforms may be subject to separate terms, policies, or notices.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">4. Use of the Website</h2>
              <p>You may use the websites only for lawful purposes and in accordance with these Terms.</p>
              <p>You must not:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorised access to systems, data, or infrastructure</li>
                <li>Introduce malware, viruses, or harmful code</li>
                <li>Interfere with website performance, availability, or security</li>
                <li>Use automated tools, bots, or scraping technologies without permission</li>
                <li>Use the website for unlawful, abusive, or defamatory purposes</li>
                <li>Misuse, exploit, or attempt to extract website content</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">5. Intellectual Property</h2>
              <p>All content on these websites is owned by or licensed to Dinesh Koyyalamudi and is protected by applicable intellectual property laws.</p>
              <p>This includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Personal brand identity and content</li>
                <li>“46DC” branding and associated assets</li>
                <li>Articles, blog posts, essays, and written content</li>
                <li>Media kits, downloadable materials, and documents</li>
                <li>Website design, layout, and structure</li>
                <li>Images, graphics, and multimedia content</li>
              </ul>
              <p className="mt-4">“46DC” and associated branding may be registered or unregistered trademarks of Dinesh Koyyalamudi or related rights holders.</p>
              <p>References to FourSix46 and its ventures remain the intellectual property of their respective entities and do not imply ownership by this website.</p>
              
              <p className="font-semibold text-white mt-6">You may:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>View and access content for personal or internal business reference only</li>
              </ul>
              
              <p className="font-semibold text-white mt-6">You must not:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Copy, reproduce, distribute, republish, or modify content</li>
                <li>Use branding, trademarks, or materials without prior written permission</li>
                <li>Scrape, extract, or reuse content for commercial purposes</li>
              </ul>
              
              <p className="mt-4">Nothing in these Terms grants you any licence or right to use any intellectual property except as expressly stated. All rights not expressly granted are reserved.</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">6. Information and No Reliance</h2>
              <p>The content on these websites is provided for general information purposes only.</p>
              <p>It does not constitute:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Legal advice</li>
                <li>Financial or investment advice</li>
                <li>Business or professional advice</li>
              </ul>
              <p className="mt-4">You must not rely on this website as the sole basis for any decision, including business, investment, or collaboration decisions.</p>
              <p>Nothing on this website constitutes an offer, invitation, or commitment to enter into any partnership, advisory relationship, or business arrangement.</p>
              <p>Any formal engagement will only arise through a separate written agreement signed by authorised parties.</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">7. Contact and Enquiries</h2>
              <p>When submitting an enquiry, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>The information provided is accurate and not misleading</li>
                <li>You are authorised to provide such information</li>
              </ul>
              <p className="mt-4">Submitting an enquiry does not:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Create any contractual or advisory relationship</li>
                <li>Establish any partnership, agency, fiduciary, or investment relationship</li>
                <li>Guarantee any response or engagement</li>
              </ul>
              <p className="mt-4">I am not obliged to respond to all enquiries.</p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">8. Speaking, Collaboration, and Opportunities</h2>
              <p>Any speaking engagements, collaborations, advisory roles, or business opportunities are subject to separate discussions and formal written agreements.</p>
              <p>Nothing on this website constitutes a confirmed engagement or commitment.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">9. Newsletter and Communications</h2>
              <p>Newsletter subscriptions and communications are governed by the Privacy Policy and Cookie Policy.</p>
              <p>No guarantees are made regarding frequency, timing, or delivery of communications.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">10. Downloads and Media</h2>
              <p>Where documents, press materials, or media resources are made available:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>They are provided for informational and internal reference use only</li>
                <li>Any permitted use by media or third parties must comply with any stated conditions</li>
                <li>Any broader use, reproduction, or distribution requires prior written permission</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">11. External Links</h2>
              <p>These websites may contain links to third-party websites, including social media platforms and venture websites.</p>
              <p>I do not control and am not responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>The content or availability of third-party websites</li>
                <li>Their privacy practices or security</li>
                <li>Any services or materials provided by them</li>
              </ul>
              <p className="mt-4">Accessing external websites is at your own risk.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">12. Website Availability</h2>
              <p>I may update, modify, suspend, or withdraw the websites at any time without notice.</p>
              <p>The websites are provided on an “as is” and “as available” basis.</p>
              <p>I do not guarantee that:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>The websites will always be available</li>
                <li>Access will be uninterrupted or error-free</li>
                <li>The websites will be secure or free from vulnerabilities</li>
              </ul>
              <p className="mt-4">You are responsible for using appropriate security measures when accessing the websites.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">13. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>I exclude all implied warranties, conditions, and representations</li>
                <li>I shall not be liable for any indirect, incidental, or consequential loss arising from your use of the websites</li>
              </ul>
              <p className="mt-4">Nothing in these Terms excludes or limits liability for:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Death or personal injury caused by negligence</li>
                <li>Fraud or fraudulent misrepresentation</li>
                <li>Any liability that cannot be excluded under applicable law</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">14. Acceptable Use</h2>
              <p>You must not misuse the websites.</p>
              <p>This includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Attempting unauthorised access</li>
                <li>Interfering with systems or infrastructure</li>
                <li>Using automated tools without permission</li>
                <li>Copying or exploiting content unlawfully</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">15. Privacy and Cookies</h2>
              <p>Your use of these websites is also governed by the Privacy Policy and Cookie Policy.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">16. Changes to These Terms</h2>
              <p>I may update these Terms from time to time.</p>
              <p>Changes will be posted on this page with an updated “Last Updated” date. Continued use of the websites indicates acceptance of the updated Terms.</p>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">17. Severability and No Waiver</h2>
              <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force.</p>
              <p>Failure to enforce any right does not constitute a waiver of that right.</p>
            </section>

            {/* Section 18 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">18. Governing Law</h2>
              <p>These Terms are governed by and construed in accordance with the laws of England and Wales.</p>
              <p>Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </section>

            {/* Section 19 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">19. Contact</h2>
              <p>For any legal or website-related enquiries:</p>
              <p className="text-text-muted font-mono">📧 dinesh@46dc.com</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
