"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./site-header.module.css";

const primaryLinks = [
  ["HOME", "/"],
  ["JOIN MARCOS", "/join"],
  ["INDICATORS", "/indicators"],
  ["TEAM", "/team"],
  ["INSIGHTS", "/insights"],
] as const;

const moreLinks = [
  ["MORE INDEX", "/more"],
  ["OUR STORY", "/story"],
  ["CONTACT", "/contact"],
  ["FAQ", "/faq"],
  ["LEGAL", "/risk-disclosure"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const whatsappUrl = getWhatsAppUrl(
    "Hi MARCOS, I'd like to know more about membership.",
  );

  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="MARCOS home">
        MARCOS
      </Link>
      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {primaryLinks.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            prefetch={false}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <details className={styles.moreMenu}>
          <summary>MORE</summary>
          <div>
            {moreLinks.map(([label, href]) => (
              <Link key={label} href={href} prefetch={false}>
                {label}
              </Link>
            ))}
          </div>
        </details>
      </nav>
      <a
        className={styles.whatsapp}
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Message MARCOS on WhatsApp"
      >
        <MessageCircle size={16} aria-hidden />
        <span>WHATSAPP</span>
      </a>
      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav
        id="mobile-menu"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
        aria-label="Mobile navigation"
      >
        <p>MARCOS / NAVIGATION</p>
        {primaryLinks.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            prefetch={false}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className={styles.mobileSubnav}>
          <span>MORE / DIRECTORY</span>
          {moreLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              prefetch={false}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          className={styles.mobileCta}
          href="/join"
          prefetch={false}
          onClick={() => setOpen(false)}
        >
          JOIN MARCOS →
        </Link>
        <a
          className={styles.mobileWhatsApp}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          <MessageCircle size={18} aria-hidden /> MESSAGE US ON WHATSAPP
        </a>
      </nav>
    </header>
  );
}
