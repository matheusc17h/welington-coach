import { useEffect, useRef, useState } from "react";

import { CAROUSEL_QUERY, CarouselDots, useMedia } from "./carousel";
import { chatPrints, prints, studentVideos, whatsapp } from "./content";
import { ChevronIcon, CrossIcon, PlayIcon } from "./icons";
import { PillCta } from "./pill";

/**
 * Students' chats inside phone frames, scrolling sideways without end (CSS:
 * the row is doubled and slides half its width). Hover pauses it; with
 * reduced motion it becomes a plain swipe row. On phones (`carousel`) it is
 * one set in a swipe carousel, under the tabs.
 */
function ChatPhones({ carousel }: { carousel: boolean }) {
  const row = carousel ? chatPrints : [...chatPrints, ...chatPrints];
  const trackRef = useRef<HTMLUListElement>(null);
  return (
    <div className="w-phones">
      {carousel ? null : <h3 className="w-h3">Direto do WhatsApp dos alunos</h3>}
      <div className={carousel ? "w-phones__viewport is-carousel" : "w-phones__viewport"}>
        <ul
          aria-label="Conversas de alunos"
          className={carousel ? "w-phones__track w-carousel" : "w-phones__track"}
          ref={trackRef}
        >
          {row.map((print, index) => {
            const copy = index >= chatPrints.length;
            return (
              <li aria-hidden={copy || undefined} className="w-phone" key={`${print.id}-${index}`}>
                <span aria-hidden="true" className="w-phone__island" />
                <img
                  alt={copy ? "" : print.alt}
                  className={print.fill ? "w-phone__shot w-phone__shot--fill" : "w-phone__shot"}
                  decoding="async"
                  height={print.height}
                  loading="lazy"
                  src={print.src}
                  width={print.width}
                />
              </li>
            );
          })}
        </ul>
      </div>
      {carousel ? <CarouselDots count={row.length} label="Conversas" track={trackRef} /> : null}
    </div>
  );
}

/**
 * Game prints as tilted polaroids in an endless row moving right, the
 * opposite way to the phones above. Six prints are too few to cover a wide
 * screen, so one loop is the set twice; the loop is then doubled for the
 * seamless slide. Only the first set is read out.
 */
function Prints({ carousel }: { carousel: boolean }) {
  const row = carousel ? prints : [...prints, ...prints, ...prints, ...prints];
  const trackRef = useRef<HTMLUListElement>(null);
  return (
    <div className="w-prints">
      {carousel ? null : <h3 className="w-h3">Prints que chegam no grupo</h3>}
      <div className={carousel ? "w-prints__viewport is-carousel" : "w-prints__viewport"}>
        <ul
          aria-label="Prints de resultado"
          className={carousel ? "w-prints__track w-carousel" : "w-prints__track"}
          ref={trackRef}
        >
          {row.map((print, index) => {
            const copy = index >= prints.length;
            return (
              <li aria-hidden={copy || undefined} className="w-print" key={`${print.src}-${index}`}>
                <figure>
                  <img
                    alt={copy ? "" : print.alt}
                    decoding="async"
                    height={print.height}
                    loading="lazy"
                    src={print.src}
                    width={print.width}
                  />
                  <figcaption>{print.label}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
      {carousel ? <CarouselDots count={row.length} label="Prints" track={trackRef} /> : null}
    </div>
  );
}

function Videos({ carousel }: { carousel: boolean }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) {
      return;
    }
    if (current === null) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (dialog.open) {
        dialog.close();
      }
      return;
    }
    video.src = studentVideos[current].src;
    video.muted = true;
    if (!dialog.open) {
      dialog.showModal();
    }
    void video.play().catch(() => undefined);
  }, [current]);

  const step = (direction: 1 | -1) =>
    setCurrent((value) =>
      value === null ? value : (value + direction + studentVideos.length) % studentVideos.length,
    );

  return (
    <div className="w-videos">
      <div className="w-quotes__bar">
        {carousel ? null : <h3 className="w-h3">Alunos mostrando a evolução</h3>}
        <p className="w-videos__hint">Toque para assistir. Começa sem som.</p>
      </div>
      {/* Endless row moving left, like the phones (CSS). One loop is the set
          twice so it covers wide screens; the copies stay clickable but are
          hidden from screen readers and the tab order. */}
      <div className={carousel ? "w-videos__viewport is-carousel" : "w-videos__viewport"}>
        <ul
          className={carousel ? "w-videos__track w-carousel" : "w-videos__track"}
          ref={trackRef}
        >
          {(carousel ? [0] : [0, 1, 2, 3]).flatMap((round) =>
            studentVideos.map((video, index) => {
              const copy = round > 0;
              return (
                <li aria-hidden={copy || undefined} key={`${video.id}-${round}`}>
                  <button
                    aria-label={`Assistir vídeo ${index + 1} de ${studentVideos.length} de aluno`}
                    className="w-video"
                    onClick={() => setCurrent(index)}
                    tabIndex={copy ? -1 : undefined}
                    type="button"
                  >
                    <img
                      alt=""
                      decoding="async"
                      height={video.posterHeight}
                      loading="lazy"
                      src={video.poster}
                      width={video.posterWidth}
                    />
                    <span aria-hidden="true" className="w-video__play">
                      <PlayIcon />
                    </span>
                  </button>
                </li>
              );
            }),
          )}
        </ul>
      </div>
      {carousel ? (
        <CarouselDots count={studentVideos.length} label="Vídeos" track={trackRef} />
      ) : null}

      <dialog
        aria-label="Vídeo de aluno"
        className="w-lightbox"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setCurrent(null);
          }
        }}
        onClose={() => setCurrent(null)}
        ref={dialogRef}
      >
        <div className="w-lightbox__frame">
          <video
            className="w-lightbox__video"
            controls
            muted
            playsInline
            preload="none"
            ref={videoRef}
          />
          <div className="w-lightbox__controls">
            <button
              aria-label="Vídeo anterior"
              className="w-round"
              onClick={() => step(-1)}
              type="button"
            >
              <ChevronIcon className="w-flip" />
            </button>
            <p className="w-lightbox__count">
              {current === null ? "" : `${current + 1} / ${studentVideos.length}`}
            </p>
            <button
              aria-label="Próximo vídeo"
              className="w-round"
              onClick={() => step(1)}
              type="button"
            >
              <ChevronIcon />
            </button>
            <button
              aria-label="Fechar vídeo"
              className="w-round w-round--close"
              onClick={() => setCurrent(null)}
              type="button"
            >
              <CrossIcon />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

const galleries = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "prints", label: "Prints" },
  { id: "videos", label: "Vídeos" },
] as const;

type Gallery = (typeof galleries)[number]["id"];

/**
 * Desktop: the three galleries stacked, as endless rows. Phones: tabs on top
 * and one gallery at a time, as a swipe carousel (WhatsApp first).
 */
export function Results() {
  const carousel = useMedia(CAROUSEL_QUERY);
  const [tab, setTab] = useState<Gallery>("whatsapp");
  const show = (id: Gallery) => !carousel || tab === id;
  const panel = (id: Gallery) =>
    carousel
      ? { "aria-labelledby": `resultados-tab-${id}`, id: `resultados-${id}`, role: "tabpanel" }
      : {};

  return (
    <section aria-labelledby="resultados-title" className="w-results w-section" id="resultados">
      <div aria-hidden="true" className="w-aurora w-aurora--hero" />
      <div className="w-wrap">
        <div className="w-results__head">
          <h2 className="w-h2" id="resultados-title">
            {/* Word and comma stay on one line, also once the title is split. */}
            Resultado de{" "}
            <span className="w-nowrap">
              <span className="w-grad-text">aluno</span>,
            </span>{" "}
            não promessa
          </h2>
          <p className="w-lead">
            Mensagens reais do grupo e dos comentários. Divisão nova, Elite, top 200 e adversário
            quitando de raiva.
          </p>
        </div>
        {carousel ? (
          <div aria-label="Galerias de resultado" className="w-results__tabs" role="tablist">
            {galleries.map((gallery) => (
              <button
                aria-controls={`resultados-${gallery.id}`}
                aria-selected={tab === gallery.id}
                id={`resultados-tab-${gallery.id}`}
                key={gallery.id}
                onClick={() => setTab(gallery.id)}
                role="tab"
                type="button"
              >
                {gallery.label}
              </button>
            ))}
          </div>
        ) : null}
        {show("whatsapp") ? (
          <div {...panel("whatsapp")}>
            <ChatPhones carousel={carousel} />
          </div>
        ) : null}
        {show("prints") ? (
          <div {...panel("prints")}>
            <Prints carousel={carousel} />
          </div>
        ) : null}
        {show("videos") ? (
          <div {...panel("videos")}>
            <Videos carousel={carousel} />
          </div>
        ) : null}
        <div className="w-results__cta">
          <p>O próximo print no grupo pode ser o seu.</p>
          <PillCta href={whatsapp.geral}>Quero ser o próximo a subir</PillCta>
        </div>
      </div>
    </section>
  );
}
