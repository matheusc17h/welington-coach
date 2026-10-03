import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { whatsapp } from "./content";
import { PillCta } from "./pill";

type Shortcut = {
  title: string;
  body: string;
  costLabel: string;
  cost: string;
  /** 3D render (transparent WebP) that tells the card's story. */
  art: { src: string; width: number; height: number };
};

const shortcuts: Shortcut[] = [
  {
    title: "Boost na conta",
    body: "A divisão subiu. O seu nível ficou exatamente onde estava.",
    costLabel: "Custa",
    cost: "Sua conta na mão de outro",
    art: { src: "/assets/atalhos/boost.webp", width: 491, height: 640 },
  },
  {
    title: "Pack atrás de pack",
    body: "Carta boa no clube não segura contra-ataque nem vira jogo.",
    costLabel: "Retorno",
    cost: "Sorte, e ela acaba",
    art: { src: "/assets/atalhos/packs.webp", width: 640, height: 554 },
  },
  {
    title: "Coins de fora",
    body: "É contra as regras da EA. Um ban apaga anos de clube.",
    costLabel: "Risco",
    cost: "Banimento da conta",
    art: { src: "/assets/atalhos/coins.webp", width: 640, height: 548 },
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
                <img
                  alt=""
                  className="w-cut__art"
                  decoding="async"
                  height={item.art.height}
                  loading="lazy"
                  src={item.art.src}
                  width={item.art.width}
                />
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
