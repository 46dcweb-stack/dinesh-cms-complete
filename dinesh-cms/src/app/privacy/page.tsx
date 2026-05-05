import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Dinesh Koyyalamudi',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-20 lg:pt-12 pb-24 font-body">
      <div className="px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              Legal Protocol
            </span>
            <h1 className="text-5xl md:text-7xl font-display leading-[1.1] tracking-tight mb-8">
              Privacy <span className="text-gradient italic">Policy.</span>
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
              <p>
                This Privacy Policy explains how Dinesh Koyyalamudi (“I”, “me”, or “my”) collects, uses, and protects personal data when you visit my website or interact with me.
              </p>
              <p>This policy applies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>www.46dc.com</li>
                <li>www.dineshkoyyalamudi.com</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">2. Who I Am</h2>
              <p className="font-semibold text-white">Data Controller:</p>
              <p>Dinesh Koyyalamudi</p>
              
              <p className="font-semibold text-white mt-4">Address:</p>
              <div className="text-text-muted">
                <p>66 Paul Street</p>
                <p>London, England</p>
                <p>EC2A 4NA</p>
                <p>United Kingdom</p>
              </div>
              
              <div className="mt-4 text-text-muted space-y-1">
                <p>📧 enquiry@46dc.com</p>
                <p>📧 dinesh@46dc.com</p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-6">
              <h2 className="text-2xl font-display text-white mb-4">3. What Data I Collect</h2>
              
              <div className="space-y-3">
                <h3 className="text-lg font-display text-white">a) Information You Provide</h3>
                <p>When you contact me via my website, I may collect:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Subject or enquiry type</li>
                </ul>
                <p className="mt-4">When you subscribe to my newsletter, I collect:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>First name</li>
                  <li>Email address</li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">b) Newsletter Consent Data</h3>
                <p>To ensure compliance with data protection laws, I maintain records of your consent, including:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>Date and time of signup</li>
                  <li>Consent wording version</li>
                  <li>Double opt-in confirmation timestamp</li>
                  <li>Subscription source</li>
                  <li>Unsubscribe timestamp</li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">c) Technical Data</h3>
                <p>When you use the website, I may collect:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-muted">
                  <li>IP address</li>
                  <li>Device and browser information</li>
                  <li>Pages visited and interactions</li>
                </ul>
                <p>This data is collected through cookies and analytics tools.</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-lg font-display text-white">d) Third-Party Content</h3>
                <p>The website may include embedded content (such as YouTube videos). These services may collect data about you and use cookies.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">4. Data Minimisation</h2>
              <p>
                I only collect and process personal data that is necessary for the purposes outlined in this policy and take reasonable steps to ensure it is relevant and limited.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">5. How I Use Your Data</h2>
              <p>I use personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>To respond to enquiries and communications</li>
                <li>To manage speaking, collaboration, or business enquiries</li>
                <li>To send newsletter updates and communications (where you have consented)</li>
                <li>To analyse website performance and improve user experience</li>
                <li>To maintain website security and prevent misuse</li>
                <li>To manage and administer my professional activities</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">6. Legal Basis for Processing</h2>
              <p>I process personal data based on:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Legitimate interests – to respond to enquiries and operate the website</li>
                <li>Pre-contract steps – where enquiries relate to potential collaborations or opportunities</li>
                <li>Consent – for newsletter subscriptions and analytics cookies</li>
                <li>Legal obligations – where applicable</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">7. Newsletter and Marketing Communications</h2>
              <p>If you subscribe to my newsletter:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>You will receive updates, insights, and announcements related to my work and ventures</li>
                <li>Subscription is based on your explicit consent</li>
              </ul>
              <p>I use Brevo to manage newsletter communications. Brevo may process your data on my behalf.</p>
              <p>Newsletter communications may include basic engagement tracking, such as whether emails are opened or links are clicked, to help improve content and relevance.</p>
              <p className="mt-4">You can unsubscribe at any time by:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Clicking the unsubscribe link in emails</li>
                <li>Contacting me directly</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">8. Cookies and Analytics</h2>
              <p>I use cookies and similar technologies, including Google Analytics, to understand how visitors use the website.</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Non-essential cookies are used only with your consent</li>
                <li>You can manage or withdraw consent via the cookie banner</li>
                <li>You can also control cookies through your browser settings</li>
              </ul>
              <p>For more details, please refer to the Cookie Policy.</p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">9. How Your Data Is Stored</h2>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Contact enquiries are sent directly to secure email systems (Google Workspace)</li>
                <li>Newsletter data is managed through Brevo</li>
                <li>Website infrastructure is hosted on secure cloud services (Firebase)</li>
              </ul>
              <p>I implement appropriate technical and organisational measures to protect personal data.</p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">10. Data Retention</h2>
              <p>I retain personal data only as long as necessary:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Contact enquiries: up to 12 months</li>
                <li>Newsletter data: until you unsubscribe</li>
                <li>Consent records: retained as required for compliance</li>
                <li>Analytics data: in line with Google Analytics settings</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">11. Sharing Your Data</h2>
              <p>I do not sell personal data.</p>
              <p>I may share data with trusted service providers, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Google (hosting, email, analytics)</li>
                <li>Brevo (newsletter services)</li>
              </ul>
              <p>These providers act as data processors and process personal data only on my instructions and in accordance with applicable data protection laws.</p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">12. International Transfers</h2>
              <p>Some service providers may process personal data outside the United Kingdom.</p>
              <p>Where personal data is transferred or accessed internationally, I take steps to ensure appropriate safeguards (such as contractual protections) are in place in accordance with applicable data protection laws.</p>
            </section>

            {/* Section 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">13. Data Security</h2>
              <p>I implement appropriate technical and organisational measures, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>HTTPS encryption</li>
                <li>Secure access controls</li>
                <li>Restricted system access</li>
                <li>Use of reputable cloud infrastructure providers</li>
              </ul>
              <p>However, no method of transmission over the internet is completely secure.</p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">14. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-muted">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Restrict or object to processing</li>
                <li>Withdraw consent at any time</li>
                <li>Data portability (where applicable)</li>
              </ul>
              <p className="mt-4">To exercise your rights, contact:</p>
              <p className="text-text-muted font-mono">📧 dinesh@46dc.com</p>
            </section>

            {/* Section 15 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">15. Children’s Privacy</h2>
              <p>This website is not directed at individuals under the age of 18.</p>
              <p>I do not knowingly collect personal data from children. If such data is identified, it will be deleted promptly.</p>
            </section>

            {/* Section 16 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">16. Complaints</h2>
              <p>If you have concerns about how your data is handled, please contact me first at <a href="mailto:dinesh@46dc.com" className="text-brand-primary hover:underline">dinesh@46dc.com</a>.</p>
              <p>You also have the right to complain to the UK Information Commissioner’s Office (ICO):</p>
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline block mt-2">https://ico.org.uk</a>
            </section>

            {/* Section 17 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-white mb-4">17. Changes to This Policy</h2>
              <p>I may update this Privacy Policy from time to time.</p>
              <p>Changes will be posted on this page with an updated “Last Updated” date. Where appropriate, I may also notify you of significant changes.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
