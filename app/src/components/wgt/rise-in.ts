import { useEffect } from "react";

/**
 * Section copy that rises in from below (GSAP), each piece on its own, once,
 * when its top reaches the middle of the screen. `clamp()` keeps the trigger
 * reachable for copy near the end of the page. Visible without JS and under
 * reduced motion. Titles have their own line-by-line reveal
 * (animations-text), so this covers the text around them.
 */
const RISE = [
  ".w-stuck__close p",
  ".w-cuts__head .w-lead",
  ".w-weeks__head .w-lead",
  ".w-results__head .w-lead",
  ".w-plans__head .w-lead",
  ".w-faq__head .w-lead",
  ".w-faq__link",
  ".w-final .w-lead",
  ".w-final .w-pill",
].join(", ");

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
          for (const el of document.querySelectorAll<HTMLElement>(RISE)) {
            gsap.from(el, {
              autoAlpha: 0,
              y: 80,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "clamp(top 50%)", once: true },
            });
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
