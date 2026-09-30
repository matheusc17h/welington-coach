import { ArrowIcon } from "./icons";

export const external = { rel: "noopener noreferrer", target: "_blank" } as const;

/** Pill CTA whose arrow disc slides on hover: the site's signature button. */
export function PillCta({
  href,
  children,
  size = "md",
}: {
  href: string;
  children: string;
  size?: "md" | "lg";
}) {
  return (
    <a className={`w-pill w-pill--${size}`} href={href} {...external}>
      <span className="w-pill__label">{children}</span>
      <span aria-hidden="true" className="w-pill__disc">
        <ArrowIcon className="w-pill__arrow" />
        <ArrowIcon className="w-pill__arrow w-pill__arrow--next" />
      </span>
    </a>
  );
}
