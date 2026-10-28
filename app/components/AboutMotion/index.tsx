"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useNearViewport from "@/app/hooks/useNearViewport";
import styles from "./AboutMotion.module.css";

export default function AboutMotion() {
  const markerRef = useRef<HTMLSpanElement>(null);
  const near = useNearViewport(markerRef, "15% 0px");

  useEffect(() => {
    if (!near) return;
    const section = markerRef.current?.closest("section");
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const select = gsap.utils.selector(section);
        const tokens = getComputedStyle(section);

        gsap.from(select("[data-about-heading]"), {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.querySelector("[data-about-heading]"),
            start: "top 92%",
            once: true,
          },
        });

        select("[data-about-reveal]").forEach((element: HTMLElement) => {
          gsap.from(element, {
            y: 22,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 96%", once: true },
          });
        });

        gsap.fromTo(
          select("[data-about-word]"),
          {
            color: tokens.getPropertyValue("--color-text-muted").trim(),
          },
          {
            color: tokens.getPropertyValue("--color-text").trim(),
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: section.querySelector("[data-about-copy]"),
              start: "top 90%",
              end: "bottom 58%",
              scrub: true,
            },
          },
        );

        const counters = select("[data-about-count]") as HTMLElement[];
        const originals = counters.map((element) => element.textContent);
        counters.forEach((element) => {
          const value = Number(element.dataset.aboutCount);
          const counter = { value: 0 };
          gsap.to(counter, {
            value,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = String(Math.round(counter.value));
            },
            scrollTrigger: { trigger: element, start: "top 98%", once: true },
          });
        });

        const atmosphere = gsap.timeline({
          paused: true,
          repeat: -1,
          yoyo: true,
        });
        atmosphere.to(
          select("[data-about-rays]"),
          {
            rotation: 5,
            xPercent: -2,
            duration: 12,
            ease: "sine.inOut",
          },
          0,
        );
        atmosphere.to(
          select("[data-about-veil]"),
          {
            xPercent: -3,
            yPercent: 2,
            duration: 12,
            ease: "sine.inOut",
          },
          0,
        );
        let visible = false;
        const syncAtmosphere = () => {
          if (visible && !document.hidden) atmosphere.play();
          else atmosphere.pause();
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          syncAtmosphere();
        });
        observer.observe(section);
        document.addEventListener("visibilitychange", syncAtmosphere);

        return () => {
          observer.disconnect();
          document.removeEventListener("visibilitychange", syncAtmosphere);
          counters.forEach((element, index) => {
            element.textContent = originals[index];
          });
        };
      },
      section,
    );

    return () => media.revert();
  }, [near]);

  return <span className={styles.marker} ref={markerRef} aria-hidden="true" />;
}
