"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Lane {
  element: HTMLOListElement;
  cards: HTMLElement[];
  phase: number;
  step: number;
  cycle: number;
  scrollPosition: number;
  scrollDirection: number;
  scrollLimit: number;
  scrollInitialized: boolean;
}

export default function useGlimpsesGallery(
  rootRef: RefObject<HTMLDivElement | null>,
  open: boolean,
) {
  const openRef = useRef(open);
  const draggedUntil = useRef(0);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const root = rootRef.current;
    const scene = root?.querySelector<HTMLElement>("[data-gallery-scene]");
    if (!root || !scene) return;
    const lanes: Lane[] = Array.from(
      root.querySelectorAll<HTMLOListElement>("[data-gallery-row]"),
    ).map((element, row) => ({
      element,
      cards: Array.from(
        element.querySelectorAll<HTMLElement>("[data-glimpse-card]"),
      ),
      phase: 0,
      step: 1,
      cycle: 1,
      scrollPosition: 0,
      scrollDirection: row === 0 ? 1 : -1,
      scrollLimit: 0,
      scrollInitialized: false,
    }));
    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("[data-glimpse-link]"),
    );
    const enhancedMedia = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const tweens = new Set<gsap.core.Tween>();
    const touches = new Set<number>();
    let enhanced = false;
    let nativeAuto = false;
    let nativeBusyUntil = 0;
    let inView = false;
    let hovering =
      hoverMedia.matches && links.some((link) => link.matches(":hover"));
    let keyboardFocused = false;
    let drag: {
      id: number;
      x: number;
      y: number;
      phases: number[];
      moved: boolean;
      lastX: number;
      lastTime: number;
      velocity: number;
    } | null = null;

    gsap.registerPlugin(ScrollTrigger);
    const reveals = gsap.matchMedia();
    reveals.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const header = root
          .closest("section")
          ?.querySelector("[data-glimpses-reveal]");
        if (header)
          gsap.from(header, {
            y: 20,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: header, start: "top 94%", once: true },
          });
      },
      root,
    );

    const wrap = (position: number, cycle: number) =>
      ((((position + cycle / 2) % cycle) + cycle) % cycle) - cycle / 2;
    const render = () => {
      if (!enhanced) return;
      const halfWidth = scene.clientWidth / 2;
      lanes.forEach((lane, row) => {
        lane.cards.forEach((card, index) => {
          const x = wrap(
            (index - (lane.cards.length - 1) / 2) * lane.step + lane.phase,
            lane.cycle,
          );
          const normal = Math.max(-1.4, Math.min(1.4, x / halfWidth));
          const bow = normal * normal;
          const y = (row === 0 ? -32 : 32) * bow;
          const z = -105 * bow;
          card.style.transform = `translate3d(${x - card.offsetWidth / 2}px, ${y - card.offsetHeight / 2}px, ${z}px) rotateX(${row === 0 ? -7 : 7}deg) rotateY(${-normal * 22}deg) rotateZ(${normal * (row === 0 ? -1.8 : 1.8)}deg)`;
        });
      });
    };
    const stopTweens = () => {
      tweens.forEach((tween) => tween.kill());
      tweens.clear();
    };
    const animateLane = (lane: Lane, phase: number) => {
      const tween = gsap.to(lane, {
        phase,
        duration: 0.75,
        ease: "power3.out",
        onUpdate: render,
        onComplete: () => {
          tweens.delete(tween);
        },
      });
      tweens.add(tween);
    };
    const measure = () => {
      if (!enhanced) {
        lanes.forEach((lane, row) => {
          lane.scrollLimit = Math.max(
            0,
            lane.element.scrollWidth - lane.element.clientWidth,
          );
          if (nativeAuto && !lane.scrollInitialized) {
            lane.element.scrollLeft = row === 0 ? 0 : lane.scrollLimit;
            lane.scrollInitialized = true;
          }
          lane.scrollPosition = lane.element.scrollLeft;
        });
        return;
      }
      const gap =
        Number.parseFloat(
          getComputedStyle(root).getPropertyValue("--photo-gap"),
        ) || 24;
      lanes.forEach((lane, row) => {
        const oldStep = lane.step;
        lane.step = (lane.cards[0]?.offsetWidth || 280) + gap;
        lane.phase =
          oldStep === 1
            ? row === 1
              ? lane.step * 0.5
              : 0
            : (lane.phase * lane.step) / oldStep;
        lane.cycle = lane.step * lane.cards.length;
      });
      render();
    };
    const configure = () => {
      stopTweens();
      enhanced = enhancedMedia.matches;
      nativeAuto = !enhanced && !reducedMotion.matches;
      hovering =
        hoverMedia.matches && links.some((link) => link.matches(":hover"));
      if (nativeAuto) root.dataset.galleryNativeAuto = "true";
      else delete root.dataset.galleryNativeAuto;
      if (enhanced) {
        root.dataset.galleryEnhanced = "true";
      } else {
        delete root.dataset.galleryEnhanced;
        lanes.forEach((lane) =>
          lane.cards.forEach((card) => card.style.removeProperty("transform")),
        );
      }
      measure();
    };
    const tick = (_time: number, delta: number) => {
      if (
        !inView ||
        document.hidden ||
        openRef.current ||
        (hoverMedia.matches && hovering) ||
        keyboardFocused ||
        touches.size ||
        drag ||
        tweens.size
      )
        return;
      const seconds = Math.min(delta, 40) / 1000;
      if (enhanced) {
        lanes.forEach((lane, row) => {
          lane.phase += (row === 0 ? -36 : 28) * seconds;
        });
        render();
      } else if (nativeAuto && performance.now() >= nativeBusyUntil) {
        lanes.forEach((lane, row) => {
          if (!lane.scrollLimit) return;
          lane.scrollPosition +=
            (row === 0 ? 36 : 28) * lane.scrollDirection * seconds;
          if (lane.scrollPosition >= lane.scrollLimit) {
            lane.scrollPosition = lane.scrollLimit;
            lane.scrollDirection = -1;
          } else if (lane.scrollPosition <= 0) {
            lane.scrollPosition = 0;
            lane.scrollDirection = 1;
          }
          lane.element.scrollLeft = lane.scrollPosition;
        });
      }
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      keyboardFocused =
        target instanceof Element &&
        target.matches("[data-glimpse-link]:focus-visible");
      if (!enhanced || !keyboardFocused || !(target instanceof Element)) return;
      const card = target.closest<HTMLElement>("[data-glimpse-card]");
      if (!card) return;
      const lane = lanes.find((lane) => lane.cards.includes(card));
      if (!lane) return;
      stopTweens();
      const index = lane.cards.indexOf(card);
      const x = wrap(
        (index - (lane.cards.length - 1) / 2) * lane.step + lane.phase,
        lane.cycle,
      );
      animateLane(lane, lane.phase - x);
    };
    const onBlur = (event: FocusEvent) => {
      keyboardFocused =
        event.relatedTarget instanceof Element &&
        root.contains(event.relatedTarget) &&
        event.relatedTarget.matches("[data-glimpse-link]:focus-visible");
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        openRef.current ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
      )
        return;
      const index = links.indexOf(event.target as HTMLAnchorElement);
      if (index < 0) return;
      event.preventDefault();
      const target =
        links[
          (index + (event.key === "ArrowRight" ? 1 : -1) + links.length) %
            links.length
        ];
      target.focus({ preventScroll: true });
      if (!enhanced)
        target.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !hoverMedia.matches) return;
      hovering = true;
      stopTweens();
    };
    const onLeave = () => {
      hovering = false;
    };
    const onPointerDown = (event: PointerEvent) => {
      keyboardFocused = false;
      if (
        !enhanced ||
        event.button !== 0 ||
        event.pointerType === "touch" ||
        !(event.target instanceof Element) ||
        !event.target.closest("[data-glimpse-link]")
      )
        return;
      stopTweens();
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        phases: lanes.map((lane) => lane.phase),
        moved: false,
        lastX: event.clientX,
        lastTime: performance.now(),
        velocity: 0,
      };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 6) return;
      if (!drag.moved && Math.abs(event.clientY - drag.y) > Math.abs(dx)) {
        drag = null;
        return;
      }
      if (!drag.moved) {
        drag.moved = true;
        scene.setPointerCapture(event.pointerId);
        root.dataset.galleryDragging = "true";
      }
      if (event.cancelable) event.preventDefault();
      const now = performance.now();
      drag.velocity =
        0.6 * drag.velocity +
        (0.4 * (event.clientX - drag.lastX)) / Math.max(1, now - drag.lastTime);
      drag.lastX = event.clientX;
      drag.lastTime = now;
      lanes.forEach((lane, row) => {
        lane.phase = drag!.phases[row] + dx * (row === 0 ? 1 : 0.9);
      });
      render();
    };
    const endDrag = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest("[data-glimpse-link]");
      hovering = !!target && scene.contains(target);
      if (drag.moved) {
        draggedUntil.current = performance.now() + 350;
        const momentum = Math.max(-180, Math.min(180, drag.velocity * 140));
        if (!hovering)
          lanes.forEach((lane, row) =>
            animateLane(lane, lane.phase + momentum * (row === 0 ? 1 : 0.9)),
          );
      }
      if (scene.hasPointerCapture(event.pointerId))
        scene.releasePointerCapture(event.pointerId);
      drag = null;
      delete root.dataset.galleryDragging;
    };
    const onNativeDrag = (event: DragEvent) => {
      if (enhanced) event.preventDefault();
    };
    const onWheel = (event: WheelEvent) => {
      if (!enhanced || Math.abs(event.deltaX) < 1) return;
      stopTweens();
      lanes.forEach((lane, row) => {
        lane.phase -= event.deltaX * (row === 0 ? 1 : 0.9);
      });
      render();
    };
    const syncNativePosition = () => {
      lanes.forEach((lane) => {
        lane.scrollPosition = lane.element.scrollLeft;
      });
      nativeBusyUntil = performance.now() + 180;
    };
    const onTouchStart = (event: TouchEvent) => {
      if (!nativeAuto) return;
      keyboardFocused = false;
      hovering = false;
      for (const touch of Array.from(event.changedTouches))
        touches.add(touch.identifier);
      syncNativePosition();
    };
    const onTouchEnd = (event: TouchEvent) => {
      let handled = false;
      for (const touch of Array.from(event.changedTouches))
        handled = touches.delete(touch.identifier) || handled;
      if (handled) syncNativePosition();
    };
    const nativeScrollCleanups = lanes.map((lane) => {
      const onScroll = () => {
        if (!nativeAuto) return;
        // Ignore our own fractional scroll writes; let a user's swipe and momentum finish.
        if (
          touches.size ||
          Math.abs(lane.element.scrollLeft - lane.scrollPosition) > 1
        )
          syncNativePosition();
      };
      lane.element.addEventListener("scroll", onScroll, { passive: true });
      return () => lane.element.removeEventListener("scroll", onScroll);
    });
    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (entry.isIntersecting)
          scene.querySelectorAll("img").forEach((image) => {
            image.loading = "eager";
          });
      },
      { threshold: 0 },
    );
    const resize = new ResizeObserver(measure);
    configure();
    intersection.observe(scene);
    resize.observe(scene);
    gsap.ticker.add(tick);
    enhancedMedia.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);
    hoverMedia.addEventListener("change", configure);
    root.addEventListener("focusin", onFocus);
    root.addEventListener("focusout", onBlur);
    root.addEventListener("keydown", onKey);
    links.forEach((link) => {
      link.addEventListener("pointerenter", onEnter);
      link.addEventListener("pointerleave", onLeave);
    });
    scene.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    scene.addEventListener("dragstart", onNativeDrag);
    scene.addEventListener("wheel", onWheel, { passive: true });
    scene.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      stopTweens();
      gsap.ticker.remove(tick);
      intersection.disconnect();
      resize.disconnect();
      enhancedMedia.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
      hoverMedia.removeEventListener("change", configure);
      nativeScrollCleanups.forEach((cleanup) => cleanup());
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("focusout", onBlur);
      root.removeEventListener("keydown", onKey);
      links.forEach((link) => {
        link.removeEventListener("pointerenter", onEnter);
        link.removeEventListener("pointerleave", onLeave);
      });
      scene.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      scene.removeEventListener("dragstart", onNativeDrag);
      scene.removeEventListener("wheel", onWheel);
      scene.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      lanes.forEach((lane) =>
        lane.cards.forEach((card) => card.style.removeProperty("transform")),
      );
      delete root.dataset.galleryEnhanced;
      delete root.dataset.galleryNativeAuto;
      delete root.dataset.galleryDragging;
      reveals.revert();
    };
  }, [rootRef]);

  const suppressClick = useCallback(
    () => performance.now() < draggedUntil.current,
    [],
  );
  return { suppressClick };
}
