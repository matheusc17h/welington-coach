import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, RefObject } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

import {
  faqs,
  heroChips,
  navLinks,
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
  GameplayIcon,
  MindIcon,
  PlusIcon,
  TacticsIcon,
  WhatsAppIcon,
} from "./icons";

/** One icon per reason in the weeks section, in content order. */
const reasonIcons = [GameplayIcon, TacticsIcon, MindIcon];
/** BorderGlow on the cards: the brand ramp on the edge, a violet glow
    (lighter on dark cards, deeper on the plans' light sheet). */
const GLOW_COLORS = ["#3fa9ff", "#7b2ff7", "#e0218a"];
const GLOW_DARK = "265 95 75";
const GLOW_LIGHT = "262 85 58";
import { BorderGlow } from "./border-glow";
import { Counter, useCounters, withCounter } from "./counter";
import { TextLoop } from "./text-loop";
import { useTextAnimations } from "./animations-text";
import { external, PillCta } from "./pill";
import { Results } from "./results";
import { Satin } from "./satin";
import { Shortcuts } from "./shortcuts";

import "./wgt.css";

function Shield({ className, eager }: { className?: string; eager?: boolean }) {
  return (
    <img
      alt=""
      className={className}
      decoding="async"
      height={448}
      loading={eager ? "eager" : "lazy"}
      src="/assets/brand/wgt-shield.webp"
      width={448}
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

/**
 * The circle behind the hero photo idles: the gradient turns inside the disc,
 * the disc breathes, the glow pulses and the ring turns the other way. The
 * photo itself never moves. Nothing runs with reduced motion.
 */
function useHeroHalo(visualRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;

    void import("gsap").then(({ gsap }) => {
      if (cancelled) {
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(visual);
        gsap.to(q(".w-hero__halo-fill"), { rotation: 360, duration: 20, ease: "none", repeat: -1 });
        gsap.to(q(".w-hero__halo-disc"), {
          scale: 1.03,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.fromTo(
          q(".w-hero__halo-glow"),
          { opacity: 0.6 },
          { opacity: 1, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true },
        );
        gsap.to(q(".w-hero__ring-line"), { rotation: -360, duration: 40, ease: "none", repeat: -1 });
      });
      cleanup = () => mm.revert();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [visualRef]);
}

function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  useHeroHalo(visualRef);
  return (
    <section aria-labelledby="hero-title" className="w-hero" id="topo">
      <Satin />
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
            plano pra você corrigir. Aula individual, em cima da SUA gameplay.
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
              Eu nunca tinha passado da segunda divisão, hoje estou na ELITE.
            </blockquote>
            <figcaption>@naelsongameseinformatica</figcaption>
          </figure>
        </div>

        <div className="w-hero__visual" ref={visualRef}>
          <div aria-hidden="true" className="w-hero__halo">
            <span className="w-hero__halo-glow" />
            <span className="w-hero__halo-disc">
              <span className="w-hero__halo-fill" />
            </span>
          </div>
          <div aria-hidden="true" className="w-hero__ring">
            <span className="w-hero__ring-line" />
          </div>
          <img
            alt="Welington Rodrigues, coach de EA SPORTS FC, de headset e controle na mão"
            className="w-hero__photo"
            decoding="async"
            fetchPriority="high"
            height={1307}
            src="/assets/brand/welington-hero-v2.webp"
            width={1320}
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

/** Social proof riding a brand-gradient wave (TextLoop). */
function Marquee() {
  return (
    <section aria-label="Prova social" className="w-marquee">
      <p className="w-sr">{proofMarquee.join(" · ")}</p>
      <TextLoop
        ribbonStops={["#1f3bff", "#7b2ff7", "#e0218a"]}
        text={proofMarquee.join(" ✦ ")}
      />
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
            Quem <span className="w-grad-text">sou eu</span>
          </h2>
          <p className="w-lead">
            Sou coach de EA SPORTS FC e jogador competitivo, com perfil verificado pela EA e mais
            de 3.500 alunos. Jogo o mesmo modo que você, sob a mesma pressão. Não ensino teoria:
            ensino o que decide jogo na Weekend League.
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
 * Cards come in one at a time as they reach the screen: a staggered batch on
 * desktop, one card per trigger on phones (stacked), alternating the side they
 * come from. Headings stay static. Cards are server-rendered and only hidden once
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
        // Desktop: cards that reach the screen together come in one after
        // another (ScrollTrigger.batch + stagger), played once. Each returns
        // to its own resting offset (the staggered grid shifts some down).
        mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
          const els = [...section.querySelectorAll<HTMLElement>(cards)];
          els.forEach(nudge);
          const rest = new Map(els.map((el) => [el, Number(gsap.getProperty(el, "y"))]));
          for (const el of els) {
            gsap.set(el, { autoAlpha: 0, scale: 0.96, y: (rest.get(el) ?? 0) + 56 });
          }
          const triggers = ScrollTrigger.batch(els, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                scale: 1,
                y: (_index: number, el: HTMLElement) => rest.get(el) ?? 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.18,
                overwrite: true,
              }),
          });
          return () => {
            for (const trigger of triggers) {
              trigger.kill();
            }
          };
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
              Onde você está{" "}
              <span className="w-grad-text">
                travando<span className="w-only-phone">?</span>
              </span>
            </h2>
            <p className="w-lead">
              Seis sinais que aparecem em quase toda call de diagnóstico. Conta quantos são seus.
            </p>
          </div>
          <div className="w-stuck__viewport">
            <ol className="w-stuck__list">
              {stuckPoints.map((point) => (
                <BorderGlow
                  as="li"
                  className="w-glass w-grow w-stuck__card"
                  colors={GLOW_COLORS}
                  glowColor={GLOW_DARK}
                  key={point.title}
                >
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </BorderGlow>
              ))}
            </ol>
          </div>
        </div>
        <div className="w-stuck__close">
          <p>
            Marcou três ou mais? O problema não é talento. É{" "}
            <span className="w-grad-text">método</span>. E método se treina.
          </p>
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

            // Tied to the scrollbar: each week lights up as the line scrolls
            // through the screen, and goes back when scrolling up.
            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: line,
                start: vertical ? "top 80%" : "top 85%",
                end: vertical ? "bottom 60%" : "bottom 40%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
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

            // The note and the three benefit cards ride the scroll too: one
            // after another along the row on desktop, each on its own as it
            // enters on phones (stacked).
            const note = section.querySelector<HTMLElement>(".w-weeks__note");
            const gains = [...section.querySelectorAll<HTMLElement>(".w-weeks__gain")];
            const from = { autoAlpha: 0, y: 70, scale: 0.94 };
            const to = { autoAlpha: 1, y: 0, scale: 1, ease: "none" };
            if (note) {
              gsap.fromTo(note, { autoAlpha: 0, y: 30 }, {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: { trigger: note, start: "top 95%", end: "top 70%", scrub: 0.6 },
              });
            }
            if (vertical) {
              for (const gain of gains) {
                gsap.fromTo(gain, from, {
                  ...to,
                  scrollTrigger: { trigger: gain, start: "top 98%", end: "top 65%", scrub: 0.6 },
                });
              }
            } else if (gains.length) {
              gsap.fromTo(gains, from, {
                ...to,
                stagger: 0.25,
                scrollTrigger: {
                  trigger: gains[0].parentElement,
                  start: "top 95%",
                  end: "top 45%",
                  scrub: 0.6,
                },
              });
            }
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
            Plano de <span className="w-grad-text">4 semanas</span>
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
        {/* What changes when you train with a player (was its own section).
            Phones: stacked. */}
        <ul className="w-weeks__gains">
          {reasons.map((reason, index) => {
            const Icon = reasonIcons[index] ?? CheckIcon;
            return (
              <BorderGlow
                as="li"
                className="w-glass w-grow w-weeks__gain"
                colors={GLOW_COLORS}
                glowColor={GLOW_DARK}
                key={reason.title}
              >
                <span aria-hidden="true" className="w-weeks__gain-icon">
                  <Icon />
                </span>
                <h3>{reason.title}</h3>
                <p>{reason.body}</p>
              </BorderGlow>
            );
          })}
        </ul>
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
            Do Intermediário ao <span className="w-grad-text">Elite</span>
          </h2>
          <p className="w-lead">
            Me conta sua divisão no WhatsApp que eu te indico o plano certo e passo o valor na hora.
          </p>
        </div>
        <div className="w-plans__viewport">
          <ul className="w-plans__grid">
            {plans.map((plan) => (
              <BorderGlow
                as="li"
                className={`w-plan w-grow w-rise${plan.featured ? " w-plan--featured" : ""}`}
                colors={GLOW_COLORS}
                glowColor={plan.featured ? GLOW_DARK : GLOW_LIGHT}
                key={plan.name}
                light={!plan.featured}
              >
                {/* TODO CONFIRMAR: "Mais escolhido" precisa ser verdade (o Premium é mesmo o
                    plano que mais vende?). Se não for, trocar por "O plano de 4 semanas". */}
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
              </BorderGlow>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  // Questions come in one after another as they reach the screen.
  useCardsReveal(sectionRef, ".w-faq__item");
  return (
    <section
      aria-labelledby="duvidas-title"
      className="w-faq w-section"
      id="duvidas"
      ref={sectionRef}
    >
      <div className="w-wrap w-faq__grid">
        <div className="w-faq__head">
          <h2 className="w-h2" id="duvidas-title">
            Antes da <span className="w-grad-text">primeira call</span>
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
          Sua próxima <span className="w-grad-text">Weekend League</span> pode ser diferente.
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
          <span className="w-sr">WGT eSports</span>
        </div>
        <ul className="w-footer__links">
          <li>
            <a href="https://www.instagram.com/welingtonrodrigues04/" {...external}>
              Instagram
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

/** The big CTA buttons in the page; the float steps aside while one passes under it. */
const FLOAT_AVOID = "main .w-pill, main .w-plan__cta";

/**
 * Bottom right on every screen size, fading in after mount. It only hides
 * while one of the page's big CTA buttons is under it, so it never covers
 * a button's label or arrow.
 */
function FloatingWhatsApp() {
  const [mounted, setMounted] = useState(false);
  const [covering, setCovering] = useState(false);
  const floatRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const float = floatRef.current;
    if (!float) {
      return;
    }
    let frame = 0;
    const check = () => {
      frame = 0;
      const zone = float.getBoundingClientRect();
      const pad = 8;
      let hit = false;
      for (const el of document.querySelectorAll(FLOAT_AVOID)) {
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
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  const shown = mounted && !covering;

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
const STICKY_AVOID = "#topo, #agendar, [data-cta], .w-videos__viewport, .w-footer";

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
        <Results />
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
