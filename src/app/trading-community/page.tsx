import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "../marketing.module.css";

export const metadata: Metadata = {
  title: "Trading Community for India, UAE & GCC — Join on WhatsApp",
  description:
    "Join the MARKOS trading community from India, Dubai or the GCC: weekday live screen shares, funded-account and prop-firm guidance, and trade review. Message us on WhatsApp.",
  alternates: { canonical: "/trading-community" },
};

export default function TradingCommunityPage() {
  const whatsapp = getWhatsAppUrl(
    "Hi MARKOS, I am comparing trading communities. Could you explain the membership format, activities, and fees?",
  );
  const gccWhatsapp = getWhatsAppUrl(
    "Hi MARKOS, I'm trading from the UAE/GCC. Can I join the community and live sessions?",
  );

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>MARKOS / TRADING COMMUNITY</p>
            <h1>
              LEARN TOGETHER.
              <br />
              <span>KEEP YOUR OWN DECISIONS.</span>
            </h1>
            <p className={styles.lede}>
              MARKOS is a trading community for market discussion, weekday live
              screen shares, risk education, and reviewing decisions. It is a
              place to study—not a signal service or a promise of funding.
            </p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.paths}>
            <article className={styles.path}>
              <p className={styles.label}>WHAT MEMBERS CAN EXPLORE</p>
              <h3>OBSERVE. DISCUSS. REVIEW.</h3>
              <p>
                Follow market context and reasoning during live sessions,
                discuss process with other traders, and learn to review a
                decision separately from its outcome.
              </p>
              <Link className={styles.action} href="/join">
                SEE MEMBERSHIP DETAILS <ArrowUpRight size={17} aria-hidden />
              </Link>
            </article>
            <article className={styles.path}>
              <p className={styles.label}>QUESTIONS BEFORE JOINING?</p>
              <h3>ASK ABOUT THE FORMAT.</h3>
              <p>
                Confirm what is included, current availability, fees, and
                whether the learning format fits your needs before deciding.
              </p>
              {whatsapp ? (
                <WhatsAppLink
                  className={styles.action}
                  href={whatsapp}
                  placement="trading-community-landing"
                  target="_blank"
                  rel="noreferrer"
                >
                  ASK ON WHATSAPP <ArrowUpRight size={17} aria-hidden />
                </WhatsAppLink>
              ) : null}
            </article>
            <article className={styles.path}>
              <p className={styles.label}>TRADING FROM DUBAI, UAE OR GCC?</p>
              <h3>YOU&apos;RE WELCOME HERE.</h3>
              <p>
                Members join from India, the UAE and across the Gulf. Ask how
                live sessions line up with your time zone (IST / GST) and how to
                get started — one message is enough.
              </p>
              <WhatsAppLink
                className={styles.action}
                href={gccWhatsapp}
                placement="trading-community-gcc"
                target="_blank"
                rel="noreferrer"
                data-whatsapp-primary
              >
                MESSAGE US FROM THE GCC <ArrowUpRight size={17} aria-hidden />
              </WhatsAppLink>
            </article>
          </div>
          <div className={styles.sectionHeader}>
            <p className={styles.label}>A COMMUNITY IS NOT A SHORTCUT</p>
            <h2>COMPARE THE LEARNING ENVIRONMENT, NOT THE HYPE.</h2>
          </div>
          <ul className={styles.benefits}>
            <li>
              Ask whether live sessions explain decisions or issue copy-trades.
            </li>
            <li>
              Check that risk, losses, and uncertainty are discussed openly.
            </li>
            <li>
              Review membership terms, current fees, renewal, and cancellation.
            </li>
            <li>
              Never share passwords, OTPs, or control of a trading account.
            </li>
          </ul>
          <p className={styles.legal}>
            MARKOS provides education and community, not individual financial
            advice, trade signals, guaranteed challenge passes, payouts, or
            trading results. Participation does not remove market risk.
          </p>
          <p>
            Want to understand the topics first? Visit our{" "}
            <Link href="/trading-education">trading education overview</Link> or
            browse <Link href="/insights">MARKOS Insights</Link>. Popular
            questions:{" "}
            <Link href="/funded-account-guide">what is a funded account</Link>,{" "}
            <Link href="/insights/pass-funded-account-challenge-in-3-days">
              passing a challenge in 3 days
            </Link>
            ,{" "}
            <Link href="/insights/top-10-prop-firms-funded-accounts-compared">
              top 10 prop firms compared
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
