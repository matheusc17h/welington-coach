import { useState } from "react";
import type { CSSProperties } from "react";

import { whatsapp } from "./content";
import { PillCta } from "./pill";

type Module = {
  id: string;
  tag: string;
  title: string;
  body: string;
  img: string;
};

const modules: Module[] = [
  {
    id: "partida",
    tag: "Primeira call",
    title: "Ponto de partida no FC 27",
    body: "Controle, câmera e configurações acertados para o jogo novo, e o diagnóstico do seu gameplay: onde você perde jogo e por onde começar.",
    img: "/assets/modulos/jornada",
  },
  {
    id: "velocidade",
    tag: "Ataque",
    title: "Atacar o espaço",
    body: "Condução em velocidade, passe mirado e a finalização certa para cada lance. Menos toque de lado, mais jogada que termina em gol.",
    img: "/assets/modulos/velocidade",
  },
  {
    id: "leitura",
    tag: "Decisão",
    title: "Leitura de jogo",
    body: "Proteger a bola sob pressão e saber quando tocar, segurar ou acelerar. A decisão vem antes da bola chegar.",
    img: "/assets/modulos/decisao",
  },
  {
    id: "plano",
    tag: "Mentalidade",
    title: "Plano de jogo",
    body: "Ajuste no intervalo, leitura do adversário e sangue frio quando o placar aperta. Jogar como quem comanda o time.",
    img: "/assets/modulos/tecnico",
  },
];

/**
 * "O que você vai treinar": a horizontal accordion. One panel is open at a
 * time (hover, focus or tap opens it); closed panels show a vertical label.
 * On phones the panels simply stack, all open.
 */
export function Modules() {
  const [open, setOpen] = useState(0);

  return (
    <section aria-labelledby="modulos-title" className="w-mods w-section" id="modulos">
      <div aria-hidden="true" className="w-aurora w-aurora--mid" />
      <div className="w-wrap">
        <div className="w-mods__head">
          <h2 className="w-h2" id="modulos-title">
            O que você vai <span className="w-grad-text">treinar</span>
          </h2>
          <p className="w-lead">
            Quatro frentes, uma de cada vez, sempre em cima das suas partidas.
          </p>
        </div>

        <ul className="w-acc">
          {modules.map((mod, index) => (
            <li
              className="w-acc__panel"
              data-open={open === index || undefined}
              key={mod.id}
              onFocus={() => setOpen(index)}
              onMouseEnter={() => setOpen(index)}
              style={{ "--i": index } as CSSProperties}
            >
              <img
                alt=""
                className="w-acc__img"
                decoding="async"
                height={900}
                loading="lazy"
                sizes="(max-width: 860px) 100vw, 60vw"
                src={`${mod.img}-960.webp`}
                srcSet={`${mod.img}-960.webp 960w, ${mod.img}-1600.webp 1600w`}
                width={1600}
              />
              <button
                aria-expanded={open === index}
                className="w-acc__toggle"
                onClick={() => setOpen(index)}
                type="button"
              >
                <span className="w-acc__num">{String(index + 1).padStart(2, "0")}</span>
                <span className="w-acc__label">{mod.tag}</span>
              </button>
              <div className="w-acc__copy">
                <p className="w-acc__tag">
                  {String(index + 1).padStart(2, "0")} · {mod.tag}
                </p>
                <h3 className="w-acc__title">{mod.title}</h3>
                <p className="w-acc__body">{mod.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="w-mods__cta">
          <p>Você começa pelo ponto de partida. O resto, o Welington monta com você.</p>
          <PillCta href={whatsapp.geral}>Quero começar</PillCta>
        </div>
      </div>
    </section>
  );
}
