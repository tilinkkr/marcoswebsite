"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./more-index.module.css";
const items = [
  [
    "01",
    "INSIGHTS / BLOGS",
    "Practical writing on risk rules, funded-account evaluations and building a deliberate trading process.",
    "/insights",
  ],
  [
    "02",
    "OUR STORY",
    "Why MARCOS exists, how the community thinks and what it refuses to promise.",
    "/story",
  ],
  [
    "03",
    "CONTACT",
    "Choose the right route for membership, indicator, partnership or team questions.",
    "/contact",
  ],
  [
    "04",
    "FAQ",
    "Direct answers to the questions traders should ask before they commit time or money.",
    "/faq",
  ],
  [
    "05",
    "LEGAL / RISK",
    "Read the risk disclosure, terms and privacy foundations behind MARCOS.",
    "/risk-disclosure",
  ],
] as const;
export function MoreIndex() {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.wrap}>
      <div className={styles.index}>
        {items.map(([number, title, , href], i) => (
          <Link
            key={title}
            href={href}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span>{number}</span>
            <strong>{title}</strong>
            <b>↗</b>
          </Link>
        ))}
      </div>
      <aside className={styles.preview} aria-live="polite">
        <span>{items[active][0]} / DIRECTORY</span>
        <h2>{items[active][1]}</h2>
        <p>{items[active][2]}</p>
        <Link href={items[active][3]}>OPEN SECTION →</Link>
      </aside>
    </div>
  );
}
