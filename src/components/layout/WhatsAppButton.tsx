import { MessageCircle } from "lucide-react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./whatsapp-button.module.css";

export function WhatsAppButton() {
  const href = getWhatsAppUrl(
    "Hi MARKOS, I'd like to know more about membership.",
  );

  return (
    <a
      className={styles.button}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Message MARKOS on WhatsApp"
    >
      <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
      <span>WHATSAPP</span>
    </a>
  );
}
