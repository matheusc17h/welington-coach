// Adapted from React Bits <BorderGlow />. Changes: typed, renders as any tag
// with the card's own classes and background (no wrapper, no forced fill),
// and the coloured edge is a masked 1px ring instead of a card-coloured
// cover, so glass, white and dark cards all keep their surface.
import { useCallback, useRef } from "react";
import type { CSSProperties, ElementType, PointerEvent, ReactNode } from "react";

import "./border-glow.css";

type BorderGlowProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Three colours for the mesh-gradient edge. */
  colors: string[];
  /** Outer glow as "H S L" (e.g. "265 90 75"). */
  glowColor: string;
  /** Light surface: normal blending instead of plus-lighter. */
  light?: boolean;
  edgeSensitivity?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  fillOpacity?: number;
};

const POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];
const OPACITIES = [100, 60, 50, 40, 30, 20, 10];
const GLOW_KEYS = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

function glowVars(glowColor: string, intensity: number) {
  const [h = 40, s = 80, l = 80] = glowColor.split(/\s+/).map(parseFloat);
  const vars: Record<string, string> = {};
  OPACITIES.forEach((opacity, i) => {
    vars[`--glow-color${GLOW_KEYS[i]}`] =
      `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`;
  });
  return vars;
}

function meshGradient(colors: string[]) {
  const layers = POSITIONS.map((position, i) => {
    const color = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    return `radial-gradient(at ${position}, ${color} 0px, transparent 50%)`;
  });
  return [...layers, `linear-gradient(${colors[0]} 0 100%)`].join(", ");
}

export function BorderGlow({
  as: Tag = "div",
  children,
  className,
  colors,
  glowColor,
  light = false,
  edgeSensitivity = 30,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLElement>(null);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = event.clientX - rect.left - cx;
    const dy = event.clientY - rect.top - cy;
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    let angle = dx === 0 && dy === 0 ? 0 : (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  const style = {
    "--edge-sensitivity": edgeSensitivity,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    "--glow-mesh": meshGradient(colors),
    ...glowVars(glowColor, glowIntensity),
  } as CSSProperties;

  return (
    <Tag
      className={`border-glow${light ? " border-glow--light" : ""}${className ? ` ${className}` : ""}`}
      onPointerMove={onPointerMove}
      ref={cardRef}
      style={style}
    >
      <span aria-hidden="true" className="border-glow__edge">
        <span className="border-glow__ring" />
      </span>
      <span aria-hidden="true" className="border-glow__fill" />
      <span aria-hidden="true" className="border-glow__light" />
      {children}
    </Tag>
  );
}
