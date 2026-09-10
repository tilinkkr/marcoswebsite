import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/blogs";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://marcos.example";
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
  ].map((route) => ({ url: base + route, lastModified: new Date() }));
  const posts = (await getBlogs())
    .filter((x) => x.status === "published")
    .map((x) => ({
      url: `${base}/insights/${x.slug}`,
      lastModified: new Date(x.updated_at),
    }));
  return [...routes, ...posts];
}
