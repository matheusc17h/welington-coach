import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  "aria-hidden": true,
  fill: "none",
  focusable: false,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
} as const;

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2.2} {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2.6} {...props}>
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2.4} {...props}>
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2.4} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2.4} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 32 32" {...props}>
      <path
        fill="currentColor"
        d="M16.04 3C8.86 3 3.03 8.8 3.03 15.94c0 2.28.6 4.51 1.74 6.47L3 29l6.8-1.77a13.1 13.1 0 0 0 6.24 1.58h.01c7.17 0 13-5.8 13-12.94C29.05 8.8 23.21 3 16.04 3Zm0 23.63h-.01c-1.94 0-3.85-.52-5.51-1.5l-.4-.23-4.03 1.05 1.08-3.91-.26-.4a10.7 10.7 0 0 1-1.66-5.7c0-5.93 4.85-10.76 10.8-10.76 5.95 0 10.79 4.83 10.79 10.76 0 5.94-4.85 10.7-10.8 10.7Zm5.92-8.04c-.33-.16-1.93-.95-2.23-1.06-.3-.1-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.21-.38.24-.7.08-.33-.16-1.38-.5-2.62-1.6a9.8 9.8 0 0 1-1.82-2.25c-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.32.33-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.27-.63-.54-.54-.73-.55h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.11-1.14 2.7 0 1.6 1.17 3.13 1.33 3.35.16.21 2.3 3.5 5.56 4.9.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.1 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38Z"
      />
    </svg>
  );
}

/* "Por que treinar" icons: one per reason, same 24px line style. */
export function GameplayIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2} {...props}>
      <rect height="12" rx="2" width="18" x="3" y="4" />
      <path d="M8 20h8M12 16v4" />
      <path d="m10.5 8 4 2-4 2z" fill="currentColor" />
    </svg>
  );
}

export function TacticsIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2} {...props}>
      <rect height="17" rx="2" width="14" x="5" y="4" />
      <path d="M9 2.5h6v3H9z" />
      <path d="m8 10 2.5 2.5M10.5 10 8 12.5" />
      <circle cx="15" cy="16" r="1.6" />
      <path d="M10 16c1.5-2.5 3-3.5 4-4.5m0 0h-2.2m2.2 0v2.2" />
    </svg>
  );
}

export function MindIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1Z" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" />
      <path d="M12 9h2.5M12 14h3M6 12h2.5" />
    </svg>
  );
}

export function RoutineIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2} {...props}>
      <rect height="16" rx="2" width="18" x="3" y="5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

export function GroupIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.6-3.4 3-5 6-5s5.4 1.6 6 5" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 15c2 .6 3.2 2.2 3.5 5" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.5M17 6h2.5a2.5 2.5 0 0 1-2.6 3.5" />
      <path d="M12 14v3M8.5 20h7M9.5 17h5v3h-5z" />
    </svg>
  );
}
