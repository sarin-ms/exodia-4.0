"use client";

import { useEffect, useState, type RefObject } from "react";

export default function useNearViewport(
  markerRef: RefObject<HTMLElement | null>,
  rootMargin = "50% 0px",
) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    const target = marker?.closest("section, footer") ?? marker;
    if (!target) return;
    const motionGate = marker?.closest("[data-motion-ready]");
    let readiness: MutationObserver | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin },
    );
    const observeWhenReady = () => {
      if (motionGate?.getAttribute("data-motion-ready") === "false") return;
      readiness?.disconnect();
      observer.observe(target);
    };
    // Geometry can intersect while the page is hidden by the original loading screen.
    if (motionGate?.getAttribute("data-motion-ready") === "false") {
      readiness = new MutationObserver(observeWhenReady);
      readiness.observe(motionGate, {
        attributes: true,
        attributeFilter: ["data-motion-ready"],
      });
    }
    observeWhenReady();
    return () => {
      readiness?.disconnect();
      observer.disconnect();
    };
  }, [markerRef, rootMargin]);

  return near;
}
