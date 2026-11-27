import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
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
        <div className={local.articleShell}>
          <article className={local.article}>
            {heroImage && (
              <div className={local.heroFrame}>
                <Image
                  className={local.hero}
                  src={heroImage}
                  alt={post.title}
                  width={1280}
                  height={720}
                  preload
                  sizes="(max-width: 1024px) 100vw, 52rem"
                />
              </div>
            )}
            <MarkdownArticle markdown={post.content_markdown} />
          </article>
          <aside
            className={local.stickyRail}
            aria-label="Strategy desk and funded account partner"
          >
            <div className={local.railCardWa}>
              <span className={local.railBadge}>
                <span className={local.railDot} aria-hidden />
                LIVE DESK · KERALA · INDIA · GCC
              </span>
              <h2>Want the exact strategy &amp; live Google Meet desk?</h2>
              <p>
                Ask our mentors free on WhatsApp in English or Malayalam. Get
                today&apos;s XAUUSD / FX risk checklist before paying any fee.
              </p>
              <WhatsAppLink
                className={local.railGlassWa}
                href={getWhatsAppUrl(
                  `Hi MARKOS, I'm reading "${post.title}". Please share your exact strategy checklist and daily Google Meet details.`,
                )}
                placement={`article-rail:${post.slug}`}
                data-whatsapp-primary
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={18} />
                <span>Get Strategy on WhatsApp</span>
              </WhatsAppLink>
            </div>

            {FEATURED_PARTNER ? (
              <div className={local.railCardPartner}>
                <span className={local.railBadgeRed}>
                  VERIFIED PARTNER LINK
                </span>
                <h3>Start your funded account cleanly</h3>
                <p>
                  Open your {FEATURED_PARTNER.name} challenge via our verified
                  partner link, then send your drawdown rules to our desk before
                  trade #1.
                </p>
                <a
                  className={local.railRedBtn}
                  href={FEATURED_PARTNER.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  START VIA {FEATURED_PARTNER.name.toUpperCase()} ↗
                </a>
                <small>
                  Disclosed affiliate link: MARKOS may earn a commission at zero
                  extra cost to you.
                </small>
              </div>
            ) : null}
          </aside>
        </div>

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
        <section
          className={local.whatsappBanner}
          aria-labelledby="article-whatsapp-title"
        >
          <div>
            <p className={local.whatsappEyebrow}>
              MARKOS LIVE DESK · KERALA, BENGALURU, MUMBAI &amp; GCC
            </p>
            <h2 id="article-whatsapp-title">
              Ready to pass with a real strategy and mentor review?
            </h2>
            <p>
              Message our desk on WhatsApp (+91 91875 87488) to ask for our live
              Google Meet timings, or start a clean funded evaluation via our
              verified {FEATURED_PARTNER?.name ?? "partner"} link.
            </p>
          </div>
          <div className={local.whatsappActions}>
            <WhatsAppLink
              className={local.whatsappPrimary}
              href={getWhatsAppUrl(
                `Hi MARKOS, I finished reading "${post.title}" and want to ask about your exact strategy and daily Google Meet community.`,
              )}
              placement={`article:${post.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} />
              <span>MESSAGE ON WHATSAPP</span>
            </WhatsAppLink>
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
          </div>
        </section>
        <nav
          className={local.relatedLinks}
          aria-label="Related guides and global city hubs"
        >
          <span>POPULAR GUIDES &amp; REGIONAL HUBS:</span>
          <Link href="/insights/pass-funded-account-in-3-days-3-trades-8-accounts-strategy-2026">
            Pass in 3 Days / 8 Accounts &amp; XAUUSD EMA
          </Link>
          <Link href="/insights/30-things-to-check-before-buying-prop-firm-challenge-5k-1-dollar-2026">
            30 Checks Before Buying (+ $1 $5K Reality)
          </Link>
          <Link href="/insights/12-hacks-first-prop-firm-payout-india-gcc-why-payout-rejected-2026">
            12 Payout Hacks &amp; Why Payouts Get Rejected
          </Link>
          <Link href="/insights/forex-trading-basics-legal-india-dubai-golden-city-apps-myths-2026">
            Forex Legal India, Dubai Life &amp; Basics
          </Link>
          <Link href="/insights/ultimate-self-improving-trading-bot-claude-codex-tradingview-2026">
            Claude + Codex Self-Improving Bot
          </Link>
          <Link href="/kerala">Kerala</Link>
          <Link href="/gcc">Dubai &amp; GCC</Link>
          <Link href="/india/bangalore">Bengaluru</Link>
          <Link href="/india/mumbai">Mumbai</Link>
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
