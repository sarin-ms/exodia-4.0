"use client";

// Adapted from React Bits Magnet by David Haz; GSAP drives this site's motion.
// Source and license: THIRD_PARTY_NOTICES.md.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { MagnetProps } from "./Magnet.types";
import styles from "./Magnet.module.css";

export default function Magnet({
  children,
  padding = 48,
  magnetStrength = 6,
  maxOffset = 12,
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        let visible = false;
        const moveX = gsap.quickTo(inner, "x", {
          duration: 0.55,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(inner, "y", {
          duration: 0.55,
          ease: "power3.out",
        });
        const reset = () => {
          moveX(0);
          moveY(0);
        };
        const onMove = (event: PointerEvent) => {
          if (!visible || event.pointerType === "touch") return;
          const rect = wrapper.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const outside = Math.hypot(
            Math.max(0, Math.abs(dx) - rect.width / 2),
            Math.max(0, Math.abs(dy) - rect.height / 2),
          );
          if (outside > padding || wrapper.contains(document.activeElement)) {
            reset();
            return;
          }
          const pull = padding > 0 ? 1 - Math.min(1, outside / padding) : 1;
          const x = (dx / Math.max(1, magnetStrength)) * pull;
          const y = (dy / Math.max(1, magnetStrength)) * pull;
          const limit = Math.min(1, maxOffset / Math.max(1, Math.hypot(x, y)));
          moveX(x * limit);
          moveY(y * limit);
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (!visible) reset();
        });
        observer.observe(wrapper);
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("blur", reset);
        document.documentElement.addEventListener("pointerleave", reset);
        wrapper.addEventListener("focusin", reset);
        return () => {
          observer.disconnect();
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("blur", reset);
          document.documentElement.removeEventListener("pointerleave", reset);
          wrapper.removeEventListener("focusin", reset);
          gsap.killTweensOf(inner);
          gsap.set(inner, { clearProps: "transform" });
        };
      },
      wrapper,
    );
    return () => media.revert();
  }, [padding, magnetStrength, maxOffset]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inner} ref={innerRef}>
        {children}
      </div>
    </div>
  );
}
