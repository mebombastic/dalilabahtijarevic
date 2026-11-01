import { useEffect } from "react";

/**
 * Sets --scroll-y on every element with [data-parallax]
 * relative to its own offset from the viewport top.
 * Used together with .parallax-slow / .parallax-fast utilities.
 */
export const useParallax = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (els.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const offset = rect.top * -1; // px scrolled past the element top
        el.style.setProperty("--scroll-y", `${offset}px`);
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
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
