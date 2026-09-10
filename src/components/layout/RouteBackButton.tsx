"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import styles from "./route-back-button.module.css";

export function RouteBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;
  return (
    <button
      className={styles.back}
      type="button"
      data-checkout={pathname.startsWith("/join/checkout") || undefined}
      onClick={() =>
        window.history.length > 1 ? router.back() : router.push("/")
      }
      aria-label="Go back"
    >
      <ArrowLeft size={16} aria-hidden />
      <span>BACK</span>
    </button>
  );
}
