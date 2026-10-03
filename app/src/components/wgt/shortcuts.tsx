import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { whatsapp } from "./content";
import { PillCta } from "./pill";

type Shortcut = {
  title: string;
  body: string;
  costLabel: string;
  cost: string;
  art: ReactNode;
};

/* Illustrations are inline SVG in the brand gradient: crisp at any size,
   themeable and no image requests. */
function BoostArt() {
  return (
    <svg aria-hidden="true" className="w-cut__art" viewBox="0 0 200 140">
      <defs>
        <linearGradient id="cut-g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3fa9ff" />
          <stop offset="0.55" stopColor="#7b2ff7" />
          <stop offset="1" stopColor="#e0218a" />
        </linearGradient>
      </defs>
      {/* Someone else's profile, in front of yours. */}
      <rect
        fill="none"
        height="78"
        opacity="0.35"
        rx="12"
        stroke="#9aa3c7"
        strokeDasharray="5 6"
        strokeWidth="2"
        width="92"
        x="30"
        y="30"
      />
      <g transform="translate(78 22)">
        <rect
          fill="#0c1030"
          height="86"
          rx="14"
          stroke="url(#cut-g1)"
          strokeWidth="2.5"
          width="96"
        />
        <circle cx="48" cy="32" fill="url(#cut-g1)" r="14" />
        <path
          d="M24 70c4-12 14-18 24-18s20 6 24 18"
          fill="none"
          stroke="url(#cut-g1)"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </g>
      <path
        d="M40 118c18 10 44 10 62 0"
        fill="none"
        stroke="#3fa9ff"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        d="m96 112 7 6-9 3"
        fill="none"
        stroke="#3fa9ff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function PointsArt() {
  return (
    <svg aria-hidden="true" className="w-cut__art" viewBox="0 0 200 140">
      <defs>
        <linearGradient id="cut-g2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3fa9ff" />
          <stop offset="0.55" stopColor="#7b2ff7" />
          <stop offset="1" stopColor="#e0218a" />
        </linearGradient>
      </defs>
      {/* A sealed pack: you pay first, find out later. */}
      <g transform="rotate(-8 100 70)">
        <rect
          fill="#0c1030"
          height="104"
          rx="12"
          stroke="url(#cut-g2)"
          strokeWidth="2.5"
          width="76"
          x="62"
          y="18"
        />
        <path d="M62 44h76" stroke="url(#cut-g2)" strokeWidth="2" />
        <text
          fill="url(#cut-g2)"
          fontFamily="Anton, Impact, sans-serif"
          fontSize="44"
          textAnchor="middle"
          x="100"
          y="100"
        >
          ?
        </text>
      </g>
      {[
        [34, 96, 13],
        [168, 40, 10],
        [160, 108, 8],
      ].map(([x, y, r]) => (
        <path
          d={`M${x} ${y - r}l${r * 0.87} ${r / 2}v${r}l${-r * 0.87} ${r / 2}l${-r * 0.87} ${-r / 2}v${-r}z`}
          fill="none"
          key={`${x}-${y}`}
          stroke="#3fa9ff"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      ))}
    </svg>
  );
}

function CoinsArt() {
  return (
    <svg aria-hidden="true" className="w-cut__art" viewBox="0 0 200 140">
      <defs>
        <linearGradient id="cut-g3" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3fa9ff" />
          <stop offset="0.55" stopColor="#7b2ff7" />
          <stop offset="1" stopColor="#e0218a" />
        </linearGradient>
      </defs>
      {/* Coin stack under a ban sign. */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse
          cx="86"
          cy={104 - i * 14}
          fill="#0c1030"
          key={i}
          rx="38"
          ry="11"
          stroke="url(#cut-g3)"
          strokeWidth="2.5"
        />
      ))}
      <circle cx="140" cy="52" fill="#0c1030" r="30" stroke="#e0218a" strokeWidth="5" />
      <path d="m119 73 42-42" stroke="#e0218a" strokeLinecap="round" strokeWidth="5" />
    </svg>
  );
}

const shortcuts: Shortcut[] = [
  {
    title: "Boost na conta",
    body: "A divisão subiu. O seu nível ficou exatamente onde estava.",
    costLabel: "Custa",
    cost: "Sua conta na mão de outro",
    art: <BoostArt />,
  },
  {
    title: "Pack atrás de pack",
    body: "Carta boa no clube não segura contra-ataque nem vira jogo.",
    costLabel: "Retorno",
    cost: "Sorte, e ela acaba",
    art: <PointsArt />,
  },
  {
    title: "Coins de fora",
    body: "É contra as regras da EA. Um ban apaga anos de clube.",
    costLabel: "Risco",
    cost: "Banimento da conta",
    art: <CoinsArt />,
  },
];

/**
 * "Atalhos que não resolvem": three shortcuts players pay for, each stamped
 * out by a magenta slash as it scrolls into view, then the one that works.
 * Cards are fully visible without JS or with reduced motion.
 */
export function Shortcuts() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      return;
    }
    section.classList.add("is-armed");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    for (const el of section.querySelectorAll(".w-cut, .w-cuts__answer")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="atalhos-title"
      className="w-cuts w-section"
      id="atalhos"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="w-aurora w-aurora--side" />
      <div className="w-wrap">
        <div className="w-cuts__head">
          <p className="w-cuts__eyebrow">Dinheiro que não vira divisão</p>
          <h2 className="w-h2" id="atalhos-title">
            Você já gastou com boost, pack e coin. E continua na{" "}
            <span className="w-grad-text">mesma divisão</span>.
          </h2>
          <p className="w-lead">
            Gastar não sobe divisão. <span className="w-grad-text">Treinar</span> sobe.
          </p>
        </div>

        <ul className="w-cuts__grid">
          {shortcuts.map((item, index) => (
            <li className="w-cut" key={item.title} style={{ "--i": index } as CSSProperties}>
              <div className="w-cut__visual">
                <span aria-hidden="true" className="w-cut__beam" />
                {item.art}
                <span aria-hidden="true" className="w-cut__slash" />
                <span aria-hidden="true" className="w-cut__stamp">
                  Não resolve
                </span>
              </div>
              <div className="w-cut__body">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <p className="w-cut__cost">
                  <span>{item.costLabel}</span>
                  <strong>{item.cost}</strong>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="w-cuts__answer">
          <div>
            <p className="w-cuts__answer-kicker">O único atalho que fica</p>
            <p className="w-cuts__answer-line">
              Treino com <span className="w-grad-text">método</span>. O que você aprende, ninguém
              tira da sua conta.
            </p>
          </div>
          <PillCta href={whatsapp.geral}>Quero investir no meu jogo, não no clube</PillCta>
        </div>
      </div>
    </section>
  );
}
