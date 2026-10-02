import { useEffect } from "react";

import { REVEALED_EVENT } from "./preloader";

const format = (value: number, decimals: number) =>
  value.toLocaleString("pt-BR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

/**
 * A number that counts up from 0 when it comes into view (see useCounters),
 * in Brazilian format (3.500, 26,1). The final value is server-rendered, so
 * without JS or with reduced motion it simply shows. A hidden copy of the
 * final text holds the width, so nothing around it shifts while it counts.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const final = `${prefix}${format(value, decimals)}${suffix}`;
  return (
    <span className="w-count">
      <span aria-hidden="true" className="w-count__ghost">
        {final}
      </span>
      <span
        className="w-count__live"
        data-count={value}
        data-decimals={decimals}
        data-prefix={prefix}
        data-suffix={suffix}
      >
        {final}
      </span>
    </span>
  );
}

/** "+3.500 alunos" → a Counter for "+3.500" followed by " alunos". */
export function withCounter(text: string) {
  const match = /^(\+?)(\d{1,3}(?:\.\d{3})*)(.*)$/.exec(text);
  if (!match) {
    return text;
  }
  const [, prefix, digits, rest] = match;
  return (
    <>
      <Counter prefix={prefix} value={Number(digits.replaceAll(".", ""))} />
      {rest}
    </>
  );
}

/**
 * Runs every Counter on the page: 0 → value over 2s (power2.out) once it is
 * 85% up the viewport. Counters in the hero wait for the preloader to lift,
 * so the count is actually seen.
 */
export function useCounters() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) {
          return;
        }
        gsap.registerPlugin(ScrollTrigger);
        const tweens: gsap.core.Tween[] = [];
        const heroStarts: (() => void)[] = [];

        for (const el of document.querySelectorAll<HTMLElement>("[data-count]")) {
          const { count = "0", decimals = "0", prefix = "", suffix = "" } = el.dataset;
          const digits = Number(decimals);
          const state = { n: 0 };
          const paint = () => {
            el.textContent = `${prefix}${format(state.n, digits)}${suffix}`;
          };
          paint();
          const inHero = Boolean(el.closest(".w-hero"));
          const tween = gsap.to(state, {
            n: Number(count),
            duration: 2,
            ease: "power2.out",
            onUpdate: paint,
            paused: inHero,
            ...(inHero
              ? { delay: 0.6 }
              : { scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
          });
          tweens.push(tween);
          if (inHero) {
            heroStarts.push(() => tween.play());
          }
        }

        const startHero = () => {
          for (const start of heroStarts) {
            start();
          }
        };
        if (
          "wgtRevealed" in document.documentElement.dataset ||
          !document.querySelector(".w-preloader")
        ) {
          startHero();
        } else {
          window.addEventListener(REVEALED_EVENT, startHero, { once: true });
        }

        cleanup = () => {
          window.removeEventListener(REVEALED_EVENT, startHero);
          for (const tween of tweens) {
            tween.scrollTrigger?.kill();
            tween.kill();
          }
          for (const el of document.querySelectorAll<HTMLElement>("[data-count]")) {
            el.textContent = `${el.dataset.prefix ?? ""}${format(
              Number(el.dataset.count),
              Number(el.dataset.decimals),
            )}${el.dataset.suffix ?? ""}`;
          }
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
}
