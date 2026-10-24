"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./StacksMotion.module.css";

const READING_TIME = 6.5;

export default function StacksMotion() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = markerRef.current?.closest("section");
    if (!section) return;
    const book = section.querySelector<HTMLElement>("[data-book]");
    const shell = section.querySelector<HTMLElement>("[data-spellbook]");
    const spreads = Array.from(section.querySelectorAll<HTMLElement>("[data-book-spread]"));
    const choices = Array.from(section.querySelectorAll<HTMLInputElement>('input[name="stack-chapter"]'));
    const chapters = section.querySelector<HTMLElement>("[data-book-chapters]");
    const leaf = section.querySelector<HTMLElement>("[data-book-leaf]");
    const shadow = section.querySelector<HTMLElement>("[data-book-shadow]");
    const slices = Array.from(section.querySelectorAll<HTMLElement>("[data-book-slice]"));
    const fronts = Array.from(section.querySelectorAll<HTMLElement>("[data-slice-front] [data-slice-content]"));
    const backs = Array.from(section.querySelectorAll<HTMLElement>("[data-slice-back] [data-slice-content]"));
    const previous = section.querySelector<HTMLButtonElement>('[data-book-step="-1"]');
    const next = section.querySelector<HTMLButtonElement>('[data-book-step="1"]');
    const status = section.querySelector<HTMLElement>("[data-book-status]");
    const autoplay = section.querySelector<HTMLButtonElement>("[data-book-auto]");
    const autoIcon = section.querySelector<HTMLElement>("[data-auto-icon]");
    const autoLabel = section.querySelector<HTMLElement>("[data-auto-label]");
    const progress = section.querySelector<HTMLElement>("[data-book-progress]");
    if (!book || !shell || !leaf || !shadow || !chapters || !previous || !next || !status || !autoplay || !autoIcon || !autoLabel || !progress || !slices.length || fronts.length !== slices.length || backs.length !== slices.length || spreads.length !== choices.length) return;

    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      section.querySelectorAll<HTMLElement>("[data-book-reveal]").forEach((element, index) => {
        gsap.from(element, {
          y: 18, opacity: 0, duration: 0.85, delay: Math.min(index * 0.09, 0.18), ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 97%", once: true },
        });
      });
    }, section);

    let current = Math.max(0, choices.findIndex(choice => choice.checked));
    let transition: gsap.core.Timeline | null = null;
    let clock: gsap.core.Tween | null = null;
    let progressTween: gsap.core.Tween | null = null;
    let userPaused = reducedMotion.matches;
    let inView = false;
    let hovering = false;
    let focused = false;
    let touching = false;
    let disposed = false;

    const updateControls = (index: number, announce: boolean) => {
      previous.disabled = index === 0;
      next.disabled = index === choices.length - 1;
      status.setAttribute("aria-live", announce ? "polite" : "off");
      status.textContent = `${String(index + 1).padStart(2, "0")} / ${String(choices.length).padStart(2, "0")}`;
      status.setAttribute("aria-label", `Chapter ${index + 1} of ${choices.length}: ${spreads[index].querySelector("h3")?.textContent}`);
    };
    const stopClock = () => {
      clock?.kill();
      progressTween?.kill();
      clock = null;
      progressTween = null;
      gsap.set(progress, { scaleX: 0 });
      section.dataset.autoRunning = "false";
    };
    const scheduleTurn = () => {
      stopClock();
      if (disposed) return;
      autoplay.setAttribute("aria-pressed", String(!userPaused));
      autoplay.setAttribute("aria-label", userPaused ? "Start automatic page turns" : "Pause automatic page turns");
      autoIcon.textContent = userPaused ? "▶" : "Ⅱ";
      autoLabel.textContent = userPaused ? "Paused" : "Auto turn";
      if (userPaused || !inView || hovering || focused || touching || document.hidden || transition) return;
      section.dataset.autoRunning = "true";
      progressTween = gsap.to(progress, { scaleX: 1, duration: READING_TIME, ease: "none" });
      clock = gsap.delayedCall(READING_TIME, () => {
        clock = null;
        turnTo((current + 1) % choices.length, false);
      });
    };

    const copyPage = (element: HTMLElement, isDesktop: boolean) => {
      const copy = element.cloneNode(true) as HTMLElement;
      copy.removeAttribute("id");
      copy.removeAttribute("aria-labelledby");
      copy.removeAttribute("data-book-spread");
      copy.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      copy.setAttribute("aria-hidden", "true");
      copy.inert = true;
      if (!isDesktop) {
        copy.style.display = "flex";
        copy.style.height = "100%";
        copy.style.minHeight = "0";
      }
      copy.querySelectorAll("img").forEach(image => { image.loading = "eager"; });
      return copy;
    };

    const turnTo = (index: number, announce = true) => {
      if (index < 0 || index >= choices.length || disposed) return;
      transition?.progress(1);
      stopClock();
      if (index === current) {
        scheduleTurn();
        return;
      }
      const old = spreads[current];
      const incoming = spreads[index];
      const forward = index > current;
      const direction = forward ? 1 : -1;
      const isDesktop = desktop.matches;
      choices[index].checked = true;
      updateControls(index, announce);
      if (reducedMotion.matches) {
        current = index;
        scheduleTurn();
        return;
      }

      const oldPage = isDesktop ? old.querySelector<HTMLElement>(forward ? "[data-book-right]" : "[data-book-left]") : old;
      const newPage = isDesktop ? incoming.querySelector<HTMLElement>(forward ? "[data-book-left]" : "[data-book-right]") : incoming;
      if (!oldPage || !newPage) return;
      const activeSlices = slices.slice(0, isDesktop ? slices.length : 6);
      const pageWidth = book.clientWidth / (isDesktop ? 2 : 1);
      const sliceWidth = pageWidth / activeSlices.length;
      const height = book.clientHeight;
      // Each strip samples the same full-size page; its hinge follows the paper's curve.
      slices.forEach((slice, i) => { slice.style.display = i < activeSlices.length ? "block" : "none"; });
      activeSlices.forEach((slice, i) => {
        slice.style.width = `${sliceWidth + 0.7}px`;
        slice.style.left = forward ? "0px" : `${-sliceWidth - 0.7}px`;
        slice.style.transformOrigin = forward ? "left center" : "right center";
        fronts[i].style.width = `${pageWidth}px`;
        fronts[i].style.left = `${-(forward ? i : activeSlices.length - 1 - i) * sliceWidth}px`;
        backs[i].style.width = `${pageWidth}px`;
        backs[i].style.left = `${-(forward ? activeSlices.length - 1 - i : i) * sliceWidth}px`;
        fronts[i].replaceChildren(copyPage(oldPage, isDesktop));
        backs[i].replaceChildren(copyPage(newPage, isDesktop));
      });
      old.setAttribute("aria-hidden", "true");
      old.inert = true;
      if (isDesktop) {
        old.style.display = "grid";
        old.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
      } else {
        old.style.display = "flex";
        old.style.position = "absolute";
        old.style.inset = "0";
      }
      old.style.zIndex = "2";
      incoming.style.zIndex = "1";
      leaf.style.left = isDesktop ? "50%" : forward ? "0%" : "100%";
      leaf.style.width = `${pageWidth}px`;
      leaf.style.height = `${height}px`;
      shadow.style.left = forward ? "0%" : "50%";
      shadow.style.transformOrigin = forward ? "right center" : "left center";
      shadow.style.background = forward ? "" : "linear-gradient(90deg, var(--book-ink), transparent)";
      section.dataset.bookTurning = "true";
      const state = { progress: 0 };
      const renderCurve = () => {
        const p = state.progress;
        const bend = Math.sin(Math.PI * p);
        let x = 0;
        let z = 0;
        activeSlices.forEach((slice, i) => {
          const alongPage = (i + 0.5) / activeSlices.length;
          const angle = -direction * (180 * p + 42 * bend * (alongPage - 0.18));
          const radians = angle * Math.PI / 180;
          slice.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`;
          slice.style.setProperty("--bend-shade", String(Math.abs(Math.sin(radians)) * 0.22));
          x += direction * sliceWidth * Math.cos(radians);
          z -= direction * sliceWidth * Math.sin(radians);
        });
        shadow.style.opacity = String(bend * 0.28);
        shadow.style.transform = `scaleX(${0.15 + bend * 0.85})`;
      };
      const finish = () => {
        leaf.hidden = true;
        fronts.forEach(front => front.replaceChildren());
        backs.forEach(back => back.replaceChildren());
        slices.forEach(slice => slice.removeAttribute("style"));
        leaf.removeAttribute("style");
        shadow.removeAttribute("style");
        old.style.removeProperty("display");
        old.style.removeProperty("grid-template-columns");
        old.style.removeProperty("position");
        old.style.removeProperty("inset");
        old.style.removeProperty("z-index");
        incoming.style.removeProperty("z-index");
        oldPage.style.removeProperty("visibility");
        old.removeAttribute("aria-hidden");
        old.inert = false;
        delete section.dataset.bookTurning;
        current = index;
        transition = null;
        if (!isDesktop) ScrollTrigger.refresh();
        scheduleTurn();
      };
      renderCurve();
      const pending = gsap.timeline({ paused: true, onComplete: finish });
      transition = pending;
      pending.to(state, { progress: 1, duration: isDesktop ? 1.65 : 1.25, ease: "power2.inOut", onUpdate: renderCurve });
      const copiedImages = [...fronts, ...backs].flatMap(face => Array.from(face.querySelectorAll<HTMLImageElement>("img")));
      void Promise.allSettled(copiedImages.map(image => image.decode())).then(() => {
        if (disposed || transition !== pending) return;
        oldPage.style.visibility = "hidden";
        leaf.hidden = false;
        pending.play();
      });
    };

    const selectedIndex = () => choices.findIndex(choice => choice.checked);
    const onChoice = (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const index = choices.indexOf(event.target);
        if (index >= 0) turnTo(index);
      }
    };
    const onPrevious = () => turnTo(selectedIndex() - 1);
    const onNext = () => turnTo(selectedIndex() + 1);
    const onToggleAuto = () => { userPaused = !userPaused; scheduleTurn(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        turnTo(selectedIndex() + (event.key === "ArrowRight" ? 1 : -1));
      }
    };
    const onEnter = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovering = true; scheduleTurn(); } };
    const onLeave = () => { hovering = false; scheduleTurn(); };
    const blocksPlayback = (target: EventTarget | null) => target instanceof Node && target !== section && target !== autoplay && section.contains(target);
    const onFocusIn = (event: FocusEvent) => { focused = blocksPlayback(event.target); scheduleTurn(); };
    const onFocusOut = (event: FocusEvent) => { focused = blocksPlayback(event.relatedTarget); scheduleTurn(); };
    let pointerStart: { x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" && event.isPrimary) {
        pointerStart = { x: event.clientX, y: event.clientY };
        touching = true;
        scheduleTurn();
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      touching = false;
      if (pointerStart) {
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        pointerStart = null;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          turnTo(selectedIndex() + (dx < 0 ? 1 : -1));
          return;
        }
      }
      scheduleTurn();
    };
    const cancelPointer = () => { pointerStart = null; touching = false; scheduleTurn(); };
    const completeTurn = () => { transition?.progress(1); };
    const onVisibility = () => { if (document.hidden) completeTurn(); scheduleTurn(); };
    const onPreference = () => { completeTurn(); if (reducedMotion.matches) userPaused = true; scheduleTurn(); };
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (!inView) completeTurn();
      if (entry.isIntersecting) book.querySelectorAll("img").forEach(image => { image.loading = "eager"; });
      scheduleTurn();
    }, { threshold: [0, 0.5] });
    visibility.observe(shell);
    chapters.addEventListener("change", onChoice);
    previous.addEventListener("click", onPrevious);
    next.addEventListener("click", onNext);
    autoplay.addEventListener("click", onToggleAuto);
    section.addEventListener("keydown", onKey);
    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("focusout", onFocusOut);
    shell.addEventListener("pointerenter", onEnter);
    shell.addEventListener("pointerleave", onLeave);
    book.addEventListener("pointerdown", onPointerDown);
    book.addEventListener("pointerup", onPointerUp);
    book.addEventListener("pointercancel", cancelPointer);
    window.addEventListener("resize", completeTurn);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onPreference);
    section.dataset.bookReady = "true";
    updateControls(current, false);
    scheduleTurn();

    return () => {
      disposed = true;
      completeTurn();
      stopClock();
      visibility.disconnect();
      chapters.removeEventListener("change", onChoice);
      previous.removeEventListener("click", onPrevious);
      next.removeEventListener("click", onNext);
      autoplay.removeEventListener("click", onToggleAuto);
      section.removeEventListener("keydown", onKey);
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("focusout", onFocusOut);
      shell.removeEventListener("pointerenter", onEnter);
      shell.removeEventListener("pointerleave", onLeave);
      book.removeEventListener("pointerdown", onPointerDown);
      book.removeEventListener("pointerup", onPointerUp);
      book.removeEventListener("pointercancel", cancelPointer);
      window.removeEventListener("resize", completeTurn);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onPreference);
      delete section.dataset.bookReady;
      delete section.dataset.autoRunning;
      media.revert();
    };
  }, []);

  return <span className={styles.marker} ref={markerRef} aria-hidden="true" />;
}
