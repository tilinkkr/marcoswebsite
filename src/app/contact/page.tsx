import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/app/public-pages.module.css";
import { ContactForm } from "@/components/forms/ContactForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getWhatsAppUrl, MARCOS_WHATSAPP_DISPLAY } from "@/lib/whatsapp";

import local from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact MARCOS about membership, indicators, partnerships, the team or technical support.",
};

const routes = [
  ["GENERAL", "MARCOS_EMAIL"],
  ["MEMBERSHIP", "MARCOS_WHATSAPP_NUMBER"],
  ["INDICATORS", "MARCOS_EMAIL"],
  ["PARTNERSHIPS", "MARCOS_EMAIL"],
  ["TEAM", "MARCOS_EMAIL"],
] as const;
const socialKeys = [
  ["INSTAGRAM", "MARCOS_INSTAGRAM_URL"],
  ["YOUTUBE", "MARCOS_YOUTUBE_URL"],
  ["DISCORD", "MARCOS_DISCORD_URL"],
  ["X", "MARCOS_X_URL"],
] as const;

export default function ContactPage() {
  const values: Record<string, string | undefined> = {
    MARCOS_EMAIL: process.env.MARCOS_EMAIL,
    MARCOS_WHATSAPP_NUMBER:
      process.env.MARCOS_WHATSAPP_NUMBER || MARCOS_WHATSAPP_DISPLAY,
    MARCOS_INSTAGRAM_URL: process.env.MARCOS_INSTAGRAM_URL,
    MARCOS_YOUTUBE_URL: process.env.MARCOS_YOUTUBE_URL,
    MARCOS_DISCORD_URL: process.env.MARCOS_DISCORD_URL,
    MARCOS_X_URL: process.env.MARCOS_X_URL,
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>MARCOS / CONTACT</p>
          <h1 className={styles.title}>
            TALK TO
            <br />
            MARCOS.
          </h1>
          <p className={styles.lede}>
            Choose the route that best matches your question, or send a clear
            message below.
          </p>
        </section>
        <section className={styles.section}>
          <div className={local.routes}>
            {routes.map(([label, key]) => {
              const value = values[key];
              if (!value) return null;
              const href = key.includes("EMAIL")
                ? `mailto:${value}`
                : getWhatsAppUrl(
                    "Hi MARCOS, I'd like to know more about membership.",
                  );
              return (
                <article key={label}>
                  <span>{label}</span>
                  <Link href={href}>{value}</Link>
                </article>
              );
            })}
          </div>
          <div className={local.socials}>
            {socialKeys.map(([label, key]) =>
              values[key] ? (
                <Link key={label} href={values[key]!}>
                  {label} ↗
                </Link>
              ) : null,
            )}
          </div>
          <div className={local.formIntro}>
            <div>
              <p className={styles.sectionLabel}>DIRECT MESSAGE</p>
              <h2 className={styles.sectionTitle}>
                START WITH
                <br />
                CONTEXT.
              </h2>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
