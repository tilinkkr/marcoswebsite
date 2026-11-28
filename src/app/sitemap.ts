import type { MetadataRoute } from "next";
import { ABROAD_COUNTRIES, GCC_COUNTRIES } from "@/config/gcc";
import { INDIA_CITIES } from "@/config/india-cities";
import { authorPath, MARCOS_AUTHORS } from "@/lib/authors";
import { getBlogs } from "@/lib/blogs";
import { blogSitemapEntries } from "@/lib/blog-sitemap";
import { absoluteUrl } from "@/lib/site";

// Rebuild periodically so newly published articles enter the sitemap without a redeploy.
export const revalidate = 60;

const LAST_CORE_UPDATE = new Date("2026-11-28T09:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Keep sitemap focused strictly on high-value, index-worthy canonical pages.
  // Utility/form/legal pages (/team/join, /more, /privacy, /terms, /risk-disclosure)
  // remain crawlable via internal navigation without diluting sitemap crawl priority
  // or triggering "Crawled - currently not indexed" bloat in Google Search Console.
  const routes = [
    "",
    "/join",
    "/indicators",
    "/team",
    "/story",
    "/method",
    "/insights",
    "/editorial-standards",
    "/trading-community",
    "/trading-education",
    "/india",
    ...INDIA_CITIES.map((city) => `/india/${city.slug}`),
    "/kerala",
    "/gcc",
    ...GCC_COUNTRIES.map((country) => `/gcc/${country.slug}`),
    "/abroad",
    ...ABROAD_COUNTRIES.map((country) => `/abroad/${country.slug}`),
    "/get-funded",
    "/faq",
    "/funded-account-guide",
  ].map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: LAST_CORE_UPDATE,
    changeFrequency:
      route === "" || route === "/insights"
        ? ("weekly" as const)
        : ("monthly" as const),
    priority:
      route === ""
        ? 1
        : route === "/insights" || route === "/funded-account-guide"
          ? 0.9
          : route === "/kerala" ||
              route === "/gcc" ||
              route === "/get-funded" ||
              route.startsWith("/india")
            ? 0.85
            : 0.75,
  }));

  const posts = blogSitemapEntries(await getBlogs());
  const authors = MARCOS_AUTHORS.map((author) => ({
    url: absoluteUrl(authorPath(author.slug)),
    lastModified: LAST_CORE_UPDATE,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...routes, ...authors, ...posts]) {
    uniqueEntries.set(entry.url, entry);
  }
  return [...uniqueEntries.values()];
}
