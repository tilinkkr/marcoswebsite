import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MarkdownArticle } from "@/components/insights/MarkdownArticle";
import { authorPath, getAuthor } from "@/lib/authors";
import { blogHeroImage, getBlog } from "@/lib/blogs";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import local from "./article.module.css";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog((await params).slug);
  if (!post) return {};
  const heroImage = blogHeroImage(post);
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
      siteName: "MARKOS",
      locale: "en_IN",
      images: [absoluteUrl(post.og_image ?? heroImage)],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title,
      description: post.seo_description,
      images: [absoluteUrl(post.og_image ?? heroImage)],
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const post = await getBlog((await params).slug);
  if (!post) notFound();
  const isAutomated = post.publication_mode === "automated";
  const author = isAutomated ? null : getAuthor(post.author_slug ?? "");
  if (!isAutomated && !author) notFound();
  const articleUrl = absoluteUrl(`/insights/${post.slug}`);
  const heroImage = blogHeroImage(post);
  const authorUrl = author ? absoluteUrl(authorPath(author.slug)) : null;
  const automatedSummary = post.automated_review_report.summary;
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
        author: author
          ? {
              "@type": "Person",
              "@id": `${authorUrl}#person`,
              name: author.name,
              url: authorUrl,
            }
          : {
              "@type": "Organization",
              name: "MARKOS AI Editorial Desk",
              url: absoluteUrl("/insights"),
            },
        ...(isAutomated
          ? {}
          : {
              reviewedBy: {
                "@type": "Person",
                name: post.reviewer_name,
                url: post.reviewer_proof_url,
              },
            }),
        datePublished: post.published_at,
        dateModified: post.updated_at,
        image: absoluteUrl(heroImage),
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
            {author ? (
              <Link href={authorPath(author.slug)}>
                {author.name}
                <br />
                <span>{author.role}</span>
              </Link>
            ) : (
              <p>
                MARKOS AI Editorial Desk
                <br />
                <span>AI-assisted educational content; no human review</span>
              </p>
            )}
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
              {post.last_reviewed_at && (
                <>
                  <br />
                  <time dateTime={post.last_reviewed_at}>
                    {isAutomated ? "Automated checks run " : "Reviewed "}
                    {new Date(post.last_reviewed_at).toLocaleDateString(
                      "en-IN",
                    )}
                  </time>
                </>
              )}
            </p>
          </div>
        </header>
        <Image
          className={local.hero}
          src={heroImage}
          alt={post.title}
          width={1600}
          height={900}
          preload
          sizes="100vw"
        />
        <aside className={local.trustPanel} aria-label="Article standards">
          <div>
            <span>METHOD</span>
            <p>{post.methodology}</p>
          </div>
          <div>
            <span>
              {isAutomated ? "AUTOMATED CONTENT CHECK" : "HUMAN REVIEW"}
            </span>
            <p>
              {isAutomated
                ? typeof automatedSummary === "string"
                  ? automatedSummary
                  : "Automated source, claim, risk-language, and attribution checks passed. No human editor reviewed this article."
                : `Reviewed by ${post.reviewer_name}. ${post.reviewer_qualification}`}
            </p>
          </div>
          <div>
            <span>LIMITATIONS</span>
            <p>{post.limitations}</p>
          </div>
          <div>
            <span>DISCLOSURE</span>
            <p>{post.conflicts_disclosure}</p>
          </div>
        </aside>
        <article className={local.article}>
          <MarkdownArticle markdown={post.content_markdown} />
        </article>
        <section className={local.evidence} aria-labelledby="evidence-title">
          <div>
            <p>ARTICLE RECORD</p>
            <h2 id="evidence-title">Evidence and accountability</h2>
            <p>
              {isAutomated
                ? "These primary or authoritative links were checked by an automated editorial workflow. Automated checks can miss errors; verify current rules directly. They are not a guarantee of market outcomes."
                : "These links support the article's named authorship and review. They are evidence to inspect, not a guarantee of market outcomes."}
            </p>
          </div>
          <div className={local.evidenceGrid}>
            {author && (
              <>
                <article>
                  <span>AUTHOR EVIDENCE</span>
                  <h3>{author.name}</h3>
                  <p>{author.focus}</p>
                  {post.author_proof_url && (
                    <a
                      href={post.author_proof_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Inspect supporting profile ↗
                    </a>
                  )}
                </article>
                <article>
                  <span>REVIEWER EVIDENCE</span>
                  <h3>{post.reviewer_name}</h3>
                  <p>{post.reviewer_qualification}</p>
                  {post.reviewer_proof_url && (
                    <a
                      href={post.reviewer_proof_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Inspect reviewer evidence ↗
                    </a>
                  )}
                </article>
              </>
            )}
            <article className={local.sources}>
              <span>PRIMARY / AUTHORITATIVE SOURCES</span>
              <ol>
                {post.source_urls.map((source, index) => (
                  <li key={source}>
                    <a href={source} target="_blank" rel="noreferrer noopener">
                      Source {index + 1}: {new URL(source).hostname}
                    </a>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>
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
