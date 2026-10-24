"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useFaqAccordion(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section) return;

    const items = Array.from(
      root.querySelectorAll<HTMLDetailsElement>("[data-faq-item]"),
    );
    const desired = new Map(items.map((item) => [item, item.open]));
    const animations = new Map<HTMLDetailsElement, gsap.core.Timeline>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setExpanded = (item: HTMLDetailsElement, expanded: boolean) => {
      const panel = item.querySelector<HTMLElement>("[data-faq-answer]");
      const copy = item.querySelector<HTMLElement>("[data-faq-copy]");
      const icon = item.querySelector<HTMLElement>("[data-faq-icon]");
      if (!panel || !copy || !icon) return;

      animations.get(item)?.kill();
      animations.delete(item);
      desired.set(item, expanded);
      item.dataset.faqOpen = String(expanded);

      if (reducedMotion.matches) {
        item.open = expanded;
        gsap.set([panel, copy, icon], { clearProps: "all" });
        return;
      }

      const wasOpen = item.open;
      const height = wasOpen ? panel.getBoundingClientRect().height : 0;
      item.open = true;
      gsap.set(panel, { height, overflow: "hidden" });
      if (expanded && !wasOpen) gsap.set(copy, { opacity: 0, y: 8 });

      const timeline = gsap.timeline({
        onComplete: () => {
          if (desired.get(item) !== expanded) return;
          item.open = expanded;
          gsap.set([panel, copy, icon], { clearProps: "all" });
          animations.delete(item);
        },
      });
      timeline
        .to(
          panel,
          {
            height: expanded ? "auto" : 0,
            duration: 0.46,
            ease: "power3.inOut",
          },
          0,
        )
        .to(
          copy,
          {
            opacity: expanded ? 1 : 0,
            y: expanded ? 0 : -4,
            duration: expanded ? 0.35 : 0.18,
            ease: "power2.out",
          },
          expanded ? 0.1 : 0,
        )
        .fromTo(
          icon,
          { scaleY: expanded ? 1 : 0 },
          { scaleY: expanded ? 0 : 1, duration: 0.3, ease: "power2.inOut" },
          0,
        );
      animations.set(item, timeline);
    };

    const cleanups = items.map((item) => {
      const summary = item.querySelector("summary");
      const onClick = (event: MouseEvent) => {
        event.preventDefault();
        const expanded = !desired.get(item);
        items.forEach((other) => {
          if (other !== item && desired.get(other)) setExpanded(other, false);
        });
        setExpanded(item, expanded);
      };
      summary?.addEventListener("click", onClick);
      return () => summary?.removeEventListener("click", onClick);
    });

    const onMotionChange = () => {
      if (!reducedMotion.matches) return;
      items.forEach((item) => setExpanded(item, desired.get(item) ?? false));
    };
    reducedMotion.addEventListener("change", onMotionChange);

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(section.querySelectorAll("[data-faq-heading]"), {
          yPercent: 110,
          rotation: 2,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
        gsap.from(section.querySelectorAll("[data-faq-reveal]"), {
          y: 14,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
        gsap.from(items, {
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 90%", once: true },
        });
        gsap.fromTo(
          section.querySelectorAll("[data-faq-spark]"),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.25,
            stagger: 0.2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: section, start: "top 65%", once: true },
          },
        );
      },
      section,
    );

    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const glow = root.querySelector<HTMLElement>("[data-faq-spotlight]");
        if (!glow) return;
        gsap.set(glow, { xPercent: -50, yPercent: -50 });
        const moveX = gsap.quickTo(glow, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(glow, "y", {
          duration: 0.5,
          ease: "power3.out",
        });
        const onMove = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          moveX(event.clientX - rect.left);
          moveY(event.clientY - rect.top);
        };
        const onEnter = (event: PointerEvent) => {
          onMove(event);
          gsap.to(glow, { opacity: 1, duration: 0.3, overwrite: "auto" });
        };
        const onLeave = () => {
          gsap.to(glow, { opacity: 0, duration: 0.4, overwrite: "auto" });
        };
        root.addEventListener("pointerenter", onEnter);
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        return () => {
          root.removeEventListener("pointerenter", onEnter);
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
          gsap.killTweensOf(glow);
          gsap.set(glow, { clearProps: "all" });
        };
      },
      root,
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      reducedMotion.removeEventListener("change", onMotionChange);
      animations.forEach((animation) => animation.kill());
      items.forEach((item) => {
        item.open = desired.get(item) ?? false;
        gsap.set(
          item.querySelectorAll(
            "[data-faq-answer], [data-faq-copy], [data-faq-icon]",
          ),
          { clearProps: "all" },
        );
      });
      media.revert();
    };
  }, [rootRef]);
}
