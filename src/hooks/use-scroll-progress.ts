import { useEffect } from "react";

/**
 * Sets --p (0 → 1) on every [data-progress] element as it scrolls
 * from the bottom of the viewport up to ~20% from the top
 * (or across its whole pass with data-progress="through").
 */
export const useScrollProgress = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    if (els.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const { top, height } = el.getBoundingClientRect();
        // "through": 0 when the element enters at the bottom, 1 when it leaves at the top
        const raw = el.dataset.progress === "through" ? (vh - top) / (vh + height) : (vh - top) / (vh * 0.8);
        const p = Math.min(1, Math.max(0, raw));
        el.style.setProperty("--p", p.toFixed(4));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
};
