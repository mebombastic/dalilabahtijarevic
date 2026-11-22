import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "de" | "sr";
export const LANGS: Lang[] = ["en", "de", "sr"];
export const LANG_LABEL: Record<Lang, string> = { en: "EN", de: "DE", sr: "SR" };
/** A piece of text in every language. */
export type L = Record<Lang, string>;

const en = {
  nav: { coach: "Coach", why: "Why Us", products: "Products", ritual: "Ritual", dailyRitual: "Daily Ritual", home: "Home", signIn: "Sign In", createAccount: "Create Account", textMe: "Text Me", openMenu: "Open menu", closeMenu: "Close menu", theme: "Toggle theme", language: "Language" },
  hero: {
    chip1: "Shakes · fibre · tea · skin",
    chip2: "Protein-packed breakfast",
    yourCoach: "Your coach",
    h1a: "Prove", h1b: "Yourself", h1c: "Right.",
    text: "Join a community dedicated to growth, discipline, and results. Your transformation starts with a single decision.",
    explore: "Explore Products",
    certified: "Certified Coach · Real Results",
  },
  quote: { a: "Strong Body.", b: "Strong Mind.", c: "Better Life." },
  coach: {
    label: "Meet Your Coach", h2a: "Hi, I'm", h2b: "Dalila.",
    p1: "I know how hard it is to stay consistent when life gets busy. That's why my approach is simple: a good breakfast, better hydration and small daily habits that add up to real change.",
    p2: "No extremes, no crash diets — just routines you can actually keep, and someone in your corner every step of the way.",
    bullets: ["A plan built around your day", "Nutrition that's simple to follow", "Real support when you need it"],
    start: "Start With Me", badge: "Certified FitLife Coach",
  },
  method: {
    label: "The Method", h2a: "Training. Nutrition.", h2b: "Made Simple.",
    p: "No guesswork, no extremes. A clear plan for how you move, what you eat and how you show up — built around your life, so the results actually last.",
    chips: ["Training", "Nutrition", "Mindset"], imgAlt: "Herbalife shakes, tea, fibre drink and shaker",
  },
  why: {
    label: "Why Choose Us", h2a: "Everything you need", h2b: "to succeed",
    features: [
      { title: "Proven Results", desc: "Real transformations from real clients who showed up and did the work." },
      { title: "Personalized Support", desc: "Certified coaching that adapts to your body, your pace, your life." },
      { title: "Expert Guidance", desc: "Everything you need to succeed — structure, nutrition, mindset." },
    ],
  },
  products: {
    label: "The Product Menu", h2a: "Everything", h2b: "you need.",
    p: "Shakes, fibre, tea, skincare and more. Text me on Instagram for prices, advice and your personal plan.",
    seeAll: "See all products", all: "All", textMe: "Text Me",
    pageH1a: "The Product", pageH1b: "Menu.",
    pageIntro: "Everything I use and recommend — from your morning shake to your evening skincare. Tap a product to learn more, then text me for prices and your personal plan.",
    helpLabel: "Need help choosing?", helpH2a: "Not sure where", helpH2b: "to start?",
    helpP: "Tell me your goal and your day, and I'll put together the right products and routine for you — no pressure, just honest advice.",
    back: "Back to home",
  },
  ritual: {
    label: "Your Daily Ritual", h2a: "One day,", h2b: "done right.",
    p: "How the products fit into a normal day — simple habits that add up to real change.",
  },
  marquee: ["Strong Body", "Strong Mind", "Better Life", "You vs. You", "Prove Yourself Right"],
  cta: {
    label: "Ready to Transform?", h2a: "Start Your", h2b: "Journey Today", script: "You vs. You.",
    p: "One decision is all it takes. Create your account and step into the version of you that you've been waiting for.",
  },
  footer: {
    blurb: "Certified FitLife coaching focused on real, lasting transformations. Strong body. Strong mind. Better life.",
    script: "Prove yourself right.", explore: "Explore", connect: "Connect", legal: "Legal", email: "Email",
    privacy: "Privacy Policy", terms: "Terms of Service", cookies: "Cookie Policy",
    rights: "© 2026 Dalila Bahtijarevic · All rights reserved", care: "Made with care",
  },
};

type Dict = typeof en;

const de: Dict = {
  nav: { coach: "Coach", why: "Warum wir", products: "Produkte", ritual: "Ritual", dailyRitual: "Tagesritual", home: "Start", signIn: "Anmelden", createAccount: "Konto erstellen", textMe: "Schreib mir", openMenu: "Menü öffnen", closeMenu: "Menü schließen", theme: "Design wechseln", language: "Sprache" },
  hero: {
    chip1: "Shakes · Ballaststoffe · Tee · Haut",
    chip2: "Proteinreiches Frühstück",
    yourCoach: "Dein Coach",
    h1a: "Beweise es", h1b: "dir", h1c: "selbst.",
    text: "Werde Teil einer Community für Wachstum, Disziplin und Ergebnisse. Deine Veränderung beginnt mit einer einzigen Entscheidung.",
    explore: "Produkte entdecken",
    certified: "Zertifizierter Coach · Echte Ergebnisse",
  },
  quote: { a: "Starker Körper.", b: "Starker Geist.", c: "Besseres Leben." },
  coach: {
    label: "Lerne deinen Coach kennen", h2a: "Hi, ich bin", h2b: "Dalila.",
    p1: "Ich weiß, wie schwer es ist, dranzubleiben, wenn das Leben stressig wird. Darum ist mein Ansatz einfach: ein gutes Frühstück, mehr trinken und kleine tägliche Gewohnheiten, die zu echter Veränderung führen.",
    p2: "Keine Extreme, keine Crash-Diäten — nur Routinen, die du wirklich durchhältst, und jemand an deiner Seite bei jedem Schritt.",
    bullets: ["Ein Plan, der zu deinem Alltag passt", "Ernährung, die einfach umzusetzen ist", "Echte Unterstützung, wenn du sie brauchst"],
    start: "Starte mit mir", badge: "Zertifizierter FitLife Coach",
  },
  method: {
    label: "Die Methode", h2a: "Training. Ernährung.", h2b: "Ganz einfach.",
    p: "Kein Rätselraten, keine Extreme. Ein klarer Plan dafür, wie du dich bewegst, was du isst und wie du auftrittst — passend zu deinem Leben, damit die Ergebnisse bleiben.",
    chips: ["Training", "Ernährung", "Mindset"], imgAlt: "Herbalife Shakes, Tee, Ballaststoff-Drink und Shaker",
  },
  why: {
    label: "Warum wir", h2a: "Alles, was du brauchst,", h2b: "um es zu schaffen",
    features: [
      { title: "Echte Ergebnisse", desc: "Echte Veränderungen von echten Kundinnen, die drangeblieben sind." },
      { title: "Persönliche Betreuung", desc: "Zertifiziertes Coaching, das sich deinem Körper, deinem Tempo und deinem Leben anpasst." },
      { title: "Fachkundige Begleitung", desc: "Alles, was du für deinen Erfolg brauchst — Struktur, Ernährung, Mindset." },
    ],
  },
  products: {
    label: "Die Produktkarte", h2a: "Alles,", h2b: "was du brauchst.",
    p: "Shakes, Ballaststoffe, Tee, Hautpflege und mehr. Schreib mir auf Instagram für Preise, Beratung und deinen persönlichen Plan.",
    seeAll: "Alle Produkte ansehen", all: "Alle", textMe: "Schreib mir",
    pageH1a: "Die", pageH1b: "Produktkarte.",
    pageIntro: "Alles, was ich selbst nutze und empfehle — vom Morgen-Shake bis zur Hautpflege am Abend. Tippe auf ein Produkt und schreib mir für Preise und deinen persönlichen Plan.",
    helpLabel: "Hilfe bei der Auswahl?", helpH2a: "Nicht sicher,", helpH2b: "wo du anfangen sollst?",
    helpP: "Erzähl mir von deinem Ziel und deinem Alltag, und ich stelle die passenden Produkte und Routine für dich zusammen — ohne Druck, nur ehrliche Beratung.",
    back: "Zurück zur Startseite",
  },
  ritual: {
    label: "Dein Tagesritual", h2a: "Ein Tag,", h2b: "richtig gemacht.",
    p: "So passen die Produkte in einen ganz normalen Tag — einfache Gewohnheiten, die zu echter Veränderung führen.",
  },
  marquee: ["Starker Körper", "Starker Geist", "Besseres Leben", "Du gegen dich", "Beweise es dir selbst"],
  cta: {
    label: "Bereit für Veränderung?", h2a: "Starte deine", h2b: "Reise heute", script: "Du gegen dich.",
    p: "Eine Entscheidung genügt. Erstelle dein Konto und werde die Version von dir, auf die du gewartet hast.",
  },
  footer: {
    blurb: "Zertifiziertes FitLife Coaching für echte, nachhaltige Veränderungen. Starker Körper. Starker Geist. Besseres Leben.",
    script: "Beweise es dir selbst.", explore: "Entdecken", connect: "Kontakt", legal: "Rechtliches", email: "E-Mail",
    privacy: "Datenschutz", terms: "AGB", cookies: "Cookie-Richtlinie",
    rights: "© 2026 Dalila Bahtijarevic · Alle Rechte vorbehalten", care: "Mit Liebe gemacht",
  },
};

const sr: Dict = {
  nav: { coach: "Trener", why: "Zašto mi", products: "Proizvodi", ritual: "Ritual", dailyRitual: "Dnevni ritual", home: "Početna", signIn: "Prijava", createAccount: "Napravi nalog", textMe: "Piši mi", openMenu: "Otvori meni", closeMenu: "Zatvori meni", theme: "Promeni temu", language: "Jezik" },
  hero: {
    chip1: "Šejkovi · vlakna · čaj · koža",
    chip2: "Doručak pun proteina",
    yourCoach: "Tvoj trener",
    h1a: "Dokaži", h1b: "sebi", h1c: "da možeš.",
    text: "Pridruži se zajednici posvećenoj rastu, disciplini i rezultatima. Tvoja transformacija počinje jednom odlukom.",
    explore: "Pogledaj proizvode",
    certified: "Sertifikovani trener · Pravi rezultati",
  },
  quote: { a: "Jako telo.", b: "Jak um.", c: "Bolji život." },
  coach: {
    label: "Upoznaj svog trenera", h2a: "Zdravo, ja sam", h2b: "Dalila.",
    p1: "Znam koliko je teško biti dosledan kad je život užurban. Zato je moj pristup jednostavan: dobar doručak, više tečnosti i male svakodnevne navike koje donose pravu promenu.",
    p2: "Bez ekstrema, bez drastičnih dijeta — samo rutine koje zaista možeš da održiš, i neko uz tebe na svakom koraku.",
    bullets: ["Plan prilagođen tvom danu", "Ishrana koju je lako pratiti", "Prava podrška kad ti zatreba"],
    start: "Počni sa mnom", badge: "Sertifikovani FitLife trener",
  },
  method: {
    label: "Metoda", h2a: "Trening. Ishrana.", h2b: "Jednostavno.",
    p: "Bez nagađanja, bez ekstrema. Jasan plan za to kako se krećeš, šta jedeš i kako se pojavljuješ — prilagođen tvom životu, da rezultati zaista ostanu.",
    chips: ["Trening", "Ishrana", "Mentalni stav"], imgAlt: "Herbalife šejkovi, čaj, napitak sa vlaknima i šejker",
  },
  why: {
    label: "Zašto mi", h2a: "Sve što ti treba", h2b: "za uspeh",
    features: [
      { title: "Dokazani rezultati", desc: "Prave promene pravih klijenata koji su istrajali i uradili posao." },
      { title: "Lična podrška", desc: "Sertifikovano vođenje koje se prilagođava tvom telu, tvom tempu i tvom životu." },
      { title: "Stručno vođenje", desc: "Sve što ti treba za uspeh — struktura, ishrana, mentalni stav." },
    ],
  },
  products: {
    label: "Meni proizvoda", h2a: "Sve", h2b: "što ti treba.",
    p: "Šejkovi, vlakna, čaj, nega kože i još mnogo toga. Piši mi na Instagramu za cene, savete i tvoj lični plan.",
    seeAll: "Svi proizvodi", all: "Sve", textMe: "Piši mi",
    pageH1a: "Meni", pageH1b: "proizvoda.",
    pageIntro: "Sve što i sama koristim i preporučujem — od jutarnjeg šejka do večernje nege kože. Izaberi proizvod i piši mi za cene i tvoj lični plan.",
    helpLabel: "Treba ti pomoć?", helpH2a: "Ne znaš", helpH2b: "odakle da kreneš?",
    helpP: "Reci mi svoj cilj i kako ti izgleda dan, a ja ću ti složiti prave proizvode i rutinu — bez pritiska, samo iskren savet.",
    back: "Nazad na početnu",
  },
  ritual: {
    label: "Tvoj dnevni ritual", h2a: "Jedan dan,", h2b: "kako treba.",
    p: "Kako se proizvodi uklapaju u običan dan — jednostavne navike koje donose pravu promenu.",
  },
  marquee: ["Jako telo", "Jak um", "Bolji život", "Ti protiv sebe", "Dokaži sebi da možeš"],
  cta: {
    label: "Spremna za promenu?", h2a: "Započni svoje", h2b: "putovanje danas", script: "Ti protiv sebe.",
    p: "Dovoljna je jedna odluka. Napravi nalog i postani verzija sebe koju si čekala.",
  },
  footer: {
    blurb: "Sertifikovano FitLife vođenje usmereno na prave, trajne promene. Jako telo. Jak um. Bolji život.",
    script: "Dokaži sebi da možeš.", explore: "Istraži", connect: "Kontakt", legal: "Pravno", email: "Email",
    privacy: "Politika privatnosti", terms: "Uslovi korišćenja", cookies: "Politika kolačića",
    rights: "© 2026 Dalila Bahtijarevic · Sva prava zadržana", care: "Napravljeno s ljubavlju",
  },
};

const DICTS: Record<Lang, Dict> = { en, de, sr };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: en });

const readStored = (): Lang => {
  try {
    const v = localStorage.getItem("lang");
    if (v === "en" || v === "de" || v === "sr") return v;
  } catch { /* storage unavailable */ }
  return "en";
};

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(readStored);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* ignore */ }
  };
  useEffect(() => { document.documentElement.lang = lang === "sr" ? "sr-Latn" : lang; }, [lang]);
  return <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
