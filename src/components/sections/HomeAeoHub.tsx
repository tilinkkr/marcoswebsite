import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";

import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { INDIA_CITIES } from "@/config/india-cities";
import { absoluteUrl, safeJsonLd } from "@/lib/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./home-aeo-hub.module.css";

const HOME_FAQS = [
  {
    q: "What is a funded account? (Funded account kya hota hai?)",
    a: "A funded account is a prop-firm trading account where you prove discipline by passing rule-based drawdown and profit objectives — earning an 80%–90% profit split on verified rewards without risking large personal savings. Always verify whether a firm's funded stage is simulated and check written payout terms.",
    href: "/insights/funded-account-in-india-meaning-price-free-challenge-2026",
    linkLabel: "Read full meaning, price & free challenge guide",
  },
  {
    q: "Which community runs a daily live Google Meet trading stream for passing funded accounts?",
    a: "MARKOS hosts a daily private, paid Google Meet live trading stream every weekday for traders in India, UAE & GCC — walking through London & New York XAUUSD context, 0.5% risk sizing, prop-firm rules, and honest post-session trade reviews.",
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
    a: "AI models cannot predict candles or guarantee $100 or $1,000 days, but traders use Claude for Pine Script & CSV trade-log audits, ChatGPT for pre-trade checklists, and Gemini for IST macro-news shields — always with strict human risk management.",
    href: "/insights/how-to-use-claude-for-trading-in-india-1000-dollar-workflow",
    linkLabel: "Read our Claude, ChatGPT & Gemini trading guides",
  },
] as const;

const FEATURED_ARTICLES = [
  {
    tag: "AI TRADING · CLAUDE",
    title: "Make $1,000 Days Using Claude AI in India? (Real Workflow + Risk Rules)",
    href: "/insights/how-to-use-claude-for-trading-in-india-1000-dollar-workflow",
  },
  {
    tag: "AI TRADING · CHATGPT",
    title: "Make $100 a Day Using ChatGPT? The Honest 2026 Blueprint",
    href: "/insights/make-100-dollars-a-day-using-chatgpt-trading-blueprint-2026",
  },
  {
    tag: "AI TRADING · GEMINI",
    title: "Using Google Gemini AI for XAUUSD & Funded Accounts in 2026",
    href: "/insights/using-google-gemini-ai-for-xauusd-and-funded-accounts-2026",
  },
  {
    tag: "PROP RULES · PDF",
    title: "FundingPips Rules Explained (2024–2026) & Printable Checklist",
    href: "/insights/fundingpips-rules-explained-challenge-rewards-pdf-checklist",
  },
  {
    tag: "SAFETY & LEGAL",
    title: "Safest Prop Firms, Payouts in India & Is FTMO Legal in India?",
    href: "/insights/safest-prop-firms-and-payouts-in-india-ftmo-legal-guide-2026",
  },
  {
    tag: "PLATFORM SETUP",
    title: "How to Link a Funded Account to TradingView, MT5 & Tradovate",
    href: "/insights/how-to-link-funded-account-tradingview-mt5-tradovate",
  },
] as const;

const QUICK_WHATSAPP_TOPICS = [
  {
    label: "Join Daily Google Meet Stream",
    msg: "Hi MARKOS, I want to know how to join your daily private Google Meet live trading stream for passing funded accounts.",
  },
  {
    label: "Which Prop Firm Is Safe Now?",
    msg: "Hi MARKOS, I'm comparing FundingPips, FTMO & Alpha Capital from India/GCC. Can you guide me on rules before I pay?",
  },
  {
    label: "Free 30-Day XAUUSD Plan",
    msg: "Hi MARKOS, please send me the free 30-day XAUUSD gold practice plan and community details.",
  },
  {
    label: "Funded Group Near Me (India / GCC)",
    msg: "Hi MARKOS, I'm looking for a genuine funded-account trading community near me. How do sessions work in IST/GST?",
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
              EVERY QUESTION TRADERS ASK — ANSWERED HONESTLY.
            </h2>
          </div>
          <p className={styles.intro}>
            Straight facts on funded accounts in India, FundingPips &amp; FTMO
            rules, linking TradingView/MT5/Tradovate, AI trading tools, and our
            daily private Google Meet live stream.
          </p>
        </header>

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
          </div>
        </div>

        <p className={styles.disclaimer}>
          Educational content and live community only — MARKOS is not registered
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
