"use client";

import Image from "next/image";

import type { EducationLibraryItem } from "@/src/types";
import { useLocale } from "@/src/i18n/LocaleContext";

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
  const { text } = useLocale();
  const resource = item.resource;
  const evidenceImage = item.evidenceImage;

  return (
    <ModalShell
      title={item.title}
      eyebrow={text("Archivo académico · Documento abierto", "Academic archive · Open document")}
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
            <p className="eyebrow">
              {text("Archivo académico", "Academic record")}
            </p>
            <h3>{item.title}</h3>
            <p className="open-book__summary">{item.summary}</p>
            <span className="open-book__status">{item.statusLabel}</span>
          </section>

          <section className="open-book__page open-book__page--right">
            <div className="open-book__running-head">
              {text("JORGE COLAMARCO · ARCHIVO", "JORGE COLAMARCO · ARCHIVE")}
            </div>
            <div
              className={`certificate-preview${evidenceImage ? ` certificate-preview--${evidenceImage.presentation}` : ""}`}
              aria-label={
                evidenceImage?.presentation === "badge"
                  ? text("Vista de la insignia", "Badge preview")
                  : text("Vista del documento", "Document preview")
              }
            >
              <span className="certificate-preview__ornament" aria-hidden="true" />
              {evidenceImage ? (
                <Image
                  className={`certificate-preview__evidence certificate-preview__evidence--${evidenceImage.presentation}`}
                  src={evidenceImage.src}
                  alt={evidenceImage.alt}
                  width={evidenceImage.width}
                  height={evidenceImage.height}
                  sizes="(max-width: 760px) 82vw, 38vw"
                  unoptimized
                  priority
                />
              ) : (
                <>
                  <span className="certificate-preview__label">
                    {item.kind === "language-certificate"
                      ? text("Resultado de inglés", "English result")
                      : item.kind === "cloud-certificate"
                        ? text("Credencial AWS", "AWS credential")
                        : item.kind === "university-project"
                          ? text("Proyecto universitario", "University project")
                          : text("Expediente UEES", "UEES record")}
                  </span>
                  <strong>{item.title}</strong>
                  <ul>
                    {item.metadata.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {item.status === "document-pending" ||
                  item.status === "details-pending" ? (
                    <small>
                      {text(
                        "Se publicará únicamente cuando exista evidencia verificable.",
                        "This will only be published when verifiable evidence is available.",
                      )}
                    </small>
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
                {text("Cerrar documento", "Close document")}
              </button>
            </div>
          </section>
        </div>
      </article>
    </ModalShell>
  );
}
