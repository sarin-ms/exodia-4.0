"use client";

import {
  memo,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./LoadingScreen.module.css";

const FLIGHT_DURATION = 2800;
const REVEAL_DURATION = 1000;
const motionStyle = {
  "--flight-duration": `${FLIGHT_DURATION}ms`,
  "--reveal-duration": `${REVEAL_DURATION}ms`,
} as CSSProperties;

type Phase = "waiting" | "flying" | "covered" | "revealing" | "complete";

type LoadingScreenProps = Readonly<{
  children: ReactNode;
}>;

const MemoizedFlyingWizard = memo(FlyingWizard);

export default function LoadingScreen({
  children,
}: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [isReady, setIsReady] = useState(false);
  const isComplete = phase === "complete";
  const isRevealed = phase === "revealing" || isComplete;

  useEffect(() => {
    let disposed = false;
    let flightTimer: number | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startFrame = window.requestAnimationFrame(() => {
      setPhase((current) =>
        current === "waiting"
          ? reducedMotion.matches
            ? "complete"
            : "flying"
          : current,
      );

      // Animation events normally finish the pass; the timer also covers interrupted animations.
      flightTimer = window.setTimeout(() => {
        setPhase((current) => (current === "flying" ? "covered" : current));
      }, FLIGHT_DURATION + 150);
    });

    const markReady = () => {
      if (!disposed) setIsReady(true);
    };
    const onPageReady = () => {
      void document.fonts.ready.then(markReady, markReady);
    };
    const maximumWait = window.setTimeout(markReady, 6500);

    if (document.readyState === "complete") {
      onPageReady();
    } else {
      window.addEventListener("load", onPageReady, { once: true });
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(startFrame);
      window.clearTimeout(flightTimer);
      window.clearTimeout(maximumWait);
      window.removeEventListener("load", onPageReady);
    };
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhase("revealing");
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isComplete]);

  useEffect(() => {
    if (phase !== "covered" || !isReady) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealTimer = window.setTimeout(
      () => setPhase("revealing"),
      reducedMotion.matches ? 0 : 180,
    );
    return () => window.clearTimeout(revealTimer);
  }, [phase, isReady]);

  useEffect(() => {
    if (phase !== "revealing") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const exitTimer = window.setTimeout(
      () => setPhase("complete"),
      reducedMotion.matches ? 0 : REVEAL_DURATION,
    );
    return () => window.clearTimeout(exitTimer);
  }, [phase]);

  return (
    <>
      {!isComplete && (
        <div className={styles.screen} data-phase={phase} style={motionStyle}>
          <div className={styles.atmosphere} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div
            className={styles.traveler}
            aria-hidden="true"
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) {
                setPhase((current) =>
                  current === "flying" ? "covered" : current,
                );
              }
            }}
          >
            <div className={styles.capeWake}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                focusable="false"
              >
                <path d="M0 49C27 46 25 14 100 0V100C25 86 27 54 0 51Z" />
              </svg>
            </div>
            <div className={styles.flyer}>
              <MemoizedFlyingWizard />
              <div className={styles.magicTrail}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>

          <p className={styles.status} role="status" aria-live="polite">
            {isRevealed
              ? "Let the magic begin."
              : "A little magic is on its way."}
          </p>
        </div>
      )}
      <div
        className={styles.content}
        data-revealed={isRevealed}
        data-motion-ready={isComplete}
        style={motionStyle}
      >
        {children}
      </div>
    </>
  );
}

function FlyingWizard() {
  return (
    <svg
      className={styles.wizard}
      viewBox="0 0 700 540"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.rider}>
        <path
          className={styles.capeBack}
          d="M268 180C311 167 342 190 373 208c43 26 95-9 147 18 65-2 111 25 121 64 7 25-3 46-23 59 5-21-23-42-69-59-30-12-48 7-56 29l-27 47-103-45-66-70Z"
        />
        <path
          className={styles.capeHem}
          d="M285 229c47-12 88 12 130 41 37 26 65 31 92 45 25 13 25 31 10 51-9 13-5 27 13 40 20 15 37 26 67 37-34-2-53 7-81 0-34-8-46-35-78-37-36-3-56-23-77-48l-72-72Z"
        />
        <path
          className={styles.broom}
          d="M24 207c14-2 56 13 87 23l353 124-4 11-354-125c-28-12-49-20-68-12-10 4-20-14-14-21Z"
        />
        <path
          className={styles.broomTail}
          d="m450 344 42 4c25 2 48 16 66 34l39 37c-33-1-52 3-78-7-25-10-45-28-69-44Z"
        />
        <path
          className={styles.bristles}
          d="m477 357 69 41m-61-35 78 42m-88-34 45 27"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path d="M282 266c28 9 67 41 85 69l30 43 40 4c25-1 33 17 24 36l-25 38c-2 15 4 38-7 54-8 10-15-7-19-22l-13-35-63-11c-28-2-50-6-70-14-18-8-21-26-12-43l17-45 7-51Z" />
        <path d="m346 346 39 19 17 26 50 8c24 4 37 22 31 42-4 16 7 37 1 49-5 11-14-1-19-14l-22-45-64-10-38-37Z" />
        <path d="M199 147c-13 12-20 23-19 40l10 30-40 8-17-1-18 5-11 4c-9-1-16 5-15 12l10 13c5 6 14 3 22-2l15-5 53 1c-9 6-15 10-17 16l6 10c7 6 14 0 22-5l18-7c13 5 31 5 42-2l24 13c13 3 28-9 31-23l4-44-16-56-52-24Z" />
        <path d="M253 114c15-10 29-15 41-14 13 2 32 18 47 29 11 9 18 29 21 48l-27-9 20 22-25 16-51-39Z" />
        <path d="m197 140 42-11 19 25-12 30-35-9Z" />
        <path d="M176 88c-8-10-6-20 4-27l-2 13c7-16 22-21 37-22l-7 7 27-8-10 11 20 3-13 5c13 6 18 14 21 30l6 21-7 23c-7 13-19 17-33 13l-21-6-20-1c-8-1-12-5-8-10l3-5-7-5 3-6c-8-1-9-6-3-12l7-8Z" />
        <path
          className={styles.glasses}
          d="M176 111c7-5 15-4 19 1m-18-3c-8 0-13 4-12 10 1 7 9 7 13 3 3-3 3-9-1-13Zm17 3 22-6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          className={styles.capeFold}
          d="M308 220c43 29 65 35 100 32m-90-12c37 42 54 62 85 70"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className={styles.scarf}
          d="M223 155c32 3 43 31 73 31 26 0 40-16 68-5 18 7 25 16 45 10-17 18-35 11-49 5-25-10-39 12-65 5-29-8-42-33-72-34Z"
        />
      </g>
    </svg>
  );
}
