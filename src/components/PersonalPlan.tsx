import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Droplets, Flame, Lock, RefreshCw, Timer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUIZ } from "@/data/quizText";
import { ALL_EXERCISES } from "@/data/exercisesExtra";
import { foodName } from "@/data/foods";
import { meals as buildMeals, nutrition, portionTotals, training, type Answers, type Nutrition, type Session } from "@/lib/plan";

type Lang = "en" | "de" | "sr";
const DAY = { en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], sr: ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"] };

export const NutritionTiles = ({ n, lang, dark = false }: { n: Nutrition; lang: Lang; dark?: boolean }) => {
  const r = QUIZ[lang].result;
  const box = dark ? "bg-[hsl(37_40%_90%/0.06)] border-[hsl(37_40%_90%/0.15)]" : "bg-secondary/40 border-border";
  const muted = dark ? "text-[hsl(37_40%_90%/0.65)]" : "text-muted-foreground";
  const total = n.protein * 4 + n.carbs * 4 + n.fat * 9;
  const bars = [[r.protein, n.protein, (n.protein * 4) / total, "bg-[hsl(var(--vermilion))]"], [r.carbs, n.carbs, (n.carbs * 4) / total, "bg-[#D9B48F]"], [r.fat, n.fat, (n.fat * 9) / total, dark ? "bg-[hsl(37_40%_90%)]" : "bg-primary"]] as const;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className={`col-span-2 rounded-2xl border p-5 ${box}`}>
        <div className={`font-body text-[10px] tracking-luxe uppercase ${muted} inline-flex items-center gap-1.5`}><Flame className="h-3.5 w-3.5 text-[hsl(var(--vermilion))]" /> {r.kcal}</div>
        <div className="font-display text-6xl leading-none mt-2">{n.kcal.toLocaleString(lang === "en" ? "en" : "de")}</div>
        <div className="mt-4 flex h-2.5 rounded-full overflow-hidden">{bars.map(([, , share, c], i) => <div key={i} className={c} style={{ width: `${share * 100}%` }} />)}</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {bars.map(([label, g, , c]) => (
            <div key={label}><div className={`font-body text-[10px] uppercase tracking-wide-2 ${muted} inline-flex items-center gap-1`}><span className={`h-2 w-2 rounded-full ${c}`} />{label}</div><div className="font-body text-lg font-medium">{g} g</div></div>
          ))}
        </div>
      </div>
      <div className={`rounded-2xl border p-5 ${box}`}>
        <div className={`font-body text-[10px] tracking-luxe uppercase ${muted} inline-flex items-center gap-1.5`}><Droplets className="h-3.5 w-3.5 text-gold" /> {r.water}</div>
        <div className="font-display text-4xl mt-2">{n.water} L</div>
      </div>
      <div className={`rounded-2xl border p-5 ${box}`}>
        <div className={`font-body text-[10px] tracking-luxe uppercase ${muted}`}>{r.bmi}</div>
        <div className="font-display text-4xl mt-2">{n.bmi}</div>
      </div>
    </div>
  );
};

const itemText = (s: Session, it: Session["items"][number], lang: Lang) => {
  const p = QUIZ[lang].plan;
  if (s.kind === "hiit") return `${s.work}${p.secs} ${p.work} / ${s.rest}${p.secs} ${p.restS}`;
  if (it.secs) return it.secs >= 120 ? `${Math.round(it.secs / 60)} min` : `${it.secs} ${p.secs}`;
  return `${it.reps} ${p.reps}${it.side ? ` ${p.each}` : ""}`;
};

export const SessionCard = ({ s, lang, onExercise }: { s: Session; lang: Lang; onExercise: (k: string) => void }) => {
  const q = QUIZ[lang];
  const roundsLabel = s.kind === "strength" ? `${s.rounds} ${q.plan.sets}` : s.kind === "cardio" || s.kind === "mobility" ? "" : `${s.rounds} ${q.plan.rounds}`;
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 border-b-2 border-primary">
        <h3 className="font-display text-3xl">{q.sessions[s.title as keyof typeof q.sessions]}</h3>
        <span className="font-body text-[10px] tracking-luxe uppercase text-gold inline-flex items-center gap-1.5"><Timer className="h-3.5 w-3.5" /> ≈ {s.minutes} min{roundsLabel && ` · ${roundsLabel}`}</span>
      </div>
      <p className="font-body text-xs text-muted-foreground px-5 pt-3">{q.kinds[s.kind]}</p>
      <ul className="px-3 sm:px-5 py-3">
        {s.items.map((it, i) => {
          const ex = ALL_EXERCISES[it.ex];
          return (
            <li key={i} className="border-b border-border last:border-0">
              <button onClick={() => onExercise(it.ex)} className="w-full flex items-center gap-3 py-2.5 text-left group">
                <span className="h-12 w-16 shrink-0 rounded-lg bg-secondary/60 overflow-hidden [&>svg]:w-full [&>svg]:h-full flex items-center justify-center"
                  {...(ex.frames.length ? { dangerouslySetInnerHTML: { __html: ex.frames[Math.min(1, ex.frames.length - 1)].svg } } : {})}>
                  {ex.frames.length ? null : <span className="font-display text-xl text-gold">{ex[lang].title.charAt(0)}</span>}
                </span>
                <span className="flex-1 min-w-0 font-body text-sm font-medium group-hover:text-gold">{ex[lang].title} <Info className="inline h-3.5 w-3.5 text-gold -mt-0.5" /></span>
                <span className="font-body text-sm text-right whitespace-nowrap">{itemText(s, it, lang)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="font-body text-[11px] text-gold px-5 pb-4">👉 {q.plan.howTo}</p>
    </div>
  );
};

export const PersonalPlan = ({ answers, lang, unlocked, onExercise, onRedo }: { answers: Answers; lang: Lang; unlocked: boolean; onExercise: (k: string) => void; onRedo: () => void }) => {
  const q = QUIZ[lang];
  const n = useMemo(() => nutrition(answers), [answers]);
  const weeks = useMemo(() => training(answers), [answers]);
  const mealList = useMemo(() => buildMeals(answers, n), [answers, n]);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState(todayIdx);
  const [opt, setOpt] = useState(0);
  const d = weeks[week][day];
  const modeText = n.mode === "lose" ? q.result.lose.replace("{x}", String(Math.abs(n.weekly))) : n.mode === "gain" ? q.result.gain : q.result.keep;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-body text-sm text-muted-foreground max-w-xl">{modeText}{n.weeksToTarget ? ` ${q.result.eta.replace("{x}", String(n.weeksToTarget))}` : ""}</p>
        <button onClick={onRedo} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 h-9 font-body text-[10px] tracking-luxe uppercase hover:border-gold hover:text-gold"><RefreshCw className="h-3 w-3" /> {q.result.redo}</button>
      </div>
      <NutritionTiles n={n} lang={lang} />

      {!unlocked ? (
        <div className="rounded-2xl border border-gold/30 p-6 text-center">
          <Lock className="h-5 w-5 mx-auto mb-2 text-gold" />
          <p className="font-body text-sm text-muted-foreground mb-4">{q.plan.locked}</p>
          <Button asChild className="rounded-full h-11 px-6 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[10px] tracking-luxe uppercase"><Link to="/plans">{q.plan.upgrade}</Link></Button>
        </div>
      ) : (
        <>
          {/* training */}
          <div>
            <div className="font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))] mb-3">{q.plan.training}</div>
            <div className="flex gap-1.5 mb-3">
              {[0, 1, 2, 3].map((w) => (
                <button key={w} onClick={() => setWeek(w)} className={`flex-1 sm:flex-none rounded-full px-3 sm:px-4 py-2 font-body text-[10px] tracking-wide-2 uppercase border whitespace-nowrap ${w === week ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{q.plan.week} {w + 1}</button>
              ))}
            </div>
            <div className="no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-7 gap-2 overflow-x-auto snap-x mb-4">
              {weeks[week].map((dd, i) => {
                const title = dd.session ? q.sessions[dd.session.title as keyof typeof q.sessions] : q.plan.rest;
                const sel = i === day;
                return (
                  <button key={i} onClick={() => setDay(i)} className={`snap-start shrink-0 w-[30%] min-w-[96px] sm:w-auto sm:min-w-0 rounded-2xl p-3 min-h-[86px] text-left border transition ${sel ? "ring-2 ring-[hsl(var(--vermilion))]" : ""} ${dd.type === "train" ? "bg-primary text-primary-foreground border-primary" : dd.type === "active" ? "bg-secondary border-border" : "bg-background border-border text-muted-foreground"}`}>
                    <span className="block font-body text-[9px] tracking-wide-2 uppercase opacity-80">{DAY[lang][i]}{i === todayIdx && week === 0 ? ` · ${q.plan.today}` : ""}</span>
                    <span className="block font-display text-base leading-tight mt-1.5">{dd.type === "active" ? q.plan.active : title}</span>
                    {dd.session && <span className="block font-body text-[10px] opacity-75 mt-1">{dd.session.minutes} min</span>}
                  </button>
                );
              })}
            </div>
            {d.session ? <SessionCard s={d.session} lang={lang} onExercise={onExercise} /> : <p className="font-body text-sm text-muted-foreground rounded-2xl bg-secondary/40 p-5">{q.plan.rest} 🌿</p>}
          </div>

          {/* meals */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))]">{q.plan.meals}</div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((o) => (
                  <button key={o} onClick={() => setOpt(o)} className={`rounded-full px-3.5 py-1.5 font-body text-[10px] tracking-wide-2 uppercase border ${o === opt ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{q.plan.option} {String.fromCharCode(65 + o)}</button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {mealList.map((m) => {
                const ps = m.options[opt % m.options.length] || [];
                const t = portionTotals(ps);
                return (
                  <div key={m.key} className="rounded-2xl border border-border p-4 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <span className="font-body text-[10px] tracking-luxe uppercase text-gold">{q.plan.mealNames[m.key]}</span>
                      <span className="font-body text-xs text-muted-foreground whitespace-nowrap"><b className="text-foreground font-medium">{Math.round(t.k)} kcal</b> · P {Math.round(t.p)} g</span>
                    </div>
                    <ul className="space-y-1">
                      {ps.map((x, i) => (
                        <li key={i} className="flex justify-between gap-3 font-body text-[13px]"><span className="min-w-0">{foodName(x.food, lang)}</span><span className="text-muted-foreground whitespace-nowrap">{x.g} g</span></li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{q.result.note}</p>
    </div>
  );
};
