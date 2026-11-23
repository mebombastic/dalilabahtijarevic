import { ArrowLeft, Camera, Check, ChevronRight, Image as ImageIcon, Minus, Plus, Sparkles, Zap, MessageCircle, Search, Bell, Pencil, Flame, Target, Users } from "lucide-react";
import { Monogram, SectionLabel } from "@/components/SiteChrome";
import coachBubble from "@/assets/coach-bubble.webp";
import f1Vanilla from "@/assets/f1-vanilla.webp";

/* ───────────── MOCK-UP ONLY: example data, nothing is connected ───────────── */

/** Illustrated lunch plate: rice, grilled chicken, salad, tomato. */
const Plate = ({ className = "", variant = 0 }: { className?: string; variant?: number }) => (
  <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
    <defs>
      <radialGradient id={`pl${variant}`} cx="50%" cy="45%" r="55%"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e9e2d6" /></radialGradient>
      <radialGradient id={`rice${variant}`} cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#fffdf7" /><stop offset="1" stopColor="#eadfca" /></radialGradient>
      <linearGradient id={`ck${variant}`} x1="0" x2="1"><stop offset="0" stopColor="#c98a4b" /><stop offset="0.5" stopColor="#e0a865" /><stop offset="1" stopColor="#b8763c" /></linearGradient>
    </defs>
    <ellipse cx="200" cy="215" rx="190" ry="178" fill="rgba(0,0,0,.25)" />
    <circle cx="200" cy="200" r="185" fill={`url(#pl${variant})`} />
    <circle cx="200" cy="200" r="150" fill="none" stroke="#e2d9ca" strokeWidth="3" />
    {/* rice */}
    <ellipse cx="135" cy="245" rx="78" ry="62" fill={`url(#rice${variant})`} />
    {Array.from({ length: 40 }).map((_, i) => (
      <ellipse key={i} cx={85 + ((i * 37) % 100)} cy={205 + ((i * 23) % 80)} rx="7" ry="3" fill="#fbf6ea" stroke="#e3d6bd" strokeWidth="0.8" transform={`rotate(${(i * 47) % 180} ${85 + ((i * 37) % 100)} ${205 + ((i * 23) % 80)})`} />
    ))}
    {/* chicken slices */}
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`rotate(${-18 + i * 6} 250 150) translate(${i * 26} ${i * 10})`}>
        <rect x="190" y="95" width="34" height="120" rx="15" fill={`url(#ck${variant})`} />
        {[0, 1, 2].map((k) => <line key={k} x1="195" x2="219" y1={120 + k * 28} y2={112 + k * 28} stroke="#8a5428" strokeWidth="4" strokeLinecap="round" opacity="0.7" />)}
      </g>
    ))}
    {/* salad */}
    {[[270, 270], [300, 245], [245, 300], [295, 295], [320, 275], [270, 320]].map(([x, y], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx="34" ry="22" fill={i % 2 ? "#4f9a3e" : "#6db24f"} transform={`rotate(${i * 40} ${x} ${y})`} />
        <path d={`M${x - 22} ${y} Q${x} ${y - 6} ${x + 22} ${y}`} stroke="#3d7a2f" strokeWidth="2" fill="none" transform={`rotate(${i * 40} ${x} ${y})`} />
      </g>
    ))}
    {/* tomato + cucumber */}
    {[[300, 320], [330, 250]].map(([x, y], i) => (
      <g key={i}><circle cx={x} cy={y} r="20" fill="#E8392B" /><circle cx={x} cy={y} r="13" fill="#f0614f" /><circle cx={x - 4} cy={y - 3} r="2.5" fill="#ffd9a0" /><circle cx={x + 5} cy={y + 2} r="2.5" fill="#ffd9a0" /></g>
    ))}
    {[[240, 255], [275, 230]].map(([x, y], i) => (
      <g key={i}><circle cx={x} cy={y} r="15" fill="#3f7d2c" /><circle cx={x} cy={y} r="11" fill="#d8ecb8" /></g>
    ))}
  </svg>
);

const Phone = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div className={`min-h-screen ${dark ? "bg-[#0a1f18] text-[hsl(37_40%_90%)]" : "bg-background text-foreground"}`}>{children}</div>
);

const AppBar = ({ title, dark = false }: { title: string; dark?: boolean }) => (
  <div className={`flex items-center justify-between px-5 pt-5 pb-3 ${dark ? "" : "border-b border-border/60"}`}>
    <ArrowLeft className="h-5 w-5" />
    <span className="font-body text-[11px] tracking-luxe uppercase">{title}</span>
    <Bell className="h-5 w-5 opacity-60" />
  </div>
);

/* 1 — camera */
const SnapScreen = () => (
  <Phone dark>
    <AppBar title="Snap your meal" dark />
    <div className="px-5">
      <div className="relative mt-2 aspect-[3/4] rounded-[2rem] overflow-hidden bg-[radial-gradient(70%_60%_at_50%_45%,#4b3a2a,#1a130d)]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.025)_0_2px,transparent_2px_26px)]" />
        <Plate className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%]" />
        {/* scan frame */}
        {["top-6 left-6 border-t-4 border-l-4 rounded-tl-3xl", "top-6 right-6 border-t-4 border-r-4 rounded-tr-3xl", "bottom-6 left-6 border-b-4 border-l-4 rounded-bl-3xl", "bottom-6 right-6 border-b-4 border-r-4 rounded-br-3xl"].map((c) => (
          <span key={c} className={`absolute h-12 w-12 border-[hsl(37_40%_90%)] ${c}`} />
        ))}
        <div className="absolute inset-x-6 top-[46%] h-[3px] rounded-full bg-vermilion shadow-[0_0_24px_6px_hsl(var(--vermilion)/0.6)]" />
        <div className="absolute top-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur px-4 py-2 font-body text-[10px] tracking-luxe uppercase">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--vermilion))]" /> Analysing your plate…
        </div>
      </div>
      <p className="text-center font-body text-sm text-[hsl(37_40%_90%/0.7)] mt-5">Keep the whole plate in the frame.<br />Good light = better results.</p>
      <div className="flex items-center justify-around mt-6">
        <span className="h-12 w-12 rounded-2xl bg-[hsl(37_40%_90%/0.1)] inline-flex items-center justify-center"><ImageIcon className="h-5 w-5" /></span>
        <span className="h-20 w-20 rounded-full border-4 border-[hsl(37_40%_90%)] inline-flex items-center justify-center"><span className="h-14 w-14 rounded-full bg-vermilion inline-flex items-center justify-center"><Camera className="h-6 w-6 text-white" /></span></span>
        <span className="h-12 w-12 rounded-2xl bg-[hsl(37_40%_90%/0.1)] inline-flex items-center justify-center"><Zap className="h-5 w-5" /></span>
      </div>
    </div>
  </Phone>
);

/* 2 — AI result */
const items = [
  { n: "Grilled chicken breast", g: 150, kcal: 248, c: "#c98a4b" },
  { n: "White rice", g: 120, kcal: 156, c: "#e9dfc8" },
  { n: "Mixed green salad", g: 80, kcal: 18, c: "#5fa647" },
  { n: "Cherry tomatoes", g: 50, kcal: 9, c: "#E8392B" },
  { n: "Olive oil dressing", g: 10, kcal: 88, c: "#c9b44a" },
];
const ResultScreen = () => (
  <Phone>
    <AppBar title="Your meal" />
    <div className="px-5 pb-8">
      <div className="relative mt-4 h-44 rounded-[1.75rem] overflow-hidden bg-[radial-gradient(70%_70%_at_50%_45%,#4b3a2a,#1a130d)]">
        <Plate className="absolute left-1/2 -translate-x-1/2 -top-10 w-[280px]" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 font-body text-[9px] tracking-luxe uppercase"><Sparkles className="h-3 w-3 text-gold" /> AI estimate</span>
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <div className="font-body text-[10px] tracking-luxe uppercase text-gold">Lunch · 13:05</div>
          <h1 className="font-display text-4xl leading-none mt-1">519 <span className="text-2xl">kcal</span></h1>
        </div>
        <span className="rounded-full bg-[hsl(140_45%_40%/0.12)] text-[hsl(140_45%_32%)] px-3 py-1.5 font-body text-[10px] tracking-wide-2 uppercase">Fits your plan ✓</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[{ k: "Protein", v: "48 g", p: 0.42 }, { k: "Carbs", v: "39 g", p: 0.3 }, { k: "Fat", v: "15 g", p: 0.28 }].map((m) => (
          <div key={m.k} className="rounded-2xl bg-card border border-border p-3">
            <div className="font-body text-[9px] tracking-luxe uppercase text-muted-foreground">{m.k}</div>
            <div className="font-display text-2xl">{m.v}</div>
            <div className="h-1.5 rounded-full bg-secondary mt-1.5"><div className="h-full rounded-full bg-vermilion" style={{ width: `${m.p * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mt-6 mb-2">We found 5 items · tap to adjust</div>
      <ul className="rounded-2xl border border-border bg-card divide-y divide-border">
        {items.map((it, i) => (
          <li key={it.n} className="flex items-center gap-3 px-4 py-3">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ background: it.c }} />
            <span className="flex-1">
              <span className="block font-body text-sm">{it.n}</span>
              <span className="block font-body text-[11px] text-muted-foreground">{it.kcal} kcal</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-1.5 py-1">
              <span className="h-6 w-6 rounded-full bg-secondary inline-flex items-center justify-center"><Minus className="h-3 w-3" /></span>
              <span className={`font-body text-xs w-11 text-center ${i === 1 ? "text-gold font-medium" : ""}`}>{it.g} g</span>
              <span className="h-6 w-6 rounded-full bg-secondary inline-flex items-center justify-center"><Plus className="h-3 w-3" /></span>
            </span>
          </li>
        ))}
      </ul>
      <button className="mt-3 w-full rounded-2xl border border-dashed border-border py-3 font-body text-xs text-muted-foreground inline-flex items-center justify-center gap-2"><Search className="h-3.5 w-3.5" /> Add something we missed</button>
      <button className="mt-5 w-full h-13 py-4 rounded-full bg-primary text-primary-foreground font-body text-[11px] tracking-luxe uppercase inline-flex items-center justify-center gap-2"><Check className="h-4 w-4" /> Add to today's lunch</button>
    </div>
  </Phone>
);

/* 3 — today vs plan */
const Ring = ({ v, size = 190 }: { v: number; size?: number }) => {
  const r = size / 2 - 12, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--secondary))" strokeWidth="14" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--vermilion))" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} />
    </svg>
  );
};
const meals = [
  { t: "Breakfast", time: "07:40", n: "Formula 1 shake · vanilla + milk", k: 230, img: "shake" },
  { t: "Snack", time: "10:30", n: "Greek yogurt with berries", k: 140, img: "" },
  { t: "Lunch", time: "13:05", n: "Chicken, rice & salad", k: 519, img: "plate" },
];
const TodayScreen = () => (
  <Phone>
    <AppBar title="Today" />
    <div className="px-5 pb-8">
      <div className="flex gap-2 overflow-hidden mt-4 mb-5">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
          <span key={d} className={`flex-1 rounded-2xl py-2 text-center font-body text-[11px] ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{d}<span className="block font-display text-lg leading-tight">{23 + i}</span></span>
        ))}
      </div>
      <div className="relative mx-auto w-fit">
        <Ring v={889 / 1600} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl leading-none">711</span>
          <span className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mt-1">kcal left</span>
          <span className="font-body text-[11px] text-muted-foreground mt-1">889 / 1,600</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {[{ k: "Protein", v: 74, t: 120 }, { k: "Carbs", v: 92, t: 160 }, { k: "Fat", v: 31, t: 55 }, { k: "Fibre", v: 14, t: 25 }].map((m) => (
          <div key={m.k}>
            <div className="flex justify-between font-body text-xs mb-1"><span>{m.k}</span><span className="text-muted-foreground">{m.v} / {m.t} g</span></div>
            <div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(m.v / m.t) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-primary text-primary-foreground p-4 mt-6 flex gap-3 items-start">
        <img src={coachBubble} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-[hsl(var(--vermilion))]" />
        <div className="font-body text-xs leading-relaxed"><span className="font-script text-xl text-[hsl(var(--vermilion))] mr-1">Dalila:</span> Great protein at lunch! For dinner aim for ~40 g protein and lots of veggies 🥗</div>
      </div>
      <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mt-6 mb-2">Meals</div>
      <ul className="space-y-2">
        {meals.map((m) => (
          <li key={m.t} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-2.5 pr-4">
            <span className="h-12 w-12 rounded-xl overflow-hidden bg-[radial-gradient(#4b3a2a,#1a130d)] shrink-0 flex items-center justify-center">
              {m.img === "plate" ? <Plate className="w-16" variant={1} /> : m.img === "shake" ? <img src={f1Vanilla} alt="" className="h-10 w-auto" /> : <span className="text-xl">🫐</span>}
            </span>
            <span className="flex-1"><span className="block font-body text-[10px] tracking-luxe uppercase text-gold">{m.t} · {m.time}</span><span className="block font-body text-sm">{m.n}</span></span>
            <span className="font-display text-lg">{m.k}</span>
          </li>
        ))}
        <li className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-3 text-muted-foreground font-body text-sm"><span className="h-10 w-10 rounded-xl bg-vermilion inline-flex items-center justify-center"><Camera className="h-5 w-5 text-white" /></span> Snap your dinner</li>
      </ul>
    </div>
  </Phone>
);

/* 4 — plan from coach */
const PlanScreen = () => (
  <Phone>
    <AppBar title="My nutrition plan" />
    <div className="px-5 pb-8">
      <div className="rounded-[1.75rem] bg-stage text-[hsl(37_40%_90%)] p-6 mt-4">
        <div className="flex items-center gap-3 mb-4"><img src={coachBubble} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-gold" /><div><div className="font-body text-[9px] tracking-luxe uppercase text-gold">Made for you by</div><div className="font-script text-2xl leading-none">Dalila</div></div></div>
        <h1 className="font-display text-4xl leading-none mb-2">Lean & Strong</h1>
        <p className="font-body text-xs text-[hsl(37_40%_90%/0.7)]">Week 4 of 12 · updated yesterday</p>
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[{ k: "kcal", v: "1,600" }, { k: "Protein", v: "120g" }, { k: "Carbs", v: "160g" }, { k: "Fat", v: "55g" }].map((m) => (
            <div key={m.k} className="rounded-xl bg-[hsl(37_40%_90%/0.08)] py-2 text-center"><div className="font-display text-lg leading-tight">{m.v}</div><div className="font-body text-[8px] tracking-luxe uppercase text-[hsl(37_40%_90%/0.6)]">{m.k}</div></div>
          ))}
        </div>
      </div>
      <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground mt-6 mb-2">Your day</div>
      <ul className="space-y-2">
        {[
          { t: "Breakfast", d: "Formula 1 shake + 250 ml milk", k: "≈ 230 kcal", ok: true },
          { t: "Snack", d: "Yogurt or a fruit + handful of nuts", k: "≈ 150 kcal", ok: true },
          { t: "Lunch", d: "Palm of protein, fist of carbs, half plate veggies", k: "≈ 500 kcal", ok: true },
          { t: "Afternoon", d: "Fibre drink + herbal tea", k: "≈ 30 kcal", ok: false },
          { t: "Dinner", d: "Protein + big salad, light carbs", k: "≈ 450 kcal", ok: false },
        ].map((m) => (
          <li key={m.t} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
            <span className={`h-7 w-7 rounded-full shrink-0 inline-flex items-center justify-center ${m.ok ? "bg-vermilion text-white" : "border-2 border-border"}`}>{m.ok && <Check className="h-4 w-4" />}</span>
            <span className="flex-1"><span className="block font-display text-xl leading-tight">{m.t}</span><span className="block font-body text-xs text-muted-foreground">{m.d}</span></span>
            <span className="font-body text-[11px] text-muted-foreground whitespace-nowrap">{m.k}</span>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-border bg-card p-4 mt-4">
        <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-2">Dalila's rules for you</div>
        <ul className="space-y-1.5 font-body text-sm">{["2 L water every day", "No sugary drinks", "Protein in every meal"].map((r) => <li key={r} className="flex gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> {r}</li>)}</ul>
      </div>
    </div>
  </Phone>
);

/* 5 — coach view (desktop) */
const clients = [
  { n: "Ana Kovač", p: "Lean & Strong", k: 889, t: 1600, s: "On track", c: "green", on: true },
  { n: "Mia Hodžić", p: "Energy Boost", k: 1420, t: 1800, s: "On track", c: "green" },
  { n: "Lejla Begić", p: "Lean & Strong", k: 2150, t: 1600, s: "Over target", c: "red" },
  { n: "Sara Petrović", p: "Starter", k: 0, t: 1700, s: "No meals logged", c: "amber" },
  { n: "Emina Delić", p: "Full Coaching", k: 1210, t: 1500, s: "On track", c: "green" },
];
const CoachScreen = () => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-background">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><Monogram className="text-2xl" /><span className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Coach dashboard</span></div>
        <div className="flex items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-body text-xs text-muted-foreground"><Search className="h-3.5 w-3.5" /> Search clients</span><img src={coachBubble} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-gold" /></div>
      </div>
    </header>
    <div className="grid grid-cols-[300px_1fr] min-h-[calc(100vh-69px)]">
      <aside className="border-r border-border p-5 bg-card/60">
        <div className="flex items-center justify-between mb-4"><span className="font-body text-[10px] tracking-luxe uppercase text-gold inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Clients · 24</span><span className="font-body text-[10px] text-muted-foreground">Today</span></div>
        <ul className="space-y-1.5">
          {clients.map((c) => (
            <li key={c.n} className={`rounded-2xl p-3 ${c.on ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <div className="flex items-center gap-3">
                <span className={`h-9 w-9 rounded-full inline-flex items-center justify-center font-display ${c.on ? "bg-primary-foreground text-primary" : "bg-secondary"}`}>{c.n[0]}</span>
                <span className="flex-1"><span className="block font-body text-sm">{c.n}</span><span className={`block font-body text-[11px] ${c.on ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{c.p}</span></span>
                <span className={`h-2.5 w-2.5 rounded-full ${c.c === "green" ? "bg-[hsl(140_50%_45%)]" : c.c === "red" ? "bg-vermilion" : "bg-[hsl(40_90%_55%)]"}`} />
              </div>
              <div className={`mt-2 h-1.5 rounded-full ${c.on ? "bg-primary-foreground/20" : "bg-secondary"}`}><div className={`h-full rounded-full ${c.k > c.t ? "bg-vermilion" : c.on ? "bg-primary-foreground" : "bg-primary"}`} style={{ width: `${Math.min(1, c.k / c.t) * 100}%` }} /></div>
              <div className={`mt-1 font-body text-[10px] ${c.on ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{c.k} / {c.t} kcal · {c.s}</div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="p-8">
        <div className="flex items-end justify-between mb-6">
          <div><SectionLabel>Client</SectionLabel><h1 className="font-display text-5xl leading-none">Ana Kovač</h1><p className="font-body text-sm text-muted-foreground mt-2">Lean & Strong · week 4 of 12 · 12-day streak 🔥</p></div>
          <div className="flex gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-[10px] tracking-luxe uppercase"><Pencil className="h-3.5 w-3.5" /> Edit plan</span><span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-body text-[10px] tracking-luxe uppercase"><MessageCircle className="h-3.5 w-3.5" /> Message</span></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ i: Flame, k: "Today", v: "889 kcal", s: "of 1,600" }, { i: Target, k: "Protein", v: "74 g", s: "of 120 g" }, { i: Check, k: "Logged this week", v: "19 meals", s: "92% of days" }, { i: Sparkles, k: "Weight", v: "71.5 kg", s: "−2.7 kg" }].map(({ i: I, k, v, s }) => (
            <div key={k} className="rounded-2xl border border-border bg-card p-4"><div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground inline-flex items-center gap-1.5"><I className="h-3.5 w-3.5 text-gold" /> {k}</div><div className="font-display text-3xl mt-1">{v}</div><div className="font-body text-[11px] text-muted-foreground">{s}</div></div>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_340px] gap-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-4">Today's food log</div>
            <ul className="space-y-3">
              {meals.map((m) => (
                <li key={m.t} className="flex items-center gap-4 rounded-2xl border border-border p-3">
                  <span className="h-16 w-16 rounded-xl overflow-hidden bg-[radial-gradient(#4b3a2a,#1a130d)] flex items-center justify-center shrink-0">{m.img === "plate" ? <Plate className="w-20" variant={2} /> : m.img === "shake" ? <img src={f1Vanilla} alt="" className="h-12 w-auto" /> : <span className="text-2xl">🫐</span>}</span>
                  <span className="flex-1"><span className="block font-body text-[10px] tracking-luxe uppercase text-gold">{m.t} · {m.time}</span><span className="block font-body">{m.n}</span>{m.img === "plate" && <span className="inline-flex items-center gap-1 font-body text-[10px] text-muted-foreground"><Sparkles className="h-3 w-3" /> AI photo estimate · 48 g protein</span>}</span>
                  <span className="font-display text-2xl">{m.k}</span>
                  <span className="h-9 w-9 rounded-full border border-border inline-flex items-center justify-center"><MessageCircle className="h-4 w-4" /></span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl bg-primary text-primary-foreground p-6">
            <div className="font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))] mb-4">Daily targets</div>
            {[{ k: "Calories", v: "1,600 kcal" }, { k: "Protein", v: "120 g" }, { k: "Carbs", v: "160 g" }, { k: "Fat", v: "55 g" }, { k: "Fibre", v: "25 g" }, { k: "Water", v: "2 L" }].map((r) => (
              <div key={r.k} className="flex items-center justify-between py-2.5 border-b border-primary-foreground/10 font-body text-sm"><span className="text-primary-foreground/70">{r.k}</span><span className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-1">{r.v} <Pencil className="h-3 w-3 opacity-60" /></span></div>
            ))}
            <div className="mt-5 rounded-2xl bg-primary-foreground/10 p-4 font-body text-xs leading-relaxed"><div className="text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))] mb-1">Quick reply</div>"Great protein at lunch! For dinner aim for ~40 g protein and lots of veggies 🥗"</div>
            <div className="mt-4 w-full rounded-full bg-vermilion text-white py-3 text-center font-body text-[10px] tracking-luxe uppercase inline-flex items-center justify-center gap-2">Send to Ana <ChevronRight className="h-3.5 w-3.5" /></div>
          </section>
        </div>
      </main>
    </div>
  </div>
);

const FoodPreview = () => {
  const v = new URLSearchParams(window.location.search).get("view");
  if (v === "result") return <ResultScreen />;
  if (v === "today") return <TodayScreen />;
  if (v === "plan") return <PlanScreen />;
  if (v === "coach") return <CoachScreen />;
  return <SnapScreen />;
};
export default FoodPreview;
