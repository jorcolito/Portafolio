"use client";

import { useState } from "react";

import {
  CONTACT_LINKS,
  EDUCATION,
  EXPERIENCE,
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
  | "experiencia"
  | "contacto";

const SECTIONS: readonly { id: QuickSection; label: string }[] = [
  { id: "presentacion", label: "Presentación" },
  { id: "proyectos", label: "Proyectos" },
  { id: "tecnologias", label: "Tecnologías" },
  { id: "educacion", label: "Educación" },
  { id: "experiencia", label: "Experiencia" },
  { id: "contacto", label: "Contacto" },
];

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
        target="_blank"
        rel="noreferrer"
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

export function QuickView({
  onClose,
  onProject,
  onContact,
  onPlaceholder,
}: QuickViewProps) {
  const [section, setSection] = useState<QuickSection>("presentacion");
  const cvLink = CONTACT_LINKS.find((link) => link.kind === "cv");

  return (
    <ModalShell title="Quick View" eyebrow="Acceso directo" onClose={onClose} wide>
      <div className="quick-view">
        <nav className="quick-nav" aria-label="Secciones de Quick View">
          <div className="quick-nav-intro">
            <strong>Modo reclutador</strong>
            <span>La misma información, sin plataformas que saltar.</span>
          </div>
          <ul role="tablist" aria-orientation="vertical">
            {SECTIONS.map((item) => (
              <li key={item.id} role="presentation">
                <button
                  id={`quick-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={section === item.id}
                  aria-controls="quick-panel"
                  onClick={() => setSection(item.id)}
                >
                  · {item.label}
                </button>
              </li>
            ))}
          </ul>
          {cvLink ? (
            <div style={{ marginTop: "1.2rem" }}>
              <ResourceAction link={cvLink} onPlaceholder={onPlaceholder} />
            </div>
          ) : null}
        </nav>

        <main
          id="quick-panel"
          className="quick-main"
          role="tabpanel"
          aria-labelledby={`quick-tab-${section}`}
          tabIndex={0}
        >
          {section === "presentacion" ? (
            <>
              <header className="quick-hero">
                <div>
                  <p className="eyebrow">{PROFILE.location}</p>
                  <h2>¡Hola! Soy {PROFILE.name}</h2>
                  <p>{PROFILE.introduction}</p>
                </div>
                <div
                  className="avatar-pixel"
                  role="img"
                  aria-label="Retrato pixel art abstracto de Jorge"
                />
              </header>
              <section className="quick-section">
                <h3>Perfil</h3>
                <div className="quick-two-column">
                  <div className="quick-info-block">
                    <p>{PROFILE.summary}</p>
                  </div>
                  <div className="quick-info-block">
                    <p>
                      Idiomas: {PROFILE.languages.map((language) => `${language.name} ${language.level}`).join(" · ")}
                    </p>
                  </div>
                </div>
              </section>
              <section className="quick-section">
                <h3>Proyectos destacados</h3>
                <div className="quick-projects">
                  {PROJECTS.map((project) => (
                    <article className="quick-project-card" key={project.id}>
                      <strong>{project.name}</strong>
                      <p>{project.shortDescription}</p>
                      <button type="button" onClick={() => onProject(project)}>
                        Ver ficha →
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {section === "proyectos" ? (
            <section>
              <p className="eyebrow">Productos reales</p>
              <h2>Proyectos destacados</h2>
              <div className="quick-projects">
                {PROJECTS.map((project) => (
                  <article className="quick-project-card" key={project.id}>
                    <strong>{project.name}</strong>
                    <p>{project.description}</p>
                    <span className="project-status">{project.status.label}</span>
                    <button type="button" onClick={() => onProject(project)}>
                      Abrir ficha →
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "tecnologias" ? (
            <section>
              <p className="eyebrow">Stack</p>
              <h2>Tecnologías</h2>
              <div className="quick-two-column">
                {TECHNOLOGY_GROUPS.map((group) => (
                  <article className="quick-info-block" key={group.id}>
                    <h3>{group.label}</h3>
                    <ul className="tag-list">
                      {group.technologies.map((technology) => (
                        <li key={technology.id}>{technology.name}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "educacion" ? (
            <section>
              <p className="eyebrow">Archivo académico</p>
              <h2>Educación</h2>
              {EDUCATION.map((record) => (
                <article className="quick-info-block" key={record.id}>
                  <h3>{record.institution}</h3>
                  <p>
                    {record.program}. {record.status}. Graduación estimada: {record.expectedGraduation}.
                  </p>
                  <ul className="tag-list" style={{ marginTop: "1rem" }}>
                    {record.areas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          ) : null}

          {section === "experiencia" ? (
            <section>
              <p className="eyebrow">Fuera del laboratorio</p>
              <h2>Experiencia</h2>
              {EXPERIENCE.map((record) => (
                <article className="quick-info-block" key={record.id}>
                  <h3>{record.organization} · {record.periodLabel}</h3>
                  <p>{record.summary}</p>
                  <ul className="tag-list" style={{ marginTop: "1rem" }}>
                    {record.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          ) : null}

          {section === "contacto" ? (
            <section>
              <p className="eyebrow">Canal externo</p>
              <h2>Hablemos</h2>
              <p className="contact-copy">
                Los datos de contacto reales se añadirán cuando Jorge los
                confirme. La interfaz ya está preparada para correo, GitHub,
                LinkedIn y CV sin publicar enlaces ficticios.
              </p>
              <div className="quick-actions" style={{ marginTop: "1.25rem" }}>
                <button
                  className="pixel-button pixel-button--primary"
                  type="button"
                  onClick={onContact}
                >
                  Abrir panel de contacto
                </button>
                {CONTACT_LINKS.map((link) => (
                  <ResourceAction
                    key={link.id}
                    link={link}
                    onPlaceholder={onPlaceholder}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </ModalShell>
  );
}
