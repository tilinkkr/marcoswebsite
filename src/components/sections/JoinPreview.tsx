"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

import { getGSAP } from "@/lib/animations/gsap";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import styles from "./join-preview.module.css";

const whatsappUrl = getWhatsAppUrl(
  "Hi MARKOS, I'd like to know more about joining the community.",
);

export function JoinPreview() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const { gsap } = getGSAP();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const reduced = Boolean(conditions?.reduced);
          const mobile = Boolean(conditions?.mobile);
          const art = section.querySelector<HTMLElement>("[data-join-art]");
          const solitude =
            section.querySelector<HTMLElement>("[data-solitude]");
          const progress =
            section.querySelector<HTMLElement>("[data-progress]");
          const floor = section.querySelector<HTMLElement>("[data-floor]");
          const content = section.querySelector<HTMLElement>(
            "[data-join-content]",
          );
          const paths = section.querySelector<HTMLElement>("[data-join-paths]");
          if (!art || !solitude || !progress || !floor || !content || !paths)
            return;

          if (reduced) {
            gsap.set([art, progress, floor, content, paths], {
              clearProps: "all",
            });
            gsap.set([solitude, progress], { display: "none" });
            return;
          }

          if (mobile) {
            gsap.set([solitude, progress], { display: "none" });
            gsap.set(art, { scale: 1.01, xPercent: 0 });
            gsap.set(floor, { autoAlpha: 0.52, scale: 1 });
            gsap.set([content, paths], { autoAlpha: 1, y: 0 });

            gsap.set([content, paths], { clearProps: "all" });
            return;
          }

          // The progress words and the final headline occupy the same visual
          // field. Keep them mutually exclusive throughout the scroll story.
          gsap.set(solitude, { autoAlpha: 1, y: 0 });
          gsap.set(progress, { autoAlpha: 0, y: 34 });
          gsap.set(floor, { autoAlpha: 0, scale: 0.72 });
          gsap.set([content, paths], { autoAlpha: 0, y: 24 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(
              art,
              { scale: 1.12, xPercent: 5 },
              { scale: 1, xPercent: 0, duration: 0.35 },
            )
            .to(solitude, { autoAlpha: 0, y: -20, duration: 0.12 }, 0.08)
            .to(floor, { autoAlpha: 0.58, scale: 1, duration: 0.25 }, 0.28)
            .to(progress, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.22)
            .to(progress, { autoAlpha: 0, y: -18, duration: 0.12 }, 0.39)
            .to(content, { autoAlpha: 1, y: 0, duration: 0.19 }, 0.52)
            .to(paths, { autoAlpha: 1, y: 0, duration: 0.13 }, 0.67)
            .to({}, { duration: 0.06 });

          return () => timeline.kill();
        },
      );
    }, section);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-testid="join-preview"
      aria-labelledby="join-preview-title"
    >
      <div className={styles.stage}>
        <picture className={styles.art} data-join-art>
          <source
            media="(max-width: 767px)"
            srcSet="/images/marcos/join/join-collective-mobile.webp"
          />
          <img src="/images/marcos/join/join-collective-desktop.webp" alt="" />
        </picture>
        <div className={styles.shade} aria-hidden />
        <div className={styles.floor} data-floor aria-hidden />
        <p className={styles.solitude} data-solitude>
          TRADING
          <br />
          IS INDIVIDUAL.
        </p>
        <p className={styles.progress} data-progress>
          PROGRESS
          <br />
          DOESN&apos;T HAVE
          <br />
          TO BE.
        </p>
        <div className={styles.content} data-join-content>
          <p className={styles.eyebrow}>MARKOS / THE FLOOR</p>
          <h2 id="join-preview-title">
            TRADE YOUR ACCOUNT.
            <br />
            <span>DON&apos;T BUILD YOUR PROCESS ALONE.</span>
          </h2>
          <p className={styles.copy}>
            MARKOS brings traders together around market study, execution, risk,
            review and continuous improvement.
          </p>
        </div>
        <div className={styles.paths} data-join-paths>
          <Link href="/join">
            JOIN THE COMMUNITY <ArrowUpRight size={17} aria-hidden />
          </Link>
          {whatsappUrl ? (
            <WhatsAppLink
              href={whatsappUrl}
              placement="home-join-preview"
              data-whatsapp-primary
              target="_blank"
              rel="noreferrer"
            >
              TALK TO US ON WHATSAPP <ArrowUpRight size={17} aria-hidden />
            </WhatsAppLink>
          ) : (
            <span aria-disabled="true">WHATSAPP / NUMBER PENDING</span>
          )}
        </div>
      </div>
    </section>
  );
}
