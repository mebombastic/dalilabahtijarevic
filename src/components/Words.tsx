import type { CSSProperties } from "react";

/**
 * Splits text into words that blur/fade/rise in one after another.
 * Inside a `.words-in` parent they play on load; inside a
 * `[data-reveal="words"]` parent they play when scrolled into view.
 */
export const Words = ({
  text,
  className = "",
  start = 0,
  step = 0.08,
}: {
  text: string;
  className?: string;
  start?: number;
  step?: number;
}) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className={`word ${className}`} style={{ "--d": `${start + i * step}s` } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
};
