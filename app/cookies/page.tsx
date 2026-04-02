import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — Zari",
};

export default function CookiesPage() {
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
          Cookie Policy
        </h1>
        <p className="text-sm text-zari-muted mb-10">
          Last updated: April 2, 2026
        </p>

        <div className="space-y-8 text-sm text-zari-text/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              1. What Are Cookies
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              2. How We Use Cookies
            </h2>
            <p>Zari uses the following types of cookies:</p>

            <div className="mt-4 space-y-4">
              <div className="bg-zari-surface rounded-xl p-4 border border-white/5">
                <h3 className="font-medium text-zari-text mb-1">Essential Cookies</h3>
                <p className="text-zari-muted text-xs">
                  Required for authentication and core functionality. These cannot be disabled. They include session tokens from Clerk (our authentication provider) and security cookies.
                </p>
              </div>

              <div className="bg-zari-surface rounded-xl p-4 border border-white/5">
                <h3 className="font-medium text-zari-text mb-1">Functional Cookies</h3>
                <p className="text-zari-muted text-xs">
                  Remember your preferences such as language selection, personality mode, and voice settings. These improve your experience but are not strictly necessary.
                </p>
              </div>

              <div className="bg-zari-surface rounded-xl p-4 border border-white/5">
                <h3 className="font-medium text-zari-text mb-1">Analytics Cookies</h3>
                <p className="text-zari-muted text-xs">
                  Help us understand how users interact with Zari so we can improve the experience. These collect anonymous usage data and do not identify you personally.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              3. Third-Party Cookies
            </h2>
            <p>
              Our third-party services (Clerk, Vercel) may set their own cookies for authentication and performance purposes. We do not control these cookies. Please refer to their respective cookie policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              4. Managing Cookies
            </h2>
            <p>
              You can control cookies through your browser settings. Note that disabling essential cookies may prevent you from using Zari. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zari-muted">
              <li>View what cookies are stored</li>
              <li>Delete individual or all cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all third-party cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zari-text mb-3">
              5. Contact
            </h2>
            <p>
              For questions about our Cookie Policy, contact us at{" "}
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
