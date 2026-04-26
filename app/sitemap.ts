import type { MetadataRoute } from "next";

const BASE = "https://zari.help";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ai-companion`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ai-friend-spanish`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ai-that-remembers`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
