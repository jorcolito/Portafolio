"use client";

import Image from "next/image";
import { useState } from "react";

import {
  CONTACT_LINKS,
  EDUCATION_LIBRARY,
  PROFILE,
  PROJECTS,
  TECHNOLOGY_GROUPS,
} from "@/src/data";
import type { PortfolioProject, ResourceLink } from "@/src/types";

import { ModalShell } from "./ModalShell";

type QuickSection =
  | "presentacion"
  | "proyectos"
  | "tecnologias"
  | "educacion"
  | "sobre-mi"
  | "contacto";

const SECTIONS: readonly { id: QuickSection; label: string }[] = [
  { id: "presentacion", label: "Presentación" },
  { id: "proyectos", label: "Proyectos" },
  { id: "tecnologias", label: "Tecnologías" },
  { id: "educacion", label: "Credenciales" },
  { id: "sobre-mi", label: "Cómo trabajo" },
  { id: "contacto", label: "Contacto" },
];

const WORK_PRINCIPLE_LABELS = ["Descubrir", "Diseñar", "Entregar"] as const;

interface QuickViewProps {
  onClose: () => void;
  onProject: (project: PortfolioProject) => void;
  onContact: () => void;
  onPlaceholder: (message: string) => void;
}

function ResourceAction({
  link,
  onPlaceholder,
}: {
  link: ResourceLink;
  onPlaceholder: (message: string) => void;
}) {
  if (link.availability === "available") {
    return (
      <a
        className="pixel-button"
        href={link.href}
        target={link.kind === "email" ? undefined : "_blank"}
        rel={link.kind === "email" ? undefined : "noreferrer"}
        aria-label={link.ariaLabel}
      >
        {link.label}
      </a>
    );
  }

  return (
    <button
      className="pixel-button"
      type="button"
      onClick={() => onPlaceholder(link.placeholderMessage)}
      aria-label={link.ariaLabel}
    >
      {link.label}
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <header className="quick-section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p>{copy}</p>
    </header>
  );
}

export function QuickView({
  onClose,
  onProject,
  onContact,
  onPlaceholder,
}: QuickViewProps) {
  const [section, setSection] = useState<QuickSection>("presentacion");
  const availableContactLinks = CONTACT_LINKS.filter(
    (link) => link.availability === "available",
  );
  const cvLink = CONTACT_LINKS.find((link) => link.kind === "cv");

  const activateSection = (nextSection: QuickSection) => {
    setSection(nextSection);
  };

  const moveTabFocus = (currentIndex: number, direction: -1 | 1) => {
    const nextIndex = (currentIndex + direction + SECTIONS.length) % SECTIONS.length;
    const nextSection = SECTIONS[nextIndex];
    activateSection(nextSection.id);
    document.getElementById(`quick-tab-${nextSection.id}`)?.focus();
  };

  return (
    <ModalShell title="Quick View" eyebrow="Lectura rápida" onClose={onClose} wide>
      <div className="quick-view quick-view--refined quick-view--employer">
        <nav
          className="quick-nav quick-view__nav"
          aria-label="Secciones de Quick View"
        >
          <div className="quick-nav-intro">
            <span className="eyebrow">En menos de un minuto</span>
            <strong>Lo importante, primero.</strong>
            <span>Trabajo, herramientas, credenciales y contacto directo.</span>
          </div>
          <ul role="tablist" aria-orientation="vertical">
            {SECTIONS.map((item, index) => (
              <li key={item.id} role="presentation">
                <button
                  id={`quick-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={section === item.id}
                  aria-controls="quick-panel"
                  tabIndex={section === item.id ? 0 : -1}
                  onClick={() => activateSection(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      moveTabFocus(index, 1);
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      moveTabFocus(index, -1);
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      activateSection(SECTIONS[0].id);
                      document.getElementById(`quick-tab-${SECTIONS[0].id}`)?.focus();
                    } else if (event.key === "End") {
                      event.preventDefault();
                      const last = SECTIONS.at(-1);
                      if (last) {
                        activateSection(last.id);
                        document.getElementById(`quick-tab-${last.id}`)?.focus();
                      }
                    }
                  }}
                >
                  <span>{item.label}</span>
                  <span className="quick-nav__chevron" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div
          id="quick-panel"
          className="quick-main quick-view__panel"
          role="tabpanel"
          aria-labelledby={`quick-tab-${section}`}
          tabIndex={0}
        >
          {section === "presentacion" ? (
            <section className="quick-panel-section">
              <header className="quick-hero quick-profile-hero">
                <div className="quick-hero__copy">
                  <p className="eyebrow">{PROFILE.title}</p>
                  <h2>Software útil, pensado como producto.</h2>
                  <p className="quick-hero__lead">{PROFILE.introduction}</p>
                  <p>{PROFILE.summary}</p>
                  <div className="quick-hero__actions">
                    <button
                      className="pixel-button pixel-button--primary"
                      type="button"
                      onClick={() => activateSection("proyectos")}
                    >
                      Ver proyectos
                    </button>
                    <button className="pixel-button" type="button" onClick={onContact}>
                      Contactar
                    </button>
                  </div>
                </div>
                <figure className="quick-profile-portrait">
                  <Image
                    src="/portraits/jorge-professional-v1.png"
                    alt="Fotografía profesional de Jorge Colamarco"
                    fill
                    sizes="(max-width: 720px) 42vw, 11rem"
                    unoptimized
                    priority
                  />
                  <figcaption>Jorge Colamarco</figcaption>
                </figure>
              </header>

              <div className="quick-signal-grid" aria-label="Propuesta profesional">
                <article className="quick-signal-card">
                  <span>Aporto</span>
                  <strong>Criterio de producto</strong>
                  <small>Entiendo el problema antes de convertirlo en código.</small>
                </article>
                <article className="quick-signal-card">
                  <span>Foco</span>
                  <strong>Ejecución full stack</strong>
                  <small>Interfaz, lógica, datos y entrega conectados.</small>
                </article>
                <article className="quick-signal-card">
                  <span>Disponibilidad</span>
                  <strong>Hablemos</strong>
                  <small>{PROFILE.availability}</small>
                </article>
              </div>

              <section className="quick-section" aria-labelledby="featured-projects-title">
                <div className="quick-subheading">
                  <h3 id="featured-projects-title">Trabajo destacado</h3>
                  <button type="button" onClick={() => activateSection("proyectos")}>
                    Ver el contexto →
                  </button>
                </div>
                <div className="quick-projects">
                  {PROJECTS.map((project) => (
                    <article className="quick-project-card" key={project.id}>
                      <p className="eyebrow">{project.category}</p>
                      <h4>{project.name}</h4>
                      <p>{project.shortDescription}</p>
                      <button type="button" onClick={() => onProject(project)}>
                        Ver ficha →
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          ) : null}

          {section === "proyectos" ? (
            <section className="quick-panel-section">
              <SectionHeading
                eyebrow="Evidencia de trabajo"
                title="Problemas, decisiones y producto."
                copy="Cada ficha explica la necesidad, el enfoque y el estado real del proyecto."
              />
              <div className="quick-projects quick-projects--detailed">
                {PROJECTS.map((project) => (
                  <article className="quick-project-card" key={project.id}>
                    <div className="quick-project-card__meta">
                      <span className="project-status">{project.status.label}</span>
                    </div>
                    <p className="eyebrow">{project.category}</p>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <p className="quick-project-card__problem">
                      {project.problemSolved}
                    </p>
                    <button type="button" onClick={() => onProject(project)}>
                      Abrir expediente →
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "tecnologias" ? (
            <section className="quick-panel-section">
              <SectionHeading
                eyebrow="Capacidad de ejecución"
                title="Tecnologías que uso para construir producto."
                copy="Cada herramienta está organizada por su función: interfaz, lógica, datos y entrega."
              />
              <div className="quick-tech-pipeline" aria-hidden="true">
                <span>Interfaz</span>
                <i />
                <span>Lógica</span>
                <i />
                <span>Datos</span>
                <i />
                <span>Entrega</span>
              </div>
              <div className="quick-tech-map" aria-label="Tecnologías por función">
                {TECHNOLOGY_GROUPS.map((group, groupIndex) => (
                  <article
                    className={`quick-tech-cluster quick-tech-cluster--${group.id}`}
                    key={group.id}
                  >
                    <header>
                      <span className="quick-tech-cluster__pulse" aria-hidden="true" />
                      <h3>{group.label}</h3>
                    </header>
                    <ul>
                      {group.technologies.map((technology, technologyIndex) => (
                        <li
                          key={technology.id}
                          style={{
                            animationDelay: `${groupIndex * 90 + technologyIndex * 55}ms`,
                          }}
                        >
                          {technology.name}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "educacion" ? (
            <section className="quick-panel-section">
              <SectionHeading
                eyebrow="Credenciales"
                title="Evidencia, no promesas."
                copy="Formación universitaria, dominio de inglés verificable y AWS Academy Data Engineering Training completado con insignia disponible."
              />
              <div
                className="quick-library-grid quick-library-grid--compact"
                aria-label="Credenciales académicas y técnicas"
              >
                {EDUCATION_LIBRARY.map((book) => (
                  <article
                    className={`quick-library-book quick-library-book--${book.kind}`}
                    key={book.id}
                  >
                    <div className="quick-library-book__spine" aria-hidden="true" />
                    <div className="quick-library-book__content">
                      <div className="quick-library-book__heading">
                        <p className="eyebrow">{book.shelfLabel}</p>
                        <span
                          className={`quick-library-book__status quick-library-book__status--${book.status}`}
                        >
                          {book.statusLabel}
                        </span>
                      </div>
                      {"evidenceImage" in book &&
                      book.evidenceImage.presentation === "badge" ? (
                        <div className="quick-library-book__badge-frame">
                          <Image
                            className="quick-library-book__badge"
                            src={book.evidenceImage.src}
                            alt={book.evidenceImage.alt}
                            width={book.evidenceImage.width}
                            height={book.evidenceImage.height}
                            sizes="88px"
                            unoptimized
                          />
                        </div>
                      ) : null}
                      <h3>{book.title}</h3>
                      <p>{book.summary}</p>
                      <ul className="quick-library-book__metadata">
                        {book.metadata.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      {book.resource ? (
                        <ResourceAction
                          link={book.resource}
                          onPlaceholder={onPlaceholder}
                        />
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "sobre-mi" ? (
            <section className="quick-panel-section">
              <SectionHeading
                eyebrow="Forma de trabajar"
                title="Pienso en producto y ejecuto de extremo a extremo."
                copy="Puedo entrar en una conversación ambigua, encontrar el problema importante y convertirlo en software claro, comprobable y mantenible."
              />
              <article className="quick-work-value">
                <p className="eyebrow">Lo que aporto a un equipo</p>
                <strong>No me limito a implementar tickets.</strong>
                <p>
                  Hago preguntas, detecto riesgos, explico decisiones y conecto la
                  experiencia del usuario con la realidad técnica. El objetivo no es
                  producir más código, sino entregar una solución que merezca existir.
                </p>
              </article>
              <div className="quick-work-principles">
                {PROFILE.workPrinciples.map((principle, index) => (
                  <article key={principle}>
                    <span>{WORK_PRINCIPLE_LABELS[index] ?? "Mejorar"}</span>
                    <p>{principle}</p>
                  </article>
                ))}
              </div>
              <div className="quick-profile-grid">
                <article className="quick-info-block">
                  <h3>Áreas donde puedo aportar</h3>
                  <ul className="tag-list">
                    {PROFILE.interests.map((interest) => (
                      <li key={interest.id}>{interest.label}</li>
                    ))}
                  </ul>
                </article>
                <article className="quick-info-block">
                  <h3>Comunicación</h3>
                  <dl className="quick-language-list">
                    {PROFILE.languages.map((language) => (
                      <div key={language.id}>
                        <dt>{language.name}</dt>
                        <dd>{language.level}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </div>
            </section>
          ) : null}

          {section === "contacto" ? (
            <section className="quick-panel-section quick-contact-panel">
              <SectionHeading
                eyebrow="Siguiente conversación"
                title="¿Hay un problema que valga la pena resolver?"
                copy="Correo, GitHub y LinkedIn están conectados para continuar la conversación sin pasos innecesarios."
              />
              <div className="quick-actions">
                <button
                  className="pixel-button pixel-button--primary"
                  type="button"
                  onClick={onContact}
                >
                  Abrir contacto
                </button>
                {availableContactLinks.map((link) => (
                  <ResourceAction
                    key={link.id}
                    link={link}
                    onPlaceholder={onPlaceholder}
                  />
                ))}
                {cvLink ? (
                  <ResourceAction link={cvLink} onPlaceholder={onPlaceholder} />
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
}
