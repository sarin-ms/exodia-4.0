"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./StacksMotion.module.css";

const CHAPTER_HOLD = 0.6;
const PAGE_TURN = 1;

export default function StacksMotion() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = markerRef.current?.closest("section");
    if (!section) return;
    const book = section.querySelector<HTMLElement>("[data-book]");
    const stage = section.querySelector<HTMLElement>("[data-book-stage]");
    const shell = section.querySelector<HTMLElement>("[data-spellbook]");
    const spreads = Array.from(
      section.querySelectorAll<HTMLElement>("[data-book-spread]"),
    );
    const choices = Array.from(
      section.querySelectorAll<HTMLAnchorElement>("[data-book-choice]"),
    );
    const shadow = section.querySelector<HTMLElement>("[data-book-shadow]");
    const curlShadow = section.querySelector<HTMLElement>(
      "[data-book-curl-shadow]",
    );
    const curlShadowBand = section.querySelector<HTMLElement>(
      "[data-book-curl-shadow-band]",
    );
    const ribbon = section.querySelector<HTMLElement>("[data-book-ribbon]");
    const ribbonBody = section.querySelector<SVGPathElement>("[data-book-ribbon-body]");
    const ribbonWeave = section.querySelector<SVGPathElement>("[data-book-ribbon-weave]");
    const ribbonEdge = section.querySelector<SVGPathElement>("[data-book-ribbon-edge]");
    const turns = Array.from(
      section.querySelectorAll<HTMLElement>("[data-book-leaf]"),
    ).map((leaf) => ({
      leaf,
      slices: Array.from(
        leaf.querySelectorAll<HTMLElement>("[data-book-slice]"),
      ),
      fronts: Array.from(
        leaf.querySelectorAll<HTMLElement>(
          "[data-slice-front] [data-slice-content]",
        ),
      ),
      backs: Array.from(
        leaf.querySelectorAll<HTMLElement>(
          "[data-slice-back] [data-slice-content]",
        ),
      ),
      frontShades: Array.from(
        leaf.querySelectorAll<HTMLElement>("[data-slice-front-shade]"),
      ),
      backShades: Array.from(
        leaf.querySelectorAll<HTMLElement>("[data-slice-back-shade]"),
      ),
    }));
    if (
      !book ||
      !stage ||
      !shell ||
      !shadow ||
      !curlShadow ||
      !curlShadowBand ||
      !ribbon ||
      !ribbonBody ||
      !ribbonWeave ||
      !ribbonEdge ||
      spreads.length < 2 ||
      spreads.length !== choices.length ||
      turns.length !== spreads.length - 1 ||
      turns.some(
        (turn) =>
          !turn.slices.length ||
          turn.fronts.length !== turn.slices.length ||
          turn.backs.length !== turn.slices.length ||
          turn.frontShades.length !== turn.slices.length * 2 ||
          turn.backShades.length !== turn.slices.length * 2,
      )
    )
      return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let disposed = false;
    let viewportWidth = document.documentElement.clientWidth;
    const resize = new ResizeObserver(() => {
      const width = document.documentElement.clientWidth;
      if (width === viewportWidth) return;
      viewportWidth = width;
      ScrollTrigger.refresh();
    });
    resize.observe(document.documentElement);

    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        book.querySelectorAll("img").forEach((image) => {
          image.loading = "eager";
        });
        preload.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    preload.observe(section);

    media.add(
      {
        reducedMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 900px)",
        mobile: "(max-width: 899px)",
      },
      (context) => {
        if (context.conditions?.reducedMotion) return;
        const isDesktop = Boolean(context.conditions?.desktop);
        // Each strip clones both page faces and updates five styles during a turn.
        const sliceCount = isDesktop ? 8 : 6;
        const duration =
          spreads.length * CHAPTER_HOLD + (spreads.length - 1) * PAGE_TURN;
        const preparedTurns = turns.map((turn) => ({
          ...turn,
          activeSlices: turn.slices.slice(0, sliceCount),
        }));
        const pages = spreads.map((spread) =>
          spread.querySelector<HTMLElement>("[data-book-right]"),
        );
        let scene = -1;
        let selectedChapter = -1;
        let sliceWidth = 0;
        let pageWidth = 0;
        let stageOffset = 0;
        let stageBottom = 0;
        let ribbonProgress = -1;
        let ribbonWidth = 14;
        let ribbonLength = 44;
        const restingRibbon = ribbonBody.getAttribute("d");
        const restingRibbonEdge = ribbonEdge.getAttribute("d");

        const selectChapter = (index: number) => {
          if (selectedChapter === index) return;
          selectedChapter = index;
          choices.forEach((choice, i) => {
            if (i === index) choice.setAttribute("aria-current", "true");
            else choice.removeAttribute("aria-current");
          });
          spreads.forEach((spread, i) => {
            spread.setAttribute("aria-hidden", String(i !== index));
            spread.inert = i !== index;
          });
        };

        const copyPage = (element: HTMLElement, showThrough = false) => {
          const copy = element.cloneNode(true) as HTMLElement;
          copy.removeAttribute("id");
          copy.removeAttribute("aria-labelledby");
          copy.removeAttribute("data-book-spread");
          copy.removeAttribute("style");
          copy
            .querySelectorAll("[id]")
            .forEach((node) => node.removeAttribute("id"));
          copy.setAttribute("aria-hidden", "true");
          copy.inert = true;
          copy.style.visibility = "visible";
          if (showThrough) copy.dataset.bookShowthrough = "true";
          if (!isDesktop) {
            copy.style.display = "flex";
            copy.style.height = "100%";
            copy.style.minHeight = "0";
          }
          copy.querySelectorAll("img").forEach((image) => {
            image.loading = "eager";
          });
          return copy;
        };

        section.dataset.bookReady = "true";
        // Stable viewport units keep mobile browser chrome from changing the scroll distance.
        section.style.setProperty(
          "--book-scroll-distance",
          `${(spreads.length - 1) * 135}svh`,
        );

        // Build both leaves once. Scrolling only changes transforms and visibility.
        preparedTurns.forEach((turn, index) => {
          const oldPage = isDesktop ? pages[index] : spreads[index];
          const newPage = isDesktop
            ? spreads[index + 1].querySelector<HTMLElement>("[data-book-left]")
            : spreads[index + 1];
          if (!oldPage || !newPage) return;
          turn.slices.forEach((slice, i) => {
            slice.style.display = i < sliceCount ? "block" : "none";
            slice.style.left = "0px";
            slice.style.transformOrigin = "left center";
          });
          turn.activeSlices.forEach((_, i) => {
            turn.fronts[i].replaceChildren(copyPage(oldPage));
            turn.backs[i].replaceChildren(
              copyPage(isDesktop ? newPage : oldPage, !isDesktop),
            );
          });
        });

        const measure = () => {
          ribbonWidth = ribbon.offsetWidth;
          ribbonLength = ribbon.offsetHeight;
          ribbonProgress = -1;
          const stageHeight = stage.offsetHeight;
          const stageTop = Math.min(0, window.innerHeight - stageHeight);
          stageOffset = -stageTop;
          stageBottom = stageHeight + stageTop;
          section.style.setProperty("--book-stage-height", `${stageHeight}px`);
          section.style.setProperty("--book-stage-top", `${stageTop}px`);
          pageWidth = book.clientWidth / (isDesktop ? 2 : 1);
          const pageHeight = book.clientHeight;
          sliceWidth = pageWidth / sliceCount;
          preparedTurns.forEach((turn) => {
            turn.leaf.style.left = isDesktop ? "50%" : "0%";
            turn.leaf.style.width = `${pageWidth}px`;
            turn.leaf.style.height = `${pageHeight}px`;
            turn.activeSlices.forEach((slice, i) => {
              slice.style.width = `${sliceWidth + 0.7}px`;
              turn.fronts[i].style.width = `${pageWidth}px`;
              turn.fronts[i].style.left = `${-i * sliceWidth}px`;
              turn.backs[i].style.width = `${pageWidth}px`;
              turn.backs[i].style.left =
                `${-(sliceCount - 1 - i) * sliceWidth}px`;
            });
          });
        };

        const setScene = (chapter: number, turning: boolean) => {
          const nextScene = chapter * 2 + (turning ? 1 : 0);
          if (scene === nextScene) return;
          scene = nextScene;
          spreads.forEach((spread) => {
            spread.style.visibility = "hidden";
            spread.style.removeProperty("z-index");
          });
          pages.forEach((page) => page?.style.removeProperty("visibility"));
          preparedTurns.forEach((turn) => {
            turn.leaf.hidden = true;
          });
          shadow.style.opacity = "0";
          curlShadow.style.opacity = "0";
          if (turning) {
            spreads[chapter].style.visibility = isDesktop
              ? "visible"
              : "hidden";
            spreads[chapter].style.zIndex = "2";
            spreads[chapter + 1].style.visibility = "visible";
            spreads[chapter + 1].style.zIndex = "1";
            if (isDesktop && pages[chapter])
              pages[chapter].style.visibility = "hidden";
            preparedTurns[chapter].leaf.hidden = false;
            section.dataset.bookTurning = "true";
          } else {
            spreads[chapter].style.visibility = "visible";
            delete section.dataset.bookTurning;
          }
        };

        const renderMobileTurn = (chapter: number, progress: number) => {
          const leaf = preparedTurns[chapter];
          const radius = pageWidth * 0.2;
          const arcLength = Math.PI * radius;
          const fold = pageWidth - (pageWidth + arcLength) * progress;
          const hingeAngle =
            Math.PI * gsap.utils.clamp(0, 1, -fold / arcLength);
          const bend = Math.sin(Math.PI * progress);
          let x = 0;
          let y = 0;
          let z = 0;
          let crest = 0;
          let previousAngle = hingeAngle;

          // Integrate a cylindrical curl: paper stays flat until the fold reaches it.
          // Each strip spans the chord between adjacent points, keeping edges joined.
          leaf.activeSlices.forEach((slice, i) => {
            const distance = (i + 1) * sliceWidth;
            const angle =
              Math.PI * gsap.utils.clamp(0, 1, (distance - fold) / arcLength);
            const flat = Math.min(distance, Math.max(0, fold));
            const folded = Math.max(
              0,
              distance - Math.max(0, fold + arcLength),
            );
            const nextX =
              flat + radius * (Math.sin(angle) - Math.sin(hingeAngle)) - folded;
            const nextZ = radius * (Math.cos(hingeAngle) - Math.cos(angle));
            const nextY = 2 * bend * (Math.cos(hingeAngle) - Math.cos(angle));
            const dx = nextX - x;
            const dz = nextZ - z;
            const chord = Math.hypot(dx, dz);
            const rotation = Math.atan2(dz, dx);
            const shear = (Math.atan2(nextY - y, chord) * 180) / Math.PI;
            slice.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${(-rotation * 180) / Math.PI}deg) skewY(${shear}deg) scaleX(${chord / sliceWidth})`;
            const startShade = Math.abs(Math.sin(previousAngle));
            const endShade = Math.abs(Math.sin(angle));
            leaf.frontShades[i * 2].style.opacity = String(startShade * 0.17);
            leaf.frontShades[i * 2 + 1].style.opacity = String(endShade * 0.17);
            leaf.backShades[i * 2].style.opacity = String(
              0.06 + endShade * 0.19,
            );
            leaf.backShades[i * 2 + 1].style.opacity = String(
              0.06 + startShade * 0.19,
            );
            crest = Math.max(crest, nextX);
            x = nextX;
            y = nextY;
            z = nextZ;
            previousAngle = angle;
          });
          curlShadow.style.opacity = String(bend * 0.75);
          curlShadowBand.style.transform = `translate3d(${crest - pageWidth * 0.25}px, 0, 0)`;
        };

        const renderRibbon = (progress: number) => {
          if (ribbonProgress === progress) return;
          ribbonProgress = progress;
          const smoothStep = (value: number) => {
            const t = gsap.utils.clamp(0, 1, value);
            return t * t * (3 - 2 * t);
          };
          // Lift the free end before the sheet reaches the binding, hold it above
          // the head of the book, then lower it after the sheet has passed.
          const lift = smoothStep(progress / 0.2) *
            (1 - smoothStep((progress - 0.76) / 0.24));
          const endX = 1 + (isDesktop ? 33 : 21) * lift;
          const endY = ribbonLength * (1 - lift) - (isDesktop ? 22 : 12) * lift;
          const controlX = endX - 1 - 7 * lift;
          const controlY = ribbonLength * 0.72 * (1 - lift) + 10 * lift;
          const dx = endX - controlX;
          const dy = endY - controlY;
          const tangentLength = Math.hypot(dx, dy);
          const halfWidth = ribbonWidth / 2;
          const normalX = dy / tangentLength * halfWidth;
          const normalY = -dx / tangentLength * halfWidth;
          const notchX = endX - dx / tangentLength * 5;
          const notchY = endY - dy / tangentLength * 5;
          const point = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`;
          const rootControlY = ribbonLength * 0.2;
          const leftCurve = `M${point(-halfWidth, 0)}C${point(-halfWidth, rootControlY)} ${point(controlX - normalX, controlY - normalY)} ${point(endX - normalX, endY - normalY)}`;
          const rightCurve = `M${point(halfWidth, 0)}C${point(halfWidth, rootControlY)} ${point(controlX + normalX, controlY + normalY)} ${point(endX + normalX, endY + normalY)}`;
          const outline = `${leftCurve}L${point(notchX, notchY)}L${point(endX + normalX, endY + normalY)}C${point(controlX + normalX, controlY + normalY)} ${point(halfWidth, rootControlY)} ${point(halfWidth, 0)}Z`;
          ribbonBody.setAttribute("d", outline);
          ribbonWeave.setAttribute("d", outline);
          ribbonEdge.setAttribute("d", rightCurve);
        };

        const render = (progress: number) => {
          const time = progress * duration;
          const chapter = Math.min(
            spreads.length - 1,
            Math.floor(time / (CHAPTER_HOLD + PAGE_TURN)),
          );
          const turn = gsap.utils.clamp(
            0,
            1,
            (time - chapter * (CHAPTER_HOLD + PAGE_TURN) - CHAPTER_HOLD) /
              PAGE_TURN,
          );
          const turning = chapter < spreads.length - 1 && turn > 0;
          setScene(chapter, turning);
          selectChapter(chapter + (turning && turn >= 0.5 ? 1 : 0));
          renderRibbon(turning ? turn : 0);
          if (!turning) return;
          if (!isDesktop) {
            renderMobileTurn(chapter, turn);
            return;
          }
          const bend = Math.sin(Math.PI * turn);
          let x = 0;
          let z = 0;
          preparedTurns[chapter].activeSlices.forEach((slice, i) => {
            const alongPage = (i + 0.5) / sliceCount;
            const angle = -(180 * turn + 42 * bend * (alongPage - 0.18));
            const radians = (angle * Math.PI) / 180;
            slice.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`;
            x += sliceWidth * Math.cos(radians);
            z -= sliceWidth * Math.sin(radians);
          });
          shadow.style.opacity = String(bend * 0.28);
          shadow.style.transform = `scaleX(${0.15 + bend * 0.85})`;
        };

        measure();
        render(0);
        const playhead = { progress: 0 };
        const animation = gsap.to(playhead, {
          progress: 1,
          duration: 1,
          ease: "none",
          paused: true,
          onUpdate: () => render(playhead.progress),
        });
        const scroll = ScrollTrigger.create({
          trigger: section,
          // CSS sticky holds the book independently of JavaScript's animation frames.
          start: () => `top+=${stageOffset} top`,
          end: () => `bottom ${stageBottom}px`,
          animation,
          scrub: 0.2,
          onRefreshInit: measure,
          onRefresh: (self) => {
            scene = -1;
            animation.progress(self.progress, true);
            render(playhead.progress);
          },
        });

        const goToChapter = (index: number) => {
          const readingPoint =
            (index * (CHAPTER_HOLD + PAGE_TURN) + CHAPTER_HOLD / 2) / duration;
          window.scrollTo({
            top: scroll.start + readingPoint * (scroll.end - scroll.start),
            behavior: "smooth",
          });
        };
        const onChoice = (event: MouseEvent) => {
          if (
            event.button !== 0 ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
          )
            return;
          const index = choices.indexOf(
            event.currentTarget as HTMLAnchorElement,
          );
          if (index < 0) return;
          event.preventDefault();
          goToChapter(index);
        };
        const onKey = (event: KeyboardEvent) => {
          if (
            event.target !== shell ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
          )
            return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            goToChapter(
              gsap.utils.clamp(
                0,
                spreads.length - 1,
                selectedChapter + (event.key === "ArrowRight" ? 1 : -1),
              ),
            );
          }
        };
        choices.forEach((choice) => choice.addEventListener("click", onChoice));
        shell.addEventListener("keydown", onKey);

        return () => {
          choices.forEach((choice) =>
            choice.removeEventListener("click", onChoice),
          );
          shell.removeEventListener("keydown", onKey);
          scroll.kill();
          animation.kill();
          spreads.forEach((spread) => {
            spread.removeAttribute("style");
            spread.removeAttribute("aria-hidden");
            spread.inert = false;
          });
          pages.forEach((page) => page?.style.removeProperty("visibility"));
          choices.forEach((choice) => choice.removeAttribute("aria-current"));
          preparedTurns.forEach((turn) => {
            turn.leaf.hidden = true;
            turn.leaf.removeAttribute("style");
            turn.slices.forEach((slice) => slice.removeAttribute("style"));
            [...turn.frontShades, ...turn.backShades].forEach((shade) =>
              shade.removeAttribute("style"),
            );
            [...turn.fronts, ...turn.backs].forEach((face) => {
              face.replaceChildren();
              face.removeAttribute("style");
            });
          });
          shadow.removeAttribute("style");
          curlShadow.removeAttribute("style");
          curlShadowBand.removeAttribute("style");
          if (restingRibbon) {
            ribbonBody.setAttribute("d", restingRibbon);
            ribbonWeave.setAttribute("d", restingRibbon);
          }
          if (restingRibbonEdge) ribbonEdge.setAttribute("d", restingRibbonEdge);
          section.style.removeProperty("--book-scroll-distance");
          section.style.removeProperty("--book-stage-height");
          section.style.removeProperty("--book-stage-top");
          delete section.dataset.bookReady;
          delete section.dataset.bookTurning;
        };
      },
      section,
    );

    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      resize.disconnect();
      preload.disconnect();
      media.revert();
    };
  }, []);

  return <span className={styles.marker} ref={markerRef} aria-hidden="true" />;
}
