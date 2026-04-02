import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Zari",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zari-bg">
      <nav className="border-b border-white/5 bg-zari-bg/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
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
          Privacy Policy
        </h1>
        <p className="text-sm text-zari-muted mb-10">
          Last updated: April 2, 2026
        </p>

        <div className="prose-zari space-y-8 text-sm text-zari-text/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use Zari, we collect the following information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zari-muted">
              <li>Account information (name, email address) provided during sign-up via Google, Apple, or email</li>
              <li>Conversation data (messages you send and receive)</li>
              <li>Memory data (facts, events, and preferences extracted from conversations)</li>
              <li>Preference settings (language, personality mode, voice settings)</li>
              <li>Usage data (app interactions, feature usage, session duration)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zari-muted">
              <li>Provide and personalize the Zari AI companion experience</li>
              <li>Build and maintain your memory profile for contextual conversations</li>
              <li>Improve our AI models and service quality</li>
              <li>Send service-related communications</li>
              <li>Ensure security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              3. Data Storage & Security
            </h2>
            <p>
              Your data is stored securely using industry-standard encryption. Conversation data and memories are stored in our database infrastructure provided by Convex. Authentication is handled by Clerk, a trusted third-party identity provider. We implement appropriate technical and organizational measures to protect your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              4. Third-Party Services
            </h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zari-muted">
              <li>Clerk — Authentication and user management</li>
              <li>Convex — Real-time database and backend</li>
              <li>Anthropic (Claude AI) — AI-powered conversation processing</li>
              <li>Vercel — Hosting and deployment</li>
            </ul>
            <p className="mt-2">
              Each third-party service has its own privacy policy governing data handling.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              5. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zari-muted">
              <li>Access your personal data</li>
              <li>Delete your memories at any time through the app</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Export your data</li>
              <li>Opt out of non-essential data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              6. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. You can delete your memories at any time. If you delete your account, all associated data will be permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              7. Children&apos;s Privacy
            </h2>
            <p>
              Zari is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              8. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
              <a
                href="mailto:privacy@zari.help"
                className="text-zari-accent hover:text-zari-accent-light"
              >
                privacy@zari.help
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
