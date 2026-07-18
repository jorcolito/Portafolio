"use client";

import Image from "next/image";

import type { EducationLibraryItem } from "@/src/types";

import { ModalShell } from "./ModalShell";

interface LibraryBookModalProps {
  item: EducationLibraryItem;
  onClose: () => void;
  onPlaceholder: (message: string) => void;
}

export function LibraryBookModal({
  item,
  onClose,
  onPlaceholder,
}: LibraryBookModalProps) {
  const resource = item.resource;
  const isCambridgeResult = item.id === "english-c1-volume";

  return (
    <ModalShell
      title={item.title}
      eyebrow="Biblioteca académica · Volumen abierto"
      variant="library"
      wide
      onClose={onClose}
    >
      <article className={`library-reveal library-reveal--${item.kind}`}>
        <div className="library-reveal__aura" aria-hidden="true" />
        <div className="open-book" data-book-status={item.status}>
          <section className="open-book__page open-book__page--left">
            <div className="open-book__running-head">{item.shelfLabel}</div>
            <div className="open-book__seal" aria-hidden="true">
              <span>JC</span>
            </div>
            <p className="eyebrow">Archivo académico</p>
            <h3>{item.title}</h3>
            <p className="open-book__summary">{item.summary}</p>
            <span className="open-book__status">{item.statusLabel}</span>
          </section>

          <section className="open-book__page open-book__page--right">
            <div className="open-book__running-head">JORGE LABS · ARCHIVE</div>
            <div
              className={`certificate-preview${isCambridgeResult ? " certificate-preview--document" : ""}`}
              aria-label="Vista del documento"
            >
              <span className="certificate-preview__ornament" aria-hidden="true" />
              {isCambridgeResult ? (
                <Image
                  className="certificate-preview__document"
                  src="/credentials/cambridge-c1-statement-of-results.png"
                  alt="Vista previa del Statement of Results de Cambridge C1 Advanced"
                  width={595}
                  height={842}
                  sizes="(max-width: 760px) 82vw, 38vw"
                  unoptimized
                  priority
                />
              ) : (
                <>
                  <span className="certificate-preview__label">
                    {item.kind === "language-certificate"
                      ? "Resultado de inglés"
                      : item.kind === "cloud-certificate"
                        ? "Credencial AWS"
                        : item.kind === "university-project"
                          ? "Proyecto universitario"
                          : "Expediente UEES"}
                  </span>
                  <strong>{item.title}</strong>
                  <ul>
                    {item.metadata.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {item.status === "document-pending" ||
                  item.status === "details-pending" ? (
                    <small>Se publicará únicamente cuando exista evidencia verificable.</small>
                  ) : null}
                </>
              )}
            </div>

            <div className="open-book__actions">
              {resource?.availability === "available" ? (
                <a
                  className="pixel-button pixel-button--primary"
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {resource.label}
                </a>
              ) : resource ? (
                <button
                  className="pixel-button"
                  type="button"
                  onClick={() => onPlaceholder(resource.placeholderMessage)}
                >
                  {resource.label}
                </button>
              ) : null}
              <button className="pixel-button" type="button" onClick={onClose}>
                Cerrar libro
              </button>
            </div>
          </section>
        </div>
      </article>
    </ModalShell>
  );
}
