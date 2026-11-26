import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
    tag: "BEST FUNDED ACCOUNTS · LINU BABU",
    title: "Best Forex Funded Account (2026): India, UK, USA, Kerala & Reddit Reality Check",
    href: "/insights/best-forex-funded-account-india-uk-usa-kerala-reddit-2026",
  },
  {
    tag: "MENTOR PASSING PLAN · RAHUL RAJA",
    title: "Funded Account Passed in 1 Month? 3 Ways I Used to Pass in India (With Mentor Support)",
    href: "/insights/funded-account-passed-in-1-month-3-ways-india-mentor-guide",
  },
  {
    tag: "NASDAQ / MNQ FUTURES · RAHUL RAJA",
    title: "NASDAQ (MNQ) & Futures Funded Accounts for India, GCC, UK & USA Traders (2026)",
    href: "/insights/nasdaq-mnq-futures-funded-account-india-gcc-usa-2026",
  },
  {
    tag: "AI TRADING · SAHAL",
    title: "Make $1,000 Days Using Claude AI in India? (Real Workflow + Risk Rules)",
    href: "/insights/how-to-use-claude-for-trading-in-india-1000-dollar-workflow",
  },
  {
    tag: "PROP RULES · LINU BABU",
    title: "FundingPips Rules Explained (2024–2026) & Printable Challenge PDF Checklist",
    href: "/insights/fundingpips-rules-explained-challenge-rewards-pdf-checklist",
  },
  {
    tag: "PLATFORM SETUP · SAHAL",
    title: "How to Link a Funded Account to TradingView, MT5 & Tradovate",
    href: "/insights/how-to-link-funded-account-tradingview-mt5-tradovate",
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
                <MessageCircle size={15} strokeWidth={2} aria-hidden />
                <span>{topic.label}</span>
                <ArrowUpRight size={14} aria-hidden />
              </WhatsAppLink>
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
