import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Crown, Loader2, Lock, Pencil, Plus, Search, Trash2, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { FOODS, foodName, type Food, type Lang3 } from "@/data/foods";

/** One logged food. Nutrition is stored per 100 g so the totals can be recalculated. */
export type FoodItem = { n: string; g: number; m: number; k: number; p: number; c: number; f: number };
type Custom = { id: string; n: string; k: number; p: number; c: number; f: number };
type Goal = { k?: number; p?: number };

// The food tables are not in the generated Supabase types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as unknown as { from: (t: string) => any };

const T = {
  en: {
    label: "Food calculator", vip: "VIP", sub: "Search a food, enter the grams and it adds up calories, protein, carbs and fat for you.",
    today: "Today", meals: ["Breakfast", "Lunch", "Dinner", "Snacks"], search: "Search food… e.g. chicken, rice, shake",
    grams: "Grams", add: "Add", per100: "per 100 g", noResults: "Not in the list?", addOwn: "Add your own food",
    own: "Your food", name: "Name", kcal: "kcal", protein: "Protein", carbs: "Carbs", fat: "Fat", saveFood: "Save food",
    goal: "Daily goal", setGoal: "Set goal", empty: "Nothing logged yet — add your first food above.",
    total: "Total", left: "left", over: "over", setup: "The food calculator is almost ready — Dalila is finishing the setup.",
    lockedTitle: "Food calculator is a VIP feature", lockedText: "Log every meal by grams and see your calories, protein, carbs and fat for each day — with goals set together with me.",
    upgrade: "Upgrade to VIP 1:1", lockedPending: "Unlocks as soon as your VIP membership is active.", saving: "Saving…", error: "Couldn't save — check your connection.",
    approx: "Herbalife values are approximate.",
  },
  de: {
    label: "Kalorienrechner", vip: "VIP", sub: "Lebensmittel suchen, Gramm eingeben — Kalorien, Eiweiß, Kohlenhydrate und Fett werden automatisch berechnet.",
    today: "Heute", meals: ["Frühstück", "Mittagessen", "Abendessen", "Snacks"], search: "Lebensmittel suchen… z. B. Hähnchen, Reis, Shake",
    grams: "Gramm", add: "Hinzufügen", per100: "pro 100 g", noResults: "Nicht in der Liste?", addOwn: "Eigenes Lebensmittel",
    own: "Dein Lebensmittel", name: "Name", kcal: "kcal", protein: "Eiweiß", carbs: "KH", fat: "Fett", saveFood: "Speichern",
    goal: "Tagesziel", setGoal: "Ziel setzen", empty: "Noch nichts eingetragen — füge oben dein erstes Lebensmittel hinzu.",
    total: "Gesamt", left: "übrig", over: "drüber", setup: "Der Kalorienrechner ist fast fertig — Dalila schließt gerade die Einrichtung ab.",
    lockedTitle: "Der Kalorienrechner ist ein VIP-Feature", lockedText: "Trag jede Mahlzeit in Gramm ein und sieh Kalorien, Eiweiß, Kohlenhydrate und Fett für jeden Tag — mit Zielen, die wir gemeinsam festlegen.",
    upgrade: "Upgrade auf VIP 1:1", lockedPending: "Wird freigeschaltet, sobald deine VIP-Mitgliedschaft aktiv ist.", saving: "Speichert…", error: "Speichern fehlgeschlagen — prüfe deine Verbindung.",
    approx: "Herbalife-Werte sind ungefähre Angaben.",
  },
  sr: {
    label: "Kalkulator hrane", vip: "VIP", sub: "Pronađi namirnicu, upiši grame i kalkulator sabira kalorije, proteine, ugljene hidrate i masti.",
    today: "Danas", meals: ["Doručak", "Ručak", "Večera", "Užine"], search: "Pretraži hranu… npr. piletina, pirinač, šejk",
    grams: "Grami", add: "Dodaj", per100: "na 100 g", noResults: "Nema na listi?", addOwn: "Dodaj svoju namirnicu",
    own: "Tvoja namirnica", name: "Naziv", kcal: "kcal", protein: "Proteini", carbs: "UH", fat: "Masti", saveFood: "Sačuvaj",
    goal: "Dnevni cilj", setGoal: "Postavi cilj", empty: "Još ništa nije upisano — dodaj prvu namirnicu gore.",
    total: "Ukupno", left: "preostalo", over: "preko", setup: "Kalkulator hrane je skoro spreman — Dalila završava podešavanje.",
    lockedTitle: "Kalkulator hrane je VIP opcija", lockedText: "Upiši svaki obrok u gramima i prati kalorije, proteine, ugljene hidrate i masti za svaki dan — sa ciljevima koje postavimo zajedno.",
    upgrade: "Pređi na VIP 1:1", lockedPending: "Otključava se čim tvoje VIP članstvo bude aktivno.", saving: "Čuvam…", error: "Čuvanje nije uspelo — proveri internet.",
    approx: "Herbalife vrednosti su približne.",
  },
};

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const r0 = (n: number) => Math.round(n);
const r1 = (n: number) => Math.round(n * 10) / 10;
export const sumItems = (items: FoodItem[]) => items.reduce(
  (a, it) => ({ k: a.k + (it.k * it.g) / 100, p: a.p + (it.p * it.g) / 100, c: a.c + (it.c * it.g) / 100, f: a.f + (it.f * it.g) / 100 }),
  { k: 0, p: 0, c: 0, f: 0 },
);
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

type Props = { lang: Lang3; userId: string; unlocked: boolean; pending: boolean; onUpgrade: () => void };

export const FoodCalculator = ({ lang, userId, unlocked, pending, onUpgrade }: Props) => {
  const c = T[lang];
  if (!unlocked) return <Locked c={c} pending={pending} onUpgrade={onUpgrade} />;
  return <Calculator c={c} lang={lang} userId={userId} />;
};

const Locked = ({ c, pending, onUpgrade }: { c: typeof T.en; pending: boolean; onUpgrade: () => void }) => (
  <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-[radial-gradient(80%_80%_at_50%_0%,hsl(var(--gold)/0.12),transparent)] p-6 md:p-10 text-center">
    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Lock className="h-5 w-5" /></div>
    <h3 className="font-display text-3xl md:text-4xl mb-3">{c.lockedTitle}</h3>
    <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto mb-6">{c.lockedText}</p>
    <div className="flex flex-wrap justify-center gap-2 mb-6 font-body text-[11px] tracking-wide-2 uppercase">
      {["kcal", "Protein", "Carbs", "Fat"].map((x) => <span key={x} className="rounded-full border border-border px-3 py-1.5 text-muted-foreground">{x}</span>)}
    </div>
    {pending ? <p className="font-body text-xs text-gold">{c.lockedPending}</p> : (
      <Button onClick={onUpgrade} className="btn-shine w-full sm:w-auto rounded-full h-12 px-8 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[11px] tracking-luxe uppercase">
        <Crown className="mr-2 h-4 w-4" /> {c.upgrade}
      </Button>
    )}
  </div>
);

const Bar = ({ value, goal, label, unit, tone }: { value: number; goal?: number; label: string; unit: string; tone: string }) => {
  const pct = goal ? Math.min(100, (value / goal) * 100) : 0;
  const over = goal ? value > goal : false;
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{label}</span>
        <span className="font-body text-xs text-muted-foreground whitespace-nowrap">{goal ? `/ ${goal} ${unit}` : ""}</span>
      </div>
      <div className="font-display text-3xl leading-none mb-2">{unit === "kcal" ? r0(value) : r1(value)}<span className="font-body text-xs text-muted-foreground ml-1">{unit}</span></div>
      {goal ? (
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div className={`h-full rounded-full transition-[width] duration-500 ${over ? "bg-[hsl(var(--vermilion))]" : tone}`} style={{ width: `${pct}%` }} />
        </div>
      ) : <div className="h-2" />}
    </div>
  );
};

const Calculator = ({ c, lang, userId }: { c: typeof T.en; lang: Lang3; userId: string }) => {
  const todayIso = iso(new Date());
  const [day, setDay] = useState(todayIso);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [custom, setCustom] = useState<Custom[]>([]);
  const [goal, setGoal] = useState<Goal>({});
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [status, setStatus] = useState<"" | "saving" | "error">("");

  const [meal, setMeal] = useState(() => { const h = new Date().getHours(); return h < 11 ? 0 : h < 16 ? 1 : h < 21 ? 2 : 3; });
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<{ n: string; k: number; p: number; c: number; f: number; u?: Food["u"]; hl?: boolean } | null>(null);
  const [grams, setGrams] = useState("");
  const [ownOpen, setOwnOpen] = useState(false);
  const [own, setOwn] = useState({ n: "", k: "", p: "", c: "", f: "" });
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ k: "", p: "" });
  const gramsRef = useRef<HTMLInputElement>(null);

  const missing = (e: { code?: string; message?: string } | null) => !!e && (e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message || ""));

  // settings once
  useEffect(() => {
    db.from("food_settings").select("goal, custom").eq("user_id", userId).maybeSingle().then(({ data, error }: { data: { goal: Goal; custom: Custom[] } | null; error: { code?: string; message?: string } | null }) => {
      if (missing(error)) { setSetupNeeded(true); return; }
      if (data) { setGoal(data.goal || {}); setCustom(data.custom || []); }
    });
  }, [userId]);

  // log for the selected day
  useEffect(() => {
    let live = true;
    setLoading(true);
    db.from("food_log").select("items").eq("user_id", userId).eq("day", day).maybeSingle().then(({ data, error }: { data: { items: FoodItem[] } | null; error: { code?: string; message?: string } | null }) => {
      if (!live) return;
      if (missing(error)) setSetupNeeded(true);
      setItems((data?.items as FoodItem[]) || []);
      setLoading(false);
    });
    return () => { live = false; };
  }, [userId, day]);

  const saveItems = async (next: FoodItem[]) => {
    setItems(next);
    setStatus("saving");
    const { error } = await db.from("food_log").upsert({ user_id: userId, day, items: next, updated_at: new Date().toISOString() });
    if (missing(error)) setSetupNeeded(true);
    setStatus(error ? "error" : "");
  };
  const saveSettings = async (patch: { goal?: Goal; custom?: Custom[] }) => {
    const { error } = await db.from("food_settings").upsert({ user_id: userId, goal: patch.goal ?? goal, custom: patch.custom ?? custom, updated_at: new Date().toISOString() });
    if (error) setStatus("error");
  };

  const results = useMemo(() => {
    const s = norm(q.trim());
    if (!s) return [];
    const mine = custom.filter((x) => norm(x.n).includes(s)).map((x) => ({ key: "c-" + x.id, n: x.n, k: x.k, p: x.p, c: x.c, f: x.f, u: undefined as Food["u"], hl: false, mine: true }));
    const base = FOODS.filter((f) => norm(foodName(f, lang)).includes(s) || norm(f.n.en).includes(s))
      .map((f) => ({ key: f.id, n: foodName(f, lang), k: f.k, p: f.p, c: f.c, f: f.f, u: f.u, hl: !!f.herbalife, mine: false }));
    return [...mine, ...base].slice(0, 8);
  }, [q, custom, lang]);

  const pick = (r: (typeof results)[number]) => {
    setPicked({ n: r.n, k: r.k, p: r.p, c: r.c, f: r.f, u: r.u, hl: r.hl });
    setGrams(String(r.u?.g ?? 100));
    setQ("");
    setTimeout(() => gramsRef.current?.select(), 30);
  };
  const g = Math.max(0, parseFloat(grams.replace(",", ".")) || 0);
  const addPicked = () => {
    if (!picked || g <= 0) return;
    saveItems([...items, { n: picked.n, g, m: meal, k: picked.k, p: picked.p, c: picked.c, f: picked.f }]);
    setPicked(null); setGrams("");
  };
  const num = (v: string) => Math.max(0, parseFloat(v.replace(",", ".")) || 0);
  const saveOwn = () => {
    if (!own.n.trim()) return;
    const x: Custom = { id: Date.now().toString(36), n: own.n.trim(), k: num(own.k), p: num(own.p), c: num(own.c), f: num(own.f) };
    const next = [x, ...custom.filter((y) => y.n.toLowerCase() !== x.n.toLowerCase())].slice(0, 40);
    setCustom(next); saveSettings({ custom: next });
    setPicked({ n: x.n, k: x.k, p: x.p, c: x.c, f: x.f }); setGrams("100");
    setOwn({ n: "", k: "", p: "", c: "", f: "" }); setOwnOpen(false);
  };
  const saveGoal = () => {
    const next = { k: num(goalForm.k) || undefined, p: num(goalForm.p) || undefined };
    setGoal(next); saveSettings({ goal: next }); setGoalOpen(false);
  };

  const shift = (n: number) => { const d = new Date(day + "T12:00:00"); d.setDate(d.getDate() + n); const s = iso(d); if (s <= todayIso) setDay(s); };
  const dayLabel = day === todayIso ? c.today : new Date(day + "T12:00:00").toLocaleDateString(lang === "sr" ? "sr-Latn" : lang, { weekday: "short", day: "numeric", month: "short" });
  const tot = sumItems(items);

  if (setupNeeded) return <p className="font-body text-sm text-muted-foreground rounded-2xl bg-secondary/50 p-5">{c.setup}</p>;

  return (
    <div className="space-y-5">
      {/* day + goal */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border p-1">
          <button onClick={() => shift(-1)} aria-label="Previous day" className="h-9 w-9 rounded-full inline-flex items-center justify-center hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
          <span className="min-w-[110px] text-center font-body text-xs tracking-wide-2 uppercase">{dayLabel}</span>
          <button onClick={() => shift(1)} disabled={day === todayIso} aria-label="Next day" className="h-9 w-9 rounded-full inline-flex items-center justify-center hover:bg-secondary disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center gap-3">
          {status === "saving" && <span className="font-body text-[11px] text-muted-foreground inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> {c.saving}</span>}
          {status === "error" && <span className="font-body text-[11px] text-destructive">{c.error}</span>}
          <button onClick={() => { setGoalForm({ k: goal.k ? String(goal.k) : "", p: goal.p ? String(goal.p) : "" }); setGoalOpen((o) => !o); }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 h-9 font-body text-[10px] tracking-luxe uppercase hover:border-gold hover:text-gold">
            <Pencil className="h-3 w-3" /> {goal.k ? c.goal : c.setGoal}
          </button>
        </div>
      </div>

      {goalOpen && (
        <div className="rounded-2xl bg-secondary/50 p-4 grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.goal} · kcal</span>
            <Input inputMode="numeric" value={goalForm.k} onChange={(e) => setGoalForm({ ...goalForm, k: e.target.value })} placeholder="1800" className="h-11 rounded-xl bg-background" /></label>
          <label className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.protein} · g</span>
            <Input inputMode="numeric" value={goalForm.p} onChange={(e) => setGoalForm({ ...goalForm, p: e.target.value })} placeholder="120" className="h-11 rounded-xl bg-background" /></label>
          <Button onClick={saveGoal} className="col-span-2 sm:col-span-1 h-11 rounded-xl bg-primary text-primary-foreground font-body text-[10px] tracking-luxe uppercase"><Check className="mr-1 h-4 w-4" /> OK</Button>
        </div>
      )}

      {/* totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 rounded-2xl border border-border bg-background p-4 sm:p-5">
        <Bar value={tot.k} goal={goal.k} label={c.kcal} unit="kcal" tone="bg-primary" />
        <Bar value={tot.p} goal={goal.p} label={c.protein} unit="g" tone="bg-gold" />
        <Bar value={tot.c} label={c.carbs} unit="g" tone="bg-primary" />
        <Bar value={tot.f} label={c.fat} unit="g" tone="bg-primary" />
        {goal.k ? (
          <p className="col-span-2 sm:col-span-4 font-body text-xs text-muted-foreground -mt-1">
            {tot.k <= goal.k ? <><b className="text-foreground font-medium">{r0(goal.k - tot.k)} kcal</b> {c.left}</> : <><b className="text-[hsl(var(--vermilion))] font-medium">{r0(tot.k - goal.k)} kcal</b> {c.over}</>}
            {goal.p ? <> · <b className="text-foreground font-medium">{r0(Math.max(0, goal.p - tot.p))} g</b> {c.protein.toLowerCase()} {c.left}</> : null}
          </p>
        ) : null}
      </div>

      {/* add food */}
      <div className="rounded-2xl bg-secondary/40 p-4 sm:p-5 space-y-3">
        <div className="no-scrollbar -mx-1 px-1 flex gap-1.5 overflow-x-auto">
          {c.meals.map((mm, i) => (
            <button key={mm} onClick={() => setMeal(i)} className={`shrink-0 rounded-full px-3.5 py-2 font-body text-[10px] tracking-wide-2 uppercase border ${i === meal ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background"}`}>{mm}</button>
          ))}
        </div>

        {!picked ? (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.search} className="h-12 pl-11 rounded-xl bg-background" />
            {q.trim() && (
              <div className="absolute z-20 left-0 right-0 mt-2 rounded-2xl border border-border bg-background shadow-soft overflow-hidden">
                {results.map((r) => (
                  <button key={r.key} onClick={() => pick(r)} className="w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/60 flex items-center gap-3">
                    <span className="flex-1 min-w-0">
                      <span className="block font-body text-sm truncate">{r.hl && <Sparkles className="inline h-3 w-3 text-gold mr-1 -mt-0.5" />}{r.n}</span>
                      <span className="block font-body text-[11px] text-muted-foreground">{r0(r.k)} kcal · P {r1(r.p)} · {c.carbs} {r1(r.c)} · {c.fat} {r1(r.f)} — {c.per100}</span>
                    </span>
                    <Plus className="h-4 w-4 text-gold shrink-0" />
                  </button>
                ))}
                <button onClick={() => { setOwn({ ...own, n: q.trim() }); setOwnOpen(true); setQ(""); }} className="w-full text-left px-4 py-3 bg-secondary/40 hover:bg-secondary font-body text-xs">
                  {results.length === 0 && <span className="text-muted-foreground mr-1">{c.noResults}</span>}<b className="text-gold font-medium">+ {c.addOwn}</b>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-background border border-gold/40 p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-medium">{picked.n}</div>
                <div className="font-body text-[11px] text-muted-foreground">{r0(picked.k)} kcal · P {r1(picked.p)} g {c.per100}{picked.hl ? ` · ${c.approx}` : ""}</div>
              </div>
              <button onClick={() => setPicked(null)} aria-label="Cancel" className="h-8 w-8 shrink-0 rounded-full inline-flex items-center justify-center hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <label className="block w-28">
                <span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.grams}</span>
                <Input ref={gramsRef} inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPicked()} className="h-11 rounded-xl bg-secondary/40 text-base" />
              </label>
              {picked.u && (
                <div className="flex gap-1.5 pb-0.5">
                  {[1, 2].map((x) => (
                    <button key={x} onClick={() => setGrams(String(picked.u!.g * x))} className="rounded-full border border-border px-3 h-9 font-body text-[11px] hover:border-gold">
                      {x === 1 ? picked.u!.l[lang] : `×2`} <span className="text-muted-foreground">({picked.u!.g * x} g)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="font-body text-sm">
                <b className="font-display text-2xl font-normal mr-1">{r0((picked.k * g) / 100)}</b> kcal
                <span className="text-muted-foreground"> · P {r1((picked.p * g) / 100)} · {c.carbs} {r1((picked.c * g) / 100)} · {c.fat} {r1((picked.f * g) / 100)} g</span>
              </div>
              <Button onClick={addPicked} disabled={g <= 0} className="w-full sm:w-auto rounded-full h-11 px-6 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[10px] tracking-luxe uppercase">
                <Plus className="mr-1 h-4 w-4" /> {c.add} · {c.meals[meal]}
              </Button>
            </div>
          </div>
        )}

        {!picked && !q && !ownOpen && (
          <button onClick={() => setOwnOpen(true)} className="font-body text-[11px] text-muted-foreground hover:text-gold">+ {c.addOwn}</button>
        )}

        {ownOpen && (
          <div className="rounded-xl bg-background border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-[10px] tracking-luxe uppercase text-gold">{c.own} · {c.per100}</span>
              <button onClick={() => setOwnOpen(false)} aria-label="Close" className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <label className="col-span-2 sm:col-span-1 block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.name}</span>
                <Input value={own.n} onChange={(e) => setOwn({ ...own, n: e.target.value })} className="h-11 rounded-xl bg-secondary/40" /></label>
              {(["k", "p", "c", "f"] as const).map((k) => (
                <label key={k} className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{k === "k" ? c.kcal : k === "p" ? c.protein : k === "c" ? c.carbs : c.fat}</span>
                  <Input inputMode="decimal" value={own[k]} onChange={(e) => setOwn({ ...own, [k]: e.target.value })} className="h-11 rounded-xl bg-secondary/40" /></label>
              ))}
            </div>
            <Button onClick={saveOwn} disabled={!own.n.trim()} className="mt-3 w-full sm:w-auto rounded-full h-11 px-6 bg-primary text-primary-foreground font-body text-[10px] tracking-luxe uppercase"><Check className="mr-1 h-4 w-4" /> {c.saveFood}</Button>
          </div>
        )}
      </div>

      {/* meals */}
      {loading ? (
        <div className="py-6 flex justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">{c.empty}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {c.meals.map((mm, mi) => {
            const list = items.map((it, idx) => ({ it, idx })).filter((x) => x.it.m === mi);
            if (!list.length) return null;
            const s = sumItems(list.map((x) => x.it));
            return (
              <div key={mm} className="min-w-0 rounded-2xl border border-border p-4">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="font-body text-[10px] tracking-luxe uppercase text-gold">{mm}</span>
                  <span className="font-body text-xs text-muted-foreground whitespace-nowrap"><b className="text-foreground font-medium">{r0(s.k)} kcal</b> · P {r0(s.p)} g</span>
                </div>
                <ul>
                  {list.map(({ it, idx }) => (
                    <li key={idx} className="flex items-center gap-2 py-2 border-t border-border first:border-0">
                      <span className="flex-1 min-w-0">
                        <span className="block font-body text-[13px] leading-snug">{it.n}</span>
                        <span className="block font-body text-[11px] text-muted-foreground">{r1(it.g)} g · {r0((it.k * it.g) / 100)} kcal · P {r1((it.p * it.g) / 100)} · {c.carbs} {r1((it.c * it.g) / 100)} · {c.fat} {r1((it.f * it.g) / 100)}</span>
                      </span>
                      <button onClick={() => saveItems(items.filter((_, j) => j !== idx))} aria-label="Remove" className="h-8 w-8 shrink-0 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /></button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** Admin view: a member's last 14 logged days with daily totals; tap a day to see the foods. */
export const AdminFoodSummary = ({ userId, lang }: { userId: string; lang: Lang3 }) => {
  const c = T[lang];
  const [rows, setRows] = useState<{ day: string; items: FoodItem[] }[] | null>(null);
  const [goal, setGoal] = useState<Goal>({});
  const [openDay, setOpenDay] = useState<string | null>(null);
  useEffect(() => {
    db.from("food_log").select("day, items").eq("user_id", userId).order("day", { ascending: false }).limit(14)
      .then(({ data }: { data: { day: string; items: FoodItem[] }[] | null }) => setRows((data || []).filter((r) => r.items?.length)));
    db.from("food_settings").select("goal").eq("user_id", userId).maybeSingle()
      .then(({ data }: { data: { goal: Goal } | null }) => setGoal(data?.goal || {}));
  }, [userId]);
  const head = { en: "Food log (last 14 days)", de: "Ernährung (letzte 14 Tage)", sr: "Ishrana (poslednjih 14 dana)" }[lang];
  const none = { en: "No food logged yet.", de: "Noch nichts eingetragen.", sr: "Još ništa nije upisano." }[lang];
  return (
    <div>
      <div className="font-body text-[9px] tracking-luxe uppercase text-gold mb-2">
        {head}{goal.k ? <span className="text-muted-foreground normal-case tracking-normal"> · {c.goal}: {goal.k} kcal{goal.p ? ` / ${goal.p} g P` : ""}</span> : null}
      </div>
      {rows === null ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : rows.length === 0 ? <p className="font-body text-sm text-muted-foreground">{none}</p> : (
        <div className="overflow-x-auto"><table className="w-full min-w-[420px] font-body text-xs border-collapse">
          <thead><tr className="text-left text-muted-foreground">{["", c.kcal, c.protein, c.carbs, c.fat].map((h, i) => <th key={i} className="font-normal py-1.5 pr-2">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => {
            const s = sumItems(r.items);
            const isOpen = openDay === r.day;
            return [
              <tr key={r.day} onClick={() => setOpenDay(isOpen ? null : r.day)} className="border-t border-border cursor-pointer hover:bg-secondary/40">
                <td className="py-1.5 pr-2 whitespace-nowrap">{isOpen ? "▾" : "▸"} {r.day}</td>
                <td className={`py-1.5 pr-2 ${goal.k && s.k > goal.k ? "text-[hsl(var(--vermilion))]" : ""}`}>{r0(s.k)}</td>
                <td className="py-1.5 pr-2">{r0(s.p)} g</td><td className="py-1.5 pr-2">{r0(s.c)} g</td><td className="py-1.5 pr-2">{r0(s.f)} g</td>
              </tr>,
              isOpen && (
                <tr key={r.day + "-d"}><td colSpan={5} className="pb-2">
                  <ul className="rounded-xl bg-secondary/40 px-3 py-2">{r.items.map((it, i) => (
                    <li key={i} className="py-0.5"><span className="text-gold">{c.meals[it.m] ?? ""}</span> · {it.n} — {r1(it.g)} g · {r0((it.k * it.g) / 100)} kcal · P {r1((it.p * it.g) / 100)}</li>
                  ))}</ul>
                </td></tr>
              ),
            ];
          })}</tbody>
        </table></div>
      )}
    </div>
  );
};
