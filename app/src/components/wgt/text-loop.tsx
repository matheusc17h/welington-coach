// Adapted from React Bits <TextLoop />. Changes: typed, wave only, a shorter
// viewBox (`viewHeight`) so the band stays a strip, and the ribbon can take a
// gradient (`ribbonStops`). The looping text is decorative: callers keep a
// screen-reader copy of it.
import { gsap } from "gsap";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import "./text-loop.css";

type TextLoopProps = {
  text: string;
  separator?: string;
  speed?: number;
  direction?: "forward" | "reverse";
  curviness?: number;
  viewHeight?: number;
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  ribbonWidth?: number;
  ribbonStops: string[];
  className?: string;
};

const VIEW_W = 1200;
const EDGE_PAD = 6;

function wavePath(curviness: number, ribbonWidth: number, viewHeight: number) {
  const cy = viewHeight / 2;
  const room = Math.max(20, cy - ribbonWidth / 2 - EDGE_PAD);
  const a = Math.min(Math.max(0, curviness) * 2.2, room * 2);
  return `M -320 ${cy} Q -160 ${cy - a} 0 ${cy} T 320 ${cy} T 640 ${cy} T 960 ${cy} T 1280 ${cy} T ${VIEW_W + 320} ${cy}`;
}

export function TextLoop({
  text,
  separator = "✦",
  speed = 80,
  direction = "forward",
  curviness = 28,
  viewHeight = 160,
  fontSize = 40,
  letterSpacing = 1,
  color = "#ffffff",
  ribbonWidth = 64,
  ribbonStops,
  className,
}: TextLoopProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const headRef = useRef<SVGTextPathElement>(null);
  const tailRef = useRef<SVGTextPathElement>(null);
  const [metrics, setMetrics] = useState({ width: 0, reps: 1 });

  const id = useId().replace(/:/g, "");
  const pathId = `text-loop-${id}`;
  const gradientId = `text-loop-grad-${id}`;

  const d = useMemo(
    () => wavePath(curviness, ribbonWidth, viewHeight),
    [curviness, ribbonWidth, viewHeight],
  );
  const unit = `${text.toUpperCase()} ${separator} `;
  const textStyle = { fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}px` };

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) {
      return;
    }
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const length = pathEl.getTotalLength();
      const unitWidth = measureEl.getComputedTextLength();
      if (!length) return;
      if (!unitWidth) return;
      // Enough repeats to cover the whole path; the loop then cycles over the
      // text's own width, so no per-frame letter-spacing fit (textLength) is
      // needed. That fit made the browser re-space every glyph each frame.
      const reps = Math.max(1, Math.ceil(length / unitWidth));
      const width = reps * unitWidth;
      setMetrics((prev) => (prev.width === width && prev.reps === reps ? prev : { width, reps }));
    };
    measure();
    // Anton arrives after first paint; re-measure once it does.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, letterSpacing]);

  useEffect(() => {
    const { width } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    const svg = head?.ownerSVGElement;
    if (!head || !tail || !svg || !width) {
      return;
    }
    const apply = (offset: number) => {
      const partner = offset >= 0 ? offset - width : offset + width;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(partner));
    };
    apply(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || speed <= 0) {
      return;
    }
    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: direction === "reverse" ? -width : width,
      duration: width / speed,
      ease: "none",
      repeat: -1,
      paused: true,
      onUpdate: () => apply(state.offset),
    });
    // Only runs while the band is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) tween.play();
      else tween.pause();
    });
    visibility.observe(svg);
    return () => {
      visibility.disconnect();
      tween.kill();
    };
  }, [metrics, speed, direction]);

  const loopText = unit.repeat(metrics.reps);
  const last = Math.max(1, ribbonStops.length - 1);

  return (
    <div aria-hidden="true" className={`text-loop${className ? ` ${className}` : ""}`}>
      <svg
        className="text-loop-svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${VIEW_W} ${viewHeight}`}
      >
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="0" x2={VIEW_W} y1="0" y2="0">
            {ribbonStops.map((stop, index) => (
              <stop key={stop} offset={index / last} stopColor={stop} />
            ))}
          </linearGradient>
        </defs>
        <path
          d={d}
          fill="none"
          id={pathId}
          ref={pathRef}
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={ribbonWidth}
        />
        <text className="text-loop-measure" ref={measureRef} style={textStyle}>
          {unit}
        </text>
        {[headRef, tailRef].map((ref, index) => (
          <text
            className="text-loop-text"
            dominantBaseline="central"
            fill={color}
            key={index}
            style={textStyle}
          >
            <textPath href={`#${pathId}`} ref={ref} startOffset={0}>
              {loopText}
            </textPath>
          </text>
        ))}
      </svg>
    </div>
  );
}
