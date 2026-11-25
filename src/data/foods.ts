/** Food database for the VIP calculator. Values per 100 g (kcal, protein, carbs, fat). */
export type Lang3 = "en" | "de" | "sr";
export type Food = {
  id: string;
  n: Record<Lang3, string>;
  k: number; p: number; c: number; f: number;
  /** optional typical portion: grams + label */
  u?: { g: number; l: Record<Lang3, string> };
  herbalife?: boolean;
};

const piece = { en: "1 piece", de: "1 Stück", sr: "1 komad" };
const slice = { en: "1 slice", de: "1 Scheibe", sr: "1 parče" };
const tbsp = { en: "1 tbsp", de: "1 EL", sr: "1 kašika" };
const cup = { en: "1 cup", de: "1 Tasse", sr: "1 šolja" };
const glass = { en: "1 glass", de: "1 Glas", sr: "1 čaša" };
const serving = { en: "1 serving", de: "1 Portion", sr: "1 porcija" };
const handful = { en: "1 handful", de: "1 Handvoll", sr: "1 šaka" };

const F = (id: string, en: string, de: string, sr: string, k: number, p: number, c: number, f: number, u?: Food["u"], herbalife?: boolean): Food =>
  ({ id, n: { en, de, sr }, k, p, c, f, u, herbalife });

export const FOODS: Food[] = [
  // Herbalife (approximate, per prepared serving scaled to 100 g)
  F("f1-milk", "Formula 1 shake (2 scoops + 250 ml semi-skimmed milk)", "Formula 1 Shake (2 Messl. + 250 ml fettarme Milch)", "Formula 1 šejk (2 merice + 250 ml mleka 1.5%)", 79, 6.5, 8.7, 2.2, { g: 276, l: serving }, true),
  F("f1-water", "Formula 1 shake (2 scoops + water)", "Formula 1 Shake (2 Messl. + Wasser)", "Formula 1 šejk (2 merice + voda)", 36, 3.5, 3.8, 0.8, { g: 276, l: serving }, true),
  F("f1-soy", "Formula 1 shake (2 scoops + 250 ml soy drink)", "Formula 1 Shake (2 Messl. + 250 ml Sojadrink)", "Formula 1 šejk (2 merice + 250 ml sojinog mleka)", 66, 6.2, 5.4, 2.2, { g: 276, l: serving }, true),
  F("tea", "Instant herbal beverage (½ tsp)", "Instant-Kräutergetränk (½ TL)", "Instant biljni napitak (½ kašičice)", 2.4, 0, 0.5, 0, { g: 250, l: cup }, true),
  F("fibre", "Fibre concentrate drink (20 ml + water)", "Ballaststoff-Konzentrat (20 ml + Wasser)", "Koncentrat vlakana (20 ml + voda)", 7, 0, 1.4, 0, { g: 270, l: glass }, true),

  // Protein
  F("chicken", "Chicken breast, cooked", "Hähnchenbrust, gegart", "Pileća prsa, kuvana/pečena", 165, 31, 0, 3.6, { g: 150, l: serving }),
  F("chicken-raw", "Chicken breast, raw", "Hähnchenbrust, roh", "Pileća prsa, sirova", 110, 23, 0, 1.5),
  F("beef", "Lean beef, cooked", "Mageres Rindfleisch, gegart", "Junetina posna, pečena", 217, 26, 0, 12, { g: 150, l: serving }),
  F("mince", "Beef mince 10% fat, cooked", "Rinderhack 10 % Fett, gegart", "Mleveno juneće 10% masti, pečeno", 217, 26, 0, 12),
  F("pork", "Pork loin, cooked", "Schweinelende, gegart", "Svinjski karé, pečen", 196, 27, 0, 9),
  F("salmon", "Salmon, baked", "Lachs, gebacken", "Losos, pečen", 206, 22, 0, 13, { g: 150, l: serving }),
  F("tuna", "Tuna in water, drained", "Thunfisch im eigenen Saft", "Tuna u sopstvenom soku", 116, 26, 0, 1, { g: 120, l: { en: "1 can", de: "1 Dose", sr: "1 konzerva" } }),
  F("white-fish", "White fish (cod), cooked", "Weißfisch (Kabeljau), gegart", "Bela riba (bakalar), kuvana", 105, 23, 0, 0.9, { g: 150, l: serving }),
  F("shrimp", "Shrimp, cooked", "Garnelen, gegart", "Škampi, kuvani", 99, 24, 0.2, 0.3),
  F("egg", "Egg, whole", "Ei, ganz", "Jaje, celo", 143, 12.6, 0.7, 9.5, { g: 60, l: piece }),
  F("egg-white", "Egg white", "Eiklar", "Belance", 52, 11, 0.7, 0.2, { g: 33, l: piece }),
  F("ham", "Chicken / turkey ham", "Geflügelschinken", "Pileća šunka", 105, 18, 2, 2.5, { g: 20, l: slice }),
  F("tofu", "Tofu", "Tofu", "Tofu", 144, 15.6, 2.8, 8.7),

  // Dairy
  F("milk", "Milk 1.5%", "Milch 1,5 %", "Mleko 1.5%", 47, 3.4, 4.9, 1.5, { g: 250, l: glass }),
  F("milk-35", "Milk 3.5%", "Milch 3,5 %", "Mleko 3.5%", 64, 3.3, 4.8, 3.5, { g: 250, l: glass }),
  F("skyr", "Skyr / high-protein yoghurt", "Skyr / Proteinjoghurt", "Skyr / proteinski jogurt", 63, 11, 4, 0.2, { g: 150, l: serving }),
  F("greek", "Greek yoghurt 2%", "Griechischer Joghurt 2 %", "Grčki jogurt 2%", 73, 10, 3.9, 2),
  F("yoghurt", "Plain yoghurt 2.8%", "Naturjoghurt 3,5 %", "Jogurt 2.8%", 61, 3.5, 4.7, 3, { g: 180, l: cup }),
  F("cottage", "Cottage cheese", "Hüttenkäse", "Cottage sir / mladi sir", 98, 11, 3.4, 4.3),
  F("quark", "Low-fat quark", "Magerquark", "Posni sir / kvark", 67, 12, 4, 0.3),
  F("cheese", "Hard cheese (gouda)", "Hartkäse (Gouda)", "Tvrdi sir (gauda)", 356, 25, 2.2, 27, { g: 20, l: slice }),
  F("feta", "Feta / white cheese", "Feta / Weißkäse", "Feta / beli sir", 264, 14, 4, 21),
  F("mozzarella", "Mozzarella light", "Mozzarella light", "Mocarela light", 165, 19, 1, 9),

  // Carbs
  F("rice", "Rice, cooked", "Reis, gekocht", "Pirinač, kuvan", 130, 2.7, 28, 0.3, { g: 150, l: serving }),
  F("rice-raw", "Rice, raw", "Reis, roh", "Pirinač, sirov", 360, 7, 79, 0.7),
  F("pasta", "Pasta, cooked", "Nudeln, gekocht", "Testenina, kuvana", 158, 5.8, 31, 0.9, { g: 180, l: serving }),
  F("pasta-raw", "Pasta, raw", "Nudeln, roh", "Testenina, sirova", 371, 13, 75, 1.5),
  F("potato", "Potatoes, boiled", "Kartoffeln, gekocht", "Krompir, kuvan", 87, 1.9, 20, 0.1, { g: 200, l: serving }),
  F("sweet-potato", "Sweet potato, baked", "Süßkartoffel, gebacken", "Batat, pečen", 90, 2, 21, 0.2, { g: 200, l: serving }),
  F("oats", "Oats", "Haferflocken", "Ovsene pahuljice", 379, 13, 60, 7, { g: 40, l: serving }),
  F("bread", "Wholegrain bread", "Vollkornbrot", "Integralni hleb", 247, 13, 41, 3.4, { g: 35, l: slice }),
  F("white-bread", "White bread", "Weißbrot", "Beli hleb", 265, 9, 49, 3.2, { g: 30, l: slice }),
  F("toast", "Toast bread", "Toastbrot", "Tost hleb", 270, 8, 49, 4, { g: 25, l: slice }),
  F("rice-cake", "Rice cake", "Reiswaffel", "Pirinčani krekeri", 387, 8, 81, 2.8, { g: 9, l: piece }),
  F("tortilla", "Wholewheat tortilla wrap", "Vollkorn-Tortilla", "Integralna tortilja", 300, 9, 48, 7, { g: 60, l: piece }),
  F("quinoa", "Quinoa, cooked", "Quinoa, gekocht", "Kinoa, kuvana", 120, 4.4, 21, 1.9),
  F("buckwheat", "Buckwheat, cooked", "Buchweizen, gekocht", "Heljda, kuvana", 92, 3.4, 20, 0.6),
  F("couscous", "Couscous, cooked", "Couscous, gekocht", "Kus-kus, kuvan", 112, 3.8, 23, 0.2),
  F("lentils", "Lentils, cooked", "Linsen, gekocht", "Sočivo, kuvano", 116, 9, 20, 0.4),
  F("chickpeas", "Chickpeas, cooked", "Kichererbsen, gekocht", "Leblebije, kuvane", 164, 8.9, 27, 2.6),
  F("beans", "Beans, cooked", "Bohnen, gekocht", "Pasulj, kuvan", 127, 8.7, 22, 0.5),
  F("corn", "Sweet corn", "Mais", "Kukuruz šećerac", 86, 3.3, 19, 1.4),

  // Fruit
  F("banana", "Banana", "Banane", "Banana", 89, 1.1, 23, 0.3, { g: 120, l: piece }),
  F("apple", "Apple", "Apfel", "Jabuka", 52, 0.3, 14, 0.2, { g: 180, l: piece }),
  F("orange", "Orange", "Orange", "Pomorandža", 47, 0.9, 12, 0.1, { g: 150, l: piece }),
  F("berries", "Berries (mixed)", "Beeren (gemischt)", "Bobičasto voće (mešano)", 50, 0.8, 11, 0.3, { g: 125, l: cup }),
  F("strawberries", "Strawberries", "Erdbeeren", "Jagode", 32, 0.7, 7.7, 0.3),
  F("grapes", "Grapes", "Weintrauben", "Grožđe", 69, 0.7, 18, 0.2),
  F("kiwi", "Kiwi", "Kiwi", "Kivi", 61, 1.1, 15, 0.5, { g: 75, l: piece }),
  F("pear", "Pear", "Birne", "Kruška", 57, 0.4, 15, 0.1, { g: 170, l: piece }),
  F("peach", "Peach", "Pfirsich", "Breskva", 39, 0.9, 10, 0.3, { g: 150, l: piece }),
  F("watermelon", "Watermelon", "Wassermelone", "Lubenica", 30, 0.6, 7.6, 0.2),
  F("dates", "Dates, dried", "Datteln, getrocknet", "Urme, suve", 282, 2.5, 75, 0.4, { g: 8, l: piece }),

  // Vegetables
  F("salad", "Green salad / lettuce", "Blattsalat", "Zelena salata", 15, 1.4, 2.9, 0.2),
  F("tomato", "Tomato", "Tomate", "Paradajz", 18, 0.9, 3.9, 0.2, { g: 120, l: piece }),
  F("cucumber", "Cucumber", "Gurke", "Krastavac", 15, 0.7, 3.6, 0.1),
  F("pepper", "Bell pepper", "Paprika", "Paprika", 31, 1, 6, 0.3, { g: 150, l: piece }),
  F("broccoli", "Broccoli", "Brokkoli", "Brokoli", 34, 2.8, 7, 0.4),
  F("zucchini", "Zucchini", "Zucchini", "Tikvica", 17, 1.2, 3.1, 0.3),
  F("carrot", "Carrot", "Karotte", "Šargarepa", 41, 0.9, 10, 0.2, { g: 80, l: piece }),
  F("spinach", "Spinach", "Spinat", "Spanać", 23, 2.9, 3.6, 0.4),
  F("mushrooms", "Mushrooms", "Champignons", "Šampinjoni", 22, 3.1, 3.3, 0.3),
  F("green-beans", "Green beans", "Grüne Bohnen", "Boranija", 31, 1.8, 7, 0.2),
  F("avocado", "Avocado", "Avocado", "Avokado", 160, 2, 8.5, 14.7, { g: 150, l: piece }),

  // Fats, nuts, extras
  F("olive-oil", "Olive oil", "Olivenöl", "Maslinovo ulje", 884, 0, 0, 100, { g: 10, l: tbsp }),
  F("butter", "Butter", "Butter", "Puter", 717, 0.9, 0.1, 81, { g: 10, l: tbsp }),
  F("peanut-butter", "Peanut butter", "Erdnussbutter", "Puter od kikirikija", 588, 25, 20, 50, { g: 15, l: tbsp }),
  F("almonds", "Almonds", "Mandeln", "Bademi", 579, 21, 22, 50, { g: 25, l: handful }),
  F("walnuts", "Walnuts", "Walnüsse", "Orasi", 654, 15, 14, 65, { g: 25, l: handful }),
  F("chia", "Chia seeds", "Chiasamen", "Čija semenke", 486, 17, 42, 31, { g: 12, l: tbsp }),
  F("honey", "Honey", "Honig", "Med", 304, 0.3, 82, 0, { g: 20, l: tbsp }),
  F("hummus", "Hummus", "Hummus", "Humus", 166, 7.9, 14, 9.6, { g: 30, l: tbsp }),
  F("dark-choc", "Dark chocolate 70%", "Zartbitterschokolade 70 %", "Crna čokolada 70%", 598, 7.8, 46, 43, { g: 10, l: piece }),

  // Drinks
  F("coffee-milk", "Coffee with milk", "Kaffee mit Milch", "Kafa sa mlekom", 20, 1.2, 1.8, 0.8, { g: 200, l: cup }),
  F("juice", "Orange juice", "Orangensaft", "Sok od pomorandže", 45, 0.7, 10, 0.2, { g: 250, l: glass }),
  F("cola", "Cola", "Cola", "Koka-kola", 42, 0, 10.6, 0, { g: 330, l: { en: "1 can", de: "1 Dose", sr: "1 limenka" } }),
];

export const foodName = (f: Food, lang: Lang3) => f.n[lang] || f.n.en;
