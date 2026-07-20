"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";

import { getLocalizedContent } from "@/src/data/localized";
import { useLocale } from "@/src/i18n/LocaleContext";
import type { PortfolioProject, ResourceLink } from "@/src/types";

import { ModalShell } from "./ModalShell";

type QuickSection =
  | "presentacion"
  | "proyectos"
  | "tecnologias"
  | "educacion"
  | "sobre-mi"
  | "contacto";

const HORIZONTAL_NAV_QUERY = "(max-width: 720px)";

function subscribeToNavigationOrientation(onChange: () => void) {
  const mediaQuery = window.matchMedia(HORIZONTAL_NAV_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getNavigationOrientationSnapshot() {
  return window.matchMedia(HORIZONTAL_NAV_QUERY).matches;
}

function getServerNavigationOrientationSnapshot() {
  return false;
}

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
  const { locale, text } = useLocale();
  const {
    contactLinks,
    educationLibrary,
    profile,
    projects,
    technologyGroups,
  } = getLocalizedContent(locale);
  const sections: readonly { id: QuickSection; label: string }[] = [
    { id: "presentacion", label: text("Presentación", "Overview") },
    { id: "proyectos", label: text("Proyectos", "Projects") },
    { id: "tecnologias", label: text("Tecnologías", "Technologies") },
    { id: "educacion", label: text("Credenciales", "Credentials") },
    { id: "sobre-mi", label: text("Cómo trabajo", "How I work") },
    { id: "contacto", label: text("Contacto", "Contact") },
  ];
  const workPrincipleLabels = [
    text("Descubrir", "Discover"),
    text("Diseñar", "Design"),
    text("Entregar", "Deliver"),
  ] as const;
  const [section, setSection] = useState<QuickSection>("presentacion");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasHorizontalNavigation = useSyncExternalStore(
    subscribeToNavigationOrientation,
    getNavigationOrientationSnapshot,
    getServerNavigationOrientationSnapshot,
  );
  const availableContactLinks = contactLinks.filter(
    (link) => link.availability === "available",
  );

  const activateSection = (nextSection: QuickSection) => {
    setSection(nextSection);
    window.requestAnimationFrame(() => {
      const scrollRegion = panelRef.current?.closest<HTMLElement>(
        ".modal-scroll-region",
      );
      scrollRegion?.scrollTo({ top: 0, behavior: "auto" });
      const activeTabIndex = sections.findIndex(
        (item) => item.id === nextSection,
      );
      tabRefs.current[activeTabIndex]?.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "auto",
      });
    });
  };

  const moveTabFocus = (currentIndex: number, direction: -1 | 1) => {
    const nextIndex =
      (currentIndex + direction + sections.length) % sections.length;
    const nextSection = sections[nextIndex];
    activateSection(nextSection.id);
    tabRefs.current[nextIndex]?.focus();
  };

  const focusTabAt = (index: number) => {
    const nextSection = sections[index];
    if (!nextSection) return;
    activateSection(nextSection.id);
    tabRefs.current[index]?.focus();
  };

  return (
    <ModalShell
      title={text("Vista rápida", "Quick view")}
      eyebrow={text("Lectura para empleadores", "Employer overview")}
      onClose={onClose}
      wide
    >
      <div className="quick-view quick-view--refined quick-view--employer">
        <nav
          className="quick-nav quick-view__nav"
          aria-label={text("Secciones de la vista rápida", "Quick view sections")}
        >
          <div className="quick-nav-intro">
            <span className="eyebrow">
              {text("En menos de un minuto", "In under a minute")}
            </span>
            <strong>{text("Lo importante, primero.", "The essentials, first.")}</strong>
            <span>
              {text(
                "Trabajo, herramientas, credenciales y contacto directo.",
                "Work, tools, credentials and direct contact.",
              )}
            </span>
          </div>
          <p className="sr-only" id="quick-tabs-instructions">
            {text(
              `Navegación ${hasHorizontalNavigation ? "horizontal" : "vertical"}. Usa las flechas para cambiar de sección.`,
              `${hasHorizontalNavigation ? "Horizontal" : "Vertical"} navigation. Use the arrow keys to change sections.`,
            )}
          </p>
          <ul
            role="tablist"
            aria-orientation={hasHorizontalNavigation ? "horizontal" : "vertical"}
            aria-describedby="quick-tabs-instructions"
          >
            {sections.map((item, index) => (
              <li key={item.id} role="presentation">
                <button
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`quick-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={section === item.id}
                  aria-controls="quick-panel"
                  tabIndex={section === item.id ? 0 : -1}
                  onClick={() => activateSection(item.id)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "ArrowRight"
                    ) {
                      event.preventDefault();
                      moveTabFocus(index, 1);
                    } else if (
                      event.key === "ArrowUp" ||
                      event.key === "ArrowLeft"
                    ) {
                      event.preventDefault();
                      moveTabFocus(index, -1);
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      focusTabAt(0);
                    } else if (event.key === "End") {
                      event.preventDefault();
                      focusTabAt(sections.length - 1);
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
          ref={panelRef}
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
                  <p className="eyebrow">{profile.title}</p>
                  <h2>
                    {text(
                      "Software útil, pensado como producto.",
                      "Useful software, shaped as a product.",
                    )}
                  </h2>
                  <p className="quick-hero__lead">{profile.introduction}</p>
                  <p>{profile.summary}</p>
                  <div className="quick-hero__actions">
                    <button
                      className="pixel-button pixel-button--primary"
                      type="button"
                      onClick={() => activateSection("proyectos")}
                    >
                      {text("Ver proyectos", "View projects")}
                    </button>
                    <button className="pixel-button" type="button" onClick={onContact}>
                      {text("Contactar", "Contact")}
                    </button>
                  </div>
                </div>
                <figure className="quick-profile-portrait">
                  <Image
                    src="/portraits/jorge-professional-v1.webp"
                    alt={text(
                      "Fotografía profesional de Jorge Colamarco",
                      "Professional portrait of Jorge Colamarco",
                    )}
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
                  <span>{text("Aporto", "I bring")}</span>
                  <strong>{text("Criterio de producto", "Product judgment")}</strong>
                  <small>
                    {text(
                      "Entiendo el problema antes de convertirlo en código.",
                      "I understand the problem before turning it into code.",
                    )}
                  </small>
                </article>
                <article className="quick-signal-card">
                  <span>{text("Foco", "Focus")}</span>
                  <strong>{text("Ejecución full stack", "Full-stack execution")}</strong>
                  <small>
                    {text(
                      "Interfaz, lógica, datos y entrega conectados.",
                      "Interface, logic, data and delivery working together.",
                    )}
                  </small>
                </article>
                <article className="quick-signal-card">
                  <span>{text("Disponibilidad", "Availability")}</span>
                  <strong>{text("Hablemos", "Let's talk")}</strong>
                  <small>{profile.availability}</small>
                </article>
              </div>

              <section className="quick-section" aria-labelledby="featured-projects-title">
                <div className="quick-subheading">
                  <h3 id="featured-projects-title">
                    {text("Trabajo destacado", "Selected work")}
                  </h3>
                  <button type="button" onClick={() => activateSection("proyectos")}>
                    {text("Ver el contexto →", "See the context →")}
                  </button>
                </div>
                <div className="quick-projects">
                  {projects.map((project) => (
                    <article className="quick-project-card" key={project.id}>
                      <p className="eyebrow">{project.category}</p>
                      <h4>{project.name}</h4>
                      <p>{project.shortDescription}</p>
                      <button type="button" onClick={() => onProject(project)}>
                        {text("Ver ficha →", "View case →")}
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
                eyebrow={text("Casos de producto", "Product case studies")}
                title={text(
                  "Problemas, decisiones y resultados.",
                  "Problems, decisions and outcomes.",
                )}
                copy={text(
                  "Cada caso explica la necesidad, el enfoque y el estado actual del proyecto.",
                  "Each case explains the need, the approach and the project's current status.",
                )}
              />
              <div className="quick-projects quick-projects--detailed">
                {projects.map((project) => (
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
                      {text("Abrir caso →", "Open case →")}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {section === "tecnologias" ? (
            <section className="quick-panel-section">
              <SectionHeading
                eyebrow={text("Capacidad de ejecución", "Delivery capability")}
                title={text(
                  "Tecnologías que uso para construir producto.",
                  "Technologies I use to build products.",
                )}
                copy={text(
                  "Cada herramienta está organizada por su función: interfaz, lógica, datos y entrega.",
                  "Each tool is organized by its role: interface, logic, data and delivery.",
                )}
              />
              <div className="quick-tech-pipeline" aria-hidden="true">
                <span>{text("Interfaz", "Interface")}</span>
                <i />
                <span>{text("Lógica", "Logic")}</span>
                <i />
                <span>{text("Datos", "Data")}</span>
                <i />
                <span>{text("Entrega", "Delivery")}</span>
              </div>
              <div
                className="quick-tech-map"
                aria-label={text("Tecnologías por función", "Technologies by role")}
              >
                {technologyGroups.map((group, groupIndex) => (
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
                eyebrow={text("Credenciales", "Credentials")}
                title={text(
                  "Formación y credenciales verificables.",
                  "Education and verifiable credentials.",
                )}
                copy={text(
                  "Formación universitaria, dominio de inglés verificable y AWS Academy Data Engineering Training completado con insignia disponible.",
                  "University studies, verified English proficiency and completed AWS Academy Data Engineering Training with an available badge.",
                )}
              />
              <div
                className="quick-library-grid quick-library-grid--compact"
                aria-label={text(
                  "Credenciales académicas y técnicas",
                  "Academic and technical credentials",
                )}
              >
                {educationLibrary.map((book) => (
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
                      {book.evidenceImage?.presentation === "badge" ? (
                        <div className="quick-library-book__badge-frame">
                          <Image
                            className="quick-library-book__badge"
                            src={book.evidenceImage!.src}
                            alt={book.evidenceImage!.alt}
                            width={book.evidenceImage!.width}
                            height={book.evidenceImage!.height}
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
                eyebrow={text("Forma de trabajar", "How I work")}
                title={text(
                  "Pienso en producto y ejecuto de extremo a extremo.",
                  "I think in products and execute end to end.",
                )}
                copy={text(
                  "Puedo entrar en una conversación ambigua, encontrar el problema importante y convertirlo en software claro, comprobable y mantenible.",
                  "I can enter an ambiguous conversation, find the important problem and turn it into clear, testable and maintainable software.",
                )}
              />
              <article className="quick-work-value">
                <p className="eyebrow">
                  {text("Lo que aporto a un equipo", "What I bring to a team")}
                </p>
                <strong>
                  {text(
                    "Conecto contexto de negocio, experiencia de usuario y ejecución técnica.",
                    "I connect business context, user experience and technical execution.",
                  )}
                </strong>
                <p>
                  {text(
                    "Hago preguntas, detecto riesgos y explico decisiones. El objetivo no es producir más código, sino entregar un resultado útil, medible y mantenible.",
                    "I ask questions, identify risks and explain decisions. The goal is not to produce more code, but to deliver a useful, measurable and maintainable outcome.",
                  )}
                </p>
              </article>
              <div className="quick-work-principles">
                {profile.workPrinciples.map((principle, index) => (
                  <article key={principle}>
                    <span>
                      {workPrincipleLabels[index] ?? text("Mejorar", "Improve")}
                    </span>
                    <p>{principle}</p>
                  </article>
                ))}
              </div>
              <div className="quick-profile-grid">
                <article className="quick-info-block">
                  <h3>
                    {text("Áreas donde puedo aportar", "Where I can contribute")}
                  </h3>
                  <ul className="tag-list">
                    {profile.interests.map((interest) => (
                      <li key={interest.id}>{interest.label}</li>
                    ))}
                  </ul>
                </article>
                <article className="quick-info-block">
                  <h3>{text("Comunicación", "Communication")}</h3>
                  <dl className="quick-language-list">
                    {profile.languages.map((language) => (
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
                eyebrow={text("Siguiente conversación", "Next conversation")}
                title={text(
                  "¿Hay un problema que valga la pena resolver?",
                  "Is there a problem worth solving?",
                )}
                copy={text(
                  "Correo, GitHub y LinkedIn están conectados para continuar la conversación sin pasos innecesarios.",
                  "Email, GitHub and LinkedIn are ready to continue the conversation without unnecessary steps.",
                )}
              />
              <div className="quick-actions">
                <button
                  className="pixel-button pixel-button--primary"
                  type="button"
                  onClick={onContact}
                >
                  {text("Abrir contacto", "Open contact")}
                </button>
                {availableContactLinks.map((link) => (
                  <ResourceAction
                    key={link.id}
                    link={link}
                    onPlaceholder={onPlaceholder}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
}
