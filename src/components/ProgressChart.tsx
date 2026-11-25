import { TrendingDown, TrendingUp } from "lucide-react";

type Lang = "en" | "de" | "sr";
export type Entry = { d: string; w?: string; wa?: string; sq?: string; pu?: string; su?: string; pl?: string };
const T = {
  en: { weight: "Weight", waist: "Waist", max: "MAX tests: first vs latest", sq: "Squats", pu: "Push-ups", su: "Sit-ups", pl: "Plank (s)", more: "Add at least two entries to see your progress line." },
  de: { weight: "Gewicht", waist: "Taille", max: "MAX-Tests: erster vs. letzter", sq: "Kniebeugen", pu: "Liegestütze", su: "Sit-ups", pl: "Plank (s)", more: "Trag mindestens zweimal ein, um deine Fortschrittslinie zu sehen." },
  sr: { weight: "Težina", waist: "Struk", max: "MAX testovi: prvi i poslednji", sq: "Čučnjevi", pu: "Sklekovi", su: "Trbušnjaci", pl: "Plank (s)", more: "Upiši bar dva puta da vidiš liniju napretka." },
};
const num = (v?: string) => { const n = parseFloat(String(v ?? "").replace(",", ".")); return isFinite(n) ? n : null; };
const fmtDate = (d: string, lang: Lang) => new Date(d + "T12:00:00").toLocaleDateString(lang === "sr" ? "sr-Latn" : lang, { day: "numeric", month: "short" });

const Line = ({ pts, unit, label, lang, color, lowerIsBetter = true }: { pts: { d: string; v: number }[]; unit: string; label: string; lang: Lang; color: string; lowerIsBetter?: boolean }) => {
  if (pts.length < 2) return null;
  const W = 320, H = 120, P = 14;
  const vs = pts.map((p) => p.v), min = Math.min(...vs), max = Math.max(...vs), span = max - min || 1;
  const x = (i: number) => P + (i * (W - 2 * P)) / (pts.length - 1);
  const y = (v: number) => H - P - ((v - min) / span) * (H - 2 * P);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const diff = Math.round((vs[vs.length - 1] - vs[0]) * 10) / 10;
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  return (
    <div className="rounded-2xl border border-border bg-background p-4 min-w-0">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{label}</span>
        <span className={`font-body text-sm font-medium inline-flex items-center gap-1 ${diff === 0 ? "" : good ? "text-[hsl(var(--vermilion))]" : "text-muted-foreground"}`}>
          {diff < 0 ? <TrendingDown className="h-4 w-4" /> : diff > 0 ? <TrendingUp className="h-4 w-4" /> : null}{diff > 0 ? "+" : ""}{diff} {unit}
        </span>
      </div>
      <div className="font-display text-3xl">{vs[vs.length - 1]} <span className="font-body text-xs text-muted-foreground">{unit}</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label={label}>
        <path d={`${path} L${x(pts.length - 1)},${H - P} L${x(0)},${H - P} Z`} fill={color} opacity="0.08" />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.v)} r="3.5" fill={color} />)}
      </svg>
      <div className="flex justify-between font-body text-[10px] text-muted-foreground"><span>{fmtDate(pts[0].d, lang)}</span><span>{fmtDate(pts[pts.length - 1].d, lang)}</span></div>
    </div>
  );
};

/** Visual progress: weight and waist lines, and MAX tests first vs latest. Entries oldest → newest. */
export const ProgressChart = ({ entries, lang }: { entries: Entry[]; lang: Lang }) => {
  const c = T[lang];
  const sorted = entries.slice().sort((a, b) => a.d.localeCompare(b.d));
  const series = (k: keyof Entry) => sorted.map((e) => ({ d: e.d, v: num(e[k]) })).filter((p): p is { d: string; v: number } => p.v !== null);
  const w = series("w"), wa = series("wa");
  const maxRows = (["sq", "pu", "su", "pl"] as const).map((k) => { const s = series(k); return s.length >= 2 ? { k, first: s[0].v, last: s[s.length - 1].v } : null; }).filter(Boolean) as { k: "sq" | "pu" | "su" | "pl"; first: number; last: number }[];
  if (w.length < 2 && wa.length < 2 && !maxRows.length) return <p className="font-body text-xs text-muted-foreground mb-5">{c.more}</p>;
  return (
    <div className="space-y-3 mb-6">
      <div className="grid sm:grid-cols-2 gap-3">
        <Line pts={w} unit="kg" label={c.weight} lang={lang} color="hsl(var(--vermilion))" />
        <Line pts={wa} unit="cm" label={c.waist} lang={lang} color="hsl(var(--primary))" />
      </div>
      {maxRows.length > 0 && (
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mb-3">{c.max}</div>
          <div className="space-y-3">
            {maxRows.map(({ k, first, last }) => {
              const top = Math.max(first, last) || 1;
              return (
                <div key={k}>
                  <div className="flex justify-between font-body text-sm mb-1"><span>{c[k]}</span><span className="font-medium">{first} → {last} <span className={last >= first ? "text-[hsl(var(--vermilion))]" : "text-muted-foreground"}>({last - first >= 0 ? "+" : ""}{Math.round((last - first) * 10) / 10})</span></span></div>
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full bg-[hsl(var(--primary)/0.35)]" style={{ width: `${(first / top) * 100}%` }} /></div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full bg-[hsl(var(--vermilion))]" style={{ width: `${(last / top) * 100}%` }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
