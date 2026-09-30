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
  PlusIcon,
  WhatsAppIcon,
} from "./icons";
import { external, PillCta } from "./pill";
import { ProFilm } from "./pro-film";
import { Results } from "./results";

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
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const target of targets) {
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="w-header"
      data-hidden={hidden || undefined}
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
              <a
                aria-current={active === link.href ? "location" : undefined}
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="w-header__cta" href={whatsapp.geral} {...external}>
          <WhatsAppIcon className="w-header__cta-icon" />
          Agendar aula
        </a>
      </nav>
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
            Aulas individuais com análise do seu gameplay. Você para de perder
            no automático e começa a jogar com método.
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
            Coach de EA SPORTS FC e jogador competitivo, com perfil verificado
            pela EA e mais de 3.500 alunos. Ele joga o mesmo modo que você, sob
            a mesma pressão, e ensina o que decide partida dentro de campo.
          </p>
          <dl className="w-about__stats">
            <div>
              <dd>26,1<small>mil</small></dd>
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
        const cards = section.querySelectorAll(".w-stuck__card");
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
          .from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.12 })
          .from(lead, { autoAlpha: 0, y: 28, duration: 0.9, ease: "power3.out" }, "-=0.6")
          .from(
            cards,
            {
              autoAlpha: 0,
              y: "+=64",
              scale: 0.95,
              duration: 1,
              stagger: 0.16,
              clearProps: "opacity,visibility,scale",
            },
            "-=0.45"
          );

        return () => split.revert();
      });
      cleanup = () => mm.revert();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef]);
}

function Stuck() {
  const sectionRef = useRef<HTMLElement>(null);
  useStuckReveal(sectionRef);

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
              Seis sinais que aparecem em quase toda call de diagnóstico. Conta
              quantos são seus.
            </p>
          </div>
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
        <div className="w-stuck__close">
          <p>
            Se você se reconheceu em três ou mais, falta{" "}
            <span className="w-grad-text">método</span> — não talento.
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

function Weeks() {
  return (
    <section aria-labelledby="metodo-title" className="w-weeks w-section" id="metodo">
      <div className="w-wrap">
        <div className="w-weeks__head">
          <h2 className="w-h2" id="metodo-title">
            Plano de <span className="w-grad-text">4 semanas</span>
          </h2>
          <p className="w-lead">
            O que você vai receber, na ordem certa. Um fundamento por semana,
            do bote no tempo à rotina de Weekend League.
          </p>
        </div>
        <ol className="w-weeks__line">
          {weeks.map((item, index) => (
            <li className="w-weeks__step w-rise" key={item.week}>
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
            Treino em cima das suas partidas, com uma meta que dá para medir:
            subir de divisão.
          </p>
        </div>
        {reasons.map((reason, index) => (
          <article
            className={`w-glass w-reasons__card w-rise${index === 0 ? " w-reasons__card--wide" : ""}`}
            key={reason.title}
          >
            <span aria-hidden="true" className="w-reasons__check">
              <CheckIcon />
            </span>
            <h3>{reason.title}</h3>
            <p>{reason.body}</p>
          </article>
        ))}
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
            Aula é treino, não atalho. Se você se encaixa em algum desses, é
            melhor não gastar seu tempo nem o meu.
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
  return (
    <section aria-labelledby="planos-title" className="w-plans w-section" id="planos">
      <div aria-hidden="true" className="w-aurora w-aurora--mid" />
      <p aria-hidden="true" className="w-bleed w-bleed--plans">
        Elite
      </p>
      <div className="w-wrap">
        <div className="w-plans__head">
          <h2 className="w-h2" id="planos-title">
            Escolha seu <span className="w-grad-text">plano</span>
          </h2>
          <p className="w-lead">
            Valor a gente fala no WhatsApp, junto com a indicação do plano que
            faz sentido para o seu momento.
          </p>
        </div>
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
                <span>Consultar valores no WhatsApp</span>
              </a>
            </li>
          ))}
        </ul>
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
          Chama no WhatsApp e agenda sua{" "}
          <span className="w-grad-text">primeira aula</span>
        </h2>
        <p className="w-lead">
          Manda a mensagem, conta em que divisão você está e marca sua primeira
          análise de gameplay.
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
          EA SPORTS FC é marca registrada da Electronic Arts. Este site não tem
          vínculo com a EA.
        </p>
      </div>
    </footer>
  );
}

/** Only shows once the hero (which has its own CTAs) is off screen. */
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

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

  return (
    <a
      aria-hidden={visible ? undefined : true}
      aria-label="Chamar o Welington no WhatsApp"
      className="w-float"
      data-visible={visible || undefined}
      href={whatsapp.geral}
      tabIndex={visible ? undefined : -1}
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
      <a className="w-skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <About />
        <Stuck />
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
      <div aria-hidden="true" className="w-grain" />
    </div>
  );
}
