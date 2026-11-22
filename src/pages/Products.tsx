import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductMenu } from "@/components/ProductMenu";
import { AuthDialog } from "@/components/AuthDialog";
import { CookieBanner } from "@/components/CookieBanner";
import { SectionLabel, SiteFooter, SiteHeader, useHashScroll } from "@/components/SiteChrome";
import { Words } from "@/components/Words";
import { useReveal } from "@/hooks/use-reveal";
import { useLang } from "@/i18n";
import { IG_DM, IG_PROFILE, getProducts } from "@/data/catalog";
import f1Chocolate from "@/assets/f1-chocolate.webp";
import f1Raspberry from "@/assets/f1-raspberry.webp";
import f1Vanilla from "@/assets/f1-vanilla.webp";
import pTea from "@/assets/p-tea.webp";
import pFibreConc from "@/assets/p-fibreconc.webp";
import coachBubble from "@/assets/coach-bubble.webp";

/** Banner products: fan of cut-outs that roll in one by one. */
const banner = [
  { src: pTea, cls: "left-[4%] bottom-0 h-[58%] rotate-[-10deg]", anim: "roll-in-left", delay: 0.25 },
  { src: f1Raspberry, cls: "left-[20%] bottom-0 h-[80%] rotate-[-5deg]", anim: "roll-in-left", delay: 0.45 },
  { src: f1Chocolate, cls: "left-1/2 -translate-x-1/2 bottom-0 h-[96%] z-10", anim: "drop-in", delay: 0.7 },
  { src: f1Vanilla, cls: "right-[20%] bottom-0 h-[80%] rotate-[5deg]", anim: "roll-in-right", delay: 0.95 },
  { src: pFibreConc, cls: "right-[5%] bottom-0 h-[86%] rotate-[9deg]", anim: "roll-in-right", delay: 1.15 },
];

const Products = () => {
  const { lang, setLang, t } = useLang();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const openAuth = (mode: "register" | "login") => { setAuthMode(mode); setAuthOpen(true); };
  useReveal();
  useHashScroll();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader onAuth={openAuth} />

      {/* BANNER */}
      <section className="bg-stage relative overflow-hidden pt-28 md:pt-32 pb-0 text-[hsl(40_33%_90%)]">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-end">
          <div className="pb-10 md:pb-20 text-center md:text-left">
            <Link to="/" className="animate-blur-up inline-flex items-center gap-2 font-body text-[10px] tracking-luxe uppercase text-[hsl(40_33%_90%/0.6)] hover:text-gold transition-colors mb-8">
              <ArrowLeft className="h-3 w-3" /> {t.products.back}
            </Link>
            <div className="animate-blur-up" style={{ animationDelay: "0.15s" }}>
              <SectionLabel>{t.products.label}</SectionLabel>
            </div>
            <h1 key={lang} className="words-in font-display text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
              <Words text={t.products.pageH1a} start={0.2} /> <em className="font-normal"><Words text={t.products.pageH1b} className="gold-text" start={0.35} /></em>
            </h1>
            <p className="animate-blur-up font-body text-[hsl(40_33%_90%/0.75)] max-w-md mx-auto md:mx-0 leading-relaxed mb-8" style={{ animationDelay: "0.6s" }}>
              {t.products.pageIntro}
            </p>
            <div className="animate-blur-up flex flex-wrap gap-3 justify-center md:justify-start" style={{ animationDelay: "0.75s" }}>
              <Button asChild size="lg" className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-full font-body text-xs tracking-luxe uppercase h-12 px-7 shadow-gold">
                <a href={IG_DM} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> {t.nav.textMe}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[hsl(40_33%_90%/0.35)] text-[hsl(40_33%_90%)] hover:border-gold hover:text-gold rounded-full font-body text-xs tracking-luxe uppercase h-12 px-7 bg-transparent">
                <a href={IG_PROFILE} target="_blank" rel="noopener noreferrer"><Instagram className="mr-2 h-4 w-4" /> @dalilafitlife</a>
              </Button>
            </div>
          </div>
          <div className="relative h-[260px] sm:h-[320px] md:h-[420px]">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[90%] h-[16%] rounded-[50%] bg-[radial-gradient(closest-side,hsl(var(--gold)/0.4),transparent)] blur-md" />
            {banner.map((b) => (
              <div key={b.src} className={`absolute ${b.cls}`}>
                <div className={`product-anim ${b.anim} h-full`} style={{ animationDelay: `${b.delay}s` }}>
                  <img src={b.src} alt="" className="h-full w-auto max-w-none drop-shadow-[0_24px_24px_rgba(0,0,0,0.55)] animate-bob-soft" style={{ animationDelay: `${-b.delay * 3}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="py-20 md:py-24 bg-secondary/30">
        <div className="container mx-auto">
          <ProductMenu key={lang} products={getProducts(lang)} dmUrl={IG_DM} profileUrl={IG_PROFILE} allLabel={t.products.all} textMe={t.products.textMe} />
        </div>
      </section>

      {/* HELP */}
      <section className="py-24 md:py-28 bg-background">
        <div className="container mx-auto max-w-3xl text-center" data-reveal="words" key={lang}>
          <SectionLabel>{t.products.helpLabel}</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl mb-6">
            <Words text={t.products.helpH2a} /> <em className="font-normal"><Words text={t.products.helpH2b} className="gold-text" start={0.15} /></em>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">{t.products.helpP}</p>
          <a href={IG_DM} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-4 rounded-full border border-gold/50 bg-background p-2 pr-7 shadow-soft hover:border-gold transition-colors">
            <span className="relative h-14 w-14 shrink-0">
              <span className="absolute inset-0 rounded-full ring-2 ring-gold animate-ping-slow" />
              <img src={coachBubble} alt="Coach Dalila" className="relative h-full w-full rounded-full object-cover ring-2 ring-gold" />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-script text-2xl text-gold">Dalila</span>
              <span className="block font-body text-[10px] tracking-luxe uppercase group-hover:text-gold transition-colors">{t.nav.textMe} →</span>
            </span>
          </a>
        </div>
      </section>

      <SiteFooter onAuth={openAuth} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} lang={lang} onLangChange={setLang} />
      <CookieBanner lang={lang} />
    </div>
  );
};

export default Products;
