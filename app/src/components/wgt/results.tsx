import { useEffect, useRef, useState } from "react";

import { chatPrints, prints, studentVideos, whatsapp } from "./content";
import { ChevronIcon, CrossIcon, PlayIcon } from "./icons";
import { PillCta } from "./pill";

/**
 * Students' chats inside phone frames, scrolling sideways without end (CSS:
 * the row is doubled and slides half its width). Hover pauses it; with
 * reduced motion it becomes a plain swipe row.
 */
function ChatPhones() {
  const row = [...chatPrints, ...chatPrints];
  return (
    <div className="w-phones">
      <h3 className="w-h3">Direto do WhatsApp dos alunos</h3>
      <div className="w-phones__viewport">
        <ul aria-label="Conversas de alunos" className="w-phones__track">
          {row.map((print, index) => {
            const copy = index >= chatPrints.length;
            return (
              <li aria-hidden={copy || undefined} className="w-phone" key={`${print.id}-${index}`}>
                <span aria-hidden="true" className="w-phone__island" />
                <img
                  alt={copy ? "" : print.alt}
                  className={print.fill ? "w-phone__shot w-phone__shot--fill" : "w-phone__shot"}
                  decoding="async"
                  loading="lazy"
                  src={print.src}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * Game prints as tilted polaroids in an endless row moving right, the
 * opposite way to the phones above. Six prints are too few to cover a wide
 * screen, so one loop is the set twice; the loop is then doubled for the
 * seamless slide. Only the first set is read out.
 */
function Prints() {
  const row = [...prints, ...prints, ...prints, ...prints];
  return (
    <div className="w-prints">
      <h3 className="w-h3">Prints que chegam no grupo</h3>
      <div className="w-prints__viewport">
        <ul aria-label="Prints de resultado" className="w-prints__track">
          {row.map((print, index) => {
            const copy = index >= prints.length;
            return (
              <li aria-hidden={copy || undefined} className="w-print" key={`${print.src}-${index}`}>
                <figure>
                  <img
                    alt={copy ? "" : print.alt}
                    decoding="async"
                    height={600}
                    loading="lazy"
                    src={print.src}
                    width={900}
                  />
                  <figcaption>{print.label}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Videos() {
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
        <h3 className="w-h3">Alunos mostrando a evolução</h3>
        <p className="w-videos__hint">Toque para assistir. Começa sem som.</p>
      </div>
      {/* Endless row moving left, like the phones (CSS). One loop is the set
          twice so it covers wide screens; the copies stay clickable but are
          hidden from screen readers and the tab order. */}
      <div className="w-videos__viewport">
        <ul className="w-videos__track">
          {[0, 1, 2, 3].flatMap((round) =>
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
                      height={640}
                      loading="lazy"
                      src={video.poster}
                      width={360}
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

export function Results() {
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
        <ChatPhones />
        <Prints />
        <Videos />
        <div className="w-results__cta">
          <p>O próximo print no grupo pode ser o seu.</p>
          <PillCta href={whatsapp.geral}>Quero ser o próximo a subir</PillCta>
        </div>
      </div>
    </section>
  );
}
