import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/public-pages.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getBlogs } from "@/lib/blogs";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import local from "./insights.module.css";
export const metadata: Metadata = {
  title: "Trading Insights for Indian Traders",
  description:
    "Evidence-led trading education for Indian market participants: risk, prop-firm rules, market analysis, psychology, tax, investing, and scam safety.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "MARKOS Trading Insights",
    description:
      "People-first guides about trading process, risk, Indian markets, and safer participation.",
    url: "/insights",
  },
};

const plannedGuides = [
  ["START HERE", "India Stock-Market Starter Kit"],
  ["LONG-TERM", "SIP, Mutual Funds and Index Investing"],
  ["RISK", "The Reality and Risks of F&O Trading in India"],
  ["PROCESS", "Trading Psychology and Risk Management"],
  ["TAX", "Stock-Market Tax, F&O, STCG, LTCG and ITR"],
  ["IPOS", "ASBA, UPI Mandates and Allotment"],
  ["COMPARE", "ETF vs Index Fund vs Mutual Fund vs Direct Stocks"],
  ["ANALYSIS", "How to Analyse Indian Companies Without Guessing"],
  ["CHARTS", "Technical Analysis Without Selling Signals"],
  ["SAFETY", "Trading Scams, Telegram Tips and WhatsApp Safety"],
] as const;

export default async function InsightsPage() {
  const posts = await getBlogs();
  const featured = posts.find((x) => x.featured) ?? posts[0];
  const remaining = posts.filter((post) => post.id !== featured?.id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MARKOS Trading Insights",
    description:
      "Educational articles about trading process, risk, Indian markets, and responsible participation.",
    url: absoluteUrl("/insights"),
    inLanguage: "en-IN",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: absoluteUrl(`/insights/${post.slug}`),
      })),
    },
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>MARKOS / INSIGHTS</p>
          <h1 className={styles.title}>
            STUDY THE
            <br />
            RULES FIRST.
          </h1>
          <p className={styles.lede}>
            Evidence-led guides for Indian traders who want to understand the
            decision, define the risk, and review the outcome—not chase tips.
          </p>
          <div className={local.principles} aria-label="Editorial principles">
            <span>PROCESS OVER IMPULSE</span>
            <span>PRIMARY SOURCES</span>
            <span>NO GUARANTEED RETURNS</span>
          </div>
        </section>
        <section className={styles.section}>
          {featured ? (
            <Link
              className={local.featured}
              href={`/insights/${featured.slug}`}
            >
              <div>
                <span>{featured.category} / FEATURED</span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <small>
                  {featured.author_name} · {featured.reading_time} MIN READ ·
                  UPDATED{" "}
                  {new Date(featured.updated_at).toLocaleDateString("en-IN")}
                </small>
              </div>
              <Image
                src={featured.hero_image}
                alt={`Editorial illustration for ${featured.title}`}
                width={1600}
                height={900}
                sizes="(max-width: 767px) 100vw, 46vw"
              />
            </Link>
          ) : (
            <p>No published insights yet.</p>
          )}
          {remaining.length > 0 && (
            <div className={local.grid}>
              {remaining.map((post) => (
                <Link
                  className={local.card}
                  href={`/insights/${post.slug}`}
                  key={post.id}
                >
                  <Image
                    src={post.hero_image}
                    alt={`Editorial illustration for ${post.title}`}
                    width={960}
                    height={540}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <span>{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <small>
                    {post.reading_time} MIN READ ·{" "}
                    {new Date(post.updated_at).toLocaleDateString("en-IN")}
                  </small>
                </Link>
              ))}
            </div>
          )}

          <section className={local.roadmap} aria-labelledby="roadmap-title">
            <header>
              <div>
                <span>EDITORIAL DESK / NEXT</span>
                <h2 id="roadmap-title">
                  THE KNOWLEDGE BASE WE&apos;RE BUILDING.
                </h2>
              </div>
              <p>
                Upcoming guides are shown as an editorial roadmap—not published
                advice. Each article will require source verification, human
                review, visible limitations, and a current risk note before it
                goes live.
              </p>
            </header>
            <div className={local.roadmapGrid}>
              {plannedGuides.map(([category, title], index) => (
                <article className={local.roadmapCard} key={title}>
                  <div className={local.imagePlaceholder} aria-hidden="true">
                    <span>IMAGE PLACEHOLDER</span>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                  </div>
                  <div className={local.roadmapCopy}>
                    <span>{category} / IN REVIEW</span>
                    <h3>{title}</h3>
                    <p>Author assigned after evidence and expertise review.</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside
            className={local.editorialNote}
            aria-label="Editorial standard"
          >
            <span>OUR STANDARD</span>
            <p>
              MARKOS separates fact, interpretation, educational examples, and
              opinion. Nothing here is personalised investment, legal, or tax
              advice. Verify current rules with the relevant regulator,
              exchange, provider, or qualified professional.
            </p>
            <Link href="/risk-disclosure">READ THE RISK DISCLOSURE →</Link>
          </aside>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
