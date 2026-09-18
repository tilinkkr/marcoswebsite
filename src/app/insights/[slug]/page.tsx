import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MarkdownArticle } from "@/components/insights/MarkdownArticle";
import { getBlog } from "@/lib/blogs";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import local from "./article.module.css";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog((await params).slug);
  if (!post) return {};
  const canonical =
    post.canonical_url?.startsWith(SITE_URL) === true
      ? post.canonical_url
      : absoluteUrl(`/insights/${post.slug}`);
  return {
    title: { absolute: post.seo_title },
    description: post.seo_description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.seo_title,
      description: post.seo_description,
      url: canonical,
      siteName: "MARCOS",
      locale: "en_IN",
      images: [absoluteUrl(post.og_image ?? post.hero_image)],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title,
      description: post.seo_description,
      images: [absoluteUrl(post.og_image ?? post.hero_image)],
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const post = await getBlog((await params).slug);
  if (!post) notFound();
  const articleUrl = absoluteUrl(`/insights/${post.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        headline: post.title,
        description: post.seo_description,
        url: articleUrl,
        mainEntityOfPage: { "@id": articleUrl },
        author: { "@type": "Person", name: post.author_name },
        datePublished: post.published_at,
        dateModified: post.updated_at,
        image: absoluteUrl(post.hero_image),
        keywords: post.tags.join(", "),
        articleSection: post.category,
        inLanguage: "en-IN",
        isAccessibleForFree: true,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: absoluteUrl("/insights"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };
  return (
    <div className={local.page}>
      <SiteHeader />
      <main>
        <nav className={local.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>→</span>
          <Link href="/insights">Insights</Link>
          <span aria-hidden>→</span>
          <span aria-current="page">{post.category}</span>
        </nav>
        <header className={local.header}>
          <p>
            {post.category} / {post.reading_time} MIN READ
          </p>
          <h1>{post.title}</h1>
          <div>
            <Link href="/team">
              {post.author_name}
              <br />
              <span>Named contributor</span>
            </Link>
            <p>
              {post.published_at && (
                <time dateTime={post.published_at}>
                  Published{" "}
                  {new Date(post.published_at).toLocaleDateString("en-IN")}
                </time>
              )}
              <br />
              <time dateTime={post.updated_at}>
                Updated {new Date(post.updated_at).toLocaleDateString("en-IN")}
              </time>
            </p>
          </div>
        </header>
        <Image
          className={local.hero}
          src={post.hero_image}
          alt={`Editorial illustration for ${post.title}`}
          width={1600}
          height={900}
          priority
          sizes="100vw"
        />
        <aside className={local.trustPanel} aria-label="Article standards">
          <div>
            <span>METHOD</span>
            <p>
              Definitions, examples, and limitations are separated so readers
              can distinguish educational explanation from interpretation.
            </p>
          </div>
          <div>
            <span>REVIEW STATUS</span>
            <p>
              {post.requires_regulatory_review
                ? "Financial and regulatory details require periodic review against current primary sources."
                : "Reviewed under the MARCOS editorial process."}
            </p>
          </div>
          <div>
            <span>LIMITATION</span>
            <p>
              Educational information only. Not personalised investment, legal,
              or tax advice and not a promise of any market outcome.
            </p>
          </div>
        </aside>
        <article className={local.article}>
          <MarkdownArticle markdown={post.content_markdown} />
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(jsonLd),
          }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
