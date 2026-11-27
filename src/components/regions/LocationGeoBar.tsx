"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useSyncExternalStore } from "react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./location-geo-bar.module.css";

type GeoProfile = {
  id: string;
  badge: string;
  headline: string;
  subline: string;
  hubHref: string;
  hubLabel: string;
  whatsappMsg: string;
};

const DEFAULT_PROFILE: GeoProfile = {
  id: "india-kerala",
  badge: "KERALA & INDIA DESK · IST (UTC+5:30)",
  headline: "Joining from Kerala, Bangalore, Mumbai or India?",
  subline:
    "Today's live London to New York Google Meet desk opens at 6:30 PM IST (Malayalam & English support).",
  hubHref: "/kerala",
  hubLabel: "KERALA & INDIA GUIDE",
  whatsappMsg:
    "Hi MARKOS, I'm trading from Kerala / India and want to join your 6:30 PM IST Google Meet desk and funded-account community.",
};

function detectGeoProfile(tz: string): GeoProfile {
  const lower = tz.toLowerCase();
  if (lower.includes("dubai") || lower.includes("muscat")) {
    return {
      id: "gcc-gst",
      badge: "DUBAI / UAE & OMAN MALAYALI DESK · GST (UTC+4)",
      headline: "Malayali trader in Dubai, Abu Dhabi, Sharjah or Oman?",
      subline:
        "Catch our live after-work Google Meet desk at 5:00 PM GST for XAUUSD, Forex & NASDAQ (MNQ) funded accounts.",
      hubHref: "/gcc/uae",
      hubLabel: "UAE & GCC MALLU HUB",
      whatsappMsg:
        "Hi MARKOS, I'm a Malayali trader in Dubai / UAE (GCC) and want to join your 5:00 PM GST live Google Meet community.",
    };
  }
  if (
    lower.includes("riyadh") ||
    lower.includes("qatar") ||
    lower.includes("kuwait") ||
    lower.includes("bahrain")
  ) {
    return {
      id: "gcc-ast",
      badge: "GCC MALAYALI DESK · SAUDI · QATAR · KUWAIT · BAHRAIN (AST)",
      headline: "Malayali trader working in Riyadh, Doha, Kuwait or Manama?",
      subline:
        "Our Malayalam & English evening Google Meet stream runs at 4:00 PM AST so you can trade cleanly after office hours.",
      hubHref: "/gcc",
      hubLabel: "GCC MALAYALI HUB",
      whatsappMsg:
        "Hi MARKOS, I'm a Malayali trader in the GCC (Saudi/Qatar/Kuwait/Bahrain) and want to join your 4:00 PM AST trading community.",
    };
  }
  if (lower.includes("london") || lower.includes("dublin")) {
    return {
      id: "uk",
      badge: "UNITED KINGDOM DESK · GMT / BST",
      headline: "Trading from London, Manchester or the UK?",
      subline:
        "Join our 1:00 PM GMT overlap desk for static-drawdown prop firms, GBPUSD, Gold and NASDAQ execution.",
      hubHref: "/abroad/uk",
      hubLabel: "UK FUNDED ACCOUNT GUIDE",
      whatsappMsg:
        "Hi MARKOS, I'm trading from the UK and want to know about your best forex funded account guide and live Google Meet desk.",
    };
  }
  if (lower.startsWith("america/")) {
    return {
      id: "usa",
      badge: "USA & CANADA DESK · EASTERN TIME (ET)",
      headline: "Trading NASDAQ (MNQ) futures or forex from the USA / Canada?",
      subline:
        "Sync with our 8:00 AM ET pre-open & 9:30 AM ET NY cash open risk room for CME futures and funded prep.",
      hubHref: "/abroad/usa",
      hubLabel: "USA FUTURES & PROP GUIDE",
      whatsappMsg:
        "Hi MARKOS, I'm trading from the USA / Canada and want to ask about NASDAQ (MNQ) futures and your morning live desk.",
    };
  }
  if (lower.startsWith("australia/")) {
    return {
      id: "australia",
      badge: "AUSTRALIA MALAYALI DESK · AEDT / AWST",
      headline: "Malayali trader in Melbourne, Sydney, Brisbane or Perth?",
      subline:
        "Compare ASIC-safe habits, static drawdown prop firms, and evening London/NY windows for Australian time zones.",
      hubHref: "/abroad/australia",
      hubLabel: "AUSTRALIA TRADER HUB",
      whatsappMsg:
        "Hi MARKOS, I'm trading from Australia and want to ask about your funded-account guides and Malayali trading community.",
    };
  }
  return DEFAULT_PROFILE;
}

const subscribeNoop = () => () => {};
let cachedClientProfile: GeoProfile | null = null;

function getClientGeoProfile(): GeoProfile {
  if (cachedClientProfile) return cachedClientProfile;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    cachedClientProfile = tz ? detectGeoProfile(tz) : DEFAULT_PROFILE;
  } catch {
    cachedClientProfile = DEFAULT_PROFILE;
  }
  return cachedClientProfile;
}

export function LocationGeoBar() {
  const profile = useSyncExternalStore(
    subscribeNoop,
    getClientGeoProfile,
    () => DEFAULT_PROFILE,
  );

  return (
    <aside
      className={styles.bar}
      aria-label="Local trading desk hours and regional hub"
    >
      <div className={styles.copy}>
        <span className={styles.badge}>
          <MapPin size={13} strokeWidth={2.2} aria-hidden />
          {profile.badge}
        </span>
        <strong className={styles.headline}>{profile.headline}</strong>
        <p className={styles.subline}>{profile.subline}</p>
      </div>
      <div className={styles.actions}>
        <WhatsAppLink
          className={styles.waBtn}
          href={getWhatsAppUrl(profile.whatsappMsg)}
          placement={`geo-bar:${profile.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon size={16} />
          <span>JOIN LOCAL DESK ON WHATSAPP</span>
          <ArrowUpRight size={14} aria-hidden />
        </WhatsAppLink>
        <Link className={styles.hubBtn} href={profile.hubHref}>
          <span>{profile.hubLabel}</span>
          <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
