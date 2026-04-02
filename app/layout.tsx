import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexClientProvider } from "@/components/convex-provider";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zari — Your AI Companion",
  description:
    "An AI companion that thinks, speaks, learns, and remembers. Available in 16 languages.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zari",
  },
  openGraph: {
    title: "Zari — Your AI Companion",
    description:
      "An AI companion that thinks, speaks, learns, and remembers. Available in 16 languages.",
    url: "https://www.zari.help",
    siteName: "Zari",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c5cfc",
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
          colorPrimary: "#7c5cfc",
          colorBackground: "#14142a",
          colorInputBackground: "#1e1e3a",
          colorText: "#e8e8f0",
        },
      }}
    >
      <html lang="en">
        <body>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <ServiceWorker />
        </body>
      </html>
    </ClerkProvider>
  );
}
