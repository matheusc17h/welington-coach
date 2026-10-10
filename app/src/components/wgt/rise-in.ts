import { useEffect } from "react";

/**
 * Section copy rising in from below (GSAP), once, when its block reaches the
 * middle of the screen. Inside each block the pieces come in one after
 * another in page order (stagger), so the reading order is kept: the title
 * first (its own line-by-line reveal, animations-text, also at 50%), then
 * the text after a short delay, then the button. `clamp()` keeps the trigger reachable near the
 * end of the page. Visible without JS and under reduced motion.
 */
const GROUPS: { block: string; items: string }[] = [
  { block: ".w-stuck__close", items: "p, .w-pill" },
  { block: ".w-cuts__head", items: ".w-lead" },
  { block: ".w-weeks__head", items: ".w-lead" },
  { block: ".w-results__head", items: ".w-lead" },
  { block: ".w-plans__head", items: ".w-lead" },
  { block: ".w-faq__head", items: ".w-lead, .w-faq__link" },
  { block: ".w-final__inner", items: ".w-lead, .w-pill" },
];

export function useRiseIn() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          for (const { block, items } of GROUPS) {
            for (const el of document.querySelectorAll<HTMLElement>(block)) {
              // querySelectorAll returns document order: the order they appear.
              const pieces = el.querySelectorAll<HTMLElement>(items);
              if (!pieces.length) continue;
              gsap.from(pieces, {
                autoAlpha: 0,
                y: 80,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.18,
                // After the block's title, which fires at the same point.
                delay: 0.3,
                scrollTrigger: { trigger: el, start: "clamp(top 50%)", once: true },
              });
            }
          }
        });
        cleanup = () => ctx.revert();
      },
    );
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
}
