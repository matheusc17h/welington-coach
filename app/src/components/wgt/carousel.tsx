import { useEffect, useState } from "react";
import type { RefObject } from "react";

/** Phones: below this the card rows become swipe carousels. */
export const CAROUSEL_QUERY = "(max-width: 768px)";

/** Media query as state. Starts false so the server markup (desktop) hydrates cleanly. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const list = window.matchMedia(query);
    const sync = () => setMatches(list.matches);
    sync();
    list.addEventListener("change", sync);
    return () => list.removeEventListener("change", sync);
  }, [query]);
  return matches;
}

/** Child of the track nearest to its visible centre (the last one once scrolled to the end). */
function nearestIndex(track: HTMLElement) {
  const items = [...track.children] as HTMLElement[];
  if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
    return items.length - 1;
  }
  const centre = track.scrollLeft + track.clientWidth / 2;
  let best = 0;
  items.forEach((item, index) => {
    const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - centre);
    const bestItem = items[best];
    if (distance < Math.abs(bestItem.offsetLeft + bestItem.offsetWidth / 2 - centre)) {
      best = index;
    }
  });
  return best;
}

/**
 * Position dots under a native scroll-snap carousel (`.w-carousel`). Hidden
 * on desktop by CSS. Tapping a dot scrolls its card into view.
 */
export function CarouselDots({
  track,
  count,
  label,
  align = "start",
}: {
  track: RefObject<HTMLElement | null>;
  count: number;
  label: string;
  align?: ScrollLogicalPosition;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) {
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(nearestIndex(el));
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [track, count]);

  const go = (index: number) => {
    const item = track.current?.children[index] as HTMLElement | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    item?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: align });
  };

  return (
    <div aria-label={label} className="w-dots" role="group">
      {Array.from({ length: count }, (_, index) => (
        <button
          aria-current={index === active ? "true" : undefined}
          aria-label={`Ir para o item ${index + 1} de ${count}`}
          key={index}
          onClick={() => go(index)}
          type="button"
        />
      ))}
    </div>
  );
}
