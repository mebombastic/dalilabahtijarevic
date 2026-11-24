import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Crown, Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";
import { CookieBanner } from "@/components/CookieBanner";
import { SectionLabel, SiteFooter, SiteHeader, useHashScroll } from "@/components/SiteChrome";
import { Words } from "@/components/Words";
import { useReveal } from "@/hooks/use-reveal";
import { useLang } from "@/i18n";
import { useAuth, userPlan, type PlanId } from "@/hooks/use-auth";
import f1Chocolate from "@/assets/f1-chocolate.webp";
import f1Latte from "@/assets/f1-latte.webp";
import pShaker from "@/assets/p-shaker.webp";
import pKit from "@/assets/p-kit.webp";

const Plans = () => {
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [plan, setPlan] = useState<PlanId>("Strong-and-Toned");
  const openAuth = (mode: "register" | "login", p?: PlanId) => { if (p) setPlan(p); setAuthMode(mode); setAuthOpen(true); };
  useReveal();
  useHashScroll();
  const mine = user ? userPlan(user) : null;

  const cards: { id: PlanId; name: string; em: string; tag: string; feats: readonly string[]; icon: typeof Crown; imgs: string[]; dark: boolean }[] = [
    { id: "Strong-and-Toned", name: "Strong &", em: "Toned", tag: t.plans.strongTag, feats: t.plans.strong, icon: Dumbbell, imgs: [pShaker, f1Chocolate, f1Latte], dark: false },
    { id: "VIP-1-1", name: "VIP", em: "1:1", tag: t.plans.vipTag, feats: t.plans.vip, icon: Crown, imgs: [pKit], dark: true },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader onAuth={openAuth} />

      <section className="pt-28 md:pt-40 pb-10 text-center">
        <div className="container mx-auto" key={lang}>
          <div className="animate-blur-up"><SectionLabel>{t.plans.label}</SectionLabel></div>
          <h1 className="words-in font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95]">
            <Words text={t.plans.h1a} start={0.1} /> <em className="font-normal"><Words text={t.plans.h1b} className="gold-text" start={0.25} /></em>
          </h1>
          <p className="animate-blur-up font-body text-muted-foreground max-w-xl mx-auto mt-6 leading-relaxed" style={{ animationDelay: "0.5s" }}>{t.plans.intro}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const isMine = mine === c.id;
            return (
              <article key={c.id} data-reveal data-reveal-delay={String(i + 1)}
                className={`relative rounded-[2rem] overflow-hidden flex flex-col border ${c.dark ? "bg-stage text-[hsl(37_40%_90%)] border-transparent shadow-gold" : "bg-card border-border"}`}>
                {c.dark && <span className="absolute top-5 right-5 z-10 rounded-full bg-vermilion text-white px-3 py-1 font-body text-[9px] tracking-luxe uppercase">{t.plans.vipTag}</span>}
                <div className="relative h-56 flex items-end justify-center gap-2 pt-8">
                  <div className={`absolute inset-x-10 bottom-4 h-8 rounded-[50%] blur-xl ${c.dark ? "bg-black/40" : "bg-black/15"}`} />
                  {c.imgs.map((src, k) => (
                    <img key={k} src={src} alt="" className="relative h-[85%] w-auto object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.3)] animate-bob-soft" style={{ animationDelay: `${-k * 1.4}s`, height: c.imgs.length > 1 ? (k === 1 ? "88%" : "70%") : "86%" }} />
                  ))}
                </div>
                <div className="p-7 md:p-9 flex-1 flex flex-col">
                  <div className={`font-body text-[10px] tracking-luxe uppercase mb-2 inline-flex items-center gap-2 ${c.dark ? "text-[hsl(var(--vermilion))]" : "text-gold"}`}><Icon className="h-3.5 w-3.5" /> {c.tag}</div>
                  <h2 className="font-display text-5xl leading-none mb-6">{c.name} <em className={c.dark ? "text-[hsl(var(--vermilion))]" : "gold-text"}>{c.em}</em></h2>
                  <ul className="space-y-3 mb-8">
                    {c.feats.map((f) => (
                      <li key={f} className="flex gap-3 font-body text-sm leading-snug"><Check className="h-4 w-4 shrink-0 mt-0.5 text-[hsl(var(--vermilion))]" /> {f}</li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    {isMine ? (
                      <Button asChild className="w-full h-12 rounded-full bg-vermilion text-white hover:bg-vermilion/90 font-body text-[11px] tracking-luxe uppercase">
                        <Link to="/account">{t.plans.goAccount} <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                      </Button>
                    ) : user ? (
                      <Button asChild className={`w-full h-12 rounded-full font-body text-[11px] tracking-luxe uppercase ${c.dark ? "bg-[hsl(37_40%_90%)] text-primary hover:bg-[hsl(37_40%_95%)]" : "bg-primary text-primary-foreground"}`}>
                        <Link to={`/account?plan=${c.id}`}>{t.plans.join} <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                      </Button>
                    ) : (
                      <Button onClick={() => openAuth("register", c.id)} className={`w-full h-12 rounded-full font-body text-[11px] tracking-luxe uppercase ${c.dark ? "bg-[hsl(37_40%_90%)] text-primary hover:bg-[hsl(37_40%_95%)]" : "bg-primary text-primary-foreground"}`}>
                        {t.plans.join} <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="container mx-auto max-w-5xl mt-14" data-reveal>
          <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
            <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-5">{t.plans.stepsTitle}</div>
            <ol className="grid md:grid-cols-3 gap-5">
              {t.plans.steps.map((s, i) => (
                <li key={s} className="flex gap-4 items-start">
                  <span className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground font-display text-xl inline-flex items-center justify-center">{i + 1}</span>
                  <span className="font-body text-sm leading-relaxed pt-2">{s}</span>
                </li>
              ))}
            </ol>
            <p className="font-body text-xs text-muted-foreground mt-6">{t.plans.note}</p>
          </div>
        </div>
      </section>

      <SiteFooter onAuth={openAuth} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} defaultPlan={plan} lang={lang} onLangChange={setLang} />
      <CookieBanner lang={lang} />
    </div>
  );
};

export default Plans;
