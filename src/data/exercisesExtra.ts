import { EXERCISES, type ExLang } from "@/data/exercises";

type Ex = (typeof EXERCISES)[string];
const L = (en: ExLang, de: ExLang, sr: ExLang) => ({ en, de, sr });
const e = (title: string, steps: string[], easy: string, easyLabel: string): ExLang => ({ title, steps, easy, easyLabel });

/** Extra exercises for personal plans (dumbbells, cardio, mobility). Pictures reuse the closest bodyweight figure. */
export const EXTRA: Record<string, Ex> = {
  kneepush: { frames: EXERCISES.push.frames, ...L(
    e("Knee push-up", ["Hands under shoulders, knees on the floor, body straight from head to knees.", "Bend your elbows and lower your chest towards the floor.", "Push back up. Keep your belly tight."], "Hands on a bench or a wall.", "Easier"),
    e("Liegestütz auf Knien", ["Hände unter den Schultern, Knie am Boden, Körper gerade von Kopf bis Knie.", "Ellbogen beugen und die Brust Richtung Boden senken.", "Wieder hochdrücken. Bauch fest."], "Hände auf einer Bank oder an der Wand.", "Leichter"),
    e("Sklek na kolenima", ["Šake ispod ramena, kolena na podu, telo pravo od glave do kolena.", "Savij laktove i spusti grudi ka podu.", "Odgurni se nazad. Stomak čvrst."], "Ruke na klupi ili na zidu.", "Lakše")) },
  goblet: { frames: EXERCISES.squat.frames, ...L(
    e("Goblet squat (dumbbell)", ["Hold one dumbbell at your chest with both hands, feet shoulder-width.", "Sit down between your heels until thighs are parallel, chest up.", "Push through your heels to stand up."], "Use a lighter weight or no weight.", "Easier"),
    e("Goblet Squat (Kurzhantel)", ["Eine Kurzhantel mit beiden Händen vor der Brust halten, Füße schulterbreit.", "Zwischen die Fersen setzen, bis die Oberschenkel parallel sind, Brust oben.", "Über die Fersen hochdrücken."], "Leichteres Gewicht oder ohne Gewicht.", "Leichter"),
    e("Goblet čučanj (bučica)", ["Drži jednu bučicu uz grudi sa obe ruke, stopala u širini ramena.", "Spusti se između peta dok butine ne budu paralelne, grudi gore.", "Odgurni se petama i ustani."], "Lakša bučica ili bez tega.", "Lakše")) },
  dblunge: { frames: EXERCISES.lunge.frames, ...L(
    e("Dumbbell lunge", ["Stand tall with a dumbbell in each hand.", "Step forward and lower until both knees are at 90°.", "Push back to standing and switch legs."], "No dumbbells, hold on to a wall.", "Easier"),
    e("Ausfallschritt mit Kurzhanteln", ["Aufrecht stehen, in jeder Hand eine Kurzhantel.", "Nach vorne steigen und absenken, bis beide Knie 90° haben.", "Zurückdrücken und Bein wechseln."], "Ohne Hanteln, an der Wand festhalten.", "Leichter"),
    e("Iskorak sa bučicama", ["Stani uspravno sa bučicom u svakoj ruci.", "Iskorači napred i spusti se dok oba kolena ne budu pod 90°.", "Vrati se nazad i promeni nogu."], "Bez bučica, pridržavaj se za zid.", "Lakše")) },
  dbrdl: { frames: [], ...L(
    e("Dumbbell Romanian deadlift", ["Stand with dumbbells in front of your thighs, knees slightly bent.", "Push your hips back and slide the weights down your legs, back flat.", "Squeeze your glutes and stand up tall."], "Lighter dumbbells, smaller range.", "Easier"),
    e("Rumänisches Kreuzheben (Kurzhanteln)", ["Hanteln vor den Oberschenkeln, Knie leicht gebeugt.", "Hüfte nach hinten schieben, Hanteln an den Beinen entlang senken, Rücken gerade.", "Po anspannen und aufrichten."], "Leichtere Hanteln, kleinere Bewegung.", "Leichter"),
    e("Rumunsko mrtvo dizanje (bučice)", ["Bučice ispred butina, kolena blago savijena.", "Guraj kukove nazad i spuštaj tegove niz noge, leđa prava.", "Stegni zadnjicu i ispravi se."], "Lakše bučice, manji pokret.", "Lakše")) },
  dbrow: { frames: [], ...L(
    e("Dumbbell row", ["One hand and knee on a bench or chair, back flat, dumbbell in the other hand.", "Pull the dumbbell to your hip, elbow close to the body.", "Lower slowly. Do all reps, then switch sides."], "Lighter dumbbell or a water bottle.", "Easier"),
    e("Kurzhantel-Rudern", ["Eine Hand und ein Knie auf Bank oder Stuhl, Rücken gerade, Hantel in der anderen Hand.", "Hantel zur Hüfte ziehen, Ellbogen nah am Körper.", "Langsam senken. Alle Wiederholungen, dann Seite wechseln."], "Leichtere Hantel oder eine Wasserflasche.", "Leichter"),
    e("Veslanje bučicom", ["Jedna ruka i koleno na klupi ili stolici, leđa prava, bučica u drugoj ruci.", "Povuci bučicu ka kuku, lakat uz telo.", "Spuštaj polako. Uradi sva ponavljanja pa promeni stranu."], "Lakša bučica ili flaša vode.", "Lakše")) },
  dbpress: { frames: [], ...L(
    e("Dumbbell shoulder press", ["Sit or stand tall, dumbbells at shoulder height, palms forward.", "Press the weights straight up until your arms are straight.", "Lower slowly back to your shoulders."], "Lighter dumbbells, one arm at a time.", "Easier"),
    e("Schulterdrücken (Kurzhanteln)", ["Aufrecht sitzen oder stehen, Hanteln auf Schulterhöhe, Handflächen nach vorne.", "Gewichte gerade nach oben drücken, bis die Arme gestreckt sind.", "Langsam zu den Schultern senken."], "Leichtere Hanteln, ein Arm nach dem anderen.", "Leichter"),
    e("Potisak bučica iznad glave", ["Sedi ili stani uspravno, bučice u visini ramena, dlanovi napred.", "Potisni tegove pravo gore dok se ruke ne isprave.", "Polako ih spusti nazad do ramena."], "Lakše bučice, jedna po jedna ruka.", "Lakše")) },
  dbchest: { frames: [], ...L(
    e("Dumbbell floor press", ["Lie on your back, knees bent, a dumbbell in each hand above your chest.", "Lower the weights until your upper arms touch the floor.", "Press back up and squeeze your chest."], "Lighter dumbbells.", "Easier"),
    e("Bodendrücken (Kurzhanteln)", ["Auf dem Rücken liegen, Knie gebeugt, Hanteln über der Brust.", "Gewichte senken, bis die Oberarme den Boden berühren.", "Wieder hochdrücken und die Brust anspannen."], "Leichtere Hanteln.", "Leichter"),
    e("Potisak bučica sa poda", ["Lezi na leđa, kolena savijena, bučice iznad grudi.", "Spuštaj tegove dok nadlaktice ne dodirnu pod.", "Potisni gore i stegni grudi."], "Lakše bučice.", "Lakše")) },
  dbthrust: { frames: EXERCISES.bridge.frames, ...L(
    e("Glute bridge with dumbbell", ["Lie on your back, knees bent, a dumbbell resting on your hips.", "Push through your heels and lift your hips into a straight line.", "Hold for 1 second at the top, lower slowly."], "Without the dumbbell.", "Easier"),
    e("Glute Bridge mit Kurzhantel", ["Auf dem Rücken liegen, Knie gebeugt, Hantel auf der Hüfte.", "Über die Fersen drücken und die Hüfte in eine gerade Linie heben.", "Oben 1 Sekunde halten, langsam senken."], "Ohne Hantel.", "Leichter"),
    e("Glute most sa bučicom", ["Lezi na leđa, kolena savijena, bučica na kukovima.", "Odgurni se petama i podigni kukove u pravu liniju.", "Zadrži 1 sekundu gore, spuštaj polako."], "Bez bučice.", "Lakše")) },
  walk: { frames: [], ...L(
    e("Brisk walk", ["Walk fast enough that talking is a little harder than normal.", "Swing your arms and stand tall.", "Keep the pace for the whole time."], "Slower pace, shorter time.", "Easier"),
    e("Zügiges Gehen", ["So schnell gehen, dass das Reden etwas schwerer fällt.", "Arme mitschwingen, aufrecht bleiben.", "Das Tempo die ganze Zeit halten."], "Langsamer, kürzer.", "Leichter"),
    e("Brzo hodanje", ["Hodaj toliko brzo da ti je pričanje malo teže nego inače.", "Mahni rukama i drži se uspravno.", "Drži tempo celo vreme."], "Sporije i kraće.", "Lakše")) },
  walkrun: { frames: [], ...L(
    e("Walk and run", ["Warm up with 5 minutes of walking.", "Run easy for 1 minute, then walk for 2 minutes.", "Repeat until the time is up. Finish with 3 minutes of walking."], "Only walking with short fast parts.", "Easier"),
    e("Gehen und Laufen", ["5 Minuten Gehen zum Aufwärmen.", "1 Minute locker laufen, dann 2 Minuten gehen.", "Wiederholen, bis die Zeit um ist. 3 Minuten Gehen zum Schluss."], "Nur Gehen mit kurzen schnellen Abschnitten.", "Leichter"),
    e("Hodanje i trčanje", ["Zagrej se sa 5 minuta hodanja.", "Trči lagano 1 minut, pa hodaj 2 minuta.", "Ponavljaj dok ne istekne vreme. Završi sa 3 minuta hodanja."], "Samo hodanje sa kratkim brzim delovima.", "Lakše")) },
  run: { frames: [], ...L(
    e("Easy run", ["Run at a pace where you can still talk in short sentences.", "Relaxed shoulders, short steps.", "Walk for a minute if you need to, then continue."], "Walk and run instead.", "Easier"),
    e("Lockerer Lauf", ["In einem Tempo laufen, bei dem du noch kurze Sätze sprechen kannst.", "Schultern locker, kurze Schritte.", "Bei Bedarf eine Minute gehen, dann weiter."], "Stattdessen Gehen und Laufen.", "Leichter"),
    e("Lagano trčanje", ["Trči tempom u kom još možeš da izgovoriš kratke rečenice.", "Opuštena ramena, kratki koraci.", "Ako treba prošetaj minut, pa nastavi."], "Umesto toga hodanje i trčanje.", "Lakše")) },
  intervals: { frames: [], ...L(
    e("Run intervals", ["Warm up with 5 minutes of easy running.", "Run fast for 1 minute, then jog or walk for 1 minute.", "Repeat the fast and easy parts, then cool down for 5 minutes."], "Fast walking instead of fast running.", "Easier"),
    e("Lauf-Intervalle", ["5 Minuten locker einlaufen.", "1 Minute schnell laufen, dann 1 Minute traben oder gehen.", "Schnelle und lockere Teile wiederholen, dann 5 Minuten auslaufen."], "Schnelles Gehen statt schnelles Laufen.", "Leichter"),
    e("Intervali trčanja", ["Zagrej se sa 5 minuta laganog trčanja.", "Trči brzo 1 minut, pa lagano trči ili hodaj 1 minut.", "Ponavljaj brze i lagane delove, pa se ohladi 5 minuta."], "Brzo hodanje umesto brzog trčanja.", "Lakše")) },
  stretch: { frames: [], ...L(
    e("Stretching", ["Hold each stretch for 30 seconds: legs, hips, back, chest and shoulders.", "Breathe slowly and never stretch into pain.", "Finish with 1 minute of slow breathing."], "Shorter holds.", "Easier"),
    e("Dehnen", ["Jede Dehnung 30 Sekunden halten: Beine, Hüfte, Rücken, Brust und Schultern.", "Langsam atmen, nie in den Schmerz dehnen.", "Mit 1 Minute ruhigem Atmen abschließen."], "Kürzer halten.", "Leichter"),
    e("Istezanje", ["Zadrži svako istezanje 30 sekundi: noge, kukovi, leđa, grudi i ramena.", "Diši polako i nikad ne isteži do bola.", "Završi sa 1 minutom mirnog disanja."], "Kraće zadržavanje.", "Lakše")) },
  deepsquat: { frames: EXERCISES.squat.frames, ...L(
    e("Deep squat", ["Stand tall, heels no wider than your shoulders, arms free.", "Lower your hips all the way until your thighs touch your calves. Knees out, chest up, weight on your heels.", "Stand back up. Hands never touch your legs or the floor."], "Go only as deep as you can with a straight back.", "Easier"),
    e("Tiefe Kniebeuge", ["Aufrecht stehen, Fersen höchstens schulterbreit, Arme frei.", "Hüfte ganz absenken, bis die Oberschenkel die Waden berühren. Knie nach außen, Brust raus, Gewicht auf den Fersen.", "Wieder aufrichten. Die Hände berühren nie Beine oder Boden."], "Nur so tief, wie es mit geradem Rücken geht.", "Leichter"),
    e("Dubok čučanj", ["Stani uspravno, pete najviše u širini ramena, ruke slobodne.", "Spusti kukove skroz dok butine ne dodirnu listove. Kolena ka spolja, grudi napred, težina na petama.", "Ustani. Ruke nikad ne diraju noge ni pod."], "Spusti se samo koliko možeš sa pravim leđima.", "Lakše")) },
  highjump: { frames: EXERCISES.sqjump.frames, ...L(
    e("High jump (tuck jump)", ["Stand tall, feet hip-width.", "Jump off both feet and pull your knees up towards your chest.", "Land softly on the balls of your feet, knees not falling inwards."], "Pull your knees only as high as you can, or do fast knee raises without jumping.", "Easier"),
    e("Hocksprung", ["Aufrecht stehen, Füße hüftbreit.", "Beidbeinig abspringen und die Knie Richtung Brust ziehen.", "Weich auf den Fußballen landen, Knie nicht nach innen."], "Knie nur so hoch wie möglich, oder schnelle Knieheben ohne Sprung.", "Leichter"),
    e("Visoki skok", ["Stani uspravno, stopala u širini kukova.", "Odrazi se sa obe noge i povuci kolena ka grudima.", "Doskoči mekano na prste, kolena ne padaju unutra."], "Kolena podigni koliko možeš, ili brzo podizanje kolena bez skoka.", "Lakše")) },
  jackknife: { frames: EXERCISES.legraise.frames, ...L(
    e("Jackknife", ["Lie on your back, legs straight, arms stretched on the floor behind your head.", "Lift your legs and upper body at the same time and touch your feet when your legs are vertical.", "Lower back down with control. Keep your legs straight."], "Bend your knees and touch your shins.", "Easier"),
    e("Klappmesser", ["Auf dem Rücken liegen, Beine gestreckt, Arme hinter dem Kopf am Boden.", "Beine und Oberkörper gleichzeitig heben und die Füße berühren, wenn die Beine senkrecht sind.", "Kontrolliert ablegen. Beine bleiben gestreckt."], "Knie beugen und die Schienbeine berühren.", "Leichter"),
    e("Perorez (jackknife)", ["Lezi na leđa, noge ispružene, ruke ispružene na podu iza glave.", "Istovremeno podigni noge i gornji deo tela i dodirni stopala kad su noge uspravne.", "Spusti se kontrolisano. Noge ostaju prave."], "Savij kolena i dodirni potkolenice.", "Lakše")) },
  hspush: { frames: EXERCISES.pike.frames, ...L(
    e("Handstand push-up", ["Kick up into a handstand against a wall, arms straight, hands about shoulder-width.", "Lower yourself until your head touches the floor.", "Press back up until your arms are straight. Keep your body tight."], "Pike push-up: feet on the floor, hips high, lower your head between your hands.", "Easier"),
    e("Handstand-Liegestütz", ["In den Handstand an der Wand, Arme gestreckt, Hände etwa schulterbreit.", "Absenken, bis der Kopf den Boden berührt.", "Wieder hochdrücken, bis die Arme gestreckt sind. Körper fest."], "Pike-Liegestütz: Füße am Boden, Hüfte hoch, Kopf zwischen die Hände senken.", "Leichter"),
    e("Sklek u stoju na rukama", ["Popni se u stoj na rukama uz zid, ruke prave, šake u širini ramena.", "Spusti se dok glava ne dodirne pod.", "Potisni se nazad dok se ruke ne isprave. Telo čvrsto."], "Pike sklek: stopala na podu, kukovi visoko, spusti glavu između šaka.", "Lakše")) },
  pullup: { frames: [], ...L(
    e("Pull-up", ["Hang from a bar with your arms completely straight, feet off the floor.", "Pull yourself up until your chin is above the bar.", "Lower all the way down until your arms are straight again."], "Jump up to get your chin over the bar, then lower yourself slowly. Or use a resistance band.", "Easier"),
    e("Klimmzug", ["An einer Stange hängen, Arme ganz gestreckt, Füße ohne Bodenkontakt.", "Hochziehen, bis das Kinn über der Stange ist.", "Ganz absenken, bis die Arme wieder gestreckt sind."], "Hochspringen, um das Kinn über die Stange zu bringen, dann langsam absenken. Oder mit Widerstandsband.", "Leichter"),
    e("Zgib", ["Visi na šipki sa potpuno ispruženim rukama, stopala ne diraju pod.", "Povuci se gore dok brada ne pređe šipku.", "Spusti se skroz dok se ruke ponovo ne isprave."], "Odskoči da brada pređe šipku, pa se polako spuštaj. Ili koristi elastičnu traku.", "Lakše")) },
  sprint: { frames: [], ...L(
    e("Sprint", ["Mark a distance, for example 40 m.", "Run as fast as you can to the mark and back.", "Walk back to the start if you need, then continue the workout."], "Fast run instead of an all-out sprint.", "Easier"),
    e("Sprint", ["Strecke markieren, zum Beispiel 40 m.", "So schnell du kannst bis zur Markierung und zurück laufen.", "Bei Bedarf zurückgehen, dann mit dem Workout weitermachen."], "Zügiges Laufen statt Vollsprint.", "Leichter"),
    e("Sprint", ["Obeleži razdaljinu, na primer 40 m.", "Trči najbrže što možeš do oznake i nazad.", "Ako treba vrati se hodajući, pa nastavi trening."], "Brzo trčanje umesto punog sprinta.", "Lakše")) },
};

export const ALL_EXERCISES: Record<string, Ex> = { ...EXERCISES, ...EXTRA };
