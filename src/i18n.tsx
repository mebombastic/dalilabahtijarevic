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
  plans: {
    nav: "Plans", label: "Membership", h1a: "Choose", h1b: "your plan.",
    intro: "Two ways to train with me. Create your account, choose your plan, and you get your own member area with your month — products, training and progress.",
    popular: "Most popular", join: "Join", current: "Your plan", goAccount: "Go to my plan",
    strongTag: "Muscle · shape · energy", vipTag: "Maximum results",
    tool: { tag: "Premium tool · VIP only", name: "Smart Plate Calculator", text: "Build every plate to the gram — breakfast, lunch, dinner and snacks. Add as many foods as you like and see calories, protein, carbs and fat instantly, with daily goals we set together.", chips: ["Calories", "Protein", "Carbs", "Fat", "Daily goals"] },
    strong: ["4 workouts a week — a full 4-week programme", "Product routine: Formula 1 + protein, herbal tea", "Workout cards and illustrated exercise guide", "Weekly challenges and progress tracker", "Your plan as a PDF in your language", "Questions answered by message"],
    vip: ["Everything in Strong & Toned", "Smart Plate Calculator — your premium nutrition tool", "5 sessions a week, rebuilt around your results", "Products chosen personally for you", "Weekly video call", "Plan updated every week", "Priority, same-day answers"],
    note: "After you sign up, I send you the price and payment details. Your plan unlocks as soon as your payment is confirmed.",
    stepsTitle: "How joining works", steps: ["Create your account and choose a plan", "Pay for your month", "I confirm — your plan unlocks"],
  },
  admin: {
    nav: "Admin", title: "Members", sub: "Everyone who has an account — activate memberships, change plans and see progress.",
    notAdmin: "This page is only for the admin.", setupNeeded: "Admin access isn't set up yet in Supabase.",
    search: "Search name or email", all: "All", waiting: "Waiting for payment", paid: "Says paid", active: "Active", free: "Free account", inactive: "Inactive",
    total: "Accounts", joined: "Joined", lastLogin: "Last login", never: "never", plan: "Plan", noPlan: "No plan", status: "Status",
    activate: "Activate", deactivate: "Deactivate", start: "Start date", progress: "Progress", noProgress: "No progress logged yet.",
    paidOn: "Says paid on", refresh: "Refresh", empty: "No accounts match.", saved: "Saved", error: "Something went wrong — try again.",
  },
  member: {
    free: "Free account", upgrade: "Upgrade", upgradeTitle: "Unlock your plan", choose: "Choose", later: "Maybe later",
    upgradeSub: "Choose your plan and get your whole month — training, products and progress — plus support from me.",
    noPlanText: "Choose a plan to unlock your training month, product routine, workouts and progress tracker.",
    account: "My account", hello: "Hi", title: "My plan", status: "Membership", active: "Active", pending: "Waiting for payment",
    signInNeeded: "Sign in to see your plan.", signIn: "Sign in", create: "Create account", loading: "Loading…",
    payTitle: "Complete your membership", paySteps: ["Account created", "Payment", "Activation"],
    payText: "Message me and I'll send you the price and payment details for your plan. As soon as your payment is confirmed, your whole month unlocks here.",
    payDetails: "Message me for payment", paid: "I've paid", paidThanks: "Thank you! I'll confirm your payment within 24 hours and unlock your plan.",
    changePlan: "Change plan", locked: "Unlocks after payment",
    download: "Download my plan (PDF)", products: "Your products", productsSub: "What & when — every day",
    training: "Your training month", week: "Week", today: "Today", challenge: "This week's challenge", typical: "Typical time", tapWorkout: "Tap a workout to see it.",
    progress: "My progress", progressSub: "Log your numbers every week — weight, measurements and MAX tests.",
    date: "Date", weight: "Weight (kg)", waist: "Waist (cm)", squat: "Squat MAX", pushup: "Push-up MAX", situp: "Sit-up MAX", plank: "Plank (s)",
    save: "Save", saved: "Saved", noEntries: "No entries yet — add your first one.", coach: "Questions? Message me", logout: "Log out", plan: "Plan",
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
  plans: {
    nav: "Pläne", label: "Mitgliedschaft", h1a: "Wähle", h1b: "deinen Plan.",
    intro: "Zwei Wege, mit mir zu trainieren. Erstelle dein Konto, wähle deinen Plan und du bekommst deinen eigenen Mitgliederbereich mit deinem Monat — Produkte, Training und Fortschritt.",
    popular: "Am beliebtesten", join: "Mitmachen", current: "Dein Plan", goAccount: "Zu meinem Plan",
    strongTag: "Muskeln · Form · Energie", vipTag: "Maximale Ergebnisse",
    tool: { tag: "Premium-Tool · nur VIP", name: "Smart-Plate-Rechner", text: "Stell jeden Teller grammgenau zusammen — Frühstück, Mittag, Abend und Snacks. So viele Lebensmittel wie du willst, und du siehst sofort Kalorien, Eiweiß, Kohlenhydrate und Fett — mit Tageszielen, die wir gemeinsam festlegen.", chips: ["Kalorien", "Eiweiß", "Kohlenhydrate", "Fett", "Tagesziele"] },
    strong: ["4 Workouts pro Woche — ein komplettes 4-Wochen-Programm", "Produkt-Routine: Formula 1 + Protein, Kräutergetränk", "Workout-Karten und illustrierte Übungsanleitung", "Wochenaufgaben und Fortschritts-Tracker", "Dein Plan als PDF in deiner Sprache", "Antworten per Nachricht"],
    vip: ["Alles aus Strong & Toned", "Smart-Plate-Rechner — dein Premium-Ernährungstool", "5 Einheiten pro Woche, angepasst an deine Ergebnisse", "Produkte persönlich für dich ausgewählt", "Wöchentlicher Videoanruf", "Plan jede Woche aktualisiert", "Vorrang, Antworten am selben Tag"],
    note: "Nach der Anmeldung schicke ich dir Preis und Zahlungsdetails. Dein Plan wird freigeschaltet, sobald deine Zahlung bestätigt ist.",
    stepsTitle: "So funktioniert die Anmeldung", steps: ["Konto erstellen und Plan wählen", "Deinen Monat bezahlen", "Ich bestätige — dein Plan wird freigeschaltet"],
  },
  admin: {
    nav: "Admin", title: "Mitglieder", sub: "Alle mit einem Konto — Mitgliedschaften freischalten, Pläne ändern und Fortschritt sehen.",
    notAdmin: "Diese Seite ist nur für den Admin.", setupNeeded: "Der Admin-Zugang ist in Supabase noch nicht eingerichtet.",
    search: "Name oder E-Mail suchen", all: "Alle", waiting: "Wartet auf Zahlung", paid: "Sagt bezahlt", active: "Aktiv", free: "Kostenloses Konto", inactive: "Inaktiv",
    total: "Konten", joined: "Seit", lastLogin: "Letzte Anmeldung", never: "nie", plan: "Plan", noPlan: "Kein Plan", status: "Status",
    activate: "Freischalten", deactivate: "Deaktivieren", start: "Startdatum", progress: "Fortschritt", noProgress: "Noch kein Fortschritt eingetragen.",
    paidOn: "Sagt bezahlt am", refresh: "Aktualisieren", empty: "Keine passenden Konten.", saved: "Gespeichert", error: "Etwas ist schiefgelaufen — bitte erneut versuchen.",
  },
  member: {
    free: "Kostenloses Konto", upgrade: "Upgrade", upgradeTitle: "Schalte deinen Plan frei", choose: "Wählen", later: "Vielleicht später",
    upgradeSub: "Wähle deinen Plan und bekomm deinen ganzen Monat — Training, Produkte und Fortschritt — plus Begleitung von mir.",
    noPlanText: "Wähle einen Plan, um deinen Trainingsmonat, deine Produkt-Routine, Workouts und den Fortschritts-Tracker freizuschalten.",
    account: "Mein Konto", hello: "Hi", title: "Mein Plan", status: "Mitgliedschaft", active: "Aktiv", pending: "Wartet auf Zahlung",
    signInNeeded: "Melde dich an, um deinen Plan zu sehen.", signIn: "Anmelden", create: "Konto erstellen", loading: "Lädt…",
    payTitle: "Schließe deine Mitgliedschaft ab", paySteps: ["Konto erstellt", "Zahlung", "Freischaltung"],
    payText: "Schreib mir und ich schicke dir Preis und Zahlungsdetails für deinen Plan. Sobald deine Zahlung bestätigt ist, wird hier dein ganzer Monat freigeschaltet.",
    payDetails: "Schreib mir wegen der Zahlung", paid: "Ich habe bezahlt", paidThanks: "Danke! Ich bestätige deine Zahlung innerhalb von 24 Stunden und schalte deinen Plan frei.",
    changePlan: "Plan ändern", locked: "Nach der Zahlung freigeschaltet",
    download: "Meinen Plan herunterladen (PDF)", products: "Deine Produkte", productsSub: "Was & wann — jeden Tag",
    training: "Dein Trainingsmonat", week: "Woche", today: "Heute", challenge: "Aufgabe dieser Woche", typical: "Typische Zeit", tapWorkout: "Tippe auf ein Workout, um es zu sehen.",
    progress: "Mein Fortschritt", progressSub: "Trag jede Woche deine Werte ein — Gewicht, Maße und MAX-Tests.",
    date: "Datum", weight: "Gewicht (kg)", waist: "Taille (cm)", squat: "Kniebeugen MAX", pushup: "Liegestütze MAX", situp: "Sit-ups MAX", plank: "Plank (s)",
    save: "Speichern", saved: "Gespeichert", noEntries: "Noch keine Einträge — füge deinen ersten hinzu.", coach: "Fragen? Schreib mir", logout: "Abmelden", plan: "Plan",
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
  plans: {
    nav: "Planovi", label: "Članstvo", h1a: "Izaberi", h1b: "svoj plan.",
    intro: "Dva načina da treniraš sa mnom. Napravi nalog, izaberi plan i dobijaš svoj članski prostor sa svojim mesecom — proizvodi, trening i napredak.",
    popular: "Najpopularnije", join: "Učlani se", current: "Tvoj plan", goAccount: "Idi na moj plan",
    strongTag: "Mišići · oblik · energija", vipTag: "Maksimalni rezultati",
    tool: { tag: "Premium alat · samo VIP", name: "Smart Plate kalkulator", text: "Složi svaki tanjir na gram — doručak, ručak, večeru i užine. Dodaj koliko god namirnica želiš i odmah vidi kalorije, proteine, ugljene hidrate i masti — sa dnevnim ciljevima koje postavimo zajedno.", chips: ["Kalorije", "Proteini", "Ugljeni hidrati", "Masti", "Dnevni ciljevi"] },
    strong: ["4 treninga nedeljno — kompletan program za 4 nedelje", "Rutina proizvoda: Formula 1 + protein, biljni napitak", "Kartice treninga i vodič kroz vežbe sa slikama", "Nedeljni izazovi i praćenje napretka", "Tvoj plan kao PDF na tvom jeziku", "Odgovori na pitanja porukom"],
    vip: ["Sve iz Strong & Toned", "Smart Plate kalkulator — tvoj premium alat za ishranu", "5 treninga nedeljno, prilagođeno tvojim rezultatima", "Proizvodi izabrani lično za tebe", "Video poziv svake nedelje", "Plan se ažurira svake nedelje", "Prioritet, odgovor isti dan"],
    note: "Posle registracije šaljem ti cenu i detalje za plaćanje. Tvoj plan se otključava čim se uplata potvrdi.",
    stepsTitle: "Kako se učlanjuješ", steps: ["Napravi nalog i izaberi plan", "Plati svoj mesec", "Ja potvrdim — tvoj plan se otključava"],
  },
  admin: {
    nav: "Admin", title: "Članice", sub: "Sve koje imaju nalog — aktiviraj članstva, menjaj planove i prati napredak.",
    notAdmin: "Ova stranica je samo za admina.", setupNeeded: "Admin pristup još nije podešen u Supabase-u.",
    search: "Traži ime ili email", all: "Sve", waiting: "Čeka uplatu", paid: "Kaže da je platila", active: "Aktivne", free: "Besplatan nalog", inactive: "Neaktivno",
    total: "Naloga", joined: "Registrovana", lastLogin: "Poslednja prijava", never: "nikad", plan: "Plan", noPlan: "Bez plana", status: "Status",
    activate: "Aktiviraj", deactivate: "Deaktiviraj", start: "Datum početka", progress: "Napredak", noProgress: "Još nema upisanog napretka.",
    paidOn: "Platila (kaže) dana", refresh: "Osveži", empty: "Nema naloga.", saved: "Sačuvano", error: "Nešto nije u redu — pokušaj ponovo.",
  },
  member: {
    free: "Besplatan nalog", upgrade: "Nadogradi", upgradeTitle: "Otključaj svoj plan", choose: "Izaberi", later: "Možda kasnije",
    upgradeSub: "Izaberi plan i dobij ceo svoj mesec — trening, proizvode i napredak — uz moju podršku.",
    noPlanText: "Izaberi plan da otključaš mesec treninga, rutinu proizvoda, treninge i praćenje napretka.",
    account: "Moj nalog", hello: "Zdravo", title: "Moj plan", status: "Članstvo", active: "Aktivno", pending: "Čeka uplatu",
    signInNeeded: "Prijavi se da vidiš svoj plan.", signIn: "Prijava", create: "Napravi nalog", loading: "Učitava se…",
    payTitle: "Završi svoje članstvo", paySteps: ["Nalog napravljen", "Uplata", "Aktivacija"],
    payText: "Piši mi i poslaću ti cenu i detalje za plaćanje tvog plana. Čim se uplata potvrdi, ovde se otključava ceo tvoj mesec.",
    payDetails: "Piši mi za uplatu", paid: "Platila sam", paidThanks: "Hvala! Potvrdiću uplatu u roku od 24 sata i otključati tvoj plan.",
    changePlan: "Promeni plan", locked: "Otključava se posle uplate",
    download: "Preuzmi moj plan (PDF)", products: "Tvoji proizvodi", productsSub: "Šta i kada — svaki dan",
    training: "Tvoj mesec treninga", week: "Nedelja", today: "Danas", challenge: "Izazov ove nedelje", typical: "Uobičajeno vreme", tapWorkout: "Dodirni trening da ga vidiš.",
    progress: "Moj napredak", progressSub: "Upisuj brojeve svake nedelje — težinu, mere i MAX testove.",
    date: "Datum", weight: "Težina (kg)", waist: "Struk (cm)", squat: "Čučnjevi MAX", pushup: "Sklekovi MAX", situp: "Trbušnjaci MAX", plank: "Plank (s)",
    save: "Sačuvaj", saved: "Sačuvano", noEntries: "Još nema unosa — dodaj prvi.", coach: "Pitanja? Piši mi", logout: "Odjava", plan: "Plan",
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
