import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url }];
}
