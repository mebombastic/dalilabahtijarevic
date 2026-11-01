import { useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Play, Users, Trophy, Heart, Sparkles, ArrowRight, ArrowUp, Mic, Camera, Menu, Globe, Sun, Moon, ChevronLeft, ChevronRight, Dumbbell, Search, ShoppingBag, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-coach-light.jpg";
import heroImgDark from "@/assets/hero-theme-gold.jpg";
import storyImg from "@/assets/story-video.jpg";
import heroPoster from "@/assets/hero-poster.jpg";
import productF1 from "@/assets/product-f1.webp";
import productTea from "@/assets/product-tea.webp";
import packMorning1 from "@/assets/pack-morning-1.jpg";
import packMorning2 from "@/assets/pack-morning-2.jpg";
import packMorning3 from "@/assets/pack-morning-3.jpg";
import packHydration from "@/assets/pack-hydration-new.jpg";
import packTotal1 from "@/assets/pack-total-1.jpg";
import packTotal2 from "@/assets/pack-total-2.jpg";
import packTotal3 from "@/assets/pack-total-3.jpg";
import { AuthDialog } from "@/components/AuthDialog";
import { CookieBanner } from "@/components/CookieBanner";
import { PackDialog, type Pack } from "@/components/PackDialog";
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

type PackMedia = { type: "image" | "video"; src: string; poster?: string };

const PackMediaViewer = ({ media, alt }: { media: PackMedia[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  const current = media[idx];
  const go = (dir: number) => setIdx((i) => (i + dir + media.length) % media.length);
  return (
    <>
      {current.type === "video" ? (
        <video
          key={current.src}
          src={current.src}
          poster={current.poster}
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          key={current.src}
          src={current.src}
          alt={alt}
          loading="lazy"
          width={900}
          height={700}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {media.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 inline-flex items-center justify-center bg-background/80 backdrop-blur border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 inline-flex items-center justify-center bg-background/80 backdrop-blur border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to media ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 w-5 transition-colors ${i === idx ? "bg-gold" : "bg-background/60 border border-gold/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

const features = [
  { icon: Trophy, title: "Proven Results", desc: "Real transformations from real clients who showed up and did the work." },
  { icon: Heart, title: "Personalized Support", desc: "Certified coaching that adapts to your body, your pace, your life." },
  { icon: Sparkles, title: "Expert Guidance", desc: "Everything you need to succeed — structure, nutrition, mindset." },
];


const packs: Array<{
  name: string;
  tagline: string;
  price: string;
  media: PackMedia[];
  desc: string;
  perfect: string;
  items: string[];
  popular?: boolean;
}> = [
  {
    name: "Morning Kickstart Pack",
    tagline: "Your clean, easy morning reset starts here.",
    price: "€65.75",
    media: [
      { type: "image", src: packMorning1 },
      { type: "image", src: packMorning2 },
      { type: "image", src: packMorning3 },
    ],
    desc: "A strong day starts with a strong morning. This pack puts the focus on breakfast with Formula 1 so you feel more in control, more consistent, and ready to go.",
    perfect: "Busy people who want a simple healthy routine that is easy to stick to.",
    items: ["Formula 1 breakfast support", "A simple, healthy start to your day", "More structure and consistency"],
  },
  {
    name: "Total Results Pack",
    tagline: "Your all-in combo for stronger results, faster.",
    price: "€156.80",
    media: [
      { type: "image", src: packTotal1 },
      { type: "image", src: packTotal2 },
      { type: "image", src: packTotal3 },
      { type: "video", src: `${import.meta.env.BASE_URL}videos/pack-total.mp4`, poster: packTotal1 },
    ],
    desc: "The perfect breakfast and hydration combo for people who want to go all-in. Formula 1, the herbal drink and aloe vera work together to support your metabolism and your results from day one.",
    perfect: "People who want the most complete start and the biggest push toward results.",
    items: ["Formula 1 breakfast", "Herbal drink for energy & focus", "Aloe vera for hydration & digestion"],
    popular: true,
  },
  {
    name: "Hydration Boost Pack",
    tagline: "Hydrate better, feel lighter, boost your daily flow.",
    price: "€95.90",
    media: [{ type: "image", src: packHydration }],
    desc: "Feel sharper and more energized throughout the day. Herbal drink in lemon, peach or raspberry plus aloe vera mango — hydration, detox, energy, fat burning and gut balance in one routine.",
    perfect: "Anyone who wants more energy, better hydration and visible momentum.",
    items: ["Herbal drink (lemon, peach, raspberry)", "Aloe vera mango for hydration", "Detox, energy, and gut balance"],
  },
];

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const stageChips = [
  { label: "Protein-packed breakfast", pos: "left-[2%] top-[14%] md:left-[18%] md:top-[18%]", delay: 0.9, bob: "0s" },
  { label: "Energy & focus", pos: "right-[2%] top-[30%] md:right-[20%] md:top-[26%]", delay: 1.05, bob: "-2s" },
  { label: "Ready in 2 minutes", pos: "left-[4%] top-[52%] md:left-[24%] md:top-[56%]", delay: 1.2, bob: "-4s" },
  { label: "Hydration & gut balance", pos: "right-[4%] top-[64%] md:right-[22%] md:top-[60%]", delay: 1.35, bob: "-1s" },
];

/** Dark product stage: bottles rise in, float, chips pop in, big word drifts on scroll. */
const ProductStage = () => (
  <section id="products" data-progress="through" className="bg-stage relative overflow-hidden py-24 md:py-32 text-[hsl(36_28%_94%)]">
    <div className="container mx-auto relative">
      <div className="text-center max-w-xl mx-auto relative z-30" data-reveal="words">
        <SectionLabel>Signature Products</SectionLabel>
        <h2 className="font-display text-4xl md:text-6xl">
          <Words text="Fuel that" /> <em className="font-normal"><Words text="fits your day." className="gold-text" start={0.16} /></em>
        </h2>
      </div>

      <div data-reveal="stage" className="relative h-[460px] sm:h-[540px] md:h-[640px] mt-6">
        {/* big drifting word */}
        <div className="absolute inset-x-0 bottom-[4%] md:bottom-[2%] z-20 pointer-events-none flex justify-center">
          <div className="stage-item" style={d(0.55)}>
            <div className="stage-word font-display italic leading-none whitespace-nowrap text-[26vw] md:text-[15vw] gold-text pr-[0.1em]">
              Nourish.
            </div>
          </div>
        </div>

        {/* tea bottle, behind */}
        <div className="stage-parallax absolute z-0 left-[3%] bottom-[24%] w-[34%] sm:w-[26%] md:left-[27%] md:bottom-[26%] md:w-[13%]" style={{ "--depth": "120px" } as CSSProperties}>
          <div className="stage-item" style={d(0.35)}>
            <img src={productTea} alt="Herbalife instant herbal beverage" className="animate-bob w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" style={{ "--r": "-8deg", "--bd": "-3s" } as CSSProperties} />
          </div>
        </div>

        {/* Formula 1, hero product */}
        <div className="stage-parallax absolute z-10 left-1/2 bottom-[16%] w-[66%] sm:w-[48%] md:w-[30%]" style={{ "--depth": "60px", translate: "-50% 0" } as CSSProperties}>
          <div className="stage-item" style={d(0.15)}>
            <img src={productF1} alt="Herbalife Formula 1 Nutritional Shake Mix" className="animate-bob w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)]" />
          </div>
        </div>

        {/* floating chips */}
        {stageChips.map((c) => (
          <div key={c.label} className={`absolute z-30 ${c.pos}`}>
            <div className="stage-chip" style={d(c.delay)}>
              <span className="animate-bob inline-flex items-center gap-2 rounded-full bg-[hsl(36_28%_94%/0.1)] backdrop-blur-md border border-[hsl(42_52%_52%/0.35)] px-3 py-1.5 md:px-4 md:py-2 font-body text-[9px] md:text-[11px] tracking-wide-2 uppercase whitespace-nowrap" style={{ "--bd": c.bob } as CSSProperties}>
                <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_hsl(42_52%_52%)]" /> {c.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-30 text-center max-w-lg mx-auto -mt-2" data-reveal="blur">
        <p className="font-body text-sm md:text-base text-[hsl(36_28%_94%/0.7)] leading-relaxed mb-8">
          The exact products behind every pack — Formula 1 breakfast, herbal drink and aloe — combined into a routine that is simple to follow and built for results.
        </p>
        <Button asChild size="lg" className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 shadow-gold">
          <a href="#packs">Shop the Packs <ArrowRight className="ml-2 h-3 w-3" /></a>
        </Button>
      </div>
    </div>
  </section>
);

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const [activePack, setActivePack] = useState<Pack | null>(null);
  const [packOpen, setPackOpen] = useState(false);
  const openPack = (p: Pack) => { setActivePack(p); setPackOpen(true); };
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

  const railRef = useRef<HTMLDivElement>(null);
  const [railProgress, setRailProgress] = useState(0);
  const onRailScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setRailProgress(max > 0 ? el.scrollLeft / max : 0);
  };

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
            <a href="#packs" className="hover:text-gold transition-colors">Packs</a>
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

      {/* HERO - original slogans, Nolla-style prompt + pills below */}
      <section id="coach" className="relative min-h-screen pt-28 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none animate-hero-zoom" data-parallax>
          <img
            src={heroPoster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-[center_24%] scale-110 blur-md opacity-100 parallax-slow"
          />
          <div className="absolute inset-0 bg-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-background/10" />
        </div>

        <div className="container mx-auto relative z-10 min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center py-20 text-center">
          <div className="w-full max-w-2xl">
            <div className="animate-blur-up" style={{ animationDelay: "0.5s" }}>
              <SectionLabel>Meet Your Coach</SectionLabel>
            </div>
            <h1 className="words-in font-display text-6xl md:text-8xl leading-[0.95] mb-6">
              <Words text="Prove" start={0.7} /> <br />
              <span className="italic font-normal"><Words text="Yourself" start={0.85} /></span>{" "}
              <Words text="Right." className="gold-text" start={1.0} />
            </h1>
            <div className="animate-blur-up font-script text-3xl text-gold mb-6" style={{ animationDelay: "1.25s" }}>Dalila Bahtijarevic</div>
            <p className="animate-blur-up font-body text-lg text-foreground/80 max-w-lg mx-auto mb-10 leading-relaxed" style={{ animationDelay: "1.4s" }}>
              Join a community dedicated to growth, discipline, and results.
              Your transformation starts with a single decision.
            </p>

            <div className="animate-blur-up flex flex-wrap gap-4 justify-center mb-2" style={{ animationDelay: "1.55s" }}>
              <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 shadow-gold">
                Create Account
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/30 hover:border-gold hover:text-gold rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 bg-background/40 backdrop-blur">
                <a href="#packs">Choose Your Pack <ArrowRight className="ml-2 h-3 w-3" /></a>
              </Button>
            </div>

          </div>

          <div className="animate-fade-up absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 font-body text-[10px] tracking-luxe uppercase text-muted-foreground">
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

      <ProductStage />

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

      {/* PACKS */}
      <section id="packs" className="py-32 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-20" data-reveal="words">
            <SectionLabel>Available Packages</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text="Choose" /> <em className="font-normal"><Words text="Your Pack" className="gold-text" start={0.1} /></em></h2>
          </div>

          <div
            ref={railRef}
            onScroll={onRailScroll}
            className="no-scrollbar flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-8 px-8 md:mx-0 md:px-0 pb-6 md:pb-0 lg:pt-4"
          >
            {packs.map((p, i) => (
              <Card key={p.name} data-reveal data-reveal-delay={String(i + 1)} className={`hover-lift shrink-0 w-[84%] sm:w-[60%] md:w-auto snap-center relative bg-background border rounded-2xl overflow-hidden flex flex-col group ${p.popular ? "border-gold shadow-gold lg:-translate-y-4" : "border-border hover:border-gold/40 hover:shadow-soft"} transition-all duration-500`}>
                {p.popular && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gold font-body text-[10px] tracking-luxe uppercase text-primary-foreground">Popular</div>
                )}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="img-reveal absolute inset-0">
                    <div className="relative w-full h-full">
                      <PackMediaViewer media={p.media} alt={p.name} />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-background/80 backdrop-blur font-body text-[10px] tracking-luxe uppercase text-gold border border-gold/40">Ready</div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl mb-2">{p.name}</h3>
                  <p className="font-body text-sm text-muted-foreground italic mb-6">{p.tagline}</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-display text-4xl gold-text">{p.price}</span>
                  </div>

                  <p className="font-body text-sm text-foreground/70 leading-relaxed mb-6">{p.desc}</p>

                  <div className="gold-divider mb-6" />

                  <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">Perfect For</div>
                  <p className="font-body text-sm text-foreground/80 mb-6">{p.perfect}</p>

                  <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">What's Included</div>
                  <ul className="space-y-2 mb-8">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-3 font-body text-sm text-foreground/80">
                        <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" strokeWidth={2} />
                        {it}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-2">
                    <Button onClick={() => openPack(p)} className={`rounded-2xl font-body text-xs tracking-luxe uppercase h-12 ${p.popular ? "bg-gold text-primary-foreground hover:bg-gold/90" : "bg-foreground text-background hover:bg-gold hover:text-primary-foreground"}`}>
                      View Details
                    </Button>
                    <button onClick={() => openPack(p)} className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground hover:text-gold transition-colors">
                      Quick look →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="md:hidden mx-auto mt-2 h-[3px] w-40 rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full bg-gold transition-[width] duration-200" style={{ width: `${Math.max(1 / packs.length, railProgress) * 100}%` }} />
          </div>
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
                <li><a href="#packs" className="text-foreground/80 hover:text-gold transition-colors">Packs</a></li>
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
      <PackDialog pack={activePack} open={packOpen} onOpenChange={setPackOpen} />
      <CookieBanner lang={lang} />
    </div>
  );
};

export default Index;
