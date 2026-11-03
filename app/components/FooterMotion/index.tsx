"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useNearViewport from "@/app/hooks/useNearViewport";
import styles from "./FooterMotion.module.css";

export default function FooterMotion() {
  const markerRef = useRef<HTMLSpanElement>(null);
  const near = useNearViewport(markerRef);

  useEffect(() => {
    if (!near) return;
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
      },
      footer,
    );
    return () => media.revert();
  }, [near]);

  return <span ref={markerRef} className={styles.marker} aria-hidden="true" />;
}
