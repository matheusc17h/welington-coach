import { useEffect } from "react";

// Scroll stack: every section in <main> is sticky with its bottom edge held at
// the bottom of the viewport, so it scrolls through fully, then stays put while
// the next one slides over it. The covered section shrinks and fades
// (--stack, 0 to 1); once it is fully covered it is moved off screen so its
// IntersectionObservers (sticky CTA, reveals) see it as gone.
// The tilted marquee is a strip that just passes over the hero.

const SKIP = ".w-marquee";

export function useStack() {
  useEffect(() => {
    const main = document.getElementById("conteudo");
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = [...main.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.tagName === "SECTION",
    );
    const stacked = sections.filter((el) => !el.matches(SKIP));
    main.classList.add("w-stack");

    // Where each section sits in the flow, ignoring sticky offsets/transforms.
    const flowTop = (section: HTMLElement) => {
      let y = main.getBoundingClientRect().top + window.scrollY;
      for (const el of sections) {
        const cs = getComputedStyle(el);
        y += parseFloat(cs.marginTop);
        if (el === section) return y;
        y += el.offsetHeight + parseFloat(cs.marginBottom);
      }
      return y;
    };

    const place = () => {
      const vh = window.innerHeight;
      for (const el of stacked) el.style.top = `${Math.min(0, vh - el.offsetHeight)}px`;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      stacked.forEach((el, i) => {
        const next = stacked[i + 1];
        const p = next
          ? Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / vh))
          : 0;
        el.style.setProperty("--stack", p.toFixed(3));
        el.toggleAttribute("data-covered", p >= 1);
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Native hash jumps read the rendered (stuck) position; use the flow one.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      const section = target?.closest<HTMLElement>("#conteudo > section");
      if (!target || !section) return;
      event.preventDefault();
      const inner = target.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const pad = section === sections[0] ? 0 : 96;
      window.scrollTo({ top: Math.max(0, flowTop(section) + inner - pad), behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    };

    const ro = new ResizeObserver(() => {
      place();
      request();
    });
    stacked.forEach((el) => ro.observe(el));
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    document.addEventListener("click", onClick);
    place();
    update();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      document.removeEventListener("click", onClick);
      main.classList.remove("w-stack");
      for (const el of stacked) {
        el.style.removeProperty("top");
        el.style.removeProperty("--stack");
        el.removeAttribute("data-covered");
      }
    };
  }, []);
}
