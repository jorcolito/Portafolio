"use client";

import { useState } from "react";

import { CONTACT_LINKS, PROFILE } from "@/src/data";
import type { ResourceLink } from "@/src/types";

import { ModalShell } from "./ModalShell";

interface ContactModalProps {
  onClose: () => void;
  onNotice: (message: string) => void;
}

export function ContactModal({ onClose, onNotice }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const contactLinks: readonly ResourceLink[] = CONTACT_LINKS;

  return (
    <ModalShell title="Contacto" eyebrow="Nodo de comunicación" onClose={onClose}>
      <div className="contact-grid">
        <section>
          <p className="eyebrow">Gracias por llegar hasta aquí</p>
          <h2>Ahora sí. Hablemos.</h2>
          <p className="contact-copy">
            Jorge está interesado en equipos de producto, oportunidades de
            desarrollo y proyectos donde la tecnología resuelva un problema
            concreto.
          </p>
          <div className="contact-links">
            {contactLinks.map((link) =>
              link.availability === "available" ? (
                <a
                  className="contact-link"
                  key={link.id}
                  href={link.href}
                  target={link.kind === "email" ? undefined : "_blank"}
                  rel={link.kind === "email" ? undefined : "noreferrer"}
                  aria-label={link.ariaLabel}
                >
                  <span>{link.kind.toUpperCase()}</span>
                  <span>{link.label} →</span>
                </a>
              ) : (
                <button
                  className="contact-link"
                  key={link.id}
                  type="button"
                  onClick={() => onNotice(link.placeholderMessage)}
                  aria-label={link.ariaLabel}
                >
                  <span>{link.kind.toUpperCase()}</span>
                  <span>{link.label}</span>
                </button>
              ),
            )}
            <button
              className="contact-link"
              type="button"
              onClick={() =>
                onNotice(
                  "El correo real aún no fue proporcionado; no se copió una dirección ficticia.",
                )
              }
            >
              <span>COPIAR</span>
              <span>Correo pendiente</span>
            </button>
          </div>
        </section>

        <section>
          <h3>Formulario visual</h3>
          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              onNotice(
                "Formulario de demostración: no se envió ningún dato. El backend se conectará en una fase posterior.",
              );
            }}
          >
            <div className="form-field">
              <label htmlFor="contact-name">Nombre</label>
              <input
                id="contact-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Tu nombre"
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Correo</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="tu@correo.com"
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={`Hola ${PROFILE.name}, me gustaría hablar sobre…`}
              />
            </div>
            <p className="form-note">
              Esta versión no transmite ni almacena información. Se conserva
              como demostración de la experiencia final.
            </p>
            <button className="pixel-button pixel-button--primary" type="submit">
              Enviar mensaje (demo)
            </button>
          </form>
        </section>
      </div>
    </ModalShell>
  );
}
