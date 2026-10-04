import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, RefObject } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

import {
  faqs,
  heroChips,
  navLinks,
  notFor,
  plans,
  proofMarquee,
  reasons,
  stuckPoints,
  weeks,
  whatsapp,
} from "./content";
import {
  ArrowIcon,
  CheckIcon,
  CrossIcon,
  GameplayIcon,
  GroupIcon,
  MindIcon,
  PlusIcon,
  RoutineIcon,
  TacticsIcon,
  TrophyIcon,
  WhatsAppIcon,
} from "./icons";

/** One icon per "Por que treinar" reason, in content order. */
const reasonIcons = [GameplayIcon, TacticsIcon, MindIcon, RoutineIcon, GroupIcon, TrophyIcon];
import { Counter, useCounters, withCounter } from "./counter";
import { useTextAnimations } from "./animations-text";
import { external, PillCta } from "./pill";
import { ProFilm } from "./pro-film";
import { Results } from "./results";
import { Shortcuts } from "./shortcuts";

import "./wgt.css";

function Shield({ className, eager }: { className?: string; eager?: boolean }) {
  return (
    <img
      alt=""
      className={className}
      decoding="async"
      height={512}
      loading={eager ? "eager" : "lazy"}
      src="/assets/brand/wgt-shield.webp"
      width={512}
    />
  );
}

function Header() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Mobile menu: closes on Escape, on an outside tap and when the layout
  // switches to desktop. It never locks page scroll.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (event: globalThis.PointerEvent) => {
      if (!(event.target as Element).closest(".w-header")) {
        setMenuOpen(false);
      }
    };
    const desktop = window.matchMedia("(min-width: 861px)");
    const onDesktop = () => {
      if (desktop.matches) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide while reading down, bring back as soon as the visitor scrolls up.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const targets = navLinks
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!targets.length || !("IntersectionObserver" in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const target of targets) {
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="w-header"
      data-hidden={(hidden && !menuOpen) || undefined}
      data-menu-open={menuOpen || undefined}
      data-scrolled={scrolled || undefined}
    >
      <nav aria-label="Principal" className="w-header__pill">
        <a
          aria-label="Welington Rodrigues, WGT eSports. Voltar ao topo"
          className="w-header__brand"
          href="#topo"
        >
          <Shield className="w-header__shield" eager />
          <span aria-hidden="true" className="w-header__lockup">
            <strong>Welington Rodrigues</strong>
            <small>Coach de EA FC</small>
          </span>
        </a>
        <ul className="w-header__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a aria-current={active === link.href ? "location" : undefined} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="w-header__cta" href={whatsapp.geral} {...external}>
          <WhatsAppIcon className="w-header__cta-icon" />
          Agendar minha análise
        </a>
        <button
          aria-controls="menu-mobile"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          className="w-header__burger"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>
      <div className="w-header__panel" hidden={!menuOpen} id="menu-mobile">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                aria-current={active === link.href ? "location" : undefined}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="w-hero" id="topo">
      <div aria-hidden="true" className="w-aurora w-aurora--hero" />
      <div className="w-hero__grid w-wrap">
        <div className="w-hero__copy">
          <ul aria-label="Credenciais" className="w-hero__chips">
            {heroChips.map((chip, index) => (
              <li className="w-in" key={chip} style={{ "--i": index } as CSSProperties}>
                {/* One flex item, or the chip gap splits number and word. */}
                <span>{withCounter(chip)}</span>
              </li>
            ))}
          </ul>
          <h1 className="w-hero__title" id="hero-title">
            <span className="w-line">
              <span className="w-line__in" style={{ "--i": 0 } as CSSProperties}>
                Pare de jogar no <span className="w-outline">automático.</span>
              </span>
            </span>
            <span className="w-line">
              <span className="w-line__in" style={{ "--i": 1 } as CSSProperties}>
                Suba de divisão no <span className="w-grad-text scramble">FC 27</span>.
              </span>
            </span>
          </h1>
          <p className="w-hero__lead">
            O Welington assiste às suas partidas, mostra exatamente onde você perde jogo e monta o
            plano pra você corrigir. Aula individual, em cima do SEU gameplay.
          </p>
          <div className="w-hero__ctas w-in w-in--cta">
            <div className="w-hero__main">
              <PillCta href={whatsapp.geral} size="lg">
                Quero minha análise de gameplay
              </PillCta>
              <p className="w-hero__micro">Você fala direto com o Welington no WhatsApp.</p>
            </div>
            <a className="w-hero__secondary" data-cta href="#resultados">
              Ver quem já subiu de divisão
            </a>
          </div>
          <figure className="w-hero__quote w-in w-in--cta">
            <blockquote>
              “Eu nunca tinha passado da segunda divisão, hoje estou na ELITE.”
            </blockquote>
            <figcaption>@naelsongameseinformatica</figcaption>
          </figure>
        </div>

        <div className="w-hero__visual">
          <div aria-hidden="true" className="w-hero__halo" />
          <div aria-hidden="true" className="w-hero__ring" />
          <img
            alt="Welington Rodrigues, coach de EA SPORTS FC, de headset e controle na mão"
            className="w-hero__photo"
            decoding="async"
            fetchPriority="high"
            height={538}
            src="/assets/brand/welington-hero.webp"
            width={446}
          />
          <Shield className="w-hero__shield" eager />
          <p className="w-hero__badge">
            <strong>
              <Counter prefix="+" value={3500} />
            </strong>
            <span>alunos já passaram pela call</span>
          </p>
        </div>
      </div>
      <p aria-hidden="true" className="w-bleed w-bleed--hero">
        WGT
      </p>
    </section>
  );
}

function Marquee() {
  const row = [...proofMarquee, ...proofMarquee];
  return (
    <section aria-label="Prova social" className="w-marquee">
      <p className="w-sr">{proofMarquee.join(" · ")}</p>
      <div aria-hidden="true" className="w-marquee__track">
        {row.map((item, index) => (
          <span className="w-marquee__item" key={`${item}-${index}`}>
            {item}
            <i className="w-marquee__star" />
          </span>
        ))}
      </div>
    </section>
  );
}

function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useCardsReveal(sectionRef, ".w-about__card");
  return (
    <section aria-labelledby="quem-title" className="w-about w-section" id="quem" ref={sectionRef}>
      <p aria-hidden="true" className="w-bleed w-bleed--about">
        Welington
      </p>
      <div className="w-wrap w-about__grid">
        <div className="w-about__intro w-rise">
          <h2 className="w-h2" id="quem-title">
            Quem sou eu
          </h2>
          <p className="w-lead">
            Coach de EA SPORTS FC e jogador competitivo, com perfil verificado pela EA e mais de
            3.500 alunos. Ele joga o mesmo modo que você, sob a mesma pressão. Não ensina teoria:
            ensina o que decide jogo na Weekend League.
          </p>
          <dl className="w-about__stats">
            <div>
              <dd>
                <Counter decimals={1} value={26.1} />
                <small>mil</small>
              </dd>
              <dt>seguidores no Instagram</dt>
            </div>
            <div>
              <dd>
                <Counter prefix="+" value={3500} />
              </dd>
              <dt>alunos treinados</dt>
            </div>
            <div>
              <dd>EA</dd>
              <dt>perfil verificado</dt>
            </div>
          </dl>
        </div>

        <div className="w-about__mosaic">
          <figure className="w-about__photo">
            <img
              alt="Welington Rodrigues com a camisa da WGT eSports"
              decoding="async"
              height={635}
              loading="lazy"
              sizes="(max-width: 860px) 92vw, 30vw"
              src="/assets/brand/welington-quem.webp"
              srcSet="/assets/brand/welington-quem-480.webp 480w, /assets/brand/welington-quem.webp 640w"
              width={640}
            />
          </figure>
          <article className="w-about__card w-about__card--mission">
            <p className="w-about__tag">Missão</p>
            <h3>Tirar você do automático.</h3>
          </article>
          <article className="w-about__card w-about__card--method">
            <p className="w-about__tag">Método</p>
            <h3>Defesa na mão, passe mirado, cabeça no lugar.</h3>
          </article>
        </div>
      </div>
    </section>
  );
}

/**
 * Cards come in one at a time with the scroll: tied to the scroll on desktop,
 * played once per card on phones (stacked), alternating the side they come
 * from. Headings stay static. Cards are server-rendered and only hidden once
 * GSAP runs, so without JS everything is visible. A card offset sideways in
 * CSS sets `--nudge-x` (percent of its width) so the offset stays responsive
 * while GSAP owns its transform.
 */
function useCardsReveal(sectionRef: RefObject<HTMLElement | null>, cards: string) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) {
          return;
        }
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        const nudge = (card: HTMLElement) => {
          const shift = parseFloat(getComputedStyle(card).getPropertyValue("--nudge-x"));
          if (shift) {
            gsap.set(card, { x: 0, xPercent: shift });
          }
        };
        // Desktop: each card rises into place tied to the page scroll.
        // Transform/opacity only, so it stays light.
        mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
          for (const card of section.querySelectorAll<HTMLElement>(cards)) {
            nudge(card);
            gsap.from(card, {
              autoAlpha: 0,
              yPercent: 35,
              scale: 0.94,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 96%", end: "top 62%", scrub: 0.5 },
            });
          }
        });
        // Phones: each card rises in on its own as it reaches the screen.
        mm.add("(max-width: 860px) and (prefers-reduced-motion: no-preference)", () => {
          section.querySelectorAll<HTMLElement>(cards).forEach((card, index) => {
            nudge(card);
            gsap.from(card, {
              autoAlpha: 0,
              y: 48,
              x: index % 2 ? 24 : -24,
              scale: 0.96,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
            });
          });
        });
        cleanup = () => mm.revert();
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef, cards]);
}

function Stuck() {
  const sectionRef = useRef<HTMLElement>(null);
  useCardsReveal(sectionRef, ".w-stuck__card");

  return (
    <section
      aria-labelledby="travando-title"
      className="w-stuck w-section"
      id="travando"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="w-aurora w-aurora--mid" />
      <div className="w-wrap">
        {/* The sticky heading lives in its own grid with the cards, so it
            releases before the closing line instead of sliding over it. */}
        <div className="w-stuck__grid">
          <div className="w-stuck__head">
            <h2 className="w-h2" id="travando-title">
              Onde você está travando
            </h2>
            <p className="w-lead">
              Seis sinais que aparecem em quase toda call de diagnóstico. Conta quantos são seus.
            </p>
          </div>
          <div className="w-stuck__viewport">
            <ol className="w-stuck__list">
              {stuckPoints.map((point, index) => (
                <li className="w-glass w-stuck__card" key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="w-stuck__close">
          <p>Marcou três ou mais? O problema não é talento. É método. E método se treina.</p>
          <PillCta href={whatsapp.erros}>Quero corrigir esses erros</PillCta>
        </div>
      </div>
    </section>
  );
}

function Film() {
  return (
    <section aria-label="O método em quatro capítulos" className="w-film" id="filme">
      <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
    </section>
  );
}

/**
 * Plan timeline, played once (not scrubbed) when the visitor is about half
 * way into the section: week 1's dot lights up and its text rises, then the
 * line draws on to the next dot, and so on until week 4. The line is
 * horizontal on desktop and vertical on phones; both are measured from the
 * real dot positions. Everything is visible without JS or with reduced motion.
 */
function useWeeksSequence(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) {
          return;
        }
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add(
          {
            vertical: "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
            horizontal: "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
          },
          (context) => {
            const vertical = Boolean(context.conditions?.vertical);
            const line = section.querySelector<HTMLElement>(".w-weeks__line");
            const fill = section.querySelector<HTMLElement>(".w-weeks__fill");
            const steps = [...section.querySelectorAll<HTMLElement>(".w-weeks__step")];
            if (!line || !fill || !steps.length) {
              return;
            }
            const dots = steps.map((step) => step.querySelector<HTMLElement>(".w-weeks__dot"));
            // Fraction of the line (0-1) where dot i sits. Measured on the
            // unscaled track: the fill itself starts at scale 0 (no size).
            const track = fill.parentElement ?? fill;
            const at = (i: number) => {
              const dot = dots[i];
              if (!dot) {
                return 1;
              }
              const l = track.getBoundingClientRect();
              const d = dot.getBoundingClientRect();
              return vertical
                ? (d.top + d.height / 2 - l.top) / l.height
                : (d.left + d.width / 2 - l.left) / l.width;
            };
            const axis = vertical ? "scaleY" : "scaleX";
            gsap.set(fill, { [axis]: 0 });

            const tl = gsap.timeline({
              paused: true,
              defaults: { ease: "power3.out" },
            });
            steps.forEach((step, i) => {
              const dot = dots[i];
              const text = step.querySelectorAll(".w-weeks__week, h3, p");
              if (i > 0) {
                // Draw the connection up to this week's dot.
                tl.to(fill, { [axis]: () => at(i), duration: 0.7, ease: "power2.inOut" });
              } else {
                tl.to(fill, { [axis]: () => at(0), duration: 0.3, ease: "power2.out" });
              }
              if (dot) {
                tl.fromTo(
                  dot,
                  { scale: 0, autoAlpha: 0 },
                  { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(2.6)" },
                  "-=0.1",
                ).fromTo(
                  dot,
                  { "--glow": 0 },
                  { "--glow": 1, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" },
                  "<0.15",
                );
              }
              tl.from(text, { autoAlpha: 0, y: 22, duration: 0.6, stagger: 0.08 }, "<");
            });
            // Finish the line to its end after the last week.
            tl.to(fill, { [axis]: 1, duration: 0.5, ease: "power2.inOut" });

            ScrollTrigger.create({
              trigger: section,
              start: "top 45%",
              once: true,
              onEnter: () => tl.play(),
            });
            return () => {
              tl.kill();
              gsap.set(fill, { clearProps: "transform" });
            };
          },
        );
        cleanup = () => mm.revert();
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef]);
}

function Weeks() {
  const sectionRef = useRef<HTMLElement>(null);
  useWeeksSequence(sectionRef);

  return (
    <section
      aria-labelledby="metodo-title"
      className="w-weeks w-section"
      id="metodo"
      ref={sectionRef}
    >
      <div className="w-wrap">
        <div className="w-weeks__head">
          <h2 className="w-h2" id="metodo-title">
            Plano de 4 semanas
          </h2>
          <p className="w-lead">
            {/* TODO CONFIRMAR: subtítulo deixando claro que é o plano Premium: "O que você
                recebe no plano Premium, na ordem certa." */}
            O que você vai receber, na ordem certa. Um fundamento por semana, do bote no tempo à
            rotina de Weekend League.
          </p>
        </div>
        <ol className="w-weeks__line">
          <li aria-hidden="true" className="w-weeks__track">
            <span className="w-weeks__fill" />
          </li>
          {weeks.map((item, index) => (
            <li className="w-weeks__step" key={item.week}>
              <span aria-hidden="true" className="w-weeks__dot" />
              <p className="w-weeks__week">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {item.week}
              </p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
        <p className="w-weeks__note">
          Tudo começa pelo diagnóstico do seu gameplay. Na primeira call você já sai sabendo onde
          perde jogo.
        </p>
      </div>
    </section>
  );
}

function Reasons() {
  const sectionRef = useRef<HTMLElement>(null);
  useCardsReveal(sectionRef, ".w-reasons__card");
  return (
    <section
      aria-labelledby="porque-title"
      className="w-reasons w-section"
      id="porque"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="w-aurora w-aurora--side" />
      <div className="w-wrap w-reasons__grid">
        <div className="w-reasons__head">
          <h2 className="w-h2" id="porque-title">
            O que muda quando você treina com quem joga
          </h2>
          <p className="w-lead">
            Treino em cima das suas partidas, com uma meta que dá para medir: subir de divisão.
          </p>
        </div>
        {reasons.map((reason, index) => {
          const Icon = reasonIcons[index] ?? CheckIcon;
          return (
            <article
              className={`w-glass w-reasons__card${index === 0 ? " w-reasons__card--wide" : ""}`}
              key={reason.title}
            >
              <span aria-hidden="true" className="w-reasons__check">
                <Icon />
              </span>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NotFor() {
  return (
    <section aria-labelledby="naoe-title" className="w-notfor w-section" id="para-quem-nao">
      <div className="w-wrap w-notfor__grid">
        <div className="w-notfor__head">
          <h2 className="w-h2" id="naoe-title">
            Para quem não é
          </h2>
          <p className="w-lead">
            Aula é treino, não atalho. Se você se encaixa em algum desses, é melhor não gastar seu
            tempo nem o meu.
          </p>
        </div>
        <ul className="w-notfor__list">
          {notFor.map((item, index) => (
            <li className="w-glass w-notfor__item w-rise" key={item}>
              <span aria-hidden="true" className="w-notfor__x">
                <CrossIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="w-notfor__yes">
          Agora, se você topa treinar, rever seus jogos e ouvir a verdade sobre o seu gameplay, esse
          treino é pra você.
        </p>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section aria-labelledby="planos-title" className="w-plans w-section" id="planos">
      <div aria-hidden="true" className="w-aurora w-aurora--mid" />
      <p aria-hidden="true" className="w-bleed w-bleed--plans">
        Divisão
      </p>
      <div className="w-wrap w-plans__stage">
        <div className="w-plans__head">
          <h2 className="w-h2" id="planos-title">
            Escolha seu plano
          </h2>
          <p className="w-lead">
            Me conta sua divisão no WhatsApp que eu te indico o plano certo e passo o valor na hora.
          </p>
        </div>
        <div className="w-plans__viewport">
          <ul className="w-plans__grid">
            {plans.map((plan) => (
              <li
                className={`w-plan w-rise${plan.featured ? " w-plan--featured" : ""}`}
                key={plan.name}
              >
                {plan.featured ? <p className="w-plan__seal">Mais escolhido</p> : null}
                <h3 className="w-plan__name">{plan.name}</h3>
                <p className="w-plan__pitch">{plan.pitch}</p>
                <ul className="w-plan__items">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {/* TODO CONFIRMAR: "a partir de R$ X" entra aqui, acima do botão. */}
                <a
                  aria-label={`${plan.cta} (abre o WhatsApp)`}
                  className="w-plan__cta"
                  data-cta
                  href={plan.href}
                  {...external}
                >
                  <WhatsAppIcon />
                  <span>{plan.cta}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="duvidas-title" className="w-faq w-section" id="duvidas">
      <div className="w-wrap w-faq__grid">
        <div className="w-faq__head">
          <h2 className="w-h2" id="duvidas-title">
            Perguntas frequentes
          </h2>
          <p className="w-lead">Não achou a sua? Manda no WhatsApp.</p>
          <a className="w-faq__link" data-cta href={whatsapp.geral} {...external}>
            Tirar dúvida no WhatsApp
            <ArrowIcon />
          </a>
        </div>
        <div className="w-faq__list">
          {faqs.map((faq, index) => (
            <details className="w-faq__item" key={faq.q} name="faq" open={index === 0}>
              <summary>
                <span className="w-faq__q">{faq.q}</span>
                <span aria-hidden="true" className="w-faq__icon">
                  <PlusIcon />
                </span>
              </summary>
              <div className="w-faq__answer">
                <p>{faq.a}</p>
                {faq.cta ? (
                  <a className="w-faq__inline" data-cta href={whatsapp.geral} {...external}>
                    Agendar minha análise
                    <ArrowIcon />
                  </a>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="w-final" id="agendar">
      <div aria-hidden="true" className="w-aurora w-aurora--final" />
      <div className="w-wrap w-final__inner">
        <Shield className="w-final__shield" />
        <h2 className="w-final__title" id="final-title">
          Sua próxima Weekend League pode ser diferente.
        </h2>
        <p className="w-lead">
          Manda sua divisão no WhatsApp e marca a primeira análise. O Welington te mostra por onde
          começar.
        </p>
        <PillCta href={whatsapp.geral} size="lg">
          Mandar minha divisão no WhatsApp
        </PillCta>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-footer">
      <div className="w-wrap w-footer__inner">
        <div className="w-footer__brand">
          <Shield className="w-footer__shield" />
          <img
            alt="WGT eSports"
            className="w-footer__wordmark"
            height={120}
            loading="lazy"
            src="/assets/brand/wgt-wordmark.webp"
            width={186}
          />
        </div>
        <ul className="w-footer__links">
          <li>
            <a href="https://www.instagram.com/welingtonrodrigues04/" {...external}>
              @welingtonrodrigues04
            </a>
          </li>
          <li>
            <a href="https://linktr.ee/WGTeSports" {...external}>
              linktr.ee/WGTeSports
            </a>
          </li>
        </ul>
        <p className="w-footer__legal">
          EA SPORTS FC é marca registrada da Electronic Arts. Este site não tem vínculo com a EA.
        </p>
      </div>
    </footer>
  );
}

/** Things the floating button must never sit on top of. */
const FLOAT_AVOID = "main a[href], main button, .w-about__photo, .w-footer";

/**
 * Only shows once the hero (which has its own CTAs) is off screen, and steps
 * aside while a button, link, the about photo or the footer passes under it.
 */
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [covering, setCovering] = useState(false);
  const floatRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const float = floatRef.current;
    if (!float) {
      return;
    }
    let frame = 0;
    const check = () => {
      frame = 0;
      // Measure the resting spot (the hidden state is only a small offset).
      const zone = float.getBoundingClientRect();
      const pad = 8;
      let hit = false;
      for (const el of document.querySelectorAll(FLOAT_AVOID)) {
        if (el === float || el.closest("dialog")) {
          continue;
        }
        const r = el.getBoundingClientRect();
        if (
          r.width > 0 &&
          r.left < zone.right + pad &&
          r.right > zone.left - pad &&
          r.top < zone.bottom + pad &&
          r.bottom > zone.top - pad
        ) {
          hit = true;
          break;
        }
      }
      setCovering(hit);
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(check);
      }
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Horizontal rails (plans, videos) move buttons without a page scroll.
    document.addEventListener("scroll", schedule, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("scroll", schedule, { capture: true });
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const hero = document.getElementById("topo");
    if (!hero || !("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "0px 0px -35% 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const shown = visible && !covering;

  return (
    <a
      aria-hidden={shown ? undefined : true}
      aria-label="Chamar o Welington no WhatsApp"
      className="w-float"
      data-visible={shown || undefined}
      href={whatsapp.geral}
      ref={floatRef}
      tabIndex={shown ? undefined : -1}
      {...external}
    >
      <WhatsAppIcon />
      <span className="w-float__label">Agendar minha análise</span>
    </a>
  );
}

/** On screen, the mobile sticky bar steps aside: the hero, the final CTA,
    every section CTA (`data-cta`) and the other tappable bits it would cover
    (the student video row, the film's sound toggle). */
const STICKY_AVOID = "#topo, #agendar, [data-cta], .w-videos__viewport, .w-pro__sound";

/**
 * Phones only (CSS): a bottom bar with the main CTA. It hides while the hero,
 * the final section or any section CTA is in the viewport, so it never sits
 * on top of another button, and comes back once none is. One
 * IntersectionObserver, no scroll listener. While hidden it is `inert`.
 */
function StickyCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onScreen.add(entry.target);
        } else {
          onScreen.delete(entry.target);
        }
      }
      setShown(onScreen.size === 0);
    });
    for (const el of document.querySelectorAll(STICKY_AVOID)) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-sticky" data-visible={shown || undefined} inert={!shown}>
      <PillCta href={whatsapp.geral} section={false}>
        Agendar minha análise
      </PillCta>
    </div>
  );
}

export function Landing() {
  useTextAnimations();
  useCounters();
  return (
    <div className="wgt" lang="pt-BR">
      <a className="w-skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <About />
        <Stuck />
        <Shortcuts />
        <Film />
        <Weeks />
        <ProFilm />
        <Reasons />
        <Results />
        <NotFor />
        <Plans />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <StickyCta />
      <div aria-hidden="true" className="w-grain" />
    </div>
  );
}
