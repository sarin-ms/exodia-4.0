import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep noindex pages crawlable so crawlers can read their robots metadata.
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteConfig.url).href,
  };
}
