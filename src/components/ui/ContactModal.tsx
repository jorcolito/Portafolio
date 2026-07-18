"use client";

import { CONTACT_LINKS, PROFILE } from "@/src/data";
import type { AvailableResourceLink, ResourceLink } from "@/src/types";

import { ModalShell } from "./ModalShell";

interface ContactModalProps {
  onClose: () => void;
  onNotice: (message: string) => void;
}

const CONTACT_KIND_LABELS: Record<ResourceLink["kind"], string> = {
  demo: "Demo",
  repository: "Repositorio",
  certificate: "Certificado",
  email: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
  cv: "CV",
};

function ContactAction({
  link,
}: {
  link: AvailableResourceLink;
}) {
  const content = (
    <>
      <span className="contact-link__kind">{CONTACT_KIND_LABELS[link.kind]}</span>
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

export function ContactModal({ onClose }: ContactModalProps) {
  const initials = PROFILE.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  const emailLink = CONTACT_LINKS.find((link) => link.kind === "email");

  return (
    <ModalShell
      title="Trabajemos juntos"
      eyebrow="Canal directo"
      variant="contact"
      wide
      onClose={onClose}
    >
      <div className="contact-experience">
        <section className="contact-profile" aria-labelledby="contact-heading">
          <div className="contact-profile__visual">
            <figure
              className="contact-portrait"
              role="img"
              aria-label="Monograma de Jorge Colamarco"
            >
              <span className="contact-portrait__glow" aria-hidden="true" />
              <span className="contact-portrait__initials" aria-hidden="true">
                {initials}
              </span>
              <figcaption>Jorge Colamarco</figcaption>
            </figure>
            <div className="contact-availability">
              <span className="contact-availability__signal" aria-hidden="true" />
              Disponible para conversar
            </div>
          </div>

          <div className="contact-profile__copy">
            <p className="eyebrow">{PROFILE.location}</p>
            <h2 id="contact-heading">Listo para construir algo útil.</h2>
            <p className="contact-copy">{PROFILE.summary}</p>
            <p className="contact-profile__role">{PROFILE.title}</p>
          </div>
        </section>

        <section
          className="contact-message-panel contact-direct-panel"
          aria-labelledby="contact-direct-heading"
        >
          <header className="contact-message-panel__header">
            <span aria-hidden="true">✦</span>
            <div>
              <p className="eyebrow">Contacto profesional</p>
              <h3 id="contact-direct-heading">¿Hablamos?</h3>
            </div>
          </header>

          <p className="contact-direct-panel__intro">
            Correo para una conversación directa; GitHub para revisar el trabajo y
            LinkedIn para el contexto profesional.
          </p>

          <nav className="contact-links" aria-label="Canales de contacto de Jorge">
            {CONTACT_LINKS.map((link) =>
              link.availability === "available" ? (
                <ContactAction key={link.id} link={link} />
              ) : null,
            )}
          </nav>

          {emailLink?.availability === "available" ? (
            <a
              className="pixel-button pixel-button--primary contact-direct-panel__primary"
              href={emailLink.href}
            >
              Escribir a Jorge
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </section>
      </div>
    </ModalShell>
  );
}
