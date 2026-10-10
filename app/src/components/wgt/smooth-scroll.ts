import { useEffect } from "react";

/**
 * Desktop smooth scrolling (Lenis), driven by GSAP's ticker so every
 * ScrollTrigger stays in step. Lenis keeps the page's native scroll (no
 * transformed wrapper), so `position: sticky` — the film's pinned stage, the
 * stuck heading — keeps working, which GSAP ScrollSmoother would break.
 * Off on touch screens, phones and under reduced motion. In-page links
 * (#metodo, #planos…) glide too, clearing the fixed header.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 861px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let teardown: (() => void) | null = null;
    let cancelled = false;

    const start = () => {
      void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
        ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
          if (cancelled || teardown || !query.matches) {
            return;
          }
          gsap.registerPlugin(ScrollTrigger);
          const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -96 } });
          const tick = (time: number) => lenis.raf(time * 1000);
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
          teardown = () => {
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.destroy();
            teardown = null;
          };
        },
      );
    };

    const onChange = () => {
      if (query.matches) start();
      else teardown?.();
    };

    start();
    query.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      query.removeEventListener("change", onChange);
      teardown?.();
    };
  }, []);
}
