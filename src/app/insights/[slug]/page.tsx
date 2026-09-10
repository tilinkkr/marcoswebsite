import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MarkdownArticle } from "@/components/insights/MarkdownArticle";
import { getBlog } from "@/lib/blogs";
import local from "./article.module.css";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog((await params).slug);
  if (!post) return {};
  return {
    title: { absolute: post.seo_title },
    description: post.seo_description,
    alternates: { canonical: post.canonical_url ?? `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seo_title,
      description: post.seo_description,
      images: [post.og_image ?? post.hero_image],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const post = await getBlog((await params).slug);
  if (!post) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description,
    author: { "@type": "Person", name: "Rahul Raja", url: "/team" },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.hero_image,
    publisher: { "@type": "Organization", name: "MARCOS" },
  };
  return (
    <div className={local.page}>
      <SiteHeader />
      <main>
        <header className={local.header}>
          <p>
            {post.category} / {post.reading_time} MIN READ
          </p>
          <h1>{post.title}</h1>
          <div>
            <Link href="/team">
              Rahul Raja
              <br />
              <span>Founder, MARCOS</span>
            </Link>
            <time dateTime={post.updated_at}>
              Updated {new Date(post.updated_at).toLocaleDateString("en-IN")}
            </time>
          </div>
        </header>
        <Image
          className={local.hero}
          src={post.hero_image}
          alt="Abstract risk boundaries around a trading account"
          width={1600}
          height={900}
          priority
          sizes="100vw"
        />
        <article className={local.article}>
          <MarkdownArticle markdown={post.content_markdown} />
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
