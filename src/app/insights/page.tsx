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
  title: "Trading Risk, Process & Prop-Firm Guides for India",
  description:
    "Practical, answer-first guides for Indian traders on drawdown rules, prop-firm evaluations, trade review, indicators and risk-aware decision-making.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "MARKOS Trading Insights",
    description:
      "Practical guides to trading process, risk, evaluation rules and Indian market participation.",
    url: "/insights",
  },
};

const practicalGuides = [
  {
    category: "EVALUATION CHECKLIST",
    question: "What should I check before paying for a prop-firm evaluation?",
    answer:
      "Read the current rules before the price: daily and total loss limits, how drawdown is calculated, payout conditions, prohibited strategies, data or reset fees, and what happens after a breach. Rules differ by provider, so verify them in the provider’s own terms and never treat an evaluation as guaranteed income.",
    href: "/faq",
    action: "REVIEW COMMON QUESTIONS",
  },
  {
    category: "RISK BASICS",
    question: "What is the difference between daily loss and maximum drawdown?",
    answer:
      "A daily loss limit usually caps losses within a defined trading day; maximum drawdown limits losses across a longer period or from a specified balance or equity peak. Providers define timing, open-position treatment and reset rules differently—check the exact calculation, not just the headline percentage.",
    href: "/risk-disclosure",
    action: "READ THE RISK DISCLOSURE",
  },
  {
    category: "TRADE REVIEW",
    question: "How can I review a trading session without copying trades?",
    answer:
      "Compare the plan with the decisions actually made: market context, entry reason, invalidation, position risk, exit and any rule breaks. Judge the quality of the process separately from the result; one profitable trade does not prove a sound method, and one loss does not automatically disprove it.",
    href: "/method",
    action: "SEE THE MARKOS METHOD",
  },
  {
    category: "INDICATOR EDUCATION",
    question: "Do trading indicators tell you when to buy or sell?",
    answer:
      "An indicator transforms price or volume data into a view that may help describe conditions; it cannot know what happens next or remove risk. Learn its inputs, lag and failure modes, test it in context, and define risk independently rather than treating an indicator as a guaranteed signal.",
    href: "/indicators",
    action: "EXPLORE INDICATOR TOOLS",
  },
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
        <section
          className={`${styles.section} ${posts.length === 0 ? local.noPosts : ""}`}
        >
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
          ) : null}
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

          <section className={local.guideHub} aria-labelledby="guide-title">
            <header>
              <div>
                <span>MARKOS FIELD NOTES / INDIA</span>
                <h2 id="guide-title">PRACTICAL ANSWERS. CLEAR RISK.</h2>
              </div>
              <p>
                Start with the question, understand the limits, then verify the
                current rules that apply to you. These educational guides are
                written for Indian traders—not as personalised financial advice.
              </p>
            </header>
            <div className={local.guideGrid}>
              {practicalGuides.map((guide, index) => (
                <article className={local.guideCard} key={guide.category}>
                  <div className={local.guideTopline}>
                    <span>{guide.category}</span>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{guide.question}</h3>
                  <p>{guide.answer}</p>
                  <Link href={guide.href}>
                    {guide.action} <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
            <aside className={local.indiaContext}>
              <div>
                <span>INDIA / INVESTOR CONTEXT</span>
                <h3>
                  Good market information starts with the right questions.
                </h3>
              </div>
              <p>
                SEBI&apos;s 2025 Investor Survey reports that market insights
                were an information need for 81% of surveyed investors; risk
                factors were named by 35%. These are survey findings—not
                keyword-volume data or a prediction of returns. Use them as a
                reminder to examine both opportunity and downside.
              </p>
              <a
                href="https://www.sebi.gov.in/sebi_data/commondocs/jan-2026/Investor%20Survey%202025%20Main%20Report.pdf"
                target="_blank"
                rel="noreferrer"
              >
                READ SEBI&apos;S INVESTOR SURVEY{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </aside>
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
