import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Menu, MessageCircle, Moon, Sun, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGS, LANG_LABEL, useLang } from "@/i18n";
import { IG_DM, IG_PROFILE } from "@/data/catalog";

export const Monogram = ({ className = "" }: { className?: string }) => (
  <span className={`font-display font-bold inline-flex items-center ${className}`}>
    <span className="gold-text">D</span>
    <span className="mx-0.5 text-foreground/40 italic font-light">/</span>
    <span className="text-foreground italic">B</span>
  </span>
);

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div className="inline-flex items-center gap-3 mb-4">
    <span className="h-px w-8 bg-gold" />
    <span className="font-body text-xs tracking-luxe uppercase text-gold">{children}</span>
    <span className="h-px w-8 bg-gold" />
  </div>
);

/** Scrolls to the element named in the URL hash (also after arriving from another page). */
export const useHashScroll = () => {
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const t = window.setTimeout(go, 80);
    return () => window.clearTimeout(t);
  }, [hash, key]);
};

const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const s = localStorage.getItem("theme");
      if (s === "dark" || s === "light") return s;
    } catch { /* ignore */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch { /* ignore */ }
  };
  return { theme, toggle };
};

const LangSwitch = ({ className = "" }: { className?: string }) => {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={t.nav.language}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 h-8 px-2.5 border border-border hover:border-gold/60 font-body text-[10px] tracking-luxe uppercase transition-colors"
      >
        <Globe className="h-3 w-3" /> {LANG_LABEL[lang]}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[60] bg-background border border-border min-w-[120px] shadow-soft">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2.5 font-body text-[11px] tracking-wide-2 uppercase hover:bg-secondary hover:text-gold transition-colors ${l === lang ? "text-gold" : ""}`}
            >
              {{ en: "English", de: "Deutsch", sr: "Srpski" }[l]}
              {l === lang && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const SiteHeader = ({ onAuth }: { onAuth: (mode: "register" | "login") => void }) => {
  const { t, lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const links = [
    { to: "/#coach", label: t.nav.coach },
    { to: "/#why", label: t.nav.why },
    { to: "/products", label: t.nav.products },
    { to: "/#ritual", label: t.nav.ritual },
  ];
  const isActive = (to: string) => to === pathname;

  return (
    <header className="animate-nav-in fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Monogram className="text-2xl" />
          <span className="hidden lg:block font-body text-[10px] tracking-luxe uppercase text-muted-foreground">Dalila Bahtijarevic · FitLife Coach</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-body text-xs tracking-wide-2 uppercase">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`hover:text-gold transition-colors ${isActive(l.to) ? "text-gold" : ""}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <button type="button" onClick={toggle} aria-label={t.nav.theme} className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-gold/60 transition-colors">
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <Button size="sm" onClick={() => onAuth("login")} variant="outline" className="hidden lg:inline-flex border-foreground/30 hover:border-gold hover:text-gold rounded-2xl font-body text-[10px] tracking-luxe uppercase bg-transparent">
            {t.nav.signIn}
          </Button>
          <Button size="sm" onClick={() => onAuth("register")} className="hidden sm:inline-flex btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-2xl font-body text-[10px] tracking-luxe uppercase">
            {t.nav.createAccount}
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 -mr-1 text-foreground/80 hover:text-gold transition-colors"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div className={`md:hidden grid transition-[grid-template-rows,opacity] duration-500 ease-luxe ${menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
        <nav className="overflow-hidden">
          <div className="container mx-auto pb-6 pt-2 flex flex-col">
            {[{ to: "/", label: t.nav.home }, ...links.slice(0, 3), { to: "/#ritual", label: t.nav.dailyRitual }].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className={`py-3.5 border-b border-border/60 font-display text-2xl hover:text-gold transition-colors ${isActive(l.to) ? "text-gold" : ""}`}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-5">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex-1 h-10 rounded-full border font-body text-[10px] tracking-luxe uppercase transition-colors ${l === lang ? "border-gold bg-gold/10 text-gold" : "border-border text-foreground/70"}`}
                >
                  {{ en: "English", de: "Deutsch", sr: "Srpski" }[l]}
                </button>
              ))}
            </div>
            <Button onClick={() => { setMenuOpen(false); onAuth("register"); }} className="btn-shine mt-4 h-12 rounded-full bg-gold text-primary-foreground hover:bg-gold/90 font-body text-[11px] tracking-luxe uppercase shadow-gold">
              {t.nav.createAccount}
            </Button>
            <div className="flex gap-3 mt-3">
              <Button onClick={() => { setMenuOpen(false); onAuth("login"); }} variant="outline" className="flex-1 h-11 rounded-full border-foreground/30 hover:border-gold hover:text-gold font-body text-[10px] tracking-luxe uppercase bg-transparent">
                {t.nav.signIn}
              </Button>
              <Button asChild variant="outline" className="flex-1 h-11 rounded-full border-foreground/30 hover:border-gold hover:text-gold font-body text-[10px] tracking-luxe uppercase bg-transparent">
                <a href={IG_DM} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> {t.nav.textMe}</a>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export const SiteFooter = ({ onAuth }: { onAuth: (mode: "register" | "login") => void }) => {
  const { t } = useLang();
  const linkCls = "text-foreground/80 hover:text-gold transition-colors";
  return (
    <footer className="border-t border-border pt-16 pb-10 bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4"><Monogram className="text-2xl" /></div>
            <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">{t.footer.blurb}</p>
            <p className="font-script text-xl text-gold">{t.footer.script}</p>
          </div>
          <div>
            <h4 className="font-body text-[10px] tracking-luxe uppercase text-gold mb-4">{t.footer.explore}</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/#coach" className={linkCls}>{t.nav.coach}</Link></li>
              <li><Link to="/#why" className={linkCls}>{t.nav.why}</Link></li>
              <li><Link to="/products" className={linkCls}>{t.nav.products}</Link></li>
              <li><Link to="/#ritual" className={linkCls}>{t.nav.dailyRitual}</Link></li>
              <li><button onClick={() => onAuth("register")} className={linkCls}>{t.nav.createAccount}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-[10px] tracking-luxe uppercase text-gold mb-4">{t.footer.connect}</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><a href={IG_PROFILE} target="_blank" rel="noopener noreferrer" className={linkCls}>Instagram</a></li>
              <li><a href="mailto:hello@dalila.coach" className={linkCls}>{t.footer.email}</a></li>
            </ul>
            <h4 className="font-body text-[10px] tracking-luxe uppercase text-gold mt-6 mb-3">{t.footer.legal}</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/privacy" className={linkCls}>{t.footer.privacy}</Link></li>
              <li><Link to="/terms" className={linkCls}>{t.footer.terms}</Link></li>
              <li><Link to="/cookies" className={linkCls}>{t.footer.cookies}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{t.footer.rights}</p>
          <p className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground">{t.footer.care}</p>
        </div>
      </div>
    </footer>
  );
};
