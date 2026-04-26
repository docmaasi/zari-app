import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Don't index authenticated app surfaces or API routes.
        disallow: [
          "/chat",
          "/api/",
          "/sign-in",
          "/sign-up",
          "/journal",
          "/memories",
          "/mood",
          "/sleep",
          "/voice-notes",
        ],
      },
    ],
    sitemap: "https://zari.help/sitemap.xml",
    host: "https://zari.help",
  };
}
