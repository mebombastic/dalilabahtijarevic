import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthDialog } from "@/components/AuthDialog";
import { SiteHeader } from "@/components/SiteChrome";
import { NutritionTiles } from "@/components/PersonalPlan";
import { useLang } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { QUIZ } from "@/data/quizText";
import { loadLocal, nutrition, saveLocal, type Answers, type Equip, type Goal } from "@/lib/plan";

type Draft = Partial<Answers> & { goals: Goal[]; equip: Equip[] };
const STEPS = ["sex", "goals", "equip", "height", "weight", "year", "level", "job", "days", "food"] as const;

const Opt = ({ active, onClick, title, sub, badge }: { active: boolean; onClick: () => void; title: string; sub?: string; badge?: string | number }) => (
  <button type="button" onClick={onClick}
    className={`w-full text-left rounded-2xl border px-5 py-4 flex items-center gap-4 transition active:scale-[0.99] ${active ? "border-[hsl(var(--vermilion))] bg-[hsl(var(--vermilion)/0.08)]" : "border-border bg-card hover:border-gold/60"}`}>
    <span className="flex-1 min-w-0">
      <span className="block font-body text-[15px] font-medium">{title}</span>
      {sub && <span className="block font-body text-xs text-muted-foreground mt-0.5">{sub}</span>}
    </span>
    <span className={`h-7 w-7 shrink-0 rounded-full border flex items-center justify-center font-body text-xs ${active ? "bg-[hsl(var(--vermilion))] border-[hsl(var(--vermilion))] text-white" : "border-border"}`}>
      {active ? (badge ?? <Check className="h-4 w-4" />) : null}
    </span>
  </button>
);

const Start = () => {
  const { lang, setLang } = useLang();
  const q = QUIZ[lang];
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const prev = loadLocal() || (user?.user_metadata?.profile as Answers | undefined) || null;
  const [d, setD] = useState<Draft>(() => prev ? { ...prev } : { goals: [], equip: [], days: 3, minutes: 30, meals: 3, diet: "all" });
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "building" | "done">("quiz");
  const [authOpen, setAuthOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const step = STEPS[i];
  const set = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));
  const toggle = <T,>(arr: T[], v: T, max = 9) => arr.includes(v) ? arr.filter((x) => x !== v) : arr.length >= max ? arr : [...arr, v];
  const yearNow = new Date().getFullYear();

  const valid = (() => {
    switch (step) {
      case "sex": return !!d.sex;
      case "goals": return d.goals.length > 0;
      case "equip": return d.equip.length > 0;
      case "height": return !!d.height && d.height >= 130 && d.height <= 220;
      case "weight": return !!d.weight && d.weight >= 35 && d.weight <= 250 && (!d.target || (d.target >= 35 && d.target <= 250));
      case "year": return !!d.year && yearNow - d.year >= 16 && yearNow - d.year <= 90;
      case "level": return d.level !== undefined;
      case "job": return d.job !== undefined;
      case "days": return !!d.days && !!d.minutes;
      case "food": return !!d.diet && !!d.meals;
    }
  })();

  const answers = d as Answers;
  const n = useMemo(() => (phase === "done" ? nutrition(answers) : null), [phase, answers]);
  const next = () => {
    if (!valid) return;
    if (i < STEPS.length - 1) { setI(i + 1); window.scrollTo(0, 0); return; }
    saveLocal(answers);
    setPhase("building");
    setTimeout(() => setPhase("done"), 1800);
  };
  useEffect(() => { if (phase === "done" && user) void saveProfile(); }, [phase, user]); // eslint-disable-line react-hooks/exhaustive-deps
  const saveProfile = async () => {
    setSaving(true);
    await supabase.auth.updateUser({ data: { profile: answers } });
    await refresh();
    setSaving(false);
  };

  const numInput = (key: "height" | "weight" | "target", unit: string, placeholder: string) => (
    <div className="flex items-center gap-3">
      <Input inputMode="decimal" autoFocus={key !== "target"} value={d[key] ?? ""} placeholder={placeholder}
        onChange={(e) => { const v = parseFloat(e.target.value.replace(",", ".")); set({ [key]: isNaN(v) ? undefined : v }); }}
        onKeyDown={(e) => e.key === "Enter" && next()}
        className="h-16 w-40 rounded-2xl text-3xl font-display text-center bg-card" />
      <span className="font-body text-lg text-muted-foreground">{unit}</span>
    </div>
  );

  const name = (user?.user_metadata?.name as string) || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader onAuth={() => setAuthOpen(true)} />
      <main className="container mx-auto max-w-xl pt-24 md:pt-32 pb-16">
        {phase === "quiz" && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => (i ? setI(i - 1) : navigate(-1))} aria-label={q.back} className="h-10 w-10 shrink-0 rounded-full border border-border inline-flex items-center justify-center hover:border-gold"><ArrowLeft className="h-4 w-4" /></button>
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-[hsl(var(--vermilion))] transition-[width] duration-500" style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} /></div>
              <span className="font-body text-xs text-muted-foreground w-10 text-right">{i + 1}/{STEPS.length}</span>
            </div>

            <div key={step} className="animate-blur-up" style={{ animationDuration: "0.45s" }}>
              {step === "sex" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-2">{q.sex.q}</h1>
                <p className="font-body text-sm text-muted-foreground mb-6">{q.sex.hint}</p>
                <div className="space-y-3">{(["f", "m"] as const).map((v) => <Opt key={v} active={d.sex === v} onClick={() => { set({ sex: v }); setTimeout(() => setI(1), 180); }} title={q.sex[v]} />)}</div>
              </>}
              {step === "goals" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-2">{q.goals.q}</h1>
                <p className="font-body text-sm text-muted-foreground mb-6">{q.goals.hint}</p>
                <div className="space-y-3">{(["lose", "muscle", "tone", "fit", "eat", "energy"] as Goal[]).map((g) =>
                  <Opt key={g} active={d.goals.includes(g)} badge={d.goals.indexOf(g) + 1} onClick={() => set({ goals: toggle(d.goals, g, 3) })} title={q.goals[g]} />)}</div>
              </>}
              {step === "equip" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-2">{q.equip.q}</h1>
                <p className="font-body text-sm text-muted-foreground mb-6">{q.equip.hint}</p>
                <div className="space-y-3">{(["body", "db", "run", "bar"] as Equip[]).map((e) =>
                  <Opt key={e} active={d.equip.includes(e)} onClick={() => set({ equip: toggle(d.equip, e) })} title={q.equip[e]} sub={q.equip[`${e}Sub` as "bodySub"]} />)}</div>
              </>}
              {step === "height" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-8">{q.height.q}</h1>
                {numInput("height", q.height.unit, "165")}
                {d.height !== undefined && !valid && <p className="font-body text-xs text-destructive mt-3">{q.height.err}</p>}
              </>}
              {step === "weight" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-8">{q.weight.q}</h1>
                {numInput("weight", q.weight.unit, "65")}
                <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mt-8 mb-2">{q.weight.target}</div>
                {numInput("target", q.weight.unit, "–")}
                {d.weight !== undefined && !valid && <p className="font-body text-xs text-destructive mt-3">{q.weight.err}</p>}
              </>}
              {step === "year" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-2">{q.year.q}</h1>
                <p className="font-body text-sm text-muted-foreground mb-6">{q.year.hint}</p>
                <select value={d.year ?? ""} onChange={(e) => set({ year: parseInt(e.target.value) || undefined })}
                  className="h-16 w-48 rounded-2xl border border-input bg-card px-5 font-display text-3xl">
                  <option value="">–</option>
                  {Array.from({ length: 75 }, (_, k) => yearNow - 16 - k).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </>}
              {step === "level" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-6">{q.level.q}</h1>
                <div className="space-y-3">{([0, 1, 2, 3] as const).map((l) => <Opt key={l} active={d.level === l} onClick={() => { set({ level: l }); setTimeout(() => setI(i + 1), 180); }} title={q.level[`l${l}`]} />)}</div>
              </>}
              {step === "job" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-6">{q.job.q}</h1>
                <div className="space-y-3">{([0, 1, 2] as const).map((j) => <Opt key={j} active={d.job === j} onClick={() => { set({ job: j }); setTimeout(() => setI(i + 1), 180); }} title={q.job[`j${j}`]} sub={q.job[`j${j}s`]} />)}</div>
              </>}
              {step === "days" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-2">{q.days.q}</h1>
                <p className="font-body text-sm text-muted-foreground mb-6">{q.days.hint}</p>
                <div className="grid grid-cols-5 gap-2 mb-8">{[2, 3, 4, 5, 6].map((x) => (
                  <button key={x} onClick={() => set({ days: x })} className={`h-16 rounded-2xl border font-display text-3xl ${d.days === x ? "bg-[hsl(var(--vermilion))] text-white border-[hsl(var(--vermilion))]" : "bg-card border-border"}`}>{x}</button>))}</div>
                <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mb-2">{q.days.min}</div>
                <div className="grid grid-cols-3 gap-2">{([15, 30, 45] as const).map((x) => (
                  <button key={x} onClick={() => set({ minutes: x })} className={`h-14 rounded-2xl border font-body text-lg ${d.minutes === x ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{x} min</button>))}</div>
              </>}
              {step === "food" && <>
                <h1 className="font-display text-4xl md:text-5xl mb-6">{q.food.q}</h1>
                <div className="space-y-3 mb-8">{(["all", "fish", "veg"] as const).map((v) => <Opt key={v} active={d.diet === v} onClick={() => set({ diet: v })} title={q.food[v]} />)}</div>
                <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mb-2">{q.food.meals}</div>
                <div className="grid grid-cols-3 gap-2">{([3, 4, 5] as const).map((x) => (
                  <button key={x} onClick={() => set({ meals: x })} className={`h-14 rounded-2xl border font-display text-2xl ${d.meals === x ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{x}</button>))}</div>
              </>}
            </div>

            {!["sex", "level", "job"].includes(step) && (
              <Button onClick={next} disabled={!valid} className="mt-10 w-full h-14 rounded-full bg-[hsl(var(--vermilion))] text-white hover:bg-[hsl(var(--vermilion)/0.9)] font-body text-[11px] tracking-luxe uppercase">
                {i === STEPS.length - 1 ? q.finish : q.next} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        )}

        {phase === "building" && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--vermilion))] mb-5" />
            <p className="font-display text-3xl">{q.building}</p>
          </div>
        )}

        {phase === "done" && n && (
          <div className="animate-blur-up">
            <div className="font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))] mb-2">{q.result.label}</div>
            <h1 className="font-display text-5xl leading-none mb-3">{q.result.title}{name ? <> <em className="text-[hsl(var(--vermilion))]">{name}.</em></> : null}</h1>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {n.mode === "lose" ? q.result.lose.replace("{x}", String(Math.abs(n.weekly))) : n.mode === "gain" ? q.result.gain : q.result.keep}
              {n.weeksToTarget ? ` ${q.result.eta.replace("{x}", String(n.weeksToTarget))}` : ""}
            </p>
            <NutritionTiles n={n} lang={lang} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-2xl border border-border bg-secondary/40 p-5"><div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{q.result.workouts}</div><div className="font-display text-4xl mt-2">{answers.days}×</div></div>
              <div className="rounded-2xl border border-border bg-secondary/40 p-5"><div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{q.days.min}</div><div className="font-display text-4xl mt-2">{answers.minutes}</div></div>
            </div>
            <div className="mt-8 space-y-3">
              {user ? (
                <Button onClick={() => navigate("/account#plan")} disabled={saving} className="w-full h-14 rounded-full bg-[hsl(var(--vermilion))] text-white hover:bg-[hsl(var(--vermilion)/0.9)] font-body text-[11px] tracking-luxe uppercase">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{q.result.open} <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              ) : (
                <Button onClick={() => setAuthOpen(true)} className="w-full h-auto min-h-14 py-4 whitespace-normal rounded-full bg-[hsl(var(--vermilion))] text-white hover:bg-[hsl(var(--vermilion)/0.9)] font-body text-[11px] tracking-wide-2 uppercase">
                  {q.result.save} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <button onClick={() => { setPhase("quiz"); setI(0); }} className="w-full font-body text-[10px] tracking-luxe uppercase text-muted-foreground hover:text-gold py-2">{q.result.redo}</button>
            </div>
            <p className="font-body text-[11px] text-muted-foreground leading-relaxed mt-6">{q.result.note}</p>
          </div>
        )}
      </main>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode="register" lang={lang} onLangChange={setLang} />
    </div>
  );
};

export default Start;
