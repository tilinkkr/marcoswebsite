import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/blogs";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUpdated = new Date("2026-09-18T00:00:00.000Z");
  const routes = [
    "",
    "/join",
    "/indicators",
    "/team",
    "/team/join",
    "/more",
    "/story",
    "/contact",
    "/insights",
    "/faq",
    "/risk-disclosure",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: siteUpdated,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/insights" ? 0.9 : 0.7,
  }));
  const posts = (await getBlogs())
    .filter((x) => x.status === "published")
    .map((x) => ({
      url: absoluteUrl(`/insights/${x.slug}`),
      lastModified: new Date(x.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  return [...routes, ...posts];
}
