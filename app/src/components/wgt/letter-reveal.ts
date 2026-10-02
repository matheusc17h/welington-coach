import { useEffect } from "react";

import { REVEALED_EVENT } from "./preloader";

/** Every title and paragraph in the page body. */
const TARGETS = "main :is(h1, h2, h3, p)";

/**
 * Left as they are: labels and badges (short UI text, some hold counters),
 * the screen-reader copy, the giant background words, closed FAQ answers,
 * text inside buttons/links, and the film, which fades its own copy.
 */
const SKIP = [
  ".w-sr",
  ".w-bleed",
  ".w-hero__badge",
  ".w-about__tag",
  ".w-plan__seal",
  ".w-quote__badge",
  ".w-lightbox__count",
  ".w-acc__tag",
  ".w-weeks__week",
  "details",
  "button",
  "a",
  "[aria-hidden='true']",
  ".scroll-scrub",
].join(", ");

const PENDING = "w-letters-pending";

/** Share of a block's run after which the next one in line may start. */
const HAND_OFF = 0.6;
/** Longest a block waits for the one before it (seconds). */
const MAX_WAIT = 1.2;

/**
 * Titles and paragraphs come in letter by letter (GSAP stagger) as they
 * scroll into view; the hero's wait for the preloader to lift. Each block is
 * split only when it is about to play and reverted right after, so the page
 * never carries thousands of letter nodes and later resizes re-wrap
 * naturally. Without JS or with reduced motion the text is simply there.
 */
export function useLetterReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const targets = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
      (el) => !el.closest(SKIP) && !el.querySelector("[data-count]") && el.textContent?.trim(),
    );
    // Hidden from now until each one plays (they are below the fold or behind
    // the preloader at this point).
    for (const el of targets) {
      el.classList.add(PENDING);
    }
    let cleanup = () => {
      for (const el of targets) {
        el.classList.remove(PENDING);
      }
    };
    let cancelled = false;

    // Words wrap with the display font loaded, so split after it.
    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      document.fonts.ready,
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (cancelled) {
        return;
      }
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const running = new Set<gsap.core.Timeline>();
      const splits = new Set<SplitText>();
      // Blocks that reach the screen together play in page order (a section
      // or card title before its text): each waits until the previous one is
      // HAND_OFF through, but only while that one is still on screen, so a
      // fast scroll never builds a backlog. Seconds on the GSAP clock.
      let queueAt = 0;
      let previous: HTMLElement | null = null;
      const onScreen = (el: HTMLElement) => {
        const box = el.getBoundingClientRect();
        return box.bottom > 0 && box.top < window.innerHeight;
      };

      const play = (el: HTMLElement) => {
        // Words keep each word whole while its letters move.
        const split = SplitText.create(el, { type: "words,chars" });
        splits.add(split);
        sliceGradients(el, split.chars as HTMLElement[]);
        el.classList.remove(PENDING);

        const title = /^H\d$/.test(el.tagName);
        const count = Math.max(split.chars.length, 1);
        // Long paragraphs keep a small step so the whole block lands in ~1.3s.
        const stagger = title ? Math.min(0.045, 1.3 / count) : Math.min(0.016, 1.2 / count);
        const duration = title ? 0.9 : 0.7;
        const now = gsap.ticker.time;
        const waiting = previous && onScreen(previous) ? queueAt - now : 0;
        const delay = Math.min(Math.max(0, waiting), MAX_WAIT);
        previous = el;
        queueAt = now + delay + (duration + stagger * (count - 1)) * HAND_OFF;
        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            split.revert();
            splits.delete(split);
            running.delete(tl);
          },
        });
        tl.fromTo(
          split.chars,
          { autoAlpha: 0, yPercent: title ? 60 : 40 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration,
            ease: title ? "power3.out" : "power2.out",
            stagger,
          },
        );
        running.add(tl);
      };

      // The hero plays as the curtain lifts: title, then its lead (queued).
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
        for (const tl of running) {
          tl.kill();
        }
        for (const split of splits) {
          split.revert();
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
 * Gradient text (.w-grad-text) paints one background across the word, which
 * the browser drops once its letters move on their own. While split, each
 * letter gets its own slice of the same gradient, so it still reads as one.
 */
function sliceGradients(root: HTMLElement, chars: HTMLElement[]) {
  for (const char of chars) {
    const gradient = char.closest<HTMLElement>(".w-grad-text");
    if (!gradient || !root.contains(gradient)) {
      continue;
    }
    const box = gradient.getBoundingClientRect();
    const own = char.getBoundingClientRect();
    Object.assign(char.style, {
      backgroundImage: getComputedStyle(gradient).backgroundImage,
      backgroundSize: `${box.width}px ${box.height}px`,
      backgroundPosition: `${box.left - own.left}px ${box.top - own.top}px`,
      backgroundRepeat: "no-repeat",
      webkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    });
  }
}
