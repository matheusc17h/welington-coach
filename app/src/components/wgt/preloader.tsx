import { useEffect, useRef, useState } from "react";

const SHIELD = "/assets/brand/wgt-shield.webp";
/** The count takes at least this long, one number at a time. */
const MIN_MS = 3200;
/** Give up waiting after this; the CSS bail-out (8s) sits just behind it. */
const MAX_MS = 7000;

/**
 * Full-screen loader: the WGT shield fills from the bottom while a counter
 * runs 0% to 100%. Progress lives in the `--p` custom property: CSS starts it
 * on first paint (so it moves before the JS arrives), then JS takes over from
 * that same value and drives it to 100% with what the first screen really
 * loads (fonts and the above-the-fold images). At 100% it lifts like a
 * curtain and the hero entrance starts.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) {
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduced ? 300 : MIN_MS;
    const start = performance.now();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    let loaded = 0;
    const bump = () => {
      loaded += 1;
    };
    const images = [...document.querySelectorAll<HTMLImageElement>("img")].filter(
      (img) => img.loading !== "lazy",
    );
    for (const img of images) {
      if (img.complete) {
        bump();
      } else {
        img.addEventListener("load", bump, { once: true });
        img.addEventListener("error", bump, { once: true });
      }
    }
    // Only what the first screen needs. Waiting for window load would also
    // wait for the videos further down.
    void document.fonts.ready.then(bump);
    const total = images.length + 1;

    // Pick up where the CSS boot animation got to, then own the value.
    let shown = Number.parseFloat(getComputedStyle(el).getPropertyValue("--p")) || 0;
    const from = shown;
    el.style.setProperty("--p", String(Math.floor(shown)));

    let frame = 0;
    let exit = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const real = loaded / total;
      const pace = Math.min(1, elapsed / minMs);
      const target = elapsed > MAX_MS ? 100 : from + (100 - from) * Math.min(real, pace);
      // Step at a steady rate (about 32 numbers a second) so the count
      // reads 1, 2, 3... instead of numbers tumbling over each other.
      const maxStep = (100 / minMs) * 16.7 * 1.05;
      shown = Math.min(target, shown + maxStep);
      el.style.setProperty("--p", String(Math.floor(shown)));
      if (shown >= 100) {
        setDone(true);
        root.style.overflow = previousOverflow;
        exit = window.setTimeout(() => setGone(true), reduced ? 200 : 1200);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame((now) => {
      setActive(true);
      tick(now);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exit);
      root.style.overflow = previousOverflow;
    };
  }, []);

  if (gone) {
    return null;
  }

  return (
    <div
      aria-busy={!done}
      aria-label="Carregando o site"
      className="w-preloader"
      data-active={active || undefined}
      data-done={done || undefined}
      ref={rootRef}
      role="status"
    >
      <div className="w-preloader__stage">
        <div className="w-preloader__shield">
          <img alt="" className="w-preloader__ghost" height={512} src={SHIELD} width={512} />
          <img alt="" className="w-preloader__fill" height={512} src={SHIELD} width={512} />
        </div>
        <p aria-hidden="true" className="w-preloader__count">
          <span />%
        </p>
        <div aria-hidden="true" className="w-preloader__bar">
          <span />
        </div>
      </div>
    </div>
  );
}
