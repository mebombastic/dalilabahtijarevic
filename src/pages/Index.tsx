import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Play, Users, Trophy, Heart, Sparkles, ArrowRight, ArrowUp, Mic, Camera, Menu, Globe, Sun, Moon, ChevronLeft, ChevronRight, Dumbbell, Search, ShoppingBag, ShieldCheck, MessageCircle, Instagram } from "lucide-react";
import storyImg from "@/assets/story-video.jpg";
import f1Chocolate from "@/assets/f1-chocolate.webp";
import f1Raspberry from "@/assets/f1-raspberry.webp";
import f1Mint from "@/assets/f1-mint.webp";
import f1Cookie from "@/assets/f1-cookie.webp";
import f1Latte from "@/assets/f1-latte.webp";
import f1Vanilla from "@/assets/f1-vanilla.webp";
import f1Banana from "@/assets/f1-banana.webp";
import { FlavourCarousel, type FlavourTin } from "@/components/FlavourCarousel";
import { ProductMenu, type Product } from "@/components/ProductMenu";
import { DailyRitual, type RitualStep } from "@/components/DailyRitual";
import pTea from "@/assets/p-tea.webp";
import pFibreConc from "@/assets/p-fibreconc.webp";
import pOatFibre from "@/assets/p-oatfibre.webp";
import pShaker from "@/assets/p-shaker.webp";
import pKit from "@/assets/p-kit.webp";
import pSkin from "@/assets/p-skin.webp";
import pBioniq from "@/assets/p-bioniq.webp";
import coachPhoto from "@/assets/coach-dalila.webp";
import coachBubble from "@/assets/coach-bubble.webp";
import { AuthDialog } from "@/components/AuthDialog";
import { CookieBanner } from "@/components/CookieBanner";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { Words } from "@/components/Words";

type Lang = "en" | "de" | "sr";

const Monogram = ({ className = "" }: { className?: string }) => (
  <span className={`font-display font-bold inline-flex items-center ${className}`}>
    <span className="gold-text">D</span>
    <span className="mx-0.5 text-foreground/40 italic font-light">/</span>
    <span className="text-foreground italic">B</span>
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-3 mb-4">
    <span className="h-px w-8 bg-gold" />
    <span className="font-body text-xs tracking-luxe uppercase text-gold">{children}</span>
    <span className="h-px w-8 bg-gold" />
  </div>
);

const PromptCard = ({
  placeholder,
  ctaLabel,
  ctaIcon: CtaIcon = ShoppingBag,
  onCta,
  onSubmit,
}: {
  placeholder: string;
  ctaLabel: string;
  ctaIcon?: typeof ShoppingBag;
  onCta: () => void;
  onSubmit: () => void;
}) => (
  <div className="mx-auto w-full max-w-xl rounded-3xl bg-background/85 backdrop-blur-xl border border-border shadow-soft p-4 text-left">
    <div className="font-body text-sm text-muted-foreground px-3 pt-2 pb-6">{placeholder}</div>
    <div className="flex items-center justify-between gap-2 px-1">
      <button
        type="button"
        onClick={onCta}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-gold/60 hover:text-gold transition-colors font-body text-xs"
      >
        <CtaIcon className="h-3.5 w-3.5" /> {ctaLabel}
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Voice"
          className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold/60 hover:text-gold transition-colors"
        >
          <Mic className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Start"
          onClick={onSubmit}
          className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-gold text-primary-foreground hover:bg-gold/90 shadow-gold transition-colors"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);


const features = [
  { icon: Trophy, title: "Proven Results", desc: "Real transformations from real clients who showed up and did the work." },
  { icon: Heart, title: "Personalized Support", desc: "Certified coaching that adapts to your body, your pace, your life." },
  { icon: Sparkles, title: "Expert Guidance", desc: "Everything you need to succeed — structure, nutrition, mindset." },
];


const IG_PROFILE = "https://www.instagram.com/dalilafitlife";
const IG_DM = "https://ig.me/m/dalilafitlife";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const heroLineup: FlavourTin[] = [
  { src: f1Chocolate, name: "Formula 1 · Smooth Chocolate", color: "#7a4a33" },
  { src: pTea, name: "Herbal Beverage · Mango & Pitaya", color: "#f2a33a", scale: 0.74 },
  { src: f1Raspberry, name: "Formula 1 · Raspberry & White Choc", color: "#e79bb4" },
  { src: pOatFibre, name: "Oat Apple Fibre", color: "#b3262f", scale: 0.56 },
  { src: f1Mint, name: "Formula 1 · Mint Chocolate", color: "#9fd3a6" },
  { src: pFibreConc, name: "Fibre Concentrate · Orange & Goji", color: "#f39a1e", scale: 1.04 },
  { src: f1Latte, name: "Formula 1 · Café Latte", color: "#c08b62" },
  { src: pShaker, name: "Herbalife Shaker", color: "#1f6b3a", scale: 0.9 },
  { src: f1Vanilla, name: "Formula 1 · Vanilla Crème", color: "#f3e6bf" },
  { src: f1Banana, name: "Formula 1 · Banana Cream", color: "#f2cf6a" },
];

const f1Flavours = [
  { src: f1Chocolate, label: "Smooth Chocolate", color: "#7a4a33" },
  { src: f1Raspberry, label: "Raspberry & White Chocolate", color: "#e79bb4" },
  { src: f1Mint, label: "Mint Chocolate", color: "#9fd3a6" },
  { src: f1Cookie, label: "Cookie Crunch", color: "#c9ad95" },
  { src: f1Latte, label: "Café Latte", color: "#c08b62" },
  { src: f1Vanilla, label: "Vanilla Crème", color: "#f3e6bf" },
  { src: f1Banana, label: "Banana Cream", color: "#f2cf6a" },
];

const products: Product[] = [
  {
    name: "Formula 1 Healthy Meal",
    subtitle: "Nutritional shake mix",
    category: "Shakes",
    badge: "Bestseller",
    kind: "cutout",
    images: f1Flavours,
    desc: "A balanced, nutritious meal in a glass — the heart of a healthy breakfast. Just shake with milk or a plant drink and go.",
    facts: ["High-quality protein in every serving", "25 vitamins & minerals", "Ready in under 2 minutes", "7 delicious flavours — tap a colour"],
  },
  {
    name: "Breakfast Starter Kit",
    subtitle: "Everything to begin",
    category: "Shakes",
    kind: "cutout",
    images: [{ src: pKit }],
    desc: "Formula 1 Healthy Meal, Oat Apple Fibre, a Herbalife shaker and a measuring scoop — the easiest way to start your morning routine.",
    facts: ["Formula 1 Healthy Meal (550 g)", "Oat Apple Fibre (204 g)", "Shaker + measuring scoop"],
  },
  {
    name: "Oat Apple Fibre",
    subtitle: "Apple flavour · 204 g",
    category: "Fibre & Digestion",
    kind: "cutout",
    images: [{ src: pOatFibre }],
    desc: "A smooth, apple-flavoured fibre drink from six fibre sources — apple, oat, maize, citrus, chicory and soya. Stir into water, juice or your shake.",
    facts: ["5 g of fibre per serving", "Only 18 kcal per serving", "No artificial sweeteners"],
  },
  {
    name: "Fibre Concentrate",
    subtitle: "Orange & goji berry · 500 ml",
    category: "Fibre & Digestion",
    kind: "cutout",
    images: [{ src: pFibreConc }],
    desc: "A concentrated fibre drink you mix with water. Calcium supports normal digestive enzyme function and vitamin C supports the immune system.",
    facts: ["High in fibre", "With calcium & vitamin C", "Sugar-free, vegan & gluten-free"],
  },
  {
    name: "Instant Herbal Beverage",
    subtitle: "Mango & pitaya · 102 g",
    category: "Tea & Energy",
    kind: "cutout",
    images: [{ src: pTea }],
    desc: "A refreshing, low-calorie tea drink with tea extracts — enjoy it hot or over ice for a natural lift during the day.",
    facts: ["With green & black tea extracts", "Sweetened with stevia", "Delicious hot or iced"],
    note: "Contains caffeine — not for children, pregnant or breastfeeding women.",
  },
  {
    name: "HL/Skin Collection",
    subtitle: "New skincare line",
    category: "Skin Care",
    badge: "New",
    kind: "photo",
    images: [{ src: pSkin }],
    desc: "Herbalife's new skincare, made with Korean skincare science — from a gentle resurfacing gel cleanser to a 10% niacinamide serum and the Ultimate Tension Cream.",
    facts: ["Cleanser, serum, lotion & creams", "Brightens and evens skin tone", "No added parabens"],
  },
  {
    name: "Bioniq GO",
    subtitle: "Personalised supplement",
    category: "Personalised",
    badge: "New",
    kind: "photo",
    images: [{ src: pBioniq }],
    desc: "Daily supplement granules made for you: a short wellness assessment matches you with one of 40 personalised formulas.",
    facts: ["Personalised to your needs", "Just 2 scoops a day", "Now part of the Herbalife family"],
  },
];

const ritual: RitualStep[] = [
  { time: "Morning · 7:00", title: "Shake up your breakfast", text: "Start with a Formula 1 Healthy Meal — protein, vitamins and minerals in two minutes, so you're full and focused until lunch.", img: f1Vanilla, kind: "cutout" },
  { time: "Midday · 12:00", title: "Hydrate & refresh", text: "A glass of Instant Herbal Beverage, hot or iced, for a natural lift and to help you drink more through the day.", img: pTea, kind: "cutout" },
  { time: "Afternoon · 16:00", title: "Feel light with fibre", text: "Mix Fibre Concentrate or Oat Apple Fibre into water — an easy way to get more fibre into your day.", img: pFibreConc, kind: "cutout" },
  { time: "Evening · 21:00", title: "Glow while you rest", text: "Wind down with your HL/Skin routine — cleanse, treat and moisturise so your skin looks as good as you feel.", img: pSkin, kind: "photo" },
];

const heroChips = [
  { label: "Shakes · fibre · tea · skin", pos: "hidden md:block md:left-[2%] md:top-[4%]", delay: 2.3, bob: "0s" },
  { label: "Protein-packed breakfast", pos: "hidden md:block md:left-[6%] md:top-[14%]", delay: 2.45, bob: "-2s" },
];

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const openAuth = (mode: "register" | "login") => { setAuthMode(mode); setAuthOpen(true); };
  const langLabel: Record<Lang, string> = { en: "EN", de: "DE", sr: "SR" };

  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") localStorage.setItem("theme", next);
  };

  useReveal();
  useParallax();
  useScrollProgress();



  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="animate-nav-in fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-3">
            <Monogram className="text-2xl" />
            <span className="hidden sm:block font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Dalila Bahtijarevic · FitLife Coach</span>
          </a>
          <nav className="hidden md:flex items-center gap-10 font-body text-xs tracking-wide-2 uppercase">
            <a href="#coach" className="hover:text-gold transition-colors">Coach</a>
            <a href="#why" className="hover:text-gold transition-colors">Why Us</a>
            <a href="#products" className="hover:text-gold transition-colors">Products</a>
            <a href="#ritual" className="hover:text-gold transition-colors">Ritual</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-border hover:border-gold/60 font-body text-[10px] tracking-luxe uppercase transition-colors"
              >
                <Globe className="h-3 w-3" /> {langLabel[lang]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-background border border-border min-w-[80px] shadow-soft">
                  {(Object.keys(langLabel) as Lang[]).map((l) => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 font-body text-[10px] tracking-luxe uppercase hover:bg-secondary hover:text-gold transition-colors ${l === lang ? "text-gold" : ""}`}>
                      {langLabel[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-gold/60 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <Button size="sm" onClick={() => openAuth("login")} variant="outline" className="hidden sm:inline-flex border-foreground/30 hover:border-gold hover:text-gold rounded-2xl font-body text-[10px] tracking-luxe uppercase bg-transparent">
              Sign In
            </Button>
            <Button size="sm" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-2xl font-body text-[10px] tracking-luxe uppercase">
              Create Account
            </Button>
            <Menu className="md:hidden h-5 w-5 text-foreground/70" />
          </div>
        </div>
      </header>

      {/* HERO — product stage: products rise in, float, chips + coach bubble pop in, giant headline */}
      <section id="top" data-progress="through" className="bg-stage relative min-h-screen pt-24 pb-12 overflow-hidden text-[hsl(36_28%_94%)]">
        <div className="container mx-auto relative flex flex-col items-center text-center">
          <div className="animate-blur-up relative z-30 mt-4 md:mt-6" style={{ animationDelay: "0.4s" }}>
            <SectionLabel>Dalila Bahtijarevic · FitLife Coach</SectionLabel>
          </div>

          <div
            data-reveal="stage"
            className="relative w-full max-w-5xl h-[440px] sm:h-[500px] md:h-[60vh] md:min-h-[500px] md:max-h-[620px]">
            {/* flavour carousel */}
            <div className="stage-parallax absolute inset-x-0 top-[14%] md:top-[6%] bottom-[29%] sm:bottom-[25%] md:bottom-[21%]" style={{ "--depth": "50px" } as CSSProperties}>
              <FlavourCarousel tins={heroLineup} startDelay={0.3} />
            </div>

            {/* giant headline in front of the products */}
            <h1 className="words-in absolute inset-x-0 bottom-0 z-20 font-display leading-[0.9] text-[14vw] sm:text-[12vw] md:text-[8.6vw] lg:text-[7.6rem] drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              <Words text="Prove" start={1.5} /> <span className="italic"><Words text="Yourself" start={1.62} /></span><br className="md:hidden" />{" "}
              <Words text="Right." className="gold-text" start={1.76} />
            </h1>

            {/* benefit chips */}
            {heroChips.map((c) => (
              <div key={c.label} className={`absolute z-30 ${c.pos}`}>
                <div className="stage-chip" style={d(c.delay)}>
                  <span className="animate-bob inline-flex items-center gap-2 rounded-full bg-[hsl(36_28%_94%/0.1)] backdrop-blur-md border border-[hsl(42_52%_52%/0.35)] px-3 py-1.5 md:px-4 md:py-2 font-body text-[9px] md:text-[11px] tracking-wide-2 uppercase whitespace-nowrap" style={{ "--bd": c.bob } as CSSProperties}>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_hsl(42_52%_52%)]" /> {c.label}
                  </span>
                </div>
              </div>
            ))}

            {/* coach bubble */}
            <div className="absolute z-30 right-[0%] top-[2%] md:right-[6%] md:top-[6%]">
              <div className="stage-chip" style={d(2.8)}>
                <a href="#coach" className="animate-bob group flex items-center gap-3 rounded-full bg-[hsl(36_28%_94%/0.1)] backdrop-blur-md border border-[hsl(42_52%_52%/0.35)] p-1.5 pr-4 md:pr-5" style={{ "--bd": "-3s" } as CSSProperties}>
                  <span className="relative block h-12 w-12 md:h-16 md:w-16 shrink-0">
                    <span className="absolute inset-0 rounded-full ring-2 ring-gold animate-ping-slow" />
                    <img src={coachBubble} alt="Coach Dalila" className="relative h-full w-full rounded-full object-cover ring-2 ring-gold" />
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block font-body text-[8px] md:text-[9px] tracking-luxe uppercase text-gold">Your coach</span>
                    <span className="block font-script text-xl md:text-2xl">Dalila</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <p className="animate-blur-up font-body text-base md:text-lg text-[hsl(36_28%_94%/0.75)] max-w-lg mx-auto mt-6 mb-8 leading-relaxed" style={{ animationDelay: "2.0s" }}>
            Join a community dedicated to growth, discipline, and results.
            Your transformation starts with a single decision.
          </p>
          <div className="animate-blur-up flex flex-wrap gap-4 justify-center" style={{ animationDelay: "2.15s" }}>
            <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 shadow-gold">
              Create Account
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[hsl(36_28%_94%/0.35)] text-[hsl(36_28%_94%)] hover:border-gold hover:text-gold rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 bg-transparent">
              <a href="#products">Explore Products <ArrowRight className="ml-2 h-3 w-3" /></a>
            </Button>
          </div>
          <div className="animate-fade-up mt-10 inline-flex items-center gap-2 font-body text-[10px] tracking-luxe uppercase text-[hsl(36_28%_94%/0.55)]" style={{ animationDelay: "2.5s" }}>
            <ShieldCheck className="h-3 w-3 text-gold" /> Certified Coach · Real Results
          </div>
        </div>
      </section>

      {/* QUOTE STRIP */}
      <section className="py-10 border-y border-border bg-secondary/40">
        <div className="container mx-auto text-center" data-reveal="scale">
          <p className="font-body text-xs md:text-sm tracking-luxe uppercase text-muted-foreground">
            Strong Body. <span className="text-foreground">Strong Mind.</span> <span className="text-gold">Better Life.</span>
          </p>
        </div>
      </section>

      {/* MEET YOUR COACH */}
      <section id="coach" className="py-28 md:py-36 bg-background overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 md:gap-20 items-center">
          <div className="relative max-w-md mx-auto w-full" data-reveal>
            <span className="absolute -top-8 -left-8 h-36 w-36 rounded-full border border-gold/40 animate-float" aria-hidden="true" />
            <div className="img-reveal relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-soft">
              <img src={coachPhoto} alt="Coach Dalila Bahtijarevic with her Herbalife shake" loading="lazy" className="w-full h-full object-cover object-[center_30%]" />
            </div>
            <div className="absolute -bottom-6 right-2 md:-right-10" data-reveal="blur" data-reveal-delay="3">
              <div className="animate-bob rounded-2xl bg-background/90 backdrop-blur border border-gold/40 px-5 py-3 shadow-soft">
                <div className="font-script text-3xl text-gold leading-none">Dalila</div>
                <div className="font-body text-[9px] tracking-luxe uppercase text-muted-foreground mt-1">Certified FitLife Coach</div>
              </div>
            </div>
          </div>

          <div>
            <div data-reveal="words">
              <SectionLabel>Meet Your Coach</SectionLabel>
              <h2 className="font-display text-5xl md:text-6xl mb-8">
                <Words text="Hi, I'm" /> <em className="font-normal"><Words text="Dalila." className="gold-text" start={0.15} /></em>
              </h2>
            </div>
            <p className="font-body text-foreground/80 leading-relaxed mb-5" data-reveal="blur" data-reveal-delay="1">
              I know how hard it is to stay consistent when life gets busy. That's why my approach is simple:
              a good breakfast, better hydration and small daily habits that add up to real change.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8" data-reveal="blur" data-reveal-delay="2">
              No extremes, no crash diets — just routines you can actually keep, and someone in your corner every step of the way.
            </p>
            <ul className="space-y-3 mb-10" data-reveal data-reveal-delay="3">
              {["A plan built around your day", "Nutrition that's simple to follow", "Real support when you need it"].map((t) => (
                <li key={t} className="flex items-center gap-3 font-body text-sm">
                  <span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-gold/15"><Check className="h-3.5 w-3.5 text-gold" /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4" data-reveal data-reveal-delay="4">
              <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 shadow-gold">
                Start With Me
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/30 hover:border-gold hover:text-gold rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 bg-transparent">
                <a href="https://www.instagram.com/dalilafitlife" target="_blank" rel="noopener noreferrer"><Camera className="mr-2 h-3.5 w-3.5" /> Instagram</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STORY — pill image that opens up on scroll */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14" data-reveal="words">
            <SectionLabel>The Method</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl mb-6">
              <Words text="Training. Nutrition." /> <br />
              <em className="font-normal"><Words text="Made Simple." className="gold-text" start={0.2} /></em>
            </h2>
          </div>
          <p className="font-body text-muted-foreground text-center max-w-xl mx-auto mb-16 leading-relaxed" data-reveal="blur">
            No guesswork, no extremes. A clear plan for how you move, what you eat and how you show up —
            built around your life, so the results actually last.
          </p>

          <div data-progress className="pill-expand relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ink">
            <img src={storyImg} alt="Training gear and shaker" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 inset-x-0 flex flex-wrap justify-center gap-3 px-4">
              {[
                { icon: Dumbbell, label: "Training" },
                { icon: Heart, label: "Nutrition" },
                { icon: Sparkles, label: "Mindset" },
              ].map((c, i) => (
                <span key={c.label} data-reveal="blur" data-reveal-delay={String(i + 1)} className="inline-flex items-center gap-2 rounded-full bg-background/85 backdrop-blur px-4 py-2 font-body text-[10px] tracking-luxe uppercase text-foreground">
                  <c.icon className="h-3.5 w-3.5 text-gold" /> {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why" className="py-32 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-20" data-reveal="words">
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text="Everything you need" /> <br /><em className="font-normal"><Words text="to succeed" className="gold-text" start={0.25} /></em></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} data-reveal="fan" data-fan={["left", "center", "right"][i]} className="hover-lift group bg-background/60 border-border hover:border-gold/60 hover:shadow-soft transition-all duration-500 p-8 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold transition-all duration-500" />
                <div className="font-display text-5xl gold-text/30 mb-6 opacity-30">0{i + 1}</div>
                <f.icon className="h-7 w-7 text-gold mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" strokeWidth={1.2} />
                <h3 className="font-display text-2xl mb-3">{f.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS MENU */}
      <section id="products" className="py-28 md:py-32 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-12" data-reveal="words">
            <SectionLabel>The Product Menu</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text="Everything" /> <em className="font-normal"><Words text="you need." className="gold-text" start={0.1} /></em></h2>
            <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">Shakes, fibre, tea, skincare and more. Text me on Instagram for prices, advice and your personal plan.</p>
          </div>
          <ProductMenu products={products} dmUrl={IG_DM} profileUrl={IG_PROFILE} />
        </div>
      </section>

      {/* DAILY RITUAL */}
      <section id="ritual" className="py-28 md:py-36 bg-background overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-20" data-reveal="words">
            <SectionLabel>Your Daily Ritual</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text="One day," /> <em className="font-normal"><Words text="done right." className="gold-text" start={0.15} /></em></h2>
            <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">How the products fit into a normal day — simple habits that add up to real change.</p>
          </div>
          <DailyRitual steps={ritual} />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-14 overflow-hidden border-y border-border bg-background" aria-hidden="true">
        <div className="marquee-track font-display text-6xl md:text-8xl whitespace-nowrap leading-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center">
              {["Strong Body", "Strong Mind", "Better Life", "You vs. You", "Prove Yourself Right"].map((t, i) => (
                <span key={t} className="flex items-center">
                  <span className={i % 2 ? "italic gold-text pr-2" : ""}>{t}</span>
                  <span className="mx-8 md:mx-12 text-gold text-3xl md:text-5xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_52%_52%/0.15),transparent_60%)]" />
        </div>
        <div className="container mx-auto text-center max-w-3xl" data-reveal="words">
          <SectionLabel>Ready to Transform?</SectionLabel>
          <h2 className="font-display text-6xl md:text-7xl mb-8">
            <Words text="Start Your" /> <br /><em className="font-normal"><Words text="Journey Today" className="gold-text" start={0.2} /></em>
          </h2>
          <p className="font-script text-2xl text-gold mb-10">You vs. You.</p>
          <p className="font-body text-muted-foreground max-w-xl mx-auto mb-10">
            One decision is all it takes. Create your account and step into the version of you
            that you've been waiting for.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-2xl font-body text-xs tracking-luxe uppercase h-14 px-10 shadow-gold">
              Create Account
            </Button>
            <Button size="lg" onClick={() => openAuth("login")} variant="outline" className="border-foreground/30 hover:border-gold hover:text-gold rounded-2xl font-body text-xs tracking-luxe uppercase h-14 px-10 bg-transparent">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border pt-16 pb-10 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Monogram className="text-2xl" />
              </div>
              <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
                Certified FitLife coaching focused on real, lasting transformations. Strong body. Strong mind. Better life.
              </p>
              <p className="font-script text-xl text-gold">Prove yourself right.</p>
            </div>

            <div>
              <h4 className="font-body text-[10px] tracking-luxe uppercase text-gold mb-4">Explore</h4>
              <ul className="space-y-2 font-body text-sm">
                <li><a href="#coach" className="text-foreground/80 hover:text-gold transition-colors">Coach</a></li>
                <li><a href="#why" className="text-foreground/80 hover:text-gold transition-colors">Why Us</a></li>
                <li><a href="#products" className="text-foreground/80 hover:text-gold transition-colors">Products</a></li>
                <li><a href="#ritual" className="text-foreground/80 hover:text-gold transition-colors">Daily Ritual</a></li>
                <li><button onClick={() => openAuth("register")} className="text-foreground/80 hover:text-gold transition-colors">Create Account</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-body text-[10px] tracking-luxe uppercase text-gold mb-4">Connect</h4>
              <ul className="space-y-2 font-body text-sm">
                <li><a href="https://www.instagram.com/dalilafitlife" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-gold transition-colors">Instagram</a></li>
                <li><a href="mailto:hello@dalila.coach" className="text-foreground/80 hover:text-gold transition-colors">Email</a></li>
              </ul>
              <h4 className="font-body text-[10px] tracking-luxe uppercase text-gold mt-6 mb-3">Legal</h4>
              <ul className="space-y-2 font-body text-sm">
                <li><Link to="/privacy" className="text-foreground/80 hover:text-gold transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-foreground/80 hover:text-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-foreground/80 hover:text-gold transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">© 2026 Dalila Bahtijarevic · All rights reserved</p>
            <p className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">MADE WITH CARE</p>
          </div>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} lang={lang} onLangChange={setLang} />
      <CookieBanner lang={lang} />
    </div>
  );
};

export default Index;
