"use client";

import type { CSSProperties } from "react";

import { TECHNOLOGIES } from "@/src/data";
import { useLocale } from "@/src/i18n/LocaleContext";
import type { PortfolioProject } from "@/src/types";

import { ModalShell } from "./ModalShell";
import { ProjectCarousel } from "./ProjectCarousel";

interface ProjectModalProps {
  project: PortfolioProject;
  onClose: () => void;
}

type ProjectAccentStyle = CSSProperties & {
  "--project-accent": string;
};

export function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  const { locale, text } = useLocale();
  const technologies = TECHNOLOGIES.filter((technology) =>
    project.technologyIds.includes(technology.id),
  );
  const accentStyle: ProjectAccentStyle = {
    "--project-accent": project.scene.accentColor,
  };
  const availableLinks = [project.links.demo, project.links.repository].filter(
    (link) => link.availability === "available",
  );

  return (
    <ModalShell
      title={project.name}
      eyebrow={text("Caso de producto", "Product case study")}
      variant="project"
      wide
      onClose={onClose}
    >
      <article
        className={`project-dossier project-dossier--${project.id}`}
        style={accentStyle}
        data-project-id={project.id}
      >
        <header className="project-dossier__hero">
          {project.media.kind === "gallery" ? (
            <ProjectCarousel
              key={project.id}
              projectName={project.name}
              media={project.media}
            />
          ) : (
            <div
              className={`project-visual project-visual--${project.id} project-dossier__visual`}
              role="img"
              aria-label={project.media.alt}
            >
              <div className="project-dossier__visual-glow" aria-hidden="true" />
              <div className="project-dossier__visual-grid" aria-hidden="true" />
              <div className="project-visual__label project-dossier__visual-label">
                <span>{text("Entorno interactivo", "Interactive environment")}</span>
                <strong>{project.scene.objectLabel}</strong>
              </div>
              <span className="project-dossier__scanline" aria-hidden="true" />
            </div>
          )}

          <div className="project-dossier__intro">
            <div className="project-dossier__meta">
              <span className="project-dossier__index">
                {locale === "en" ? "CASE" : "CASO"} / {project.id.toUpperCase()}
              </span>
              <span
                className={`project-status project-status--${project.status.tone}`}
              >
                <span className="project-status__signal" aria-hidden="true" />
                {project.status.label}
              </span>
            </div>
            <p className="eyebrow project-dossier__category">
              {project.category}
            </p>
            <h3 className="project-dossier__title">{project.name}</h3>
            <p className="project-summary project-dossier__summary">
              {project.description}
            </p>
            <p className="project-dossier__concept">
              <span>{text("Escena", "Scene")}</span>
              {project.scene.concept}
            </p>
          </div>
        </header>

        <div className="project-dossier__body">
          <section className="project-dossier__story" aria-labelledby={`${project.id}-challenge`}>
            <div>
              <p className="project-section-kicker">{text("El reto", "The challenge")}</p>
              <h4 id={`${project.id}-challenge`}>
                {text("Problema resuelto", "Problem addressed")}
              </h4>
              <p className="project-problem">{project.problemSolved}</p>
            </div>
          </section>

          <section className="project-dossier__capabilities" aria-labelledby={`${project.id}-capabilities`}>
            <div>
              <p className="project-section-kicker">
                {text("La solución", "The solution")}
              </p>
              <h4 id={`${project.id}-capabilities`}>
                {text("Capacidades principales", "Core capabilities")}
              </h4>
              <ul className="project-list project-feature-grid">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="project-dossier__stack" aria-labelledby={`${project.id}-stack`}>
            <div>
              <p className="project-section-kicker">
                {text("Construcción", "Build")}
              </p>
              <h4 id={`${project.id}-stack`}>
                {text("Tecnologías", "Technologies")}
              </h4>
              {technologies.length > 0 ? (
                <ul className="tag-list project-stack-list">
                  {technologies.map((technology) => (
                    <li key={technology.id}>{technology.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="status-copy">{project.technologyNote}</p>
              )}
            </div>
          </section>
        </div>

        <footer className="project-dossier__footer">
          <p className="project-dossier__footer-note">
            <span aria-hidden="true">✦</span>
            {text(
              "Alcance, decisiones y estado actual documentados.",
              "Scope, decisions and current status documented.",
            )}
          </p>
          <div className="project-actions project-dossier__actions">
            {availableLinks.map((link, index) =>
                <a
                  key={link.id}
                  className={`pixel-button${index === 0 ? " pixel-button--primary" : ""}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
            )}
            <button className="pixel-button" type="button" onClick={onClose}>
              {text("Volver al portafolio", "Back to portfolio")}
            </button>
          </div>
        </footer>
      </article>
    </ModalShell>
  );
}
