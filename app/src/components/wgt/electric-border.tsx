// Adapted from React Bits <ElectricBorder /> (inspired by @BalintFerenczy,
// https://codepen.io/BalintFerenczy/pen/KwdoyEN). Changes: typed, renders as
// any tag, pauses off screen, draws one still frame under reduced motion.
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import "./electric-border.css";

type ElectricBorderProps = {
  as?: ElementType;
  children: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
};

const OCTAVES = 10;
const LACUNARITY = 1.6;
const GAIN = 0.7;
const FREQUENCY = 10;
const DISPLACEMENT = 60;
const OFFSET = 60;

function random(x: number) {
  return (Math.sin(x * 12.9898) * 43758.5453) % 1;
}

function noise2D(x: number, y: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const a = random(i + j * 57);
  const b = random(i + 1 + j * 57);
  const c = random(i + (j + 1) * 57);
  const d = random(i + 1 + (j + 1) * 57);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

function octavedNoise(x: number, amplitude: number, time: number, seed: number) {
  let y = 0;
  let amp = amplitude;
  let frequency = FREQUENCY;
  // The first octave is flattened (base flatness 0), as in the original.
  for (let i = 0; i < OCTAVES; i++) {
    if (i > 0) {
      y += amp * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
    }
    frequency *= LACUNARITY;
    amp *= GAIN;
  }
  return y;
}

function cornerPoint(cx: number, cy: number, r: number, start: number, progress: number) {
  const angle = start + (progress * Math.PI) / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function roundedRectPoint(t: number, left: number, top: number, w: number, h: number, r: number) {
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  const arc = (Math.PI * r) / 2;
  let d = t * (2 * sw + 2 * sh + 4 * arc);

  if (d <= sw) return { x: left + r + d, y: top };
  d -= sw;
  if (d <= arc) return cornerPoint(left + w - r, top + r, r, -Math.PI / 2, d / arc);
  d -= arc;
  if (d <= sh) return { x: left + w, y: top + r + d };
  d -= sh;
  if (d <= arc) return cornerPoint(left + w - r, top + h - r, r, 0, d / arc);
  d -= arc;
  if (d <= sw) return { x: left + w - r - d, y: top + h };
  d -= sw;
  if (d <= arc) return cornerPoint(left + r, top + h - r, r, Math.PI / 2, d / arc);
  d -= arc;
  if (d <= sh) return { x: left, y: top + h - r - d };
  d -= sh;
  return cornerPoint(left + r, top + r, r, Math.PI, d / arc);
}

export function ElectricBorder({
  as: Tag = "div",
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  contentClassName,
  style,
}: ElectricBorderProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) {
      return;
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let last = 0;
    let frame = 0;
    let onScreen = false;

    const resize = () => {
      width = container.offsetWidth + OFFSET * 2;
      height = container.offsetHeight + OFFSET * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const w = width - 2 * OFFSET;
      const h = height - 2 * OFFSET;
      const r = Math.min(borderRadius, Math.min(w, h) / 2);
      const samples = Math.floor((2 * (w + h) + 2 * Math.PI * r) / 2);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const point = roundedRectPoint(p, OFFSET, OFFSET, w, h, r);
        const x = point.x + octavedNoise(p * 8, chaos, time, 0) * DISPLACEMENT;
        const y = point.y + octavedNoise(p * 8, chaos, time, 1) * DISPLACEMENT;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const tick = (now: number) => {
      time += ((now - last) / 1000) * speed;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (still || frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(container);

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    visibility.observe(container);

    const onTab = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onTab);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onTab);
    };
  }, [color, speed, chaos, borderRadius]);

  const vars = { "--electric-border-color": color, borderRadius } as CSSProperties;

  return (
    <Tag
      className={`electric-border${className ? ` ${className}` : ""}`}
      ref={containerRef}
      style={{ ...vars, ...style }}
    >
      <div aria-hidden="true" className="eb-canvas-container">
        <canvas className="eb-canvas" ref={canvasRef} />
      </div>
      <div aria-hidden="true" className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className={`eb-content${contentClassName ? ` ${contentClassName}` : ""}`}>
        {children}
      </div>
    </Tag>
  );
}
