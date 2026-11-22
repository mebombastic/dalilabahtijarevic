import { useEffect } from "react";

/**
 * Adds `is-visible` to [data-reveal] elements when they scroll into view.
 * Also picks up elements added later (e.g. after a language change or filter).
 */
export const useReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    const watch = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.hasAttribute("data-reveal") && !root.classList.contains("is-visible")) io.observe(root);
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    };
    watch(document);
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => { if (n instanceof HTMLElement) watch(n); }));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
};
