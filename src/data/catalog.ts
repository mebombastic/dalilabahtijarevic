import type { Lang, L } from "@/i18n";
import type { Product } from "@/components/ProductMenu";
import type { FlavourTin } from "@/components/FlavourCarousel";
import type { RitualStep } from "@/components/DailyRitual";
import f1Chocolate from "@/assets/f1-chocolate.webp";
import f1Raspberry from "@/assets/f1-raspberry.webp";
import f1Mint from "@/assets/f1-mint.webp";
import f1Cookie from "@/assets/f1-cookie.webp";
import f1Latte from "@/assets/f1-latte.webp";
import f1Vanilla from "@/assets/f1-vanilla.webp";
import f1Banana from "@/assets/f1-banana.webp";
import pTea from "@/assets/p-tea.webp";
import pFibreConc from "@/assets/p-fibreconc.webp";
import pShaker from "@/assets/p-shaker.webp";
import pKit from "@/assets/p-kit.webp";
import pSkin from "@/assets/p-skin.webp";
import pBioniq from "@/assets/p-bioniq.webp";

export const IG_PROFILE = "https://www.instagram.com/dalilafitlife";
export const IG_DM = "https://www.instagram.com/dalilafitlife/"; // goes straight to the profile (opens the app on phones)

const flavour = {
  chocolate: { en: "Smooth Chocolate", de: "Zarte Schokolade", sr: "Čokolada" },
  raspberry: { en: "Raspberry & White Chocolate", de: "Himbeere & weiße Schokolade", sr: "Malina i bela čokolada" },
  mint: { en: "Mint Chocolate", de: "Minze-Schokolade", sr: "Mint čokolada" },
  cookie: { en: "Cookie Crunch", de: "Cookie Crunch", sr: "Cookie Crunch" },
  latte: { en: "Café Latte", de: "Café Latte", sr: "Café Latte" },
  vanilla: { en: "Vanilla Crème", de: "Vanille-Creme", sr: "Vanila krem" },
  banana: { en: "Banana Cream", de: "Bananencreme", sr: "Krem od banane" },
} satisfies Record<string, L>;

const cat = {
  shakes: { en: "Shakes", de: "Shakes", sr: "Šejkovi" },
  fibre: { en: "Fibre & Digestion", de: "Ballaststoffe & Verdauung", sr: "Vlakna i varenje" },
  tea: { en: "Tea & Energy", de: "Tee & Energie", sr: "Čaj i energija" },
  skin: { en: "Skin Care", de: "Hautpflege", sr: "Nega kože" },
  personal: { en: "Personalised", de: "Personalisiert", sr: "Personalizovano" },
} satisfies Record<string, L>;

const badge = {
  best: { en: "Bestseller", de: "Bestseller", sr: "Najprodavanije" },
  new: { en: "New", de: "Neu", sr: "Novo" },
} satisfies Record<string, L>;

const lineup: { src: string; name: L; color: string; scale?: number; f1?: boolean }[] = [
  { src: f1Chocolate, name: flavour.chocolate, f1: true, color: "#7a4a33" },
  { src: pTea, name: { en: "Herbal Beverage · Mango & Pitaya", de: "Kräutergetränk · Mango & Pitaya", sr: "Biljni napitak · Mango i pitaja" }, color: "#f2a33a", scale: 0.74 },
  { src: f1Raspberry, name: flavour.raspberry, f1: true, color: "#e79bb4" },
  { src: f1Mint, name: flavour.mint, f1: true, color: "#9fd3a6" },
  { src: pFibreConc, name: { en: "Fibre Concentrate · Orange & Goji", de: "Ballaststoff-Konzentrat · Orange & Goji", sr: "Koncentrat vlakana · Narandža i goji" }, color: "#f39a1e", scale: 1.04 },
  { src: f1Latte, name: flavour.latte, f1: true, color: "#c08b62" },
  { src: pShaker, name: { en: "Herbalife Shaker", de: "Herbalife Shaker", sr: "Herbalife šejker" }, color: "#1f6b3a", scale: 0.9 },
  { src: f1Vanilla, name: flavour.vanilla, f1: true, color: "#f3e6bf" },
  { src: f1Banana, name: flavour.banana, f1: true, color: "#f2cf6a" },
];

export const heroLineup = (lang: Lang): FlavourTin[] =>
  lineup.map((x) => ({ src: x.src, color: x.color, scale: x.scale, name: x.f1 ? `Formula 1 · ${x.name[lang]}` : x.name[lang] }));

const f1Images = (lang: Lang) => [
  { src: f1Chocolate, label: flavour.chocolate[lang], color: "#7a4a33" },
  { src: f1Raspberry, label: flavour.raspberry[lang], color: "#e79bb4" },
  { src: f1Mint, label: flavour.mint[lang], color: "#9fd3a6" },
  { src: f1Cookie, label: flavour.cookie[lang], color: "#c9ad95" },
  { src: f1Latte, label: flavour.latte[lang], color: "#c08b62" },
  { src: f1Vanilla, label: flavour.vanilla[lang], color: "#f3e6bf" },
  { src: f1Banana, label: flavour.banana[lang], color: "#f2cf6a" },
];

type ProductDef = Omit<Product, "name" | "subtitle" | "category" | "desc" | "facts" | "note" | "badge" | "images"> & {
  name: L; subtitle: L; category: L; desc: L; facts: L[]; note?: L; badge?: L; images: (lang: Lang) => Product["images"];
};

const defs: ProductDef[] = [
  {
    name: { en: "Formula 1 Healthy Meal", de: "Formula 1 Healthy Meal", sr: "Formula 1 Healthy Meal" },
    subtitle: { en: "Nutritional shake mix", de: "Nährstoff-Shake", sr: "Nutritivni šejk" },
    category: cat.shakes, badge: badge.best, kind: "cutout", images: f1Images,
    desc: {
      en: "A balanced, nutritious meal in a glass - the heart of a healthy breakfast. Just shake with milk or a plant drink and go.",
      de: "Eine ausgewogene, nährstoffreiche Mahlzeit im Glas - das Herz eines gesunden Frühstücks. Einfach mit Milch oder Pflanzendrink shaken und los.",
      sr: "Uravnotežen, hranljiv obrok u čaši - srce zdravog doručka. Samo promućkaj sa mlekom ili biljnim napitkom i kreni.",
    },
    facts: [
      { en: "High-quality protein in every serving", de: "Hochwertiges Protein in jeder Portion", sr: "Kvalitetni proteini u svakoj porciji" },
      { en: "25 vitamins & minerals", de: "25 Vitamine & Mineralstoffe", sr: "25 vitamina i minerala" },
      { en: "Ready in under 2 minutes", de: "In unter 2 Minuten fertig", sr: "Spremno za manje od 2 minuta" },
      { en: "7 delicious flavours - tap a colour", de: "7 leckere Sorten - tippe auf eine Farbe", sr: "7 ukusa - dodirni boju" },
    ],
  },
  {
    name: { en: "Breakfast Starter Kit", de: "Frühstücks-Starterset", sr: "Početni paket za doručak" },
    subtitle: { en: "Everything to begin", de: "Alles für den Start", sr: "Sve za početak" },
    category: cat.shakes, kind: "cutout", images: () => [{ src: pKit }],
    desc: {
      en: "Formula 1 Healthy Meal, Oat Apple Fibre, a Herbalife shaker and a measuring scoop - the easiest way to start your morning routine.",
      de: "Formula 1 Healthy Meal, Hafer-Apfel-Ballaststoffe, ein Herbalife Shaker und ein Messlöffel - der einfachste Start in deine Morgenroutine.",
      sr: "Formula 1 Healthy Meal, vlakna od ovsa i jabuke, Herbalife šejker i merica - najlakši način da započneš jutarnju rutinu.",
    },
    facts: [
      { en: "Formula 1 Healthy Meal (550 g)", de: "Formula 1 Healthy Meal (550 g)", sr: "Formula 1 Healthy Meal (550 g)" },
      { en: "Oat Apple Fibre (204 g)", de: "Hafer-Apfel-Ballaststoffe (204 g)", sr: "Vlakna od ovsa i jabuke (204 g)" },
      { en: "Shaker + measuring scoop", de: "Shaker + Messlöffel", sr: "Šejker + merica" },
    ],
  },
  {
    name: { en: "Fibre Concentrate", de: "Ballaststoff-Konzentrat", sr: "Koncentrat vlakana" },
    subtitle: { en: "Orange & goji berry · 500 ml", de: "Orange & Gojibeere · 500 ml", sr: "Narandža i goji bobica · 500 ml" },
    category: cat.fibre, kind: "cutout", images: () => [{ src: pFibreConc }],
    desc: {
      en: "A concentrated fibre drink you mix with water. Calcium supports normal digestive enzyme function and vitamin C supports the immune system.",
      de: "Ein Ballaststoff-Konzentrat zum Mischen mit Wasser. Calcium unterstützt die normale Funktion der Verdauungsenzyme, Vitamin C das Immunsystem.",
      sr: "Koncentrovani napitak sa vlaknima koji mešaš sa vodom. Kalcijum doprinosi normalnoj funkciji probavnih enzima, a vitamin C imunološkom sistemu.",
    },
    facts: [
      { en: "High in fibre", de: "Reich an Ballaststoffen", sr: "Bogat vlaknima" },
      { en: "With calcium & vitamin C", de: "Mit Calcium & Vitamin C", sr: "Sa kalcijumom i vitaminom C" },
      { en: "Sugar-free, vegan & gluten-free", de: "Zuckerfrei, vegan & glutenfrei", sr: "Bez šećera, veganski i bez glutena" },
    ],
  },
  {
    name: { en: "Instant Herbal Beverage", de: "Instant-Kräutergetränk", sr: "Instant biljni napitak" },
    subtitle: { en: "Mango & pitaya · 102 g", de: "Mango & Pitaya · 102 g", sr: "Mango i pitaja · 102 g" },
    category: cat.tea, kind: "cutout", images: () => [{ src: pTea }],
    desc: {
      en: "A refreshing, low-calorie tea drink with tea extracts - enjoy it hot or over ice for a natural lift during the day.",
      de: "Ein erfrischendes, kalorienarmes Teegetränk mit Teeextrakten - heiß oder auf Eis, für einen natürlichen Kick am Tag.",
      sr: "Osvežavajući, niskokalorični napitak sa ekstraktima čaja - topao ili sa ledom, za prirodnu energiju tokom dana.",
    },
    facts: [
      { en: "With green & black tea extracts", de: "Mit Grün- & Schwarztee-Extrakten", sr: "Sa ekstraktima zelenog i crnog čaja" },
      { en: "Sweetened with stevia", de: "Mit Stevia gesüßt", sr: "Zaslađeno stevijom" },
      { en: "Delicious hot or iced", de: "Heiß oder eisgekühlt köstlich", sr: "Ukusno toplo ili hladno" },
    ],
    note: {
      en: "Contains caffeine - not for children, pregnant or breastfeeding women.",
      de: "Enthält Koffein - nicht für Kinder, Schwangere oder Stillende.",
      sr: "Sadrži kofein - nije za decu, trudnice ni dojilje.",
    },
  },
  {
    name: { en: "HL/Skin Collection", de: "HL/Skin Kollektion", sr: "HL/Skin kolekcija" },
    subtitle: { en: "New skincare line", de: "Neue Hautpflege-Linie", sr: "Nova linija nege kože" },
    category: cat.skin, badge: badge.new, kind: "photo", images: () => [{ src: pSkin }],
    desc: {
      en: "Herbalife's new skincare, made with Korean skincare science - from a gentle resurfacing gel cleanser to a 10% niacinamide serum and the Ultimate Tension Cream.",
      de: "Die neue Hautpflege von Herbalife, entwickelt mit koreanischer Hautpflege-Wissenschaft - vom sanften Gel-Reiniger bis zum 10 % Niacinamid-Serum und der Ultimate Tension Cream.",
      sr: "Nova Herbalife nega kože, razvijena uz korejsku nauku o nezi - od nežnog gel čistača do seruma sa 10 % niacinamida i Ultimate Tension kreme.",
    },
    facts: [
      { en: "Cleanser, serum, lotion & creams", de: "Reiniger, Serum, Lotion & Cremes", sr: "Čistač, serum, losion i kreme" },
      { en: "Brightens and evens skin tone", de: "Für einen strahlenden, ebenmäßigen Teint", sr: "Posvetljuje i ujednačava ten" },
      { en: "No added parabens", de: "Ohne zugesetzte Parabene", sr: "Bez dodatih parabena" },
    ],
  },
  {
    name: { en: "Bioniq GO", de: "Bioniq GO", sr: "Bioniq GO" },
    subtitle: { en: "Personalised supplement", de: "Personalisiertes Supplement", sr: "Personalizovani suplement" },
    category: cat.personal, badge: badge.new, kind: "photo", images: () => [{ src: pBioniq }],
    desc: {
      en: "Daily supplement granules made for you: a short wellness assessment matches you with one of 40 personalised formulas.",
      de: "Tägliche Supplement-Granulate, gemacht für dich: Ein kurzer Wellness-Check ordnet dir eine von 40 personalisierten Formeln zu.",
      sr: "Dnevne granule suplemenata napravljene za tebe: kratka procena zdravlja dodeljuje ti jednu od 40 personalizovanih formula.",
    },
    facts: [
      { en: "Personalised to your needs", de: "Auf deine Bedürfnisse abgestimmt", sr: "Prilagođeno tvojim potrebama" },
      { en: "Just 2 scoops a day", de: "Nur 2 Messlöffel am Tag", sr: "Samo 2 merice dnevno" },
      { en: "Now part of the Herbalife family", de: "Jetzt Teil der Herbalife-Familie", sr: "Sada deo Herbalife porodice" },
    ],
  },
];

export const getProducts = (lang: Lang): Product[] =>
  defs.map((p) => ({
    kind: p.kind,
    name: p.name[lang],
    subtitle: p.subtitle[lang],
    category: p.category[lang],
    desc: p.desc[lang],
    facts: p.facts.map((f) => f[lang]),
    note: p.note?.[lang],
    badge: p.badge?.[lang],
    images: p.images(lang),
  }));

const steps: { time: L; title: L; text: L; img: string; kind: RitualStep["kind"] }[] = [
  {
    time: { en: "Morning · 7:00", de: "Morgens · 7:00", sr: "Jutro · 7:00" },
    title: { en: "Shake up your breakfast", de: "Shake dein Frühstück", sr: "Šejk za doručak" },
    text: {
      en: "Start with a Formula 1 Healthy Meal - protein, vitamins and minerals in two minutes, so you're full and focused until lunch.",
      de: "Starte mit einem Formula 1 Healthy Meal - Protein, Vitamine und Mineralstoffe in zwei Minuten, damit du bis zum Mittag satt und fokussiert bist.",
      sr: "Počni dan uz Formula 1 Healthy Meal - proteini, vitamini i minerali za dva minuta, da budeš sita i fokusirana do ručka.",
    },
    img: f1Vanilla, kind: "cutout",
  },
  {
    time: { en: "Midday · 12:00", de: "Mittags · 12:00", sr: "Podne · 12:00" },
    title: { en: "Hydrate & refresh", de: "Trinken & erfrischen", sr: "Hidriraj se i osveži" },
    text: {
      en: "A glass of Instant Herbal Beverage, hot or iced, for a natural lift and to help you drink more through the day.",
      de: "Ein Glas Instant-Kräutergetränk, heiß oder auf Eis, für einen natürlichen Kick und damit du über den Tag mehr trinkst.",
      sr: "Čaša instant biljnog napitka, toplog ili sa ledom, za prirodnu energiju i da piješ više tečnosti tokom dana.",
    },
    img: pTea, kind: "cutout",
  },
  {
    time: { en: "Afternoon · 16:00", de: "Nachmittags · 16:00", sr: "Popodne · 16:00" },
    title: { en: "Feel light with fibre", de: "Leicht mit Ballaststoffen", sr: "Lakoća uz vlakna" },
    text: {
      en: "Mix Fibre Concentrate into water - an easy way to get more fibre into your day.",
      de: "Rühre Ballaststoff-Konzentrat in Wasser - ein einfacher Weg zu mehr Ballaststoffen.",
      sr: "Umešaj koncentrat vlakana u vodu - lak način da uneseš više vlakana tokom dana.",
    },
    img: pFibreConc, kind: "cutout",
  },
  {
    time: { en: "Evening · 21:00", de: "Abends · 21:00", sr: "Veče · 21:00" },
    title: { en: "Glow while you rest", de: "Strahlen im Schlaf", sr: "Sijaj dok se odmaraš" },
    text: {
      en: "Wind down with your HL/Skin routine - cleanse, treat and moisturise so your skin looks as good as you feel.",
      de: "Komm mit deiner HL/Skin-Routine zur Ruhe - reinigen, pflegen, Feuchtigkeit spenden, damit deine Haut so gut aussieht, wie du dich fühlst.",
      sr: "Opusti se uz HL/Skin rutinu - očisti, neguj i hidriraj kožu da izgleda dobro koliko se i ti osećaš.",
    },
    img: pSkin, kind: "photo",
  },
];

export const getRitual = (lang: Lang): RitualStep[] =>
  steps.map((s) => ({ time: s.time[lang], title: s.title[lang], text: s.text[lang], img: s.img, kind: s.kind }));
