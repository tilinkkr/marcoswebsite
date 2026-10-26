import { MessageCircle } from "lucide-react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "./WhatsAppLink";
import styles from "./whatsapp-button.module.css";

export function WhatsAppButton() {
  const href = getWhatsAppUrl(
    "Hi MARKOS, I'd like to know more about membership.",
  );

  return (
    <WhatsAppLink
      className={styles.button}
      href={href}
      placement="floating"
      target="_blank"
      rel="noreferrer"
      aria-label="Message MARKOS on WhatsApp"
    >
      <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
      <span>WHATSAPP</span>
    </WhatsAppLink>
  );
}
