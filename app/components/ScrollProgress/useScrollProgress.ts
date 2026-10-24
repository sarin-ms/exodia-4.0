import { useEffect, type RefObject } from "react";

export default function useScrollProgress(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let previousPercent = -1;
    let disposed = false;

    const update = () => {
      frame = 0;
      const maximum =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0;
      const percent = progress === 1 ? 100 : Math.floor(progress * 100);

      root.style.setProperty("--scroll-progress", String(progress));
      root.dataset.ready = "true";
      root.hidden = maximum <= 0;

      if (percent !== previousPercent) {
        root.setAttribute("aria-valuenow", String(percent));
        previousPercent = percent;
      }
    };

    const scheduleUpdate = () => {
      if (!disposed && !frame) frame = window.requestAnimationFrame(update);
    };

    // The book, gallery, and FAQ can change the document height after loading.
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    void document.fonts.ready.then(scheduleUpdate);
    scheduleUpdate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
    };
  }, [rootRef]);
}
