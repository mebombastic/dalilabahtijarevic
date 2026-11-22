export type RitualStep = { time: string; title: string; text: string; img: string; kind: "cutout" | "photo" };

/**
 * "Your daily ritual" timeline. A gold line fills as you scroll (uses --p from
 * useScrollProgress via data-progress="through"); steps slide in from alternating sides.
 */
export const DailyRitual = ({ steps }: { steps: RitualStep[] }) => (
  <div data-progress="through" className="relative max-w-5xl mx-auto">
    {/* track + scroll-filled gold line */}
    <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-px bg-border" />
    <div
      className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-2 w-px bg-gradient-to-b from-gold to-gold/40 origin-top"
      style={{ height: "calc(100% - 1rem)", transform: "scaleY(clamp(0, calc((var(--p, 0) - 0.15) * 1.8), 1))" }}
    />

    <ol className="space-y-14 md:space-y-20">
      {steps.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li key={s.time} className="relative grid md:grid-cols-2 md:gap-16 items-center pl-16 md:pl-0">
            {/* dot */}
            <span className="absolute left-[27px] md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10 h-4 w-4 rounded-full bg-background border-2 border-gold shadow-[0_0_0_6px_hsl(var(--background)),0_0_18px_hsl(var(--gold)/0.6)]" />

            <div className={`${right ? "md:order-2" : ""} mb-5 md:mb-0`} data-reveal={right ? "right" : "left"}>
              <div className={`relative mx-auto w-full max-w-[340px] aspect-[5/4] rounded-[2rem] overflow-hidden ${s.kind === "cutout" ? "bg-[radial-gradient(60%_60%_at_50%_60%,hsl(var(--gold)/0.25),transparent_70%),linear-gradient(180deg,hsl(37_45%_94%),hsl(36_32%_85%))] dark:bg-[radial-gradient(60%_60%_at_50%_60%,hsl(var(--gold)/0.25),transparent_70%),linear-gradient(180deg,hsl(162_40%_12%),hsl(162_45%_7%))]" : ""}`}>
                {s.kind === "cutout" ? (
                  <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-x-0 mx-auto bottom-[8%] h-[80%] w-auto object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.3)] animate-bob-soft" style={{ animationDelay: `${-i * 1.3}s` }} />
                ) : (
                  <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
            </div>

            <div className={`${right ? "md:order-1 md:text-right" : ""}`} data-reveal="blur" data-reveal-delay="1">
              <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-2">{s.time}</div>
              <h3 className="font-display text-3xl md:text-4xl mb-3">{s.title}</h3>
              <p className={`font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md ${right ? "md:ml-auto" : ""}`}>{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  </div>
);
