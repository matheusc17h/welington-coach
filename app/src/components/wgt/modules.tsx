import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { whatsapp } from "./content";
import { PillCta } from "./pill";

type Module = {
  word: string;
  cut?: boolean;
  title: string;
  body: string;
  img: string;
};

const modules: Module[] = [
  {
    word: "Ataque",
    title: "O maestro do ataque",
    body: "Construção, passe mirado e finalização certa para cada situação.",
    img: "/assets/modulos/ataque",
    cut: true,
  },
  {
    word: "Defesa",
    title: "Muralha defensiva",
    body: "Troca manual, jockey e bote no tempo certo. Sem depender da IA.",
    img: "/assets/modulos/defesa",
    cut: true,
  },
  {
    word: "Drible",
    title: "Drible com propósito",
    body: "Skill que abre espaço, não que perde a bola no meio-campo.",
    img: "/assets/modulos/drible",
    cut: true,
  },
];

/** Responsive image: 960w for cards/phones, 1600w for the featured card. */
function ModuleImage({
  base,
  sizes,
  className,
}: {
  base: string;
  sizes: string;
  className?: string;
}) {
  return (
    <img
      alt=""
      className={className}
      decoding="async"
      height={900}
      loading="lazy"
      sizes={sizes}
      src={`${base}-960.webp`}
      srcSet={`${base}-960.webp 960w, ${base}-1600.webp 1600w`}
      width={1600}
    />
  );
}

/**
 * Three layers, like a game cover: the scene, the giant word, then the same
 * frame with the background removed on top, so the player stands in front
 * of the word. The cutout is optional (layout is identical without it).
 */
function ModuleMedia({
  base,
  word,
  sizes,
  cut,
}: {
  base: string;
  word: string;
  sizes: string;
  cut?: boolean;
}) {
  return (
    <div className="w-mod__media">
      <ModuleImage base={base} className="w-mod__scene" sizes={sizes} />
      <p aria-hidden="true" className="w-mod__word">
        {word}
      </p>
      {cut ? <ModuleImage base={`${base}-cut`} className="w-mod__cut" sizes={sizes} /> : null}
    </div>
  );
}

/**
 * "O que você vai treinar": a featured journey card plus three skill cards.
 * Each image carries a giant italic word (JORNADA, ATAQUE...) that wipes in
 * as the card scrolls into view. Everything is visible without JS.
 */
export function Modules() {
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
      { rootMargin: "0px 0px -15% 0px" },
    );
    for (const el of section.querySelectorAll(".w-mod")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="modulos-title"
      className="w-mods w-section"
      id="modulos"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="w-aurora w-aurora--mid" />
      <div className="w-wrap">
        <div className="w-mods__head">
          <h2 className="w-h2" id="modulos-title">
            O que você vai <span className="w-grad-text">treinar</span>
          </h2>
          <p className="w-lead">
            Do primeiro diagnóstico ao jogo completo. Cada fundamento com o Welington do seu lado.
          </p>
        </div>

        <article className="w-mod w-mod--feature">
          <ModuleMedia
            base="/assets/modulos/jornada"
            cut
            sizes="(max-width: 860px) 100vw, 60vw"
            word="Jornada"
          />
          <div className="w-mod__copy">
            <p className="w-mod__tag">Aula 01 · Comece por aqui</p>
            <h3 className="w-mod__title">Jornada EA FC 27</h3>
            <p>
              O que mudou do 26 para o 27 e como ajustar controle, câmera e configurações antes de
              entrar em campo.
            </p>
            <p>Depois, o diagnóstico do seu gameplay: onde você perde jogo e por onde começar.</p>
            <PillCta href={whatsapp.geral}>Começar agora</PillCta>
          </div>
        </article>

        <ul className="w-mods__grid">
          {modules.map((mod, index) => (
            <li
              className="w-mod w-mod--card"
              key={mod.word}
              style={{ "--i": index } as CSSProperties}
            >
              <ModuleMedia
                base={mod.img}
                cut={mod.cut}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                word={mod.word}
              />
              <div className="w-mod__copy">
                <h3 className="w-mod__title">{mod.title}</h3>
                <p>{mod.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
