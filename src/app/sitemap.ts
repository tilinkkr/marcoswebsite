import type { MetadataRoute } from "next";
import { ABROAD_COUNTRIES, GCC_COUNTRIES } from "@/config/gcc";
import { authorPath, MARCOS_AUTHORS } from "@/lib/authors";
import { getBlogs } from "@/lib/blogs";
import { blogSitemapEntries } from "@/lib/blog-sitemap";
import { absoluteUrl } from "@/lib/site";

// The sitemap is cached by Next.js by default. Rebuild it periodically so
// articles published directly through the CMS are discovered without a deploy.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/join",
    "/indicators",
    "/team",
    "/team/join",
    "/more",
    "/story",
    "/method",
    "/contact",
    "/insights",
    "/editorial-standards",
    "/trading-community",
    "/trading-education",
    "/kerala",
    "/gcc",
    ...GCC_COUNTRIES.map((country) => `/gcc/${country.slug}`),
    "/abroad",
    ...ABROAD_COUNTRIES.map((country) => `/abroad/${country.slug}`),
    "/get-funded",
    "/faq",
    "/funded-account-guide",
    "/risk-disclosure",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: absoluteUrl(route || "/"),
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/insights" ? 0.9 : 0.7,
  }));
  const posts = blogSitemapEntries(await getBlogs());
  const authors = MARCOS_AUTHORS.map((author) => ({
    url: absoluteUrl(authorPath(author.slug)),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...routes, ...authors, ...posts]) {
    uniqueEntries.set(entry.url, entry);
  }
  return [...uniqueEntries.values()];
}
