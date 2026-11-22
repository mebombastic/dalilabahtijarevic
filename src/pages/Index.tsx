import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Trophy, Heart, Sparkles, ArrowRight, Camera, Dumbbell, ShieldCheck } from "lucide-react";
import storyImg from "@/assets/story-video.jpg";
import coachPhoto from "@/assets/coach-dalila.webp";
import coachBubble from "@/assets/coach-bubble.webp";
import { FlavourCarousel } from "@/components/FlavourCarousel";
import { ProductMenu } from "@/components/ProductMenu";
import { DailyRitual } from "@/components/DailyRitual";
import { AuthDialog } from "@/components/AuthDialog";
import { CookieBanner } from "@/components/CookieBanner";
import { SectionLabel, SiteFooter, SiteHeader, useHashScroll } from "@/components/SiteChrome";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { Words } from "@/components/Words";
import { useLang } from "@/i18n";
import { IG_DM, IG_PROFILE, getProducts, getRitual, heroLineup } from "@/data/catalog";

const featureIcons = [Trophy, Heart, Sparkles];
const methodIcons = [Dumbbell, Heart, Sparkles];
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const Index = () => {
  const { lang, setLang, t } = useLang();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const openAuth = (mode: "register" | "login") => { setAuthMode(mode); setAuthOpen(true); };

  useReveal();
  useParallax();
  useScrollProgress();
  useHashScroll();

  const heroChips = [
    { label: t.hero.chip1, pos: "hidden md:block md:left-[2%] md:top-[4%]", delay: 2.3, bob: "0s" },
    { label: t.hero.chip2, pos: "hidden md:block md:left-[6%] md:top-[14%]", delay: 2.45, bob: "-2s" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader onAuth={openAuth} />

      {/* HERO — product carousel, giant headline, chips + coach bubble */}
      <section id="top" data-progress="through" className="bg-stage relative min-h-screen pt-24 pb-12 overflow-hidden text-[hsl(37_40%_90%)]">
        <div className="container mx-auto relative flex flex-col items-center text-center">
          <div className="animate-blur-up relative z-30 mt-4 md:mt-6" style={{ animationDelay: "0.4s" }}>
            <SectionLabel>Dalila Bahtijarevic · FitLife Coach</SectionLabel>
          </div>

          <div data-reveal="stage" className="relative w-full max-w-5xl h-[440px] sm:h-[500px] md:h-[60vh] md:min-h-[500px] md:max-h-[620px]">
            <div className="stage-parallax absolute inset-x-0 top-[14%] md:top-[6%] bottom-[29%] sm:bottom-[25%] md:bottom-[21%]" style={{ "--depth": "50px" } as CSSProperties}>
              <FlavourCarousel tins={heroLineup(lang)} startDelay={0.3} />
            </div>

            <h1 key={lang} className="words-in absolute inset-x-0 bottom-0 z-20 font-display leading-[0.9] text-[13vw] sm:text-[11vw] md:text-[8vw] lg:text-[7.2rem] drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              <Words text={t.hero.h1a} start={1.5} /> <span className="italic"><Words text={t.hero.h1b} start={1.62} /></span><br className="md:hidden" />{" "}
              <Words text={t.hero.h1c} className="gold-text" start={1.76} />
            </h1>

            {heroChips.map((c) => (
              <div key={c.pos} className={`absolute z-30 ${c.pos}`}>
                <div className="stage-chip" style={d(c.delay)}>
                  <span className="animate-bob inline-flex items-center gap-2 rounded-full bg-[hsl(37_40%_90%/0.1)] backdrop-blur-md border border-[hsl(var(--gold)/0.35)] px-3 py-1.5 md:px-4 md:py-2 font-body text-[9px] md:text-[11px] tracking-wide-2 uppercase whitespace-nowrap" style={{ "--bd": c.bob } as CSSProperties}>
                    <span className="h-1.5 w-1.5 rounded-full bg-vermilion shadow-[0_0_10px_hsl(var(--vermilion))]" /> {c.label}
                  </span>
                </div>
              </div>
            ))}

            <div className="absolute z-30 right-[0%] top-[2%] md:right-[6%] md:top-[6%]">
              <div className="stage-chip" style={d(2.8)}>
                <a href="#coach" className="animate-bob group flex items-center gap-3 rounded-full bg-[hsl(37_40%_90%/0.1)] backdrop-blur-md border border-[hsl(var(--gold)/0.35)] p-1.5 pr-4 md:pr-5" style={{ "--bd": "-3s" } as CSSProperties}>
                  <span className="relative block h-12 w-12 md:h-16 md:w-16 shrink-0">
                    <span className="absolute inset-0 rounded-full ring-2 ring-gold animate-ping-slow" />
                    <img src={coachBubble} alt="Coach Dalila" className="relative h-full w-full rounded-full object-cover ring-2 ring-gold" />
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block font-body text-[8px] md:text-[9px] tracking-luxe uppercase text-gold">{t.hero.yourCoach}</span>
                    <span className="block font-script text-xl md:text-2xl">Dalila</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <p className="animate-blur-up font-body text-base md:text-lg text-[hsl(37_40%_90%/0.75)] max-w-lg mx-auto mt-6 mb-8 leading-relaxed" style={{ animationDelay: "2.0s" }}>
            {t.hero.text}
          </p>
          <div className="animate-blur-up flex flex-wrap gap-4 justify-center" style={{ animationDelay: "2.15s" }}>
            <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 shadow-gold">
              {t.nav.createAccount}
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[hsl(37_40%_90%/0.35)] text-[hsl(37_40%_90%)] hover:border-gold hover:text-gold rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 bg-transparent">
              <Link to="/products">{t.hero.explore} <ArrowRight className="ml-2 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="animate-fade-up mt-10 inline-flex items-center gap-2 font-body text-[10px] tracking-luxe uppercase text-[hsl(37_40%_90%/0.55)]" style={{ animationDelay: "2.5s" }}>
            <ShieldCheck className="h-3 w-3 text-gold" /> {t.hero.certified}
          </div>
        </div>
      </section>

      {/* QUOTE STRIP */}
      <section className="py-10 border-y border-border bg-secondary/40">
        <div className="container mx-auto text-center" data-reveal="scale">
          <p className="font-body text-xs md:text-sm tracking-luxe uppercase text-muted-foreground">
            {t.quote.a} <span className="text-foreground">{t.quote.b}</span> <span className="text-gold">{t.quote.c}</span>
          </p>
        </div>
      </section>

      {/* MEET YOUR COACH */}
      <section id="coach" className="py-28 md:py-36 bg-background overflow-hidden scroll-mt-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 md:gap-20 items-center">
          <div className="relative max-w-md mx-auto w-full" data-reveal>
            <span className="absolute -top-8 -left-8 h-36 w-36 rounded-full border border-gold/40 animate-float" aria-hidden="true" />
            <div className="img-reveal relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-soft">
              <img src={coachPhoto} alt="Coach Dalila Bahtijarevic" loading="lazy" className="w-full h-full object-cover object-[center_30%]" />
            </div>
            <div className="absolute -bottom-6 right-2 md:-right-10" data-reveal="blur" data-reveal-delay="3">
              <div className="animate-bob rounded-2xl bg-background/90 backdrop-blur border border-gold/40 px-5 py-3 shadow-soft">
                <div className="font-script text-3xl text-gold leading-none">Dalila</div>
                <div className="font-body text-[9px] tracking-luxe uppercase text-muted-foreground mt-1">{t.coach.badge}</div>
              </div>
            </div>
          </div>

          <div>
            <div data-reveal="words" key={lang}>
              <SectionLabel>{t.coach.label}</SectionLabel>
              <h2 className="font-display text-5xl md:text-6xl mb-8">
                <Words text={t.coach.h2a} /> <em className="font-normal"><Words text={t.coach.h2b} className="gold-text" start={0.15} /></em>
              </h2>
            </div>
            <p className="font-body text-foreground/80 leading-relaxed mb-5" data-reveal="blur" data-reveal-delay="1">{t.coach.p1}</p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8" data-reveal="blur" data-reveal-delay="2">{t.coach.p2}</p>
            <ul className="space-y-3 mb-10" data-reveal data-reveal-delay="3">
              {t.coach.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 font-body text-sm">
                  <span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-gold/15"><Check className="h-3.5 w-3.5 text-gold" /></span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4" data-reveal data-reveal-delay="4">
              <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 shadow-gold">
                {t.coach.start}
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/30 hover:border-gold hover:text-gold rounded-full font-body text-xs tracking-luxe uppercase h-14 px-8 bg-transparent">
                <a href={IG_PROFILE} target="_blank" rel="noopener noreferrer"><Camera className="mr-2 h-3.5 w-3.5" /> Instagram</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* METHOD — pill image that opens up on scroll */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14" data-reveal="words" key={lang}>
            <SectionLabel>{t.method.label}</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl mb-6">
              <Words text={t.method.h2a} /> <br />
              <em className="font-normal"><Words text={t.method.h2b} className="gold-text" start={0.2} /></em>
            </h2>
          </div>
          <p className="font-body text-muted-foreground text-center max-w-xl mx-auto mb-16 leading-relaxed" data-reveal="blur">{t.method.p}</p>

          <div data-progress className="pill-expand relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ink">
            <img src={storyImg} alt={t.method.imgAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 inset-x-0 flex flex-wrap justify-center gap-3 px-4">
              {t.method.chips.map((label, i) => {
                const Icon = methodIcons[i];
                return (
                  <span key={i} data-reveal="blur" data-reveal-delay={String(i + 1)} className="inline-flex items-center gap-2 rounded-full bg-background/85 backdrop-blur px-4 py-2 font-body text-[10px] tracking-luxe uppercase text-foreground">
                    <Icon className="h-3.5 w-3.5 text-gold" /> {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why" className="py-32 bg-secondary/30 relative overflow-hidden scroll-mt-20">
        <div className="container mx-auto">
          <div className="text-center mb-20" data-reveal="words" key={lang}>
            <SectionLabel>{t.why.label}</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text={t.why.h2a} /> <br /><em className="font-normal"><Words text={t.why.h2b} className="gold-text" start={0.25} /></em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.why.features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <Card key={i} data-reveal="fan" data-fan={["left", "center", "right"][i]} className="hover-lift group bg-background/60 border-border hover:border-gold/60 hover:shadow-soft transition-all duration-500 p-8 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold transition-all duration-500" />
                  <div className="font-display text-5xl mb-6 opacity-30">0{i + 1}</div>
                  <Icon className="h-7 w-7 text-gold mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" strokeWidth={1.2} />
                  <h3 className="font-display text-2xl mb-3">{f.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section id="products" className="py-28 md:py-32 bg-secondary/30 scroll-mt-20">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-12" data-reveal="words" key={lang}>
            <SectionLabel>{t.products.label}</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text={t.products.h2a} /> <em className="font-normal"><Words text={t.products.h2b} className="gold-text" start={0.1} /></em></h2>
            <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">{t.products.p}</p>
          </div>
          <ProductMenu key={lang} products={getProducts(lang).slice(0, 3)} dmUrl={IG_DM} profileUrl={IG_PROFILE} textMe={t.products.textMe} showTabs={false} />
          <div className="text-center mt-12">
            <Button asChild size="lg" className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-14 px-10 shadow-gold">
              <Link to="/products">{t.products.seeAll} <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* DAILY RITUAL */}
      <section id="ritual" className="py-28 md:py-36 bg-background overflow-hidden scroll-mt-20">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-20" data-reveal="words" key={lang}>
            <SectionLabel>{t.ritual.label}</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl"><Words text={t.ritual.h2a} /> <em className="font-normal"><Words text={t.ritual.h2b} className="gold-text" start={0.15} /></em></h2>
            <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">{t.ritual.p}</p>
          </div>
          <DailyRitual steps={getRitual(lang)} />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-14 overflow-hidden border-y border-border bg-background" aria-hidden="true">
        <div className="marquee-track font-display text-6xl md:text-8xl whitespace-nowrap leading-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center">
              {t.marquee.map((m, i) => (
                <span key={m} className="flex items-center">
                  <span className={i % 2 ? "italic gold-text pr-2" : ""}>{m}</span>
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.15),transparent_60%)]" />
        </div>
        <div className="container mx-auto text-center max-w-3xl" data-reveal="words" key={lang}>
          <SectionLabel>{t.cta.label}</SectionLabel>
          <h2 className="font-display text-6xl md:text-7xl mb-8">
            <Words text={t.cta.h2a} /> <br /><em className="font-normal"><Words text={t.cta.h2b} className="gold-text" start={0.2} /></em>
          </h2>
          <p className="font-script text-2xl text-gold mb-10">{t.cta.script}</p>
          <p className="font-body text-muted-foreground max-w-xl mx-auto mb-10">{t.cta.p}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => openAuth("register")} className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-2xl font-body text-xs tracking-luxe uppercase h-14 px-10 shadow-gold">
              {t.nav.createAccount}
            </Button>
            <Button size="lg" onClick={() => openAuth("login")} variant="outline" className="border-foreground/30 hover:border-gold hover:text-gold rounded-2xl font-body text-xs tracking-luxe uppercase h-14 px-10 bg-transparent">
              {t.nav.signIn}
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter onAuth={openAuth} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} lang={lang} onLangChange={setLang} />
      <CookieBanner lang={lang} />
    </div>
  );
};

export default Index;
