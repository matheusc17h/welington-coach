import { useEffect } from "react";

import { REVEALED_EVENT } from "./preloader";

/** The main title of each section (hero, section heads, final call). */
const TARGETS = "main :is(.w-hero__title, .w-h2, .w-final__title)";

const PENDING = "w-letters-pending";

/** Characters shown while a title decodes. */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*";

/**
 * Section titles decode into place (GSAP ScrambleText) as they scroll into
 * view; the hero's waits for the preloader to lift. Each run of text inside a
 * title (plain, gradient or outlined) gets its own temporary span, so the
 * styled words keep their markup, and the original text nodes come back once
 * it lands. Screen readers get the real title the whole time. Without JS or
 * with reduced motion the titles are simply there.
 */
export function useTitleScramble() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const targets = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter((el) =>
      el.textContent?.trim(),
    );
    for (const el of targets) {
      el.classList.add(PENDING);
    }
    let cleanup = () => {
      for (const el of targets) {
        el.classList.remove(PENDING);
      }
    };
    let cancelled = false;

    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/ScrambleTextPlugin"),
      document.fonts.ready,
    ]).then(([{ gsap }, { ScrollTrigger }, { ScrambleTextPlugin }]) => {
      if (cancelled) {
        return;
      }
      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
      const running = new Map<gsap.core.Timeline, () => void>();

      const play = (el: HTMLElement) => {
        const label = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
        const hadLabel = el.hasAttribute("aria-label");
        if (!hadLabel) {
          el.setAttribute("aria-label", label);
        }
        const runs = wrapText(el);
        el.classList.remove(PENDING);

        const restore = () => {
          for (const { span, node } of runs) {
            span.replaceWith(node);
          }
          if (!hadLabel) {
            el.removeAttribute("aria-label");
          }
        };
        const tl = gsap.timeline({
          onComplete: () => {
            restore();
            running.delete(tl);
          },
        });
        // Runs decode one after another, at a pace set by their length.
        for (const { span, text } of runs) {
          tl.to(span, {
            duration: Math.min(1.4, 0.35 + text.length * 0.045),
            ease: "none",
            scrambleText: { text, chars: CHARS, speed: 0.5, revealDelay: 0.15 },
          });
        }
        running.set(tl, restore);
      };

      const hero = targets.filter((el) => el.closest(".w-hero"));
      const delayed: gsap.core.Tween[] = [];
      const playHero = () => {
        delayed.push(
          gsap.delayedCall(0.3, () => {
            for (const el of hero) {
              play(el);
            }
          }),
        );
      };
      if (
        "wgtRevealed" in document.documentElement.dataset ||
        !document.querySelector(".w-preloader")
      ) {
        playHero();
      } else {
        window.addEventListener(REVEALED_EVENT, playHero, { once: true });
      }

      const triggers = targets
        .filter((el) => !hero.includes(el))
        .map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => play(el),
          }),
        );

      cleanup = () => {
        window.removeEventListener(REVEALED_EVENT, playHero);
        for (const call of delayed) {
          call.kill();
        }
        for (const trigger of triggers) {
          trigger.kill();
        }
        for (const [tl, restore] of running) {
          tl.kill();
          restore();
        }
        for (const el of targets) {
          el.classList.remove(PENDING);
        }
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
}

/**
 * Puts every non-blank text node of `root` in its own span (ScrambleText
 * rewrites an element's whole content, which would flatten nested styling).
 */
function wrapText(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.data.trim()) {
      nodes.push(node);
    }
  }
  return nodes.map((node) => {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.textContent = node.data;
    node.replaceWith(span);
    return { span, node, text: node.data };
  });
}
