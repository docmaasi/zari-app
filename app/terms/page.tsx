import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ZariLogo } from "@/components/zari-logo";

export const metadata = {
  title: "Terms of Use — Zari",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zari-bg">
      <nav className="border-b border-white/5 bg-zari-bg/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ZariLogo size={32} />
            <span className="text-lg font-bold text-zari-text">Zari</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zari-muted hover:text-zari-text mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-zari-text mb-2">
          Terms of Use
        </h1>
        <p className="text-sm text-zari-muted mb-10">
          Last updated: April 2, 2026
        </p>

        <div className="space-y-8 text-sm text-zari-text/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Zari (&quot;the Service&quot;), you agree to be bound by these Terms of Use. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              2. Description of Service
            </h2>
            <p>
              Zari is an AI-powered companion application that provides conversational AI, memory features, text-to-speech, and multilingual support. Zari is designed to assist, support, and engage users in conversation. Zari is not a substitute for professional medical, legal, financial, or psychological advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              3. User Accounts
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-zari-muted">
              <li>You must be at least 13 years old to use Zari</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate information during registration</li>
              <li>One person may not maintain more than one account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zari-muted">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to exploit, harm, or manipulate the AI system</li>
              <li>Share harmful, abusive, or inappropriate content</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use automated systems or bots to access the Service</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              5. AI Disclaimers
            </h2>
            <p>
              Zari is an AI assistant and may produce inaccurate, incomplete, or inappropriate responses. The Service includes responsible disclosure notices for health, financial, and legal topics. These disclosures are reminders to seek professional advice and do not constitute professional guidance themselves.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              6. Intellectual Property
            </h2>
            <p>
              The Zari name, logo, design, and underlying technology are the intellectual property of Zari and its licensors. Your conversations remain your own, but you grant us a license to process them for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Zari shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. The Service is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              8. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these terms. You may delete your account at any time through the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              10. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a
                href="mailto:legal@zari.help"
                className="text-zari-accent hover:text-zari-accent-light"
              >
                legal@zari.help
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
