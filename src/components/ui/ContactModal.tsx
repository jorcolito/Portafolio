"use client";

import Image from "next/image";

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

export function ContactModal({ onClose, onNotice }: ContactModalProps) {
  const emailLink = CONTACT_LINKS.find((link) => link.kind === "email");
  const cvLink = CONTACT_LINKS.find((link) => link.kind === "cv");

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
            >
              <span className="contact-portrait__glow" aria-hidden="true" />
              <Image
                className="contact-portrait__image"
                src="/portraits/jorge-professional-v1.png"
                alt="Fotografía profesional de Jorge Colamarco"
                fill
                sizes="(max-width: 760px) 42vw, 10rem"
                unoptimized
                priority
              />
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

          <div className="contact-direct-panel__actions">
            {emailLink?.availability === "available" ? (
              <a
                className="pixel-button pixel-button--primary contact-direct-panel__primary"
                href={emailLink.href}
              >
                Escribir a Jorge
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
            {cvLink?.availability === "placeholder" ? (
              <button
                className="pixel-button"
                type="button"
                onClick={() => onNotice(cvLink.placeholderMessage)}
              >
                Descargar CV · próximamente
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </ModalShell>
  );
}
