"use client";

import { TECHNOLOGIES } from "@/src/data";
import type { PortfolioProject } from "@/src/types";

import { ModalShell } from "./ModalShell";

interface ProjectModalProps {
  project: PortfolioProject;
  onClose: () => void;
  onPlaceholder: (message: string) => void;
}

export function ProjectModal({
  project,
  onClose,
  onPlaceholder,
}: ProjectModalProps) {
  const technologies = TECHNOLOGIES.filter((technology) =>
    project.technologyIds.includes(technology.id),
  );

  return (
    <ModalShell
      title={project.name}
      eyebrow="Ficha de proyecto"
      onClose={onClose}
    >
      <div className="project-modal">
        <div
          className={`project-visual project-visual--${project.id}`}
          role="img"
          aria-label={project.media.alt}
        >
          <div className="project-visual__label">
            <span>{project.media.label}</span>
            <strong>{project.scene.objectLabel}</strong>
          </div>
        </div>

        <article className="project-copy">
          <p className="eyebrow">{project.category}</p>
          <h3>{project.name}</h3>
          <p className="project-summary">{project.description}</p>
          <p className="project-problem">
            <strong>Problema resuelto:</strong> {project.problemSolved}
          </p>

          <div className="project-grid">
            <section>
              <h4>Funcionalidades</h4>
              <ul className="project-list">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>Tecnologías</h4>
              {technologies.length > 0 ? (
                <ul className="tag-list">
                  {technologies.map((technology) => (
                    <li key={technology.id}>{technology.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="status-copy">{project.technologyNote}</p>
              )}
            </section>
          </div>

          <p className="project-status">
            <span aria-hidden="true">● </span>
            Estado: {project.status.label}
          </p>

          <div className="project-actions">
            {[project.links.demo, project.links.repository].map((link) =>
              link.availability === "available" ? (
                <a
                  key={link.id}
                  className="pixel-button pixel-button--primary"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.id}
                  className="pixel-button"
                  type="button"
                  onClick={() => onPlaceholder(link.placeholderMessage)}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </button>
              ),
            )}
            <button className="pixel-button" type="button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </article>
      </div>
    </ModalShell>
  );
}
