import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { LocationGeoBar } from "@/components/regions/LocationGeoBar";
import { FEATURED_PARTNER } from "@/config/funded-partners";
import { INDIA_CITIES } from "@/config/india-cities";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./home-aeo-hub.module.css";

const HOME_FAQS = [
  {
    q: "What is a funded account? (Funded account kya hota hai?)",
    a: "A funded account is a prop-firm trading account where you prove discipline by passing rule-based drawdown and profit objectives: earning an 80%–90% profit split on verified rewards without risking large personal savings. Always verify whether a firm's funded stage is simulated and check written payout terms.",
    href: "/insights/funded-account-in-india-meaning-price-free-challenge-2026",
    linkLabel: "Read full meaning, price & free challenge guide",
  },
  {
    q: "Which community runs a daily live Google Meet trading stream for passing funded accounts?",
    a: "MARKOS hosts a daily private, paid Google Meet live trading stream every weekday for traders in India, UAE & GCC: walking through London & New York XAUUSD context, 0.5% risk sizing, prop-firm rules, and honest post-session trade reviews.",
    href: "/insights/daily-google-meet-live-trading-stream-funded-account-community",
    linkLabel: "Inside our daily Google Meet trading stream",
  },
  {
    q: "What are the FundingPips rules & how do payouts work in India?",
    a: "FundingPips evaluations (1-Step, 2-Step Standard/Pro, Zero) enforce strict daily loss limits (4%–5%), max drawdown caps (6%–10%), minimum trading days, and consistency checks. Indian traders typically receive verified rewards via Rise or crypto rails and should consult a CA on income-tax & FEMA compliance.",
    href: "/insights/fundingpips-rules-explained-challenge-rewards-pdf-checklist",
    linkLabel: "FundingPips rules explained & printable PDF checklist",
  },
  {
    q: "Which prop firm is safe now, and is FTMO legal in India?",
    a: "No offshore prop firm is SEBI-regulated. Traders judge safety by longevity, written drawdown formulas, and proven Rise/wire payout rails (such as FTMO, The5ers, FundingPips, Alpha Capital, and FundedNext). Under RBI/FEMA, Indian residents should check live country eligibility and consult a CA before paying.",
    href: "/insights/safest-prop-firms-and-payouts-in-india-ftmo-legal-guide-2026",
    linkLabel: "Safest prop firms, payouts & FTMO India legal check",
  },
  {
    q: "How do I link a funded account to TradingView, MT5, or Tradovate?",
    a: "For MT5, log in via File -> Login to Trade Account using your firm's exact server and master password. For Tradovate + TradingView, sign data agreements at trader.tradovate.com first, then connect inside TradingView's Trading Panel under the Demo tab.",
    href: "/insights/how-to-link-funded-account-tradingview-mt5-tradovate",
    linkLabel: "Step-by-step TradingView, MT5 & Tradovate setup",
  },
  {
    q: "Can Claude AI, ChatGPT, or Google Gemini really help trade XAUUSD & funded accounts?",
    a: "AI models cannot predict candles or guarantee $100 or $1,000 days, but traders use Claude for Pine Script & CSV trade-log audits, ChatGPT for pre-trade checklists, and Gemini for IST macro-news shields: always with strict human risk management.",
    href: "/insights/how-to-use-claude-for-trading-in-india-1000-dollar-workflow",
    linkLabel: "Read our Claude, ChatGPT & Gemini trading guides",
  },
] as const;

const FEATURED_ARTICLES = [
  {
    tag: "XAUUSD & PASSING · RAHUL RAJA",
    title: "Pass a Funded Account in 3 Days or 3 Trades? How I Passed 8 Accounts & My XAUUSD EMA Entry",
    href: "/insights/pass-funded-account-in-3-days-3-trades-8-accounts-strategy-2026",
  },
  {
    tag: "30-POINT AUDIT · LINU BABU",
    title: "30 Important Things to Check Before Buying a Prop Firm Challenge (+ $1 $5K Reality)",
    href: "/insights/30-things-to-check-before-buying-prop-firm-challenge-5k-1-dollar-2026",
  },
  {
    tag: "PAYOUT HACKS · LINU BABU",
    title: "12 Hacks to Get Your First Prop Firm Payout (India & GCC) + Why 90% Fail",
    href: "/insights/12-hacks-first-prop-firm-payout-india-gcc-why-payout-rejected-2026",
  },
  {
    tag: "CLAUDE CODE · SAHAL",
    title: "I Backtested 10,000+ Trading Strategies with Claude Code & TradingView [2026]",
    href: "/insights/backtest-10000-trading-strategies-claude-code-tradingview-2026",
  },
  {
    tag: "INDIA & DUBAI · LINU BABU",
    title: "Forex Is Legal in India (Most Trade It Illegally): Basics, XAUUSD, Dubai Life & 5 Apps",
    href: "/insights/forex-trading-basics-legal-india-dubai-golden-city-apps-myths-2026",
  },
  {
    tag: "BEST BROKERS · LINU BABU",
    title: "Best Funded Account Broker & Forex Prop Firms [2026]: India, Kerala, GCC, UK & USA",
    href: "/insights/best-forex-funded-account-india-uk-usa-kerala-reddit-2026",
  },
] as const;

const STUDIO_GALLERY = [
  {
    src: "/images/studio/markos-live-stream-studio.webp",
    alt: "MARKOS mentor broadcasting the daily live Google Meet trading stream from Kerala",
    tag: "DAILY GOOGLE MEET",
    title: "Live Broadcast Desk",
    wide: true,
  },
  {
    src: "/images/studio/markos-dual-monitor-desk.webp",
    alt: "MARKOS dual-monitor execution desk with volume profile and candlestick analysis",
    tag: "EXECUTION DESK",
    title: "London & NY Session Flow",
    wide: true,
  },
  {
    src: "/images/studio/markos-kerala-mentorship-table.webp",
    alt: "MARKOS Kerala trading community roundtable reviewing risk journals",
    tag: "KERALA & GCC COMMUNITY",
    title: "Real Mentors, Real Traders",
    wide: false,
  },
  {
    src: "/images/studio/markos-mentor-chart-session.webp",
    alt: "MARKOS live chart breakdown session on breakout structure and drawdown discipline",
    tag: "STRUCTURE BREAKDOWN",
    title: "Pre-Market Levels & Rules",
    wide: false,
  },
  {
    src: "/images/studio/markos-trading-journal-plan.webp",
    alt: "MARKOS trading notebook showing Plan, Entry, and Risk framework",
    tag: "PLAN · ENTRY · RISK",
    title: "0.5% Fixed-Risk Journal",
    wide: false,
  },
] as const;

const QUICK_WHATSAPP_TOPICS = [
  {
    label: "Start Funded Account (Our Link + Mentor)",
    msg: "Hi MARKOS, I want to start a funded account using your verified partner link and get mentor support on your daily Google Meet stream.",
  },
  {
    label: "Pass Funded Account in 1 Month Plan",
    msg: "Hi MARKOS, I want mentor support and a structured 1-month risk plan to pass my funded account honestly.",
  },
  {
    label: "NASDAQ / MNQ & Futures Group (India / GCC)",
    msg: "Hi MARKOS, I trade NASDAQ (MNQ/NQ), Gold (XAUUSD) or futures from India/GCC/UK/USA. How do your daily live sessions work?",
  },
  {
    label: "WhatsApp Community for Trading in Kerala",
    msg: "Hi MARKOS, I'm looking for the Kerala Malayalam forex & funded-account WhatsApp community. How do I join?",
  },
] as const;

export function HomeAeoHub() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/")}#home-faq`,
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section
      id="funded-answers"
      className={styles.section}
      aria-labelledby="home-aeo-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              DIRECT ANSWERS · FUNDED ACCOUNTS, PROP RULES &amp; DAILY GMEET
            </p>
            <h2 id="home-aeo-title" className={styles.headline}>
              EVERY QUESTION TRADERS ASK. ANSWERED HONESTLY.
            </h2>
          </div>
          <p className={styles.intro}>
            Straight facts on funded accounts in India, FundingPips &amp; FTMO
            rules, linking TradingView/MT5/Tradovate, AI trading tools, and our
            daily private Google Meet live stream.
          </p>
        </header>

        {/* Smart Local Timezone GEO Trigger (India / Kerala / Dubai GCC / UK / USA / AU) */}
        <LocationGeoBar />

        {/* #1 Priority Partner Funded Account Banner */}
        {FEATURED_PARTNER ? (
          <div className={styles.partnerBanner}>
            <div>
              <p className={styles.partnerEyebrow}>
                VERIFIED PARTNER LINK · FOREX, XAUUSD &amp; INDICES
              </p>
              <h3 className={styles.partnerTitle}>
                Ready to take your funded account? Start via the official MARKOS
                partner link.
              </h3>
              <p className={styles.partnerCopy}>
                Open your {FEATURED_PARTNER.name} challenge through our verified
                partner link, then message our mentors on WhatsApp (+91 91875
                87488) to build your 0.5% risk plan and join our daily live
                Google Meet desk.
              </p>
              <small className={styles.partnerDisclosure}>
                Affiliate disclosure: MARKOS may earn a partner commission if
                you purchase an evaluation via this link, at zero extra cost to
                you. Always check written prop-firm terms before paying.
              </small>
            </div>
            <div className={styles.partnerActions}>
              <a
                className={styles.partnerPrimary}
                href={FEATURED_PARTNER.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                <ShieldCheck size={17} strokeWidth={2} aria-hidden />
                START FUNDED ACCOUNT ({FEATURED_PARTNER.name.toUpperCase()}){" "}
                <ArrowUpRight size={15} aria-hidden />
              </a>
              <Link className={styles.partnerSecondary} href="/get-funded">
                COMPARE PARTNER TERMS <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        ) : null}

        {/* Instant 1-Tap WhatsApp Bar */}
        <div className={styles.waStrip}>
          <div className={styles.waStripHeader}>
            <span className={styles.liveDot} aria-hidden />
            <strong>TAP A QUESTION TO MESSAGE MARKOS ON WHATSAPP (+91 91875 87488)</strong>
          </div>
          <div className={styles.waChips}>
            {QUICK_WHATSAPP_TOPICS.map((topic) => (
              <WhatsAppLink
                key={topic.label}
                className={styles.waChip}
                href={getWhatsAppUrl(topic.msg)}
                placement={`home-aeo-chip:${topic.label}`}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={16} />
                <span>{topic.label}</span>
                <ArrowUpRight size={14} aria-hidden />
              </WhatsAppLink>
            ))}
          </div>
        </div>

        {/* Authentic MARKOS Studio Bento Gallery */}
        <div className={styles.subBlock}>
          <div className={styles.subHeader}>
            <p className={styles.eyebrow}>
              INSIDE THE MARKOS DESK · KERALA, INDIA &amp; GCC
            </p>
            <Link className={styles.allLink} href="/story">
              EXPLORE OUR STORY <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
          <div className={styles.studioGrid}>
            {STUDIO_GALLERY.map((shot) => (
              <figure
                key={shot.src}
                className={`${styles.studioCard} ${shot.wide ? styles.studioWide : ""}`}
              >
                <div className={styles.studioFrame}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    loading="lazy"
                    sizes={
                      shot.wide
                        ? "(max-width: 768px) 100vw, 56vw"
                        : "(max-width: 768px) 100vw, 32vw"
                    }
                    className={styles.studioImg}
                  />
                </div>
                <figcaption className={styles.studioCaption}>
                  <span>{shot.tag}</span>
                  <strong>{shot.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Direct Answer AEO Grid */}
        <div className={styles.faqGrid}>
          {HOME_FAQS.map((item, idx) => (
            <article className={styles.faqCard} key={item.q}>
              <span className={styles.index}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
              <Link className={styles.cardLink} href={item.href}>
                {item.linkLabel} <ArrowUpRight size={14} aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        {/* Latest High-Intent Guides & AI Trading Blogs */}
        <div className={styles.subBlock}>
          <div className={styles.subHeader}>
            <p className={styles.eyebrow}>MARKOS INSIGHTS · 2026 GUIDES</p>
            <Link className={styles.allLink} href="/insights">
              VIEW ALL GUIDES <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
          <div className={styles.articleGrid}>
            {FEATURED_ARTICLES.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className={styles.articleCard}
              >
                <span>{article.tag}</span>
                <strong>{article.title}</strong>
              </Link>
            ))}
          </div>
        </div>

        {/* Local SEO / GEO Prime Indian Cities & GCC Hub */}
        <div className={styles.subBlock}>
          <div className={styles.subHeader}>
            <p className={styles.eyebrow}>
              FUNDED TRADING GROUPS NEAR ME · INDIA, KERALA &amp; GCC
            </p>
            <Link className={styles.allLink} href="/india">
              ALL INDIAN CITIES <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
          <div className={styles.cityPills}>
            {INDIA_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/india/${city.slug}`}
                className={styles.cityPill}
              >
                {city.name}
              </Link>
            ))}
            <Link href="/kerala" className={styles.cityPill}>
              Kerala (Malayalam)
            </Link>
            <Link href="/gcc/uae" className={styles.cityPill}>
              Dubai / UAE
            </Link>
            <Link href="/gcc" className={styles.cityPill}>
              All GCC Countries
            </Link>
            <Link href="/abroad/uk" className={styles.cityPill}>
              United Kingdom
            </Link>
            <Link href="/abroad/usa" className={styles.cityPill}>
              United States
            </Link>
            <Link href="/abroad/australia" className={styles.cityPill}>
              Australia
            </Link>
            <Link href="/abroad/canada" className={styles.cityPill}>
              Canada
            </Link>
          </div>
        </div>

        <p className={styles.disclaimer}>
          Educational content and live community only. MARKOS is not registered
          with SEBI as an investment adviser or research analyst. Trading forex,
          XAUUSD, and prop-firm evaluations carries substantial risk of loss; no
          challenge pass, payout, or profit is promised.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
    </section>
  );
}
