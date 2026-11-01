import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, X, Globe, User, Check, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-coach-light.jpg";
import heroImgDark from "@/assets/hero-coach-dark.jpg";

type Lang = "en" | "de" | "sr";
type Role = "client" | "coach";
type Mode = "register" | "login";

const t = {
  en: {
    welcome: "Welcome",
    tagline: "Your transformation begins here",
    subline: "One decision. One discipline. One you.",
    email: "Email",
    emailPh: "you@example.com",
    password: "Password",
    firstName: "Your name",
    firstNamePh: "What should we call you?",
    joinAs: "Joining as",
    client: "Client",
    clientDesc: "Train with Dalila",
    coach: "Coach",
    coachDesc: "Lead a community",
    create: "Begin My Journey",
    signIn: "Continue",
    signInTitle: "Welcome Back",
    signInSub: "Pick up right where you left off.",
    hasAccount: "Already with us?",
    noAccount: "First time here?",
    signInLink: "Sign in",
    signUpLink: "Create an account",
    forgot: "Forgot password?",
    terms: "By continuing you accept our Terms & Privacy.",
    or: "or",
  },
  de: {
    welcome: "Willkommen",
    tagline: "Hier beginnt deine Transformation",
    subline: "Eine Entscheidung. Eine Disziplin. Ein Du.",
    email: "E-Mail",
    emailPh: "du@beispiel.com",
    password: "Passwort",
    firstName: "Dein Name",
    firstNamePh: "Wie sollen wir dich nennen?",
    joinAs: "Ich starte als",
    client: "Kundin",
    clientDesc: "Trainiere mit Dalila",
    coach: "Coach",
    coachDesc: "Führe eine Community",
    create: "Reise beginnen",
    signIn: "Weiter",
    signInTitle: "Willkommen zurück",
    signInSub: "Mach genau dort weiter, wo du aufgehört hast.",
    hasAccount: "Schon dabei?",
    noAccount: "Zum ersten Mal hier?",
    signInLink: "Anmelden",
    signUpLink: "Konto erstellen",
    forgot: "Passwort vergessen?",
    terms: "Mit der Fortsetzung akzeptierst du unsere AGB & Datenschutz.",
    or: "oder",
  },
  sr: {
    welcome: "Dobrodošla",
    tagline: "Tvoja transformacija počinje ovde",
    subline: "Jedna odluka. Jedna disciplina. Jedna ti.",
    email: "Email",
    emailPh: "ti@primer.com",
    password: "Lozinka",
    firstName: "Tvoje ime",
    firstNamePh: "Kako da te zovemo?",
    joinAs: "Pridružujem se kao",
    client: "Klijent",
    clientDesc: "Treniraj sa Dalilom",
    coach: "Trener",
    coachDesc: "Vodi zajednicu",
    create: "Započni put",
    signIn: "Nastavi",
    signInTitle: "Dobrodošla nazad",
    signInSub: "Nastavi tačno tamo gde si stala.",
    hasAccount: "Već imaš nalog?",
    noAccount: "Prvi put ovde?",
    signInLink: "Prijavi se",
    signUpLink: "Napravi nalog",
    forgot: "Zaboravljena lozinka?",
    terms: "Nastavkom prihvataš naše Uslove i Privatnost.",
    or: "ili",
  },
};

const langLabel: Record<Lang, string> = { en: "EN", de: "DE", sr: "SR" };

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: Mode;
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

export const AuthDialog = ({ open, onOpenChange, defaultMode = "register", lang, onLangChange }: AuthDialogProps) => {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [role, setRole] = useState<Role>("client");
  const [showPw, setShowPw] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const c = t[lang];
  const isRegister = mode === "register";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-gold/30 bg-background rounded-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">{isRegister ? c.create : c.signIn}</DialogTitle>
        <DialogDescription className="sr-only">{c.tagline}</DialogDescription>

        {/* Header banner */}
        <div className="relative h-40 overflow-hidden border-b border-gold/30">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 block dark:hidden" />
          <img src={heroImgDark} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 hidden dark:block" />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_52%_52%/0.25),transparent_70%)]" />

          {/* Top controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-background/60 backdrop-blur border border-border hover:border-gold/60 font-body text-[10px] tracking-luxe uppercase transition-colors"
              >
                <Globe className="h-3 w-3" /> {langLabel[lang]}
              </button>
              {langOpen && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-background border border-border min-w-[80px] shadow-soft">
                  {(Object.keys(langLabel) as Lang[]).map((l) => (
                    <button key={l} onClick={() => { onLangChange(l); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 font-body text-[10px] tracking-luxe uppercase hover:bg-secondary hover:text-gold transition-colors ${l === lang ? "text-gold" : ""}`}>
                      {langLabel[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 inline-flex items-center justify-center bg-background/60 backdrop-blur border border-border hover:border-gold/60 hover:text-gold transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Brand center */}
          <div className="absolute inset-x-0 bottom-4 text-center">
            <div className="font-display font-bold text-3xl inline-flex items-center">
              <span className="gold-text">D</span>
              <span className="mx-0.5 text-foreground/40 italic font-light">/</span>
              <span className="text-foreground italic">B</span>
            </div>
            <p className="font-script text-base text-gold mt-0.5">Prove yourself right.</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 md:p-10">
          {/* Mode tabs */}
          <div className="flex border border-border mb-8">
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 font-body text-[10px] tracking-luxe uppercase transition-colors ${
                isRegister ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-gold"
              }`}
            >
              {c.signUpLink}
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 font-body text-[10px] tracking-luxe uppercase transition-colors ${
                !isRegister ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-gold"
              }`}
            >
              {c.signInLink}
            </button>
          </div>

          {/* Title */}
          <div className="mb-7">
            <h2 className="font-display text-3xl">
              {isRegister ? c.welcome : c.signInTitle}<span className="gold-text">.</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1.5">
              {isRegister ? c.tagline : c.signInSub}
            </p>
            {isRegister && <p className="font-script text-lg text-gold mt-2">{c.subline}</p>}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {isRegister && (
              <div className="space-y-1.5">
                <Label className="font-body text-[10px] tracking-luxe uppercase text-foreground/70">{c.firstName}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder={c.firstNamePh}
                    className="pl-10 h-12 rounded-2xl bg-secondary/40 border-border focus-visible:border-gold focus-visible:ring-0 font-body" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="font-body text-[10px] tracking-luxe uppercase text-foreground/70">{c.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder={c.emailPh}
                  className="pl-10 h-12 rounded-2xl bg-secondary/40 border-border focus-visible:border-gold focus-visible:ring-0 font-body" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="font-body text-[10px] tracking-luxe uppercase text-foreground/70">{c.password}</Label>
                {!isRegister && (
                  <button type="button" className="font-body text-[10px] tracking-wide text-gold hover:underline underline-offset-4">
                    {c.forgot}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPw ? "text" : "password"} placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-2xl bg-secondary/40 border-border focus-visible:border-gold focus-visible:ring-0 font-body" />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="space-y-2 pt-1">
                <Label className="font-body text-[10px] tracking-luxe uppercase text-foreground/70">{c.joinAs}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: "client" as Role, label: c.client, desc: c.clientDesc },
                    { id: "coach" as Role, label: c.coach, desc: c.coachDesc },
                  ]).map((r) => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)}
                      className={`relative p-4 text-left border transition-all ${
                        role === r.id
                          ? "border-gold bg-gold/10"
                          : "border-border hover:border-gold/40 bg-secondary/20"
                      }`}>
                      <div className={`font-display text-base ${role === r.id ? "text-gold" : "text-foreground"}`}>
                        {r.label}
                      </div>
                      <div className="font-body text-[10px] tracking-wide-2 uppercase text-muted-foreground mt-1">
                        {r.desc}
                      </div>
                      {role === r.id && (
                        <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-gold" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit"
              className="group w-full h-13 py-4 mt-2 bg-foreground text-background hover:bg-gold hover:text-primary-foreground rounded-2xl font-body text-xs tracking-luxe uppercase transition-all">
              <span>{isRegister ? c.create : c.signIn}</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>

            {isRegister && (
              <p className="text-[10px] text-muted-foreground text-center font-body leading-relaxed pt-1">
                {c.terms}
              </p>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
