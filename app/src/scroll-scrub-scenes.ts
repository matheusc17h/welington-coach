/**
 * Scene data for the scroll-scrub journey.
 *
 * Single-shot film (one continuous DualSense turn), cut at exact shared frames
 * into four chapter clips: the last frame of each clip is the first frame of
 * the next, so the scrub is seamless while each chapter keeps its own nav stop.
 * Every `poster` is the first frame of the encoded clip beside it.
 *
 * Keep this array a module constant.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#3fa9ff",
  background: "#06081a",
  ink: "#f5f7ff",
  muted: "#9aa3c7",
};

const world = "/assets/world";

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    align: "left",
    body: "No FC 27 os companheiros não dão mais bote por você. Quem defende é você.",
    clip: `${world}/scene-01.mp4`,
    id: "controle-01",
    kicker: "01 / 04",
    label: "Sua mão",
    mobileClip: `${world}/scene-01-mobile.mp4`,
    mobilePoster: `${world}/scene-01-mobile-poster.webp`,
    poster: `${world}/scene-01-poster.webp`,
    scroll: 1.5,
    tags: ["FC 27", "Fim do bote automático"],
    title: "A IA saiu do controle. Agora é a sua mão.",
  },
  {
    align: "right",
    body: "Troca manual antes do passe chegar, jockey e bote em pé no tempo certo.",
    clip: `${world}/scene-02.mp4`,
    id: "controle-02",
    kicker: "02 / 04",
    label: "Defesa",
    mobileClip: `${world}/scene-02-mobile.mp4`,
    mobilePoster: `${world}/scene-02-mobile-poster.webp`,
    poster: `${world}/scene-02-poster.webp`,
    scroll: 1.4,
    title: "Defesa na mão",
  },
  {
    align: "left",
    body: "A enfiada vai exatamente onde você mira. Timing virou tudo.",
    clip: `${world}/scene-03.mp4`,
    id: "controle-03",
    kicker: "03 / 04",
    label: "Passe",
    mobileClip: `${world}/scene-03-mobile.mp4`,
    mobilePoster: `${world}/scene-03-mobile-poster.webp`,
    poster: `${world}/scene-03-poster.webp`,
    scroll: 1.4,
    title: "Passe mirado, corrida no tempo",
  },
  {
    align: "right",
    body: "Ganha quem continua pensando quando o placar aperta.",
    clip: `${world}/scene-04.mp4`,
    id: "controle-04",
    kicker: "04 / 04",
    label: "Cabeça",
    mobileClip: `${world}/scene-04-mobile.mp4`,
    mobilePoster: `${world}/scene-04-mobile-poster.webp`,
    poster: `${world}/scene-04-poster.webp`,
    scroll: 1.5,
    title: "Cabeça no lugar",
  },
];
