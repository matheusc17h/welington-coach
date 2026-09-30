import { useEffect, useRef, useState } from "react";

import { whatsapp } from "./content";
import { PillCta } from "./pill";

const FILM = {
  desktop: "/assets/film/jogando-como-pro.mp4",
  mobile: "/assets/film/jogando-como-pro-mobile.mp4",
  poster: "/assets/film/jogando-como-pro-poster.webp",
  mobilePoster: "/assets/film/jogando-como-pro-mobile-poster.webp",
  finalPoster: "/assets/film/jogando-como-pro-final.webp",
};

/** Seconds before the end where the last take starts and the line appears. */
const FINAL_TAKE = 1.7;

function SoundOnIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </svg>
  );
}

/**
 * "Jogando como pro": a cut, cinematic loop (not a scrub). Loads only when the
 * section approaches, plays only while visible, starts muted. The closing line
 * shows on the last take; reduced motion gets the final still, no video fetch.
 */
export function ProFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) {
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      setReduced(true);
      section.classList.add("is-final");
      return;
    }

    let loaded = false;
    const load = () => {
      if (loaded) {
        return;
      }
      loaded = true;
      const small = window.matchMedia("(max-width: 860px)").matches;
      video.poster = small ? FILM.mobilePoster : FILM.poster;
      video.src = small ? FILM.mobile : FILM.desktop;
      video.load();
    };

    const onTime = () => {
      const { currentTime, duration } = video;
      const final = Number.isFinite(duration) && currentTime >= duration - FINAL_TAKE;
      section.classList.toggle("is-final", final);
    };
    video.addEventListener("timeupdate", onTime);

    const near = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load();
          near.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    near.observe(section);

    const visible = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            load();
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 },
    );
    visible.observe(section);

    return () => {
      near.disconnect();
      visible.disconnect();
      video.removeEventListener("timeupdate", onTime);
      video.pause();
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) {
      void video.play().catch(() => undefined);
    }
  };

  return (
    <section
      aria-labelledby="pro-title"
      className="w-pro is-final"
      id="jogando-como-pro"
      ref={sectionRef}
    >
      {reduced ? (
        <img
          alt=""
          className="w-pro__media"
          decoding="async"
          height={1080}
          loading="lazy"
          src={FILM.finalPoster}
          width={1920}
        />
      ) : (
        <video
          aria-label="Filme: um jogador profissional jogando com método"
          className="w-pro__media"
          loop
          muted
          playsInline
          preload="none"
          ref={videoRef}
        />
      )}
      <div aria-hidden="true" className="w-pro__shade" />

      <div className="w-pro__overlay">
        <h2 className="w-pro__title" id="pro-title">
          Isso é jogar com <span className="w-grad-text">método.</span>
        </h2>
        <PillCta href={whatsapp.geral} size="lg">
          Quero jogar assim
        </PillCta>
      </div>

      {reduced ? null : (
        <button
          aria-label={muted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
          aria-pressed={!muted}
          className="w-pro__sound"
          onClick={toggleSound}
          type="button"
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          <span>{muted ? "Ativar som" : "Som ligado"}</span>
        </button>
      )}
    </section>
  );
}
