import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexClientProvider } from "@/components/convex-provider";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const SITE_TITLE = "Zari — AI That Remembers You";
const SITE_DESCRIPTION =
  "Voice-first AI companion that listens, remembers everything that matters, and grows with you. 16 languages. Talk in your headphones.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon-180.png",
    shortcut: "/favicon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zari",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://www.zari.help",
    siteName: "Zari",
    type: "website",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Zari" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/icon-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ff3d8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ff3d8a",
          colorBackground: "#16161f",
          colorInputBackground: "#1f1f2c",
          colorText: "#f7f7fb",
        },
      }}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/chat"
      signUpFallbackRedirectUrl="/chat"
    >
      <html lang="en">
        <head>
          {/* Preconnects shave ~150-300ms off Google Fonts on first paint */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        </head>
        <body>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <ServiceWorker />
        </body>
      </html>
    </ClerkProvider>
  );
}
