"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FooterMotion.module.css";

export default function FooterMotion() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const footer = markerRef.current?.closest("footer");
    if (!footer) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const entrance = gsap.timeline({
          scrollTrigger: { trigger: footer, start: "top 92%", once: true },
        });
        entrance.from(
          footer.querySelectorAll("[data-footer-reveal]"),
          {
            y: 10,
            opacity: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0,
        );
        const wordmark = footer.querySelector("[data-footer-wordmark]");
        if (wordmark)
          entrance.to(
            wordmark,
            {
              backgroundPosition: "0% 50%",
              duration: 1.8,
              ease: "power2.inOut",
            },
            0.2,
          );

        const trail = footer.querySelector("[data-footer-trail]");
        const spark = footer.querySelector("[data-footer-spark]");
        if (!trail || !spark) return;
        const sweep = gsap
          .timeline({ paused: true, repeat: -1, repeatDelay: 3.5 })
          .fromTo(
            trail,
            { xPercent: -120, opacity: 0 },
            {
              xPercent: 440,
              opacity: 0.9,
              duration: 2.6,
              ease: "power2.inOut",
            },
          )
          .to(trail, { opacity: 0, duration: 0.2 });
        const pulse = gsap.to(spark, {
          y: -2,
          scale: 0.85,
          opacity: 0.45,
          duration: 1.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });
        let inView = false;
        const syncMotion = () => {
          if (inView && !document.hidden) {
            sweep.play();
            pulse.play();
          } else {
            sweep.pause();
            pulse.pause();
          }
        };
        const visibility = ScrollTrigger.create({
          trigger: footer,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView = self.isActive;
            syncMotion();
          },
        });
        inView = visibility.isActive;
        syncMotion();
        document.addEventListener("visibilitychange", syncMotion);
        return () =>
          document.removeEventListener("visibilitychange", syncMotion);
      },
      footer,
    );
    return () => media.revert();
  }, []);

  return <span ref={markerRef} className={styles.marker} aria-hidden="true" />;
}
