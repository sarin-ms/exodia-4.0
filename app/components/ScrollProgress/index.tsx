"use client";

import { useRef } from "react";
import useScrollProgress from "./useScrollProgress";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollProgress(rootRef);

  return (
    <div
      className={styles.progress}
      ref={rootRef}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span className={styles.trail} aria-hidden="true" />
      <span className={styles.spark} aria-hidden="true" />
    </div>
  );
}
