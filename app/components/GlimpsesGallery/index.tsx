"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { GlimpsesGalleryProps } from "./GlimpsesGallery.types";
import useGlimpsesGallery from "./useGlimpsesGallery";
import styles from "./GlimpsesGallery.module.css";

export default function GlimpsesGallery({ photos }: GlimpsesGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadedSrc, setLoadedSrc] = useState("");
  const isOpen = activeIndex !== null;
  const { suppressClick } = useGlimpsesGallery(rootRef, isOpen);
  const split = Math.ceil(photos.length / 2);
  const rows = [photos.slice(0, split), photos.slice(split)];
  const active = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    if (activeIndex !== null && !dialogRef.current?.open)
      dialogRef.current?.showModal();
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex === null) return;
    for (const direction of [-1, 1]) {
      const image = new window.Image();
      image.src =
        photos[(activeIndex + direction + photos.length) % photos.length].src;
    }
  }, [activeIndex, photos]);

  const openPhoto = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    if (suppressClick()) return;
    returnFocusRef.current = event.currentTarget;
    setActiveIndex(index);
  };
  const changePhoto = (direction: number) => {
    setActiveIndex((index) =>
      index === null ? 0 : (index + direction + photos.length) % photos.length,
    );
  };

  return (
    <div className={styles.gallery} ref={rootRef}>
      <div
        className={styles.scene}
        data-gallery-scene
        role="group"
        aria-label="Exodia event photographs"
      >
        {rows.map((row, rowIndex) => (
          <ol
            className={styles.row}
            data-gallery-row
            key={rowIndex}
            start={rowIndex * split + 1}
            aria-label={`Archive photos ${rowIndex * split + 1} to ${rowIndex * split + row.length}`}
          >
            {row.map((photo, column) => {
              const index = rowIndex * split + column;
              return (
                <li className={styles.card} data-glimpse-card key={photo.id}>
                  <a
                    className={styles.photoLink}
                    data-glimpse-link
                    data-glimpse-index={index}
                    href={photo.src}
                    onClick={(event) => openPhoto(event, index)}
                    aria-label={`${String(index + 1).padStart(2, "0")} ${photo.title}. Open photo ${index + 1} of ${photos.length}`}
                  >
                    <figure className={styles.photo}>
                      <Image
                        className={styles.thumbnail}
                        src={photo.thumbnail}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 900px) 400px, (min-width: 433px) 320px, 74vw"
                        loading="lazy"
                        draggable={false}
                      />
                      <figcaption className={styles.caption}>
                        <span className={styles.photoNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.photoTitle}>{photo.title}</span>
                        <span className={styles.expandIcon} aria-hidden="true">
                          ↗
                        </span>
                      </figcaption>
                    </figure>
                  </a>
                </li>
              );
            })}
          </ol>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-labelledby="glimpse-title"
        onClose={() => {
          setActiveIndex(null);
          returnFocusRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.target === event.currentTarget &&
            (event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom)
          )
            event.currentTarget.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            event.stopPropagation();
            changePhoto(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {active && activeIndex !== null && (
          <div className={styles.lightboxContent}>
            <header className={styles.lightboxHeader}>
              <p>The Exodia archives</p>
              <button
                className={styles.close}
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close photo viewer"
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <figure className={styles.lightboxFigure}>
              <div
                className={styles.lightboxStage}
                aria-busy={loadedSrc !== active.src}
              >
                {loadedSrc !== active.src && (
                  <span className={styles.loadingPhoto} role="status">
                    Loading photo<span aria-hidden="true">…</span>
                  </span>
                )}
                <Image
                  className={`${styles.fullImage} ${loadedSrc !== active.src ? styles.imagePending : ""}`}
                  key={active.id}
                  src={active.src}
                  alt={active.alt}
                  width={active.width}
                  height={active.height}
                  loading="eager"
                  onLoad={() => setLoadedSrc(active.src)}
                  unoptimized
                />
              </div>
              <figcaption className={styles.lightboxCaption}>
                <h3 id="glimpse-title">{active.title}</h3>
                <p aria-live="polite" aria-atomic="true">
                  {String(activeIndex + 1).padStart(2, "0")}{" "}
                  <span>/ {String(photos.length).padStart(2, "0")}</span>
                </p>
              </figcaption>
            </figure>
            <nav
              className={styles.lightboxNav}
              aria-label="Browse event photos"
            >
              <button type="button" onClick={() => changePhoto(-1)}>
                <span aria-hidden="true">←</span>Previous
              </button>
              <p>
                Arrow keys to explore<span aria-hidden="true"> · </span>Esc to
                close
              </p>
              <button type="button" onClick={() => changePhoto(1)}>
                Next<span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>
        )}
      </dialog>
    </div>
  );
}
