"use client";

import Image from "next/image";

import { getLocalizedContent } from "@/src/data/localized";
import { useLocale } from "@/src/i18n/LocaleContext";
import type { AvailableResourceLink, ResourceLink } from "@/src/types";

import { ModalShell } from "./ModalShell";

interface ContactModalProps {
  onClose: () => void;
  onElevator: () => void;
  onNotice: (message: string) => void;
}

const CONTACT_KIND_LABELS: Record<
  ResourceLink["kind"],
  readonly [string, string]
> = {
  demo: ["Demo", "Demo"],
  repository: ["Repositorio", "Repository"],
  certificate: ["Certificado", "Certificate"],
  email: ["Email", "Email"],
  github: ["GitHub", "GitHub"],
  linkedin: ["LinkedIn", "LinkedIn"],
  cv: ["CV", "CV"],
};

function ContactAction({
  link,
}: {
  link: AvailableResourceLink;
}) {
  const { locale } = useLocale();
  const kindLabel = CONTACT_KIND_LABELS[link.kind][locale === "en" ? 1 : 0];
  const content = (
    <>
      <span className="contact-link__kind">{kindLabel}</span>
      <span className="contact-link__label">{link.label}</span>
      <span className="contact-link__arrow" aria-hidden="true">
        ↗
      </span>
    </>
  );

  return (
    <a
      className="contact-link"
      href={link.href}
      target={link.kind === "email" ? undefined : "_blank"}
      rel={link.kind === "email" ? undefined : "noreferrer"}
      aria-label={link.ariaLabel}
    >
      {content}
    </a>
  );
}

export function ContactModal({
  onClose,
  onElevator,
}: ContactModalProps) {
  const { locale, text } = useLocale();
  const { contactLinks, profile } = getLocalizedContent(locale);
  const emailLink = contactLinks.find((link) => link.kind === "email");

  return (
    <ModalShell
      title={text("Trabajemos juntos", "Let's work together")}
      eyebrow={text("Canal directo", "Direct channel")}
      variant="contact"
      wide
      onClose={onClose}
    >
      <div className="contact-experience">
        <section className="contact-profile" aria-labelledby="contact-heading">
          <div className="contact-profile__visual">
            <figure
              className="contact-portrait"
            >
              <span className="contact-portrait__glow" aria-hidden="true" />
              <Image
                className="contact-portrait__image"
                src="/portraits/jorge-professional-v1.webp"
                alt={text(
                  "Fotografía profesional de Jorge Colamarco",
                  "Professional portrait of Jorge Colamarco",
                )}
                fill
                sizes="(max-width: 760px) 42vw, 10rem"
                unoptimized
                priority
              />
              <figcaption>Jorge Colamarco</figcaption>
            </figure>
            <div className="contact-availability">
              <span className="contact-availability__signal" aria-hidden="true" />
              {text("Disponible para conversar", "Available to talk")}
            </div>
          </div>

          <div className="contact-profile__copy">
            <p className="eyebrow">{profile.location}</p>
            <h2 id="contact-heading">
              {text("Listo para construir algo útil.", "Ready to build something useful.")}
            </h2>
            <p className="contact-copy">{profile.summary}</p>
            <p className="contact-profile__role">{profile.title}</p>
          </div>
        </section>

        <section
          className="contact-message-panel contact-direct-panel"
          aria-labelledby="contact-direct-heading"
        >
          <header className="contact-message-panel__header">
            <span aria-hidden="true">✦</span>
            <div>
              <p className="eyebrow">
                {text("Contacto profesional", "Professional contact")}
              </p>
              <h3 id="contact-direct-heading">
                {text("¿Hablamos?", "Shall we talk?")}
              </h3>
            </div>
          </header>

          <p className="contact-direct-panel__intro">
            {text(
              "Correo para una conversación directa; GitHub para revisar el trabajo y LinkedIn para el contexto profesional.",
              "Email for a direct conversation, GitHub to review the work and LinkedIn for professional context.",
            )}
          </p>

          <nav
            className="contact-links"
            aria-label={text("Canales de contacto de Jorge", "Jorge's contact channels")}
          >
            {contactLinks.map((link) =>
              link.availability === "available" ? (
                <ContactAction key={link.id} link={link} />
              ) : null,
            )}
          </nav>

          <div className="contact-direct-panel__actions">
            {emailLink?.availability === "available" ? (
              <a
                className="pixel-button pixel-button--primary contact-direct-panel__primary"
                href={emailLink.href}
              >
                {text("Escribir a Jorge", "Email Jorge")}
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
            <button
              className="pixel-button"
              type="button"
              onClick={onElevator}
            >
              {text("Volver al elevador", "Back to elevator")}
            </button>
          </div>
        </section>
      </div>
    </ModalShell>
  );
}
