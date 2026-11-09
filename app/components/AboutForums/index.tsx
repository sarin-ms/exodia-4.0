"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { organizers } from "@/app/content/organizers";
import styles from "./AboutForums.module.css";

export default function AboutForums() {
  const dialogId = useId();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [forum, setForum] = useState<(typeof organizers)[number] | null>(null);
  const hasMascot = forum?.id === "iedc-bootcamp";

  useEffect(() => {
    if (forum && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [forum]);

  return (
    <div className={styles.forums} data-about-reveal>
      <h3 className={styles.label}>Organised By</h3>
      <ul className={styles.logos}>
        {organizers.map((organizer) => (
          <li key={organizer.id}>
            <button
              className={styles.logoButton}
              type="button"
              aria-haspopup="dialog"
              aria-controls={dialogId}
              aria-label={`About ${organizer.name}`}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setForum(organizer);
              }}
            >
              <Image
                className={styles.logo}
                src={organizer.logo}
                alt=""
                width={organizer.width}
                height={organizer.height}
                unoptimized
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        className={`${styles.dialog}${hasMascot ? ` ${styles.withMascot}` : ""}`}
        id={dialogId}
        ref={dialogRef}
        aria-labelledby={forum ? titleId : undefined}
        onClose={() => {
          setForum(null);
          triggerRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;

          const { left, right, top, bottom } =
            event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < left ||
            event.clientX > right ||
            event.clientY < top ||
            event.clientY > bottom
          ) {
            event.currentTarget.close();
          }
        }}
      >
        {forum && (
          <>
            <header className={styles.dialogHeader}>
              <h3 id={titleId}>{forum.name}</h3>
              <button
                className={styles.close}
                type="button"
                aria-label="Close forum details"
                onClick={() => dialogRef.current?.close()}
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <p className={styles.tagline}>{forum.tagline}</p>
            <div className={styles.dialogBody}>
              <div className={styles.description}>
                {forum.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {hasMascot && (
                <Image
                  className={styles.mascot}
                  src="/images/about/volt.webp"
                  alt="IEDC mascot in wizard robes, casting a spell over an open book"
                  width={640}
                  height={853}
                  loading="eager"
                  unoptimized
                />
              )}
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
