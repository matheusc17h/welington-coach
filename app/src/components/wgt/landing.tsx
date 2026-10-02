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
import { external, PillCta } from "./pill";
import { Preloader } from "./preloader";
import { ProFilm } from "./pro-film";
import { Results } from "./results";
import { Modules } from "./modules";
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
            <small>Coach EA FC · WGT</small>
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
          Agendar aula
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
                {chip}
              </li>
            ))}
          </ul>
          <h1 className="w-hero__title" id="hero-title">
            <span className="w-line">
              <span className="w-line__in" style={{ "--i": 0 } as CSSProperties}>
                Hora de subir sua
              </span>
            </span>
            <span className="w-line">
              <span className="w-line__in w-grad-text" style={{ "--i": 1 } as CSSProperties}>
                jogabilidade
              </span>
            </span>
            <span className="w-line">
              <span className="w-line__in" style={{ "--i": 2 } as CSSProperties}>
                para outro <span className="w-outline">patamar</span>
              </span>
            </span>
          </h1>
          <p className="w-hero__lead w-in w-in--late">
            Aulas individuais com análise do seu gameplay. Você para de perder no automático e
            começa a jogar com método.
          </p>
          <div className="w-hero__ctas w-in w-in--cta">
            <PillCta href={whatsapp.geral} size="lg">
              Quero minha primeira aula
            </PillCta>
            <a className="w-hero__secondary" href="#resultados">
              Ver resultados dos alunos
            </a>
          </div>
        </div>

        <div className="w-hero__visual">
          <div aria-hidden="true" className="w-hero__halo" />
          <div aria-hidden="true" className="w-hero__ring" />
          <img
            alt="Welington Rodrigues, coach de EA SPORTS FC, de headset e controle na mão"
            className="w-hero__photo"
            decoding="async"
            fetchPriority="high"
            height={1000}
            sizes="(max-width: 860px) 88vw, 44vw"
            src="/assets/brand/welington.webp"
            srcSet="/assets/brand/welington-480.webp 480w, /assets/brand/welington.webp 800w"
            width={800}
          />
          <Shield className="w-hero__shield" eager />
          <p className="w-hero__badge">
            <strong>+3.500</strong>
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
  return (
    <section aria-labelledby="quem-title" className="w-about w-section" id="quem">
      <p aria-hidden="true" className="w-bleed w-bleed--about">
        Welington
      </p>
      <div className="w-wrap w-about__grid">
        <div className="w-about__intro w-rise">
          <h2 className="w-h2" id="quem-title">
            Quem é o <span className="w-grad-text">Welington</span>
          </h2>
          <p className="w-lead">
            Coach de EA SPORTS FC e jogador competitivo, com perfil verificado pela EA e mais de
            3.500 alunos. Ele joga o mesmo modo que você, sob a mesma pressão, e ensina o que decide
            partida dentro de campo.
          </p>
          <dl className="w-about__stats">
            <div>
              <dd>
                26,1<small>mil</small>
              </dd>
              <dt>seguidores no Instagram</dt>
            </div>
            <div>
              <dd>+3.500</dd>
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
              height={1000}
              loading="lazy"
              sizes="(max-width: 860px) 70vw, 30vw"
              src="/assets/brand/welington.webp"
              srcSet="/assets/brand/welington-480.webp 480w, /assets/brand/welington.webp 800w"
              width={800}
            />
          </figure>
          <article className="w-about__card w-about__card--mission w-rise">
            <p className="w-about__tag">Missão</p>
            <h3>Tirar você do automático.</h3>
          </article>
          <article className="w-about__card w-about__card--method w-rise">
            <p className="w-about__tag">Método</p>
            <h3>Defesa na mão, passe mirado, cabeça no lugar.</h3>
          </article>
        </div>
      </div>
    </section>
  );
}

/**
 * Title rises line by line out of a mask, then the lead, then the six cards
 * one at a time. Text is server-rendered and only hidden once GSAP runs, so
 * without JS or with reduced motion everything is simply visible.
 */
function useStuckReveal(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;

    // Lines must be measured with the display font loaded, or they break wrong.
    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      document.fonts.ready,
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      if (cancelled) {
        return;
      }
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = section.querySelector<HTMLElement>(".w-stuck__head .w-h2");
        const lead = section.querySelector(".w-stuck__head .w-lead");
        if (!title) {
          return;
        }
        const split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          linesClass: "w-split-line",
        });

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
            // Restore the plain heading so later resizes re-wrap naturally.
            onComplete: () => split.revert(),
          })
          // Starts below the mask's padded bottom edge, accents included.
          .from(split.lines, { yPercent: 135, duration: 1.1, stagger: 0.12 })
          .from(lead, { autoAlpha: 0, y: 28, duration: 0.9, ease: "power3.out" }, "-=0.6");

        return () => split.revert();
      });
      // Desktop keeps the two-column grid beside the sticky heading; each
      // card rises into place tied to the page scroll (mobile uses the
      // horizontal rail instead). Transform/opacity only, so it stays light.
      mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
        for (const card of section.querySelectorAll(".w-stuck__card")) {
          gsap.from(card, {
            autoAlpha: 0,
            yPercent: 35,
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 96%", end: "top 62%", scrub: 0.5 },
          });
        }
      });
      cleanup = () => mm.revert();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef]);
}

/**
 * Scroll-driven horizontal rail: the `pin` block holds on screen while the
 * page scroll slides `track` sideways, one card after another; once the last
 * card is in, the page scrolls on normally. `section` gets `is-scrub` while it
 * runs (CSS switches the rail to a single row). Without JS, with reduced
 * motion or outside `media`, the normal swipe/grid layout stays.
 */
function useHorizontalScrub(
  sectionRef: RefObject<HTMLElement | null>,
  {
    media,
    pin,
    track,
    items,
    priority,
  }: {
    media: string;
    pin: string;
    track: string;
    items?: string;
    /** Higher refreshes first. Upper pins must go first, because their added
        scroll distance moves every trigger below them. */
    priority: number;
  },
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger"), document.fonts.ready]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) {
          return;
        }
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add(`${media} and (prefers-reduced-motion: no-preference)`, () => {
          const pinEl = section.querySelector<HTMLElement>(pin);
          const rail = section.querySelector<HTMLElement>(track);
          const viewport = rail?.parentElement;
          if (!pinEl || !rail || !viewport) {
            return;
          }
          section.classList.add("is-scrub");
          const distance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);

          const slide = gsap.to(rail, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pinEl,
              pin: pinEl,
              // Centre the block when it fits, otherwise hold it under the header.
              start: () =>
                pinEl.offsetHeight < window.innerHeight - 96 ? "center center" : "top 80px",
              end: () => `+=${distance()}`,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: priority,
            },
          });

          // Light up each card while it crosses the middle of the rail.
          if (items) {
            for (const item of section.querySelectorAll(items)) {
              ScrollTrigger.create({
                trigger: item,
                containerAnimation: slide,
                start: "left 72%",
                end: "right 28%",
                toggleClass: "is-active",
              });
            }
          }

          return () => section.classList.remove("is-scrub");
        });
        // The rails set up asynchronously and in any order: re-measure every
        // trigger (by priority) once this one exists.
        const frame = requestAnimationFrame(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
        // Fonts are awaited above; late images can still move the pins.
        const onLoad = () => ScrollTrigger.refresh();
        if (document.readyState !== "complete") {
          window.addEventListener("load", onLoad, { once: true });
        }
        cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("load", onLoad);
          mm.revert();
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef, media, pin, track, items, priority]);
}

function Stuck() {
  const sectionRef = useRef<HTMLElement>(null);
  useStuckReveal(sectionRef);
  useHorizontalScrub(sectionRef, {
    media: "(max-width: 860px)",
    pin: ".w-stuck__grid",
    track: ".w-stuck__list",
    items: ".w-stuck__card",
    priority: 2,
  });

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
              Onde você está <span className="w-grad-text">travando</span>
            </h2>
            <p className="w-lead">
              Seis sinais que aparecem em quase toda call de diagnóstico. Conta quantos são seus.
            </p>
          </div>
          <div className="w-stuck__viewport">
            <ol className="w-stuck__list">
              {stuckPoints.map((point, index) => (
                <li className="w-glass w-stuck__card" key={point.title}>
                  <span aria-hidden="true" className="w-stuck__num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="w-stuck__close">
          <p>
            Se você se reconheceu em três ou mais, falta <span className="w-grad-text">método</span>{" "}
            — não talento.
          </p>
          <PillCta href={whatsapp.geral}>Quero corrigir isso</PillCta>
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
            Plano de <span className="w-grad-text">4 semanas</span>
          </h2>
          <p className="w-lead">
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
      </div>
    </section>
  );
}

function Reasons() {
  return (
    <section aria-labelledby="porque-title" className="w-reasons w-section" id="porque">
      <div aria-hidden="true" className="w-aurora w-aurora--side" />
      <div className="w-wrap w-reasons__grid">
        <div className="w-reasons__head">
          <h2 className="w-h2" id="porque-title">
            Por que treinar com o <span className="w-grad-text">Welington</span>
          </h2>
          <p className="w-lead">
            Treino em cima das suas partidas, com uma meta que dá para medir: subir de divisão.
          </p>
        </div>
        {reasons.map((reason, index) => {
          const Icon = reasonIcons[index] ?? CheckIcon;
          return (
            <article
              className={`w-glass w-reasons__card w-rise${index === 0 ? " w-reasons__card--wide" : ""}`}
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
            Para quem <span className="w-outline w-outline--magenta">não</span> é
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
              <span className="w-notfor__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Plans() {
  const sectionRef = useRef<HTMLElement>(null);
  // Desktop shows the three plans side by side; the rail only exists below 861px.
  // The heading is pinned with the rail, so the cards never slide over it.
  // Short screens can't fit both: they keep the plain swipe rail.
  useHorizontalScrub(sectionRef, {
    media: "(max-width: 860px) and (min-height: 760px)",
    pin: ".w-plans__stage",
    track: ".w-plans__grid",
    priority: 1,
  });

  return (
    <section
      aria-labelledby="planos-title"
      className="w-plans w-section"
      id="planos"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="w-aurora w-aurora--mid" />
      <p aria-hidden="true" className="w-bleed w-bleed--plans">
        Elite
      </p>
      <div className="w-wrap w-plans__stage">
        <div className="w-plans__head">
          <h2 className="w-h2" id="planos-title">
            Escolha seu <span className="w-grad-text">plano</span>
          </h2>
          <p className="w-lead">
            Valor a gente fala no WhatsApp, junto com a indicação do plano que faz sentido para o
            seu momento.
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
                <a
                  aria-label={`Consultar valores do plano ${plan.name} no WhatsApp`}
                  className="w-plan__cta"
                  href={plan.href}
                  {...external}
                >
                  <WhatsAppIcon />
                  <span>
                    Consultar valores<span className="w-plan__cta-more"> no WhatsApp</span>
                  </span>
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
            Perguntas <span className="w-grad-text">frequentes</span>
          </h2>
          <p className="w-lead">Não achou a sua? Manda no WhatsApp.</p>
          <a className="w-faq__link" href={whatsapp.geral} {...external}>
            Tirar dúvida no WhatsApp
            <ArrowIcon />
          </a>
        </div>
        <div className="w-faq__list">
          {faqs.map((faq, index) => (
            <details className="w-faq__item" key={faq.q} name="faq" open={index === 0}>
              <summary>
                <span className="w-faq__n" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="w-faq__q">{faq.q}</span>
                <span aria-hidden="true" className="w-faq__icon">
                  <PlusIcon />
                </span>
              </summary>
              <div className="w-faq__answer">
                <p>{faq.a}</p>
                {faq.cta ? (
                  <a className="w-faq__inline" href={whatsapp.geral} {...external}>
                    Agendar aula
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
          Chama no WhatsApp e agenda sua <span className="w-grad-text">primeira aula</span>
        </h2>
        <p className="w-lead">
          Manda a mensagem, conta em que divisão você está e marca sua primeira análise de gameplay.
        </p>
        <PillCta href={whatsapp.geral} size="lg">
          Agendar minha primeira aula
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
      <span className="w-float__label">Agendar aula</span>
    </a>
  );
}

/** Glass cards: a soft light follows the pointer (CSS vars, no React state). */
function trackGlow(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }
  const card = (event.target as HTMLElement).closest<HTMLElement>(".w-glass");
  if (!card) {
    return;
  }
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function Landing() {
  return (
    <div className="wgt" lang="pt-BR" onPointerMove={trackGlow}>
      <Preloader />
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
        <Modules />
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
      <div aria-hidden="true" className="w-grain" />
    </div>
  );
}
