"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { initializePostHog } from "@/lib/analytics/posthog";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  placement: string;
  children: ReactNode;
};

export function WhatsAppLink({
  href,
  placement,
  children,
  onClick,
  ...props
}: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const analytics = initializePostHog();
    if (
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      analytics.capture("whatsapp_click", {
        placement,
        page_path: window.location.pathname,
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
