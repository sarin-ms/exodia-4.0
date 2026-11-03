import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  // The landing-page sections share one URL; registration and tickets are noindex.
  return [{ url: new URL("/", siteConfig.url).href }];
}
