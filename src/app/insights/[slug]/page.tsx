import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { MarkdownArticle } from "@/components/insights/MarkdownArticle";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import {
  AUTHOR_REGISTRATION_DISCLOSURE,
  authorPath,
  bylineSlugForPost,
  getAuthor,
} from "@/lib/authors";
import { blogHeroImage, getBlog, getBlogs } from "@/lib/blogs";
import { blogCanonicalUrl } from "@/lib/blog-sitemap";
import { extractFaqs } from "@/lib/faq";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import local from "./article.module.css";

// Cache rendered article HTML at the edge (ISR) instead of uncached SSR.
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog((await params).slug);
  if (!post) return {};
  const socialImage = post.og_image ?? blogHeroImage(post);
  const canonical = blogCanonicalUrl(post);
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
      ...(socialImage ? { images: [absoluteUrl(socialImage)] } : {}),
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [
        post.publication_mode === "automated" ? "MARKOS" : post.author_name,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title,
      description: post.seo_description,
      ...(socialImage ? { images: [absoluteUrl(socialImage)] } : {}),
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const post = await getBlog((await params).slug);
  if (!post) notFound();
  const isAutomated = post.publication_mode === "automated";
  const author = isAutomated ? null : getAuthor(post.author_slug ?? "");
  if (!isAutomated && !author) notFound();
  const articleUrl = blogCanonicalUrl(post);
  const heroImage = blogHeroImage(post);
  // The named team member for this topic; `author` above is reserved for
  // posts with a recorded human review and its evidence panel.
  const byline = author ?? getAuthor(bylineSlugForPost(post));
  const authorUrl = byline ? absoluteUrl(authorPath(byline.slug)) : null;
  // FAQ answers come from the visible article body, so the structured data
  // always matches what readers see.
  const faqs = extractFaqs(post.content_markdown);
  const faqPage = faqs.length
    ? [
        {
          "@type": "FAQPage",
          "@id": `${articleUrl}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ]
    : [];
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
        author: byline
          ? {
              "@type": "Person",
              "@id": `${authorUrl}#person`,
              name: byline.name,
              jobTitle: byline.role,
              url: authorUrl,
              worksFor: { "@id": `${SITE_URL}/#organization` },
            }
          : { "@id": `${SITE_URL}/#organization` },
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
        ...(heroImage ? { image: absoluteUrl(heroImage) } : {}),
        keywords: post.tags
          .filter((tag) => !/^campaign-day-\d{2}$/i.test(tag))
          .join(", "),
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
      ...faqPage,
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
            {byline ? (
              <Link href={authorPath(byline.slug)}>
                {byline.name}
                <br />
                <span>{byline.role}</span>
                <br />
                <small>{AUTHOR_REGISTRATION_DISCLOSURE}</small>
              </Link>
            ) : (
              <p>
                MARKOS Editorial Team
                <br />
                <span>Trading education</span>
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
                    {isAutomated ? "Sources checked " : "Reviewed "}
                    {new Date(post.last_reviewed_at).toLocaleDateString(
                      "en-IN",
                    )}
                  </time>
                </>
              )}
            </p>
          </div>
        </header>
        {heroImage && (
          <Image
            className={local.hero}
            src={heroImage}
            alt={post.title}
            width={1600}
            height={900}
            preload
            sizes="100vw"
          />
        )}
        <aside className={local.trustPanel} aria-label="Article standards">
          <div>
            <span>METHOD</span>
            <p>{post.methodology}</p>
          </div>
          {!isAutomated && (
            <div>
              <span>HUMAN REVIEW</span>
              <p>{`Reviewed by ${post.reviewer_name}. ${post.reviewer_qualification}`}</p>
            </div>
          )}
          <div>
            <span>LIMITATIONS</span>
            <p>{post.limitations}</p>
          </div>
          <div>
            <span>DISCLOSURE</span>
            <p>{post.conflicts_disclosure}</p>
          </div>
        </aside>
        {FEATURED_PARTNER ? (
          <aside
            className={local.partnerPeakStrip}
            aria-label="Start your funded account via MARKOS partner link"
          >
            <div>
              <span>MARKOS PARTNER LINK · START FUNDED</span>
              <p>
                Planning to start a forex, gold (XAUUSD), or index evaluation?
                Open your <strong>{FEATURED_PARTNER.name}</strong> challenge
                using our official partner link: then message our mentors on
                WhatsApp (+91 91875 87488) to map your 0.5% risk rules before
                taking trade #1.
              </p>
              <small>
                Disclosed affiliate link: MARKOS may earn a partner commission
                at zero extra cost to you. Always read the prop firm&apos;s
                written terms before paying.
              </small>
            </div>
            <div className={local.partnerPeakActions}>
              <a
                className={local.partnerPeakBtn}
                href={FEATURED_PARTNER.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                START FUNDED ACCOUNT ({FEATURED_PARTNER.name.toUpperCase()}) ↗
              </a>
              <WhatsAppLink
                className={local.partnerPeakWa}
                href={getWhatsAppUrl(
                  `Hi MARKOS, I'm reading "${post.title}" and want to start a funded account using your partner link with mentor guidance.`,
                )}
                placement={`article-top:${post.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                ASK MENTOR ON WHATSAPP ↗
              </WhatsAppLink>
            </div>
          </aside>
        ) : null}
        <article className={local.article}>
          <MarkdownArticle markdown={post.content_markdown} />
        </article>
        <section
          className={local.whatsappBanner}
          aria-labelledby="article-whatsapp-title"
        >
          <div>
            <p className={local.whatsappEyebrow}>
              MARKOS PARTNER LINK &amp; DAILY LIVE GOOGLE MEET DESK
            </p>
            <h2 id="article-whatsapp-title">
              Ready to take your funded account, with mentor support?
            </h2>
            <p>
              Start your challenge through our verified{" "}
              {FEATURED_PARTNER?.name ?? "partner"} link, or message our mentors
              directly on WhatsApp (+91 91875 87488) to ask about daily private
              Google Meet live trading streams, 1-month risk plans, and our
              India, Kerala, GCC, UK &amp; USA trader community.
            </p>
          </div>
          <div className={local.whatsappActions}>
            {FEATURED_PARTNER ? (
              <a
                className={local.partnerBannerPrimary}
                href={FEATURED_PARTNER.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                START FUNDED ACCOUNT ({FEATURED_PARTNER.name.toUpperCase()}) ↗
              </a>
            ) : null}
            <WhatsAppLink
              className={local.whatsappPrimary}
              href={getWhatsAppUrl(
                `Hi MARKOS, I just read "${post.title}" and want to start a funded account via your link and ask about your daily live Google Meet mentor stream.`,
              )}
              placement={`article:${post.slug}`}
              data-whatsapp-primary
              target="_blank"
              rel="noreferrer"
            >
              MESSAGE MARKOS ON WHATSAPP ↗
            </WhatsAppLink>
            <Link className={local.whatsappSecondary} href="/get-funded">
              COMPARE PARTNER DETAILS →
            </Link>
          </div>
        </section>
        <nav
          className={local.relatedLinks}
          aria-label="Related guides and global city hubs"
        >
          <span>POPULAR GUIDES &amp; REGIONAL HUBS:</span>
          <Link href="/insights/best-forex-funded-account-india-uk-usa-kerala-reddit-2026">
            Best Funded Account Broker (India/UK/USA/Kerala)
          </Link>
          <Link href="/insights/backtest-10000-trading-strategies-claude-code-tradingview-2026">
            10,000+ Strategies with Claude Code &amp; TradingView
          </Link>
          <Link href="/insights/turn-claude-code-into-master-xauusd-gold-trader-5-prompts-2026">
            Master XAUUSD Gold with Claude (5 Prompts)
          </Link>
          <Link href="/insights/connect-claude-directly-to-tradingview-and-broker-results-2026">
            Connect Claude to TradingView &amp; Broker
          </Link>
          <Link href="/insights/7-free-github-repos-build-your-own-ai-trading-system-claude-2026">
            7 Free GitHub AI Trading Repos
          </Link>
          <Link href="/insights/funded-account-passed-in-1-month-3-ways-india-mentor-guide">
            Passed in 1 Month? 3 Ways + Mentor Plan
          </Link>
          <Link href="/kerala">Kerala Malayalam Group</Link>
          <Link href="/gcc">GCC Malayali Desk</Link>
          <Link href="/india/bangalore">Bangalore</Link>
        </nav>
        <section className={local.evidence} aria-labelledby="evidence-title">
          <div>
            <p>ARTICLE RECORD</p>
            <h2 id="evidence-title">Evidence and accountability</h2>
            <p>
              {isAutomated
                ? "The primary and authoritative sources behind this article. Rules change, so verify current terms directly. Sources are not a guarantee of market outcomes."
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
        <section
          className={local.accountability}
          aria-labelledby="accountability-title"
        >
          <div>
            <p>MARKOS / EDITORIAL ACCOUNTABILITY</p>
            <h2 id="accountability-title">SPOT AN ERROR OR OUTDATED RULE?</h2>
          </div>
          <p>
            Send the article URL, the exact statement, and a reliable source.
            MARKOS assesses correction reports and updates material errors when
            verified.
          </p>
          <div>
            <Link href="/contact">REPORT A CORRECTION ↗</Link>
            <Link href="/editorial-standards">
              READ OUR EDITORIAL STANDARDS ↗
            </Link>
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
