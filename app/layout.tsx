import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexClientProvider } from "@/components/convex-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zari — Your AI Companion",
  description:
    "An AI companion that thinks, speaks, learns, and remembers. Available in 16 languages.",
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
        </body>
      </html>
    </ClerkProvider>
  );
}
