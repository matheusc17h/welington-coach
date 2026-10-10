import { useEffect } from "react";
import type Lenis from "lenis";

/** The running Lenis instance (desktop only), for code that must scroll. */
let current: Lenis | null = null;

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
          const lenis = new Lenis({ lerp: 0.13, anchors: { offset: -96 } });
          current = lenis;
          const tick = (time: number) => lenis.raf(time * 1000);
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
          teardown = () => {
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.destroy();
            current = null;
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

/**
 * Where a (re)load lands. Browser and router scroll restoration are off (see
 * __root.tsx and router.tsx): jumping to an old offset before GSAP, the film
 * and Lenis had laid the page out left reloads in the wrong spot. So the page
 * starts at the top; with a #hash it waits for the page to settle (load,
 * fonts, triggers refreshed) and then jumps straight to that section.
 */
export function useInitialScroll() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      return;
    }
    let cancelled = false;
    const settle = async () => {
      if (document.readyState !== "complete") {
        await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
      }
      await document.fonts?.ready;
      // Let the dynamically imported GSAP hooks and Lenis start.
      await new Promise((resolve) => setTimeout(resolve, 350));
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
      const target = document.getElementById(id);
      if (!target) return;
      if (current) {
        current.scrollTo(target, { offset: -96, immediate: true });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
    };
    void settle();
    return () => {
      cancelled = true;
    };
  }, []);
}
