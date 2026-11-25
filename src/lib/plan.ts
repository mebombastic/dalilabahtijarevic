/** Personal plan engine: calories, macros, water, a 4-week training plan and example meals. */
import { FOODS, type Food } from "@/data/foods";

export type Goal = "lose" | "muscle" | "tone" | "fit" | "eat" | "energy";
export type Equip = "body" | "db" | "run" | "bar";
export type Answers = {
  sex: "f" | "m";
  goals: Goal[];          // up to 3, in order of importance
  equip: Equip[];         // at least one
  height: number;         // cm
  weight: number;         // kg
  target?: number;        // kg (optional)
  year: number;           // birth year
  level: 0 | 1 | 2 | 3;   // new, getting back, regular, advanced
  job: 0 | 1 | 2;         // sitting, on my feet, physical work
  days: number;           // 2–6 workouts a week
  minutes: 15 | 30 | 45;
  diet: "all" | "veg" | "fish";
  meals: 3 | 4 | 5;
};

export const age = (a: Answers) => new Date().getFullYear() - a.year;

/* ---------------- nutrition ---------------- */
export type Nutrition = {
  bmr: number; tdee: number; kcal: number; protein: number; carbs: number; fat: number;
  water: number; bmi: number; mode: "lose" | "gain" | "keep"; weekly: number; weeksToTarget?: number;
};
const r = (n: number, step = 1) => Math.round(n / step) * step;

export function nutrition(a: Answers): Nutrition {
  const ag = age(a);
  const bmr = 10 * a.weight + 6.25 * a.height - 5 * ag + (a.sex === "m" ? 5 : -161);
  const factor = Math.min(1.85, [1.2, 1.35, 1.5][a.job] + 0.04 * a.days);
  const tdee = bmr * factor;
  const bmi = a.weight / Math.pow(a.height / 100, 2);
  const wantsLose = a.goals.includes("lose") || (a.target !== undefined && a.target < a.weight - 1);
  const wantsGain = a.goals.includes("muscle") && !wantsLose;
  let mode: Nutrition["mode"] = wantsLose ? "lose" : wantsGain ? "gain" : "keep";
  if (mode === "lose" && bmi < 19) mode = "keep"; // never a deficit when already light
  let kcal = mode === "lose" ? tdee * (a.goals.includes("muscle") ? 0.85 : 0.8) : mode === "gain" ? tdee * 1.08 : tdee;
  kcal = Math.max(kcal, a.sex === "f" ? 1300 : 1600, bmr * 1.05);
  // protein from a sensible body weight (not too high when BMI is high)
  const refW = bmi > 28 ? 25 * Math.pow(a.height / 100, 2) : a.weight;
  const pPerKg = mode === "gain" ? 2.0 : mode === "lose" || a.goals.includes("tone") || a.goals.includes("muscle") ? 1.8 : 1.6;
  const protein = refW * pPerKg;
  const fat = Math.max(0.8 * refW, (kcal * 0.27) / 9);
  const carbs = Math.max(50, (kcal - protein * 4 - fat * 9) / 4);
  const water = (a.weight * 33 + (a.days * 500) / 7) / 1000;
  const weekly = mode === "lose" ? -(tdee - kcal) * 7 / 7700 : mode === "gain" ? 0.2 : 0;
  const weeksToTarget = a.target && weekly < 0 && a.target < a.weight ? Math.ceil((a.weight - a.target) / -weekly) : undefined;
  return {
    bmr: r(bmr, 10), tdee: r(tdee, 10), kcal: r(kcal, 10), protein: r(protein, 5), carbs: r(carbs, 5), fat: r(fat, 5),
    water: Math.round(water * 10) / 10, bmi: Math.round(bmi * 10) / 10, mode, weekly: Math.round(weekly * 100) / 100, weeksToTarget,
  };
}

/* ---------------- training ---------------- */
export type Item = { ex: string; reps?: number; secs?: number; side?: boolean; ladder?: number[]; dist?: number };
export type Session = {
  kind: "circuit" | "strength" | "hiit" | "cardio" | "mobility" | "fortime" | "max";
  title: string;              // key into SESSION_NAMES
  rounds: number;             // circuit/hiit rounds or strength sets
  work?: number; rest?: number; // hiit seconds
  items: Item[];
  minutes: number;
};
export type Day = { type: "train" | "rest" | "active"; session?: Session };

const PATTERN: Record<number, number[]> = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5] };

function sessionOrder(a: Answers): Session["title"][] {
  const by: Record<Goal, string[]> = {
    lose: ["fatburn", "countdown", "cardio", "engine"],
    muscle: a.equip.includes("bar") ? ["lower", "pullday", "pushday", "upper"] : ["lower", "pushday", "upper", "countdown"],
    tone: ["glutes", "countdown", "upper", "pushday"],
    fit: ["engine", "sprint", "cardio", "hiit"],
    eat: ["fullbody", "cardio", "core", "countdown"],
    energy: ["fullbody", "cardio", "core", "sprint"],
  };
  const out: string[] = [];
  const lists = a.goals.length ? a.goals.map((g) => by[g]) : [by.fit];
  for (let i = 0; i < 4; i++) for (const l of lists) if (!out.includes(l[i])) out.push(l[i]);
  return out;
}

export function training(a: Answers): Day[][] {
  const days = Math.min(6, Math.max(2, a.days));
  const order = sessionOrder(a);
  const lvl = a.level;
  const db = a.equip.includes("db");
  const run = a.equip.includes("run");
  const baseReps = [8, 10, 12, 15][lvl];
  const rounds = { 15: [2, 2, 3, 3], 30: [3, 3, 4, 4], 45: [4, 4, 5, 5] }[a.minutes][lvl];
  const push = lvl === 0 ? "kneepush" : "push";
  const FT = [0.3, 0.45, 0.65, 0.9];   // share of the full "for time" volume per level
  const weeks: Day[][] = [];
  for (let w = 0; w < 4; w++) {
    const grow = 1 + 0.1 * w;                    // +10% reps each week
    const R = (n: number) => Math.max(4, Math.round(n * grow));
    const S = (s: number) => Math.round((s * grow) / 5) * 5;
    const make = (title: string): Session => {
      switch (title) {
        case "lower": return { kind: "strength", title, rounds: rounds, minutes: a.minutes, items: db
          ? [{ ex: "goblet", reps: R(baseReps) }, { ex: "dbrdl", reps: R(baseReps) }, { ex: "dblunge", reps: R(baseReps * 0.8), side: true }, { ex: "dbthrust", reps: R(baseReps + 4) }, { ex: "plank", secs: S(20 + 10 * lvl) }]
          : [{ ex: lvl >= 2 ? "sqjump" : "squat", reps: R(baseReps + 4) }, { ex: "lunge", reps: R(baseReps), side: true }, { ex: "bridge", reps: R(baseReps + 6) }, { ex: "wall", secs: S(20 + 10 * lvl) }, { ex: "plank", secs: S(20 + 10 * lvl) }] };
        case "upper": return { kind: "strength", title, rounds: rounds, minutes: a.minutes, items: db
          ? [{ ex: "dbchest", reps: R(baseReps) }, { ex: "dbrow", reps: R(baseReps), side: true }, { ex: "dbpress", reps: R(baseReps) }, { ex: push, reps: R(baseReps * 0.8) }, { ex: "situp", reps: R(baseReps + 4) }]
          : [{ ex: push, reps: R(baseReps) }, { ex: lvl >= 2 ? "pike" : "climber", reps: R(lvl >= 2 ? baseReps * 0.7 : baseReps * 1.5) }, { ex: "plank", secs: S(25 + 10 * lvl) }, { ex: "situp", reps: R(baseReps + 4) }, { ex: "legraise", reps: R(baseReps) }] };
        case "glutes": return { kind: "circuit", title, rounds, minutes: a.minutes, items: [
          { ex: db ? "dbthrust" : "bridge", reps: R(baseReps + 6) }, { ex: "sumo", reps: R(baseReps + 4) }, { ex: db ? "dblunge" : "lunge", reps: R(baseReps), side: true },
          { ex: db ? "dbrdl" : "squat", reps: R(baseReps + 2) }, { ex: "wall", secs: S(20 + 10 * lvl) }] };
        case "fatburn": return { kind: "circuit", title, rounds, minutes: a.minutes, items: [
          { ex: "jack", reps: R(baseReps * 2) }, { ex: "squat", reps: R(baseReps + 4) }, { ex: "climber", reps: R(baseReps * 1.5) },
          { ex: push, reps: R(baseReps * 0.8) }, { ex: lvl >= 2 ? "burpee" : "lunge", reps: R(lvl >= 2 ? baseReps * 0.7 : baseReps), side: lvl < 2 }, { ex: "situp", reps: R(baseReps + 2) }] };
        case "fullbody": return { kind: "circuit", title, rounds, minutes: a.minutes, items: db
          ? [{ ex: "goblet", reps: R(baseReps) }, { ex: "dbrow", reps: R(baseReps), side: true }, { ex: "dbpress", reps: R(baseReps) }, { ex: "dbthrust", reps: R(baseReps + 4) }, { ex: "climber", reps: R(baseReps * 1.5) }]
          : [{ ex: "squat", reps: R(baseReps + 4) }, { ex: push, reps: R(baseReps * 0.8) }, { ex: "lunge", reps: R(baseReps), side: true }, { ex: "bridge", reps: R(baseReps + 6) }, { ex: "situp", reps: R(baseReps + 2) }] };
        case "hiit": {
          const work = [20, 30, 40, 45][lvl], rest = [40, 30, 20, 15][lvl];
          const hr = Math.max(2, Math.round((a.minutes * 60) / ((work + rest) * 5)));
          return { kind: "hiit", title, rounds: hr, work: S(work), rest, minutes: a.minutes, items: [
            { ex: "jack" }, { ex: lvl >= 2 ? "sqjump" : "squat" }, { ex: "climber" }, { ex: lvl >= 2 ? "burpee" : push }, { ex: "plank" }] };
        }
        case "cardio": { const m = Math.min(50, a.minutes + (lvl >= 2 ? 10 : 0));
          return { kind: "cardio", title, rounds: 1, minutes: m,
            items: [{ ex: run ? (lvl === 0 ? "walkrun" : lvl === 1 ? "run" : w % 2 ? "intervals" : "run") : "walk", secs: m * 60 }] }; }
        case "countdown": { // descending rounds, for time
          const f = FT[lvl] * grow, top = a.minutes === 15 ? 3 : a.minutes === 30 ? 4 : 5;
          const lad = Array.from({ length: top }, (_, k) => Math.max(3, Math.round(((top - k) * 10 * f) / 1)));
          return { kind: "fortime", title, rounds: top, minutes: a.minutes, items: [
            { ex: lvl >= 1 ? "burpee" : "jack", ladder: lad.map((x) => Math.max(2, Math.round(x * (lvl >= 1 ? 1 : 2)))) }, { ex: "squat", ladder: lad }, { ex: "situp", ladder: lad }] };
        }
        case "engine": { // jacks, burpees, leg raises, situps
          const f = FT[lvl] * grow, n = a.minutes === 15 ? 2 : 3;
          const q = (x: number) => Math.max(3, Math.round(x * f));
          return { kind: "fortime", title, rounds: n, minutes: a.minutes, items: [
            { ex: "jack", reps: q(75) }, { ex: lvl >= 1 ? "burpee" : "squat", reps: q(25) }, { ex: "legraise", reps: q(50) },
            { ex: "jack", reps: q(75) }, { ex: "situp", reps: q(50) }, { ex: lvl >= 1 ? "burpee" : "climber", reps: q(25) }] };
        }
        case "sprint": { // short and fast: 10 / 25 / 10
          const f = Math.max(0.4, FT[lvl]) * grow;
          const lad = [10, 25, 10].map((x) => Math.max(3, Math.round(x * f)));
          return { kind: "fortime", title, rounds: 3, minutes: 15, items: [
            { ex: lvl >= 1 ? "burpee" : "squat", ladder: lad }, { ex: "climber", ladder: lad.map((x) => x * 2) }, { ex: lvl >= 2 ? "highjump" : "jack", ladder: lad }] };
        }
        case "pushday": { // push-ups, jackknives, deep squats
          const f = FT[lvl] * grow, n = a.minutes === 15 ? 2 : a.minutes === 30 ? 3 : 4;
          const q = (x: number) => Math.max(3, Math.round(x * f));
          return { kind: "fortime", title, rounds: n, minutes: a.minutes, items: [
            { ex: lvl >= 3 ? "hspush" : push, reps: lvl >= 3 ? 5 : q(50) }, { ex: lvl >= 2 ? "jackknife" : "legraise", reps: q(20) }, { ex: lvl >= 1 ? "deepsquat" : "squat", reps: q(50) }] };
        }
        case "pullday": { // pull-ups and push-ups, 20 / 15 / 10 / 5
          const f = Math.max(0.25, FT[lvl]) * grow;
          const lad = [20, 15, 10, 5].map((x) => Math.max(1, Math.round(x * f)));
          const items: Item[] = [{ ex: "pullup", ladder: lad }, { ex: push, ladder: lad }];
          if (run) items.push({ ex: "sprint", dist: 80, ladder: [1, 1, 1, 1] });
          return { kind: "fortime", title, rounds: 4, minutes: a.minutes, items };
        }
        case "core": default: return { kind: "circuit", title: "core", rounds, minutes: a.minutes, items: [
          { ex: "plank", secs: S(20 + 10 * lvl) }, { ex: "situp", reps: R(baseReps + 2) }, { ex: "legraise", reps: R(baseReps) }, { ex: "bridge", reps: R(baseReps + 4) }, { ex: "climber", reps: R(baseReps) }] };
      }
    };
    const week: Day[] = Array.from({ length: 7 }, () => ({ type: "rest" as const }));
    PATTERN[days].forEach((d, i) => { week[d] = { type: "train", session: make(order[(i + w) % order.length]) }; });
    // MAX tests: first workout of week 1 and last workout of week 4 (to see progress)
    if (w === 0 || w === 3) {
      const d = w === 0 ? PATTERN[days][0] : PATTERN[days][PATTERN[days].length - 1];
      const t = [60, 90, 120, 120][lvl];
      week[d] = { type: "train", session: { kind: "max", title: "maxtest", rounds: 1, minutes: 15 + Math.round(t / 60) * 4, items: [
        { ex: "squat", secs: t }, { ex: push, secs: Math.round(t * 0.8 / 10) * 10 }, { ex: "situp", secs: t }, { ex: a.equip.includes("bar") ? "pullup" : "plank", secs: a.equip.includes("bar") ? 60 : 0 }] } };
    }
    // one easy active day on a rest day
    const free = week.findIndex((d, i) => d.type === "rest" && i !== 6);
    if (free >= 0) week[free] = { type: "active", session: { kind: "mobility", title: "recovery", rounds: 1, minutes: 20, items: [{ ex: "walk", secs: 1200 }, { ex: "stretch", secs: 600 }] } };
    weeks.push(week);
  }
  return weeks;
}

/* ---------------- meals ---------------- */
export type Portion = { food: Food; g: number };
export type Meal = { key: "breakfast" | "lunch" | "dinner" | "snack" | "snack2"; kcal: number; protein: number; options: Portion[][] };

const F = (id: string) => FOODS.find((f) => f.id === id)!;
type Tpl = { p: string; c?: string; fixed: [string, number][]; pMin?: number; cMin?: number; veg?: boolean; fish?: boolean };
const TPL: Record<string, Tpl[]> = {
  breakfast: [
    { p: "skyr", c: "oats", fixed: [["f1-milk", 276]], pMin: 0, veg: true },
    { p: "skyr", c: "oats", fixed: [["berries", 100]], veg: true },
    { p: "egg", c: "bread", fixed: [["tomato", 120]], pMin: 60, veg: true },
  ],
  lunch: [
    { p: "chicken", c: "rice", fixed: [["salad", 100], ["olive-oil", 10]] },
    { p: "salmon", c: "potato", fixed: [["broccoli", 150]], fish: true },
    { p: "beef", c: "pasta", fixed: [["salad", 100], ["tomato", 100]] },
    { p: "tofu", c: "quinoa", fixed: [["pepper", 100], ["olive-oil", 10]], veg: true },
  ],
  dinner: [
    { p: "egg", c: "bread", fixed: [["spinach", 80], ["pepper", 100]], pMin: 120, veg: true },
    { p: "tuna", c: "chickpeas", fixed: [["salad", 100], ["olive-oil", 10]], fish: true },
    { p: "chicken", c: "sweet-potato", fixed: [["zucchini", 150]] },
    { p: "cottage", c: "bread", fixed: [["cucumber", 150]], veg: true },
  ],
  snack: [
    { p: "greek", fixed: [["apple", 180]], veg: true },
    { p: "cottage", fixed: [["berries", 100]], veg: true },
    { p: "skyr", fixed: [["banana", 120]], veg: true },
  ],
};

function build(t: Tpl, kcal: number, protein: number): Portion[] {
  const fixed = t.fixed.map(([id, g]) => ({ food: F(id), g }));
  const fk = fixed.reduce((s, x) => s + (x.food.k * x.g) / 100, 0);
  const fp = fixed.reduce((s, x) => s + (x.food.p * x.g) / 100, 0);
  const P = F(t.p), C = t.c ? F(t.c) : null;
  const cProtEst = C ? (C.p / C.k) * Math.max(0, kcal - fk) * 0.4 : 0;
  let gp = Math.max(t.pMin ?? 50, ((protein - fp - cProtEst) / P.p) * 100);
  gp = Math.min(gp, ((kcal - fk) * 0.75 / P.k) * 100);
  gp = Math.max(t.pMin ?? 0, Math.round(gp / 10) * 10);
  const out: Portion[] = [...fixed];
  if (gp > 0) out.unshift({ food: P, g: gp });
  if (C) {
    const left = kcal - fk - (P.k * gp) / 100;
    const gc = Math.round(Math.max(0, (left / C.k) * 100) / 10) * 10;
    if (gc >= 20) out.splice(1, 0, { food: C, g: gc });
  }
  return out;
}

export function meals(a: Answers, n: Nutrition): Meal[] {
  const split: Record<number, [Meal["key"], number][]> = {
    3: [["breakfast", 0.3], ["lunch", 0.4], ["dinner", 0.3]],
    4: [["breakfast", 0.25], ["lunch", 0.35], ["snack", 0.1], ["dinner", 0.3]],
    5: [["breakfast", 0.22], ["snack", 0.1], ["lunch", 0.3], ["snack2", 0.1], ["dinner", 0.28]],
  };
  const ok = (t: Tpl) => a.diet === "all" || (a.diet === "veg" ? t.veg : t.veg || t.fish);
  return split[a.meals].map(([key, share]) => {
    const kcal = r(n.kcal * share, 10), protein = r(n.protein * share, 5);
    const list = TPL[key === "snack2" ? "snack" : key].filter(ok);
    return { key, kcal, protein, options: list.map((t) => build(t, kcal, protein)) };
  });
}

export const portionTotals = (ps: Portion[]) => ps.reduce((s, x) => ({
  k: s.k + (x.food.k * x.g) / 100, p: s.p + (x.food.p * x.g) / 100, c: s.c + (x.food.c * x.g) / 100, f: s.f + (x.food.f * x.g) / 100,
}), { k: 0, p: 0, c: 0, f: 0 });

/* ---------------- storage ---------------- */
const KEY = "dbfit-quiz";
export const saveLocal = (a: Answers) => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* ignore */ } };
export const loadLocal = (): Answers | null => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
export const clearLocal = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } };
export const isAnswers = (x: unknown): x is Answers => !!x && typeof x === "object" && "weight" in (x as object) && "height" in (x as object);
