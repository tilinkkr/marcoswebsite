"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./site-header.module.css";

const primaryLinks = [
  ["HOME", "/"],
  ["JOIN MARKOS", "/join"],
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
    "Hi MARKOS, I'd like to know more about membership.",
  );

  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="MARKOS home">
        MARKOS
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
      <WhatsAppLink
        className={styles.whatsapp}
        href={whatsappUrl}
        placement="header-desktop"
        target="_blank"
        rel="noreferrer"
        aria-label="Message MARKOS on WhatsApp"
      >
        <MessageCircle size={16} aria-hidden />
        <span>WHATSAPP</span>
      </WhatsAppLink>
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
        <p>MARKOS / NAVIGATION</p>
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
          JOIN MARKOS →
        </Link>
        <WhatsAppLink
          className={styles.mobileWhatsApp}
          href={whatsappUrl}
          placement="header-mobile-menu"
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          <MessageCircle size={18} aria-hidden /> MESSAGE US ON WHATSAPP
        </WhatsAppLink>
      </nav>
    </header>
  );
}
