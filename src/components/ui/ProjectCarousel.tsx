"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

import { useLocale } from "@/src/i18n/LocaleContext";
import type { ProjectMediaGallery } from "@/src/types";

interface ProjectCarouselProps {
  projectName: string;
  media: ProjectMediaGallery;
}

export function ProjectCarousel({
  projectName,
  media,
}: ProjectCarouselProps) {
  const { text } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const total = media.images.length;
  const activeImage = media.images[activeIndex];

  const moveBy = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + total) % total);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(total - 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (startX === null) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) < 44) return;
    moveBy(distance > 0 ? -1 : 1);
  };

  return (
    <section
      className="project-gallery"
      role="region"
      aria-roledescription={text("carrusel", "carousel")}
      aria-label={`${projectName}: ${media.alt}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <figure
        className="project-gallery__viewport"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <Image
          key={activeImage.id}
          className="project-gallery__image"
          src={activeImage.src}
          alt={activeImage.alt}
          width={activeImage.width}
          height={activeImage.height}
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 76vw, 46vw"
          unoptimized
          draggable={false}
        />
        <figcaption className="project-gallery__caption">
          <span>{media.label}</span>
          <strong>{activeImage.caption}</strong>
        </figcaption>
      </figure>

      <div className="project-gallery__controls">
        <button
          className="project-gallery__arrow"
          type="button"
          onClick={() => moveBy(-1)}
          aria-label={text("Imagen anterior", "Previous image")}
        >
          <span aria-hidden="true">←</span>
        </button>

        <div
          className="project-gallery__dots"
          role="group"
          aria-label={text("Elegir captura", "Choose screenshot")}
        >
          {media.images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-pressed={index === activeIndex}
              aria-label={text(
                `Mostrar imagen ${index + 1}: ${image.caption}`,
                `Show image ${index + 1}: ${image.caption}`,
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <p className="project-gallery__position" aria-live="polite" aria-atomic="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          <span className="sr-only">: {activeImage.caption}</span>
        </p>

        <button
          className="project-gallery__arrow"
          type="button"
          onClick={() => moveBy(1)}
          aria-label={text("Imagen siguiente", "Next image")}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="project-gallery__hint">
        {text(
          "Usa las flechas o desliza para recorrer las capturas.",
          "Use the arrow keys or swipe to browse the screenshots.",
        )}
      </p>
    </section>
  );
}
