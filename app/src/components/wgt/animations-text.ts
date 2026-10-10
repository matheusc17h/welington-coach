import { useEffect } from "react";

// Títulos de seção (o filme "jogando como pro" anima a própria copy).
const TITLES = "main :is(.w-h2, .w-final__title)";
// Palavra de destaque do hero.
const SCRAMBLE = "main .w-hero .scramble";

// Esconde até animar; só o JS coloca essa classe, então sem JS tudo aparece.
const PENDING = "w-letters-pending";

/**
 * Animações de texto (GSAP):
 * - títulos de seção sobem linha por linha por trás de uma máscara (SplitText),
 *   uma vez, quando entram na tela;
 * - a palavra de destaque do hero se monta com ScrambleText quando a
 *   página carrega.
 * Os contadores ficam em counter.tsx. Com reduced motion nada anima.
 */
export function useTextAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const titles = [...document.querySelectorAll<HTMLElement>(TITLES)];
    for (const el of titles) {
      el.classList.add(PENDING);
    }
    let cleanup = () => {
      for (const el of titles) {
        el.classList.remove(PENDING);
      }
    };
    let cancelled = false;

    // Só divide as linhas depois que a fonte carregou.
    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("gsap/ScrambleTextPlugin"),
      document.fonts.ready,
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }, { ScrambleTextPlugin }]) => {
      if (cancelled) {
        return;
      }
      gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

      // 1. Títulos: reveal por linha com máscara, sem scrub.
      const splits = titles.map((el) => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          // Masks get "w-line-mask": padded in wgt.css so accents on
          // capitals (Ó, Á, Ã, Ê) and descenders aren't clipped.
          linesClass: "w-line",
          autoSplit: true,
          // Roda de novo se a largura mudar; a animação retornada mantém o progresso.
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 130,
              duration: 0.7,
              ease: "power4.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
        el.classList.remove(PENDING);
        return split;
      });

      // 2. Hero: scramble na palavra de destaque, com largura travada.
      const word = document.querySelector<HTMLElement>(SCRAMBLE);
      let scramble: gsap.core.Tween | null = null;
      const playHero = () => {
        if (!word) {
          return;
        }
        const text = word.textContent ?? "";
        const width = word.getBoundingClientRect().width;
        gsap.set(word, { display: "inline-block", width, minWidth: width, whiteSpace: "nowrap" });
        scramble = gsap.to(word, {
          duration: 1.4,
          delay: 0.3,
          scrambleText: { text, chars: "X0#█▓", speed: 0.4 },
          // Solta a largura no fim pra acompanhar resize.
          onComplete: () => {
            gsap.set(word, { clearProps: "display,width,minWidth,whiteSpace" });
          },
        });
      };
      playHero();

      cleanup = () => {
        if (scramble && word) {
          scramble.progress(1).kill();
          gsap.set(word, { clearProps: "display,width,minWidth,whiteSpace" });
        }
        for (const split of splits) {
          split.revert();
        }
        for (const el of titles) {
          el.classList.remove(PENDING);
        }
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
}
