import { useState } from "react";
import { Bell, Calendar, Check, ChevronDown, Crown, Download, Flame, Heart, LogOut, MessageCircle, Settings, Sparkles, Target, TrendingDown, User, Droplets, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Monogram, SectionLabel } from "@/components/SiteChrome";
import coachBubble from "@/assets/coach-bubble.webp";
import f1Vanilla from "@/assets/f1-vanilla.webp";
import f1Chocolate from "@/assets/f1-chocolate.webp";
import pTea from "@/assets/p-tea.webp";
import pFibre from "@/assets/p-fibreconc.webp";
import pSkin from "@/assets/p-skin.webp";

/* ───────────────────────── MOCK-UP ONLY: example data, nothing is connected ───────────────────────── */

const MemberHeader = ({ menuOpen = false }: { menuOpen?: boolean }) => (
  <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
    <div className="container mx-auto flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3">
        <Monogram className="text-2xl" />
        <span className="hidden lg:block font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Member Area</span>
      </div>
      <nav className="hidden md:flex items-center gap-8 font-body text-xs tracking-wide-2 uppercase">
        <span className="text-gold">My Plan</span>
        <span>Progress</span>
        <span>Recipes</span>
        <span>Products</span>
      </nav>
      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-full border border-border">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-vermilion text-[9px] text-white font-body inline-flex items-center justify-center">2</span>
        </button>
        <div className="relative">
          <button className="flex items-center gap-2 rounded-full border border-border pl-1 pr-3 py-1">
            <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-display text-sm inline-flex items-center justify-center">A</span>
            <span className="hidden sm:block font-body text-xs">Ana</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card shadow-soft p-2 font-body text-sm">
              <div className="px-3 py-2 border-b border-border mb-1">
                <div className="font-medium">Ana Kovač</div>
                <div className="text-[11px] text-muted-foreground">ana@example.com</div>
              </div>
              {[{ i: User, t: "My profile" }, { i: Crown, t: "My subscription" }, { i: Settings, t: "Settings" }].map(({ i: I, t }) => (
                <div key={t} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"><I className="h-4 w-4 text-gold" /> {t}</div>
              ))}
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground"><LogOut className="h-4 w-4" /> Log out</div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);

const Ring = ({ value, size = 132 }: { value: number; size?: number }) => {
  const r = size / 2 - 9, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(37 40% 90% / 0.15)" strokeWidth="9" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--vermilion))" strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} />
    </svg>
  );
};

const ritual = [
  { t: "Morning shake", s: "Formula 1 · Vanilla Crème", img: f1Vanilla, done: true },
  { t: "Herbal beverage", s: "Mango & pitaya, iced", img: pTea, done: true },
  { t: "Fibre drink", s: "Fibre Concentrate in water", img: pFibre, done: false },
  { t: "Evening skincare", s: "HL/Skin routine", img: pSkin, done: false },
];

const weights = [74.2, 73.8, 73.5, 73.1, 72.6, 72.4, 71.9, 71.5];
const Chart = () => {
  const w = 520, h = 150, min = 70.5, max = 74.8;
  const pts = weights.map((v, i) => [20 + (i * (w - 40)) / (weights.length - 1), 15 + ((max - v) / (max - min)) * (h - 30)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="hsl(var(--vermilion))" stopOpacity="0.25" />
          <stop offset="1" stopColor="hsl(var(--vermilion))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((k) => <line key={k} x1="20" x2={w - 20} y1={20 + k * 50} y2={20 + k * 50} stroke="hsl(var(--border))" strokeDasharray="3 5" />)}
      <path d={`${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`} fill="url(#fill)" />
      <path d={d} fill="none" stroke="hsl(var(--vermilion))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 6 : 3.5} fill={i === pts.length - 1 ? "hsl(var(--vermilion))" : "hsl(var(--background))"} stroke="hsl(var(--vermilion))" strokeWidth="2" />)}
    </svg>
  );
};

const card = "rounded-3xl border border-border bg-card p-6 md:p-7";

export const MemberDashboard = ({ menuOpen = false }: { menuOpen?: boolean }) => {
  const [done, setDone] = useState(ritual.map((r) => r.done));
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MemberHeader menuOpen={menuOpen} />

      {/* welcome band */}
      <section className="bg-stage text-[hsl(37_40%_90%)] pt-24 md:pt-28 pb-10 md:pb-14">
        <div className="container mx-auto grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">Monday · 23 November</div>
            <h1 className="font-display text-5xl md:text-6xl leading-[1] mb-4">Good morning, <em className="gold-text font-normal">Ana.</em></h1>
            <p className="font-body text-[hsl(37_40%_90%/0.75)] max-w-lg">Day 23 of your 90-day plan. You're doing great — two more habits to tick off today.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              {[{ i: Flame, t: "12-day streak" }, { i: TrendingDown, t: "−2.7 kg so far" }, { i: Target, t: "Goal: 68 kg" }].map(({ i: I, t }) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full bg-[hsl(37_40%_90%/0.1)] border border-[hsl(37_40%_90%/0.2)] px-4 py-2 font-body text-[11px] tracking-wide-2 uppercase">
                  <I className="h-3.5 w-3.5 text-gold" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto">
            <Ring value={23 / 90} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl leading-none">26%</span>
              <span className="font-body text-[9px] tracking-luxe uppercase text-[hsl(37_40%_90%/0.6)] mt-1">of plan</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-10 md:py-14 grid lg:grid-cols-3 gap-6">
        {/* today's ritual */}
        <section className={`${card} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <SectionLabel>Today's ritual</SectionLabel>
              <h2 className="font-display text-3xl">{done.filter(Boolean).length} of {ritual.length} done</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-body text-xs text-muted-foreground"><Droplets className="h-4 w-4 text-gold" /> Water 1.5 / 2 L</div>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden mb-6">
            <div className="h-full rounded-full bg-vermilion transition-all" style={{ width: `${(done.filter(Boolean).length / ritual.length) * 100}%` }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {ritual.map((r, i) => (
              <button key={r.t} onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} className={`flex items-center gap-4 rounded-2xl border p-3 pr-4 text-left transition-colors ${done[i] ? "border-gold/40 bg-secondary/60" : "border-border hover:border-gold/40"}`}>
                <span className="h-14 w-14 shrink-0 rounded-xl bg-secondary flex items-end justify-center overflow-hidden">
                  <img src={r.img} alt="" className="h-[88%] w-auto object-contain" />
                </span>
                <span className="flex-1">
                  <span className={`block font-display text-xl leading-tight ${done[i] ? "line-through decoration-vermilion/60" : ""}`}>{r.t}</span>
                  <span className="block font-body text-xs text-muted-foreground">{r.s}</span>
                </span>
                <span className={`h-7 w-7 rounded-full border-2 inline-flex items-center justify-center ${done[i] ? "bg-vermilion border-vermilion text-white" : "border-border"}`}>
                  {done[i] && <Check className="h-4 w-4" />}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* my plan */}
        <section className={`${card} bg-primary text-primary-foreground border-primary`}>
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))]"><Crown className="h-3.5 w-3.5" /> My plan</span>
            <span className="rounded-full bg-[hsl(140_50%_45%/0.2)] text-[hsl(140_55%_70%)] px-3 py-1 font-body text-[9px] tracking-luxe uppercase">Active</span>
          </div>
          <h2 className="font-display text-4xl mb-1">Full Coaching</h2>
          <p className="font-body text-xs text-primary-foreground/60 mb-6">Renews 15 December · €59 / month</p>
          <ul className="space-y-3 mb-7">
            {["Personal plan built for you", "Weekly check-in with Dalila", "Message support every day", "Recipes & meal guide", "Member price on products"].map((b) => (
              <li key={b} className="flex gap-3 font-body text-sm"><Check className="h-4 w-4 text-[hsl(var(--vermilion))] shrink-0 mt-0.5" /> {b}</li>
            ))}
          </ul>
          <Button className="w-full h-11 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-body text-[11px] tracking-luxe uppercase">Manage subscription</Button>
        </section>

        {/* progress */}
        <section className={`${card} lg:col-span-2`}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div>
              <SectionLabel>My progress</SectionLabel>
              <h2 className="font-display text-3xl">Weight · last 8 weeks</h2>
            </div>
            <div className="flex gap-6">
              {[{ k: "Start", v: "74.2 kg" }, { k: "Now", v: "71.5 kg" }, { k: "Waist", v: "−5 cm" }].map((s) => (
                <div key={s.k} className="text-right">
                  <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{s.k}</div>
                  <div className="font-display text-2xl">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <Chart />
          <Button variant="outline" className="mt-4 rounded-full border-foreground/25 font-body text-[10px] tracking-luxe uppercase h-10 px-5 bg-transparent">+ Log today's weight</Button>
        </section>

        {/* coach message + check-in */}
        <section className={`${card} flex flex-col`}>
          <SectionLabel>From your coach</SectionLabel>
          <div className="flex items-center gap-3 mb-4">
            <img src={coachBubble} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-gold" />
            <div>
              <div className="font-script text-2xl text-gold leading-none">Dalila</div>
              <div className="font-body text-[11px] text-muted-foreground">Yesterday, 19:42</div>
            </div>
          </div>
          <p className="font-body text-sm leading-relaxed bg-secondary rounded-2xl rounded-tl-sm p-4 mb-5">
            So proud of your streak! 💪 This week try the chocolate shake with a spoon of peanut butter — and don't forget your fibre in the afternoon.
          </p>
          <div className="rounded-2xl border border-border p-4 mb-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gold" />
            <div className="flex-1">
              <div className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Next check-in</div>
              <div className="font-display text-xl">Thursday · 18:00</div>
            </div>
          </div>
          <Button className="mt-auto h-11 rounded-full bg-primary text-primary-foreground font-body text-[11px] tracking-luxe uppercase"><MessageCircle className="mr-2 h-4 w-4" /> Message Dalila</Button>
        </section>

        {/* recipes / resources */}
        <section className={`${card} lg:col-span-2`}>
          <SectionLabel>For you this week</SectionLabel>
          <div className="grid sm:grid-cols-3 gap-4 mt-2">
            {[
              { img: f1Chocolate, t: "Choco-peanut protein shake", m: "Recipe · 3 min" },
              { img: pTea, t: "Iced mango tea refresher", m: "Recipe · 2 min" },
              { img: f1Vanilla, t: "Your meal guide — week 4", m: "PDF · personal" },
            ].map((r) => (
              <div key={r.t} className="rounded-2xl border border-border overflow-hidden group">
                <div className="h-32 bg-[radial-gradient(60%_70%_at_50%_70%,hsl(var(--vermilion)/0.15),transparent),linear-gradient(180deg,hsl(37_45%_94%),hsl(36_32%_85%))] flex items-end justify-center">
                  <img src={r.img} alt="" className="h-[85%] w-auto object-contain group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="font-display text-lg leading-tight mb-1">{r.t}</div>
                  <div className="font-body text-[11px] text-muted-foreground flex items-center gap-1.5">{r.m.startsWith("PDF") ? <Download className="h-3 w-3" /> : <Heart className="h-3 w-3" />} {r.m}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* member perks */}
        <section className={card}>
          <SectionLabel>Member perks</SectionLabel>
          <ul className="space-y-4 mt-2">
            {[{ i: Star, t: "Member price", s: "On every product order" }, { i: Sparkles, t: "Free starter kit", s: "Unlocked at day 30 — 7 days to go" }, { i: Heart, t: "Invite a friend", s: "Get one month free" }].map(({ i: I, t, s }) => (
              <li key={t} className="flex gap-3">
                <span className="h-10 w-10 rounded-full bg-secondary inline-flex items-center justify-center shrink-0"><I className="h-4 w-4 text-gold" /></span>
                <span><span className="block font-display text-xl leading-tight">{t}</span><span className="block font-body text-xs text-muted-foreground">{s}</span></span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

/* plans page a visitor sees before paying */
export const PlansPreview = () => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Monogram className="text-2xl" />
        <nav className="hidden md:flex items-center gap-8 font-body text-xs tracking-wide-2 uppercase"><span>Coach</span><span>Products</span><span className="text-gold">Plans</span><span>Ritual</span></nav>
        <div className="flex gap-3"><Button size="sm" variant="outline" className="rounded-2xl font-body text-[10px] tracking-luxe uppercase bg-transparent">Sign In</Button><Button size="sm" className="rounded-2xl bg-gold text-primary-foreground font-body text-[10px] tracking-luxe uppercase">Create Account</Button></div>
      </div>
    </header>
    <section className="pt-32 pb-24 container mx-auto">
      <div className="text-center mb-14">
        <SectionLabel>Coaching plans</SectionLabel>
        <h1 className="font-display text-5xl md:text-6xl">Choose <em className="gold-text font-normal">your plan.</em></h1>
        <p className="font-body text-muted-foreground mt-5 max-w-lg mx-auto">Create your account, pick a plan and get your own member area with your personal plan, progress and direct support.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {[
          { n: "Starter", p: "29", d: "Start your routine", f: ["Personal starting plan", "Daily ritual tracker", "Recipe library"], hot: false },
          { n: "Full Coaching", p: "59", d: "Most popular", f: ["Everything in Starter", "Weekly check-in with Dalila", "Message support every day", "Progress tracking & meal guide", "Member price on products"], hot: true },
          { n: "VIP 1:1", p: "99", d: "Maximum support", f: ["Everything in Full Coaching", "Video call every week", "Fully custom meal plan", "Priority answers"], hot: false },
        ].map((pl) => (
          <div key={pl.n} className={`relative rounded-3xl border p-8 flex flex-col ${pl.hot ? "bg-primary text-primary-foreground border-primary shadow-gold md:-translate-y-4" : "bg-card border-border"}`}>
            {pl.hot && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-vermilion text-white px-4 py-1 font-body text-[9px] tracking-luxe uppercase">Most popular</span>}
            <div className={`font-body text-[10px] tracking-luxe uppercase mb-2 ${pl.hot ? "text-[hsl(var(--vermilion))]" : "text-gold"}`}>{pl.d}</div>
            <h3 className="font-display text-3xl mb-4">{pl.n}</h3>
            <div className="mb-6"><span className="font-display text-5xl">€{pl.p}</span><span className={`font-body text-sm ${pl.hot ? "text-primary-foreground/60" : "text-muted-foreground"}`}> / month</span></div>
            <ul className="space-y-3 mb-8">
              {pl.f.map((f) => <li key={f} className="flex gap-3 font-body text-sm"><Check className={`h-4 w-4 shrink-0 mt-0.5 ${pl.hot ? "text-[hsl(var(--vermilion))]" : "text-gold"}`} /> {f}</li>)}
            </ul>
            <Button className={`mt-auto h-12 rounded-full font-body text-[11px] tracking-luxe uppercase ${pl.hot ? "bg-vermilion text-white hover:bg-vermilion/90" : "bg-primary text-primary-foreground"}`}>Choose {pl.n}</Button>
          </div>
        ))}
      </div>
      <p className="text-center font-body text-xs text-muted-foreground mt-10">Secure payment by card, Apple Pay or Google Pay · Cancel anytime</p>
    </section>
  </div>
);

const MemberPreview = () => {
  const view = new URLSearchParams(window.location.search).get("view");
  if (view === "plans") return <PlansPreview />;
  return <MemberDashboard menuOpen={view === "menu"} />;
};

export default MemberPreview;
