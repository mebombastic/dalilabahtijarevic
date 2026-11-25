/** Text for weekly check-in and daily habits (member + admin). */
const en = {
  ci: {
    label: "Weekly check-in", sub: "Once a week: your numbers, a photo and how you feel. I read every check-in and answer you here.",
    weight: "Weight (kg)", waist: "Waist (cm)", energy: "Energy", sleep: "Sleep", hunger: "Hunger", scaleLow: "low", scaleHigh: "great",
    hungerLow: "never hungry", hungerHigh: "always hungry",
    photo: "Progress photo (optional)", photoBtn: "Add a photo", photoChange: "Change photo", photoNote: "Only you and Dalila can see it.",
    note: "How did your week go?", notePh: "Workouts, food, what was easy or hard…",
    question: "Question for Dalila (optional)", questionPh: "Anything you want to ask me",
    send: "Send check-in", sending: "Sending…", sentTitle: "This week's check-in is sent", waiting: "Dalila will answer you soon.",
    reply: "Dalila's answer", history: "Earlier check-ins", week: "Week of", none: "No check-ins yet.",
    error: "Couldn't send. Check your connection and try again.", setup: "Check-ins are almost ready. Dalila is finishing the setup.",
    photoErr: "The photo couldn't be uploaded. You can send the check-in without it.",
  },
  hb: {
    label: "My habits", sub: "Tick what you did today. Small things every day make the big change.",
    items: { water: "2 L of water", steps: "8,000 steps", sleep: "7+ hours of sleep", shake: "Herbalife shake", veg: "Vegetables with 2 meals", move: "Workout or walk" },
    today: "Today", week: "This week", streak: "days in a row", streakHint: "A day counts when you tick at least 4.", score: "done",
  },
  ad: {
    checkins: "Check-ins", unanswered: "waiting for your answer", replyPh: "Write your answer…", sendReply: "Send answer", answered: "Answered",
    habits7: "Habits, last 7 days", noCheckins: "No check-ins yet.", energy: "Energy", sleep: "Sleep", hunger: "Hunger", question: "Question",
  },
};
type T = typeof en;
const de: T = {
  ci: {
    label: "Wöchentlicher Check-in", sub: "Einmal pro Woche: deine Werte, ein Foto und wie es dir geht. Ich lese jeden Check-in und antworte dir hier.",
    weight: "Gewicht (kg)", waist: "Taille (cm)", energy: "Energie", sleep: "Schlaf", hunger: "Hunger", scaleLow: "schlecht", scaleHigh: "super",
    hungerLow: "nie hungrig", hungerHigh: "immer hungrig",
    photo: "Fortschrittsfoto (optional)", photoBtn: "Foto hinzufügen", photoChange: "Foto ändern", photoNote: "Nur du und Dalila könnt es sehen.",
    note: "Wie war deine Woche?", notePh: "Training, Essen, was leicht oder schwer war…",
    question: "Frage an Dalila (optional)", questionPh: "Alles, was du mich fragen willst",
    send: "Check-in senden", sending: "Wird gesendet…", sentTitle: "Der Check-in dieser Woche ist gesendet", waiting: "Dalila antwortet dir bald.",
    reply: "Antwort von Dalila", history: "Frühere Check-ins", week: "Woche vom", none: "Noch keine Check-ins.",
    error: "Senden fehlgeschlagen. Prüfe deine Verbindung und versuche es erneut.", setup: "Check-ins sind fast fertig. Dalila schließt gerade die Einrichtung ab.",
    photoErr: "Das Foto konnte nicht hochgeladen werden. Du kannst den Check-in ohne Foto senden.",
  },
  hb: {
    label: "Meine Gewohnheiten", sub: "Hake ab, was du heute geschafft hast. Kleine Dinge jeden Tag machen die große Veränderung.",
    items: { water: "2 L Wasser", steps: "8.000 Schritte", sleep: "7+ Stunden Schlaf", shake: "Herbalife-Shake", veg: "Gemüse zu 2 Mahlzeiten", move: "Training oder Spaziergang" },
    today: "Heute", week: "Diese Woche", streak: "Tage am Stück", streakHint: "Ein Tag zählt, wenn du mindestens 4 abhakst.", score: "erledigt",
  },
  ad: {
    checkins: "Check-ins", unanswered: "warten auf deine Antwort", replyPh: "Schreib deine Antwort…", sendReply: "Antwort senden", answered: "Beantwortet",
    habits7: "Gewohnheiten, letzte 7 Tage", noCheckins: "Noch keine Check-ins.", energy: "Energie", sleep: "Schlaf", hunger: "Hunger", question: "Frage",
  },
};
const sr: T = {
  ci: {
    label: "Nedeljni check-in", sub: "Jednom nedeljno: tvoji brojevi, slika i kako se osećaš. Čitam svaki check-in i odgovaram ti ovde.",
    weight: "Težina (kg)", waist: "Struk (cm)", energy: "Energija", sleep: "San", hunger: "Glad", scaleLow: "loše", scaleHigh: "odlično",
    hungerLow: "nikad gladna", hungerHigh: "stalno gladna",
    photo: "Slika napretka (nije obavezno)", photoBtn: "Dodaj sliku", photoChange: "Promeni sliku", photoNote: "Vidite je samo ti i Dalila.",
    note: "Kako je prošla tvoja nedelja?", notePh: "Treninzi, hrana, šta je bilo lako ili teško…",
    question: "Pitanje za Dalilu (nije obavezno)", questionPh: "Šta god želiš da me pitaš",
    send: "Pošalji check-in", sending: "Šaljem…", sentTitle: "Check-in za ovu nedelju je poslat", waiting: "Dalila će ti uskoro odgovoriti.",
    reply: "Dalilin odgovor", history: "Raniji check-in", week: "Nedelja od", none: "Još nema check-in.",
    error: "Slanje nije uspelo. Proveri internet i pokušaj ponovo.", setup: "Check-in je skoro spreman. Dalila završava podešavanje.",
    photoErr: "Slika nije mogla da se pošalje. Možeš poslati check-in i bez nje.",
  },
  hb: {
    label: "Moje navike", sub: "Štikliraj šta si danas uradila. Male stvari svaki dan prave veliku promenu.",
    items: { water: "2 L vode", steps: "8.000 koraka", sleep: "7+ sati sna", shake: "Herbalife šejk", veg: "Povrće uz 2 obroka", move: "Trening ili šetnja" },
    today: "Danas", week: "Ove nedelje", streak: "dana zaredom", streakHint: "Dan se računa kad štikliraš bar 4.", score: "urađeno",
  },
  ad: {
    checkins: "Check-in", unanswered: "čeka tvoj odgovor", replyPh: "Napiši odgovor…", sendReply: "Pošalji odgovor", answered: "Odgovoreno",
    habits7: "Navike, poslednjih 7 dana", noCheckins: "Još nema check-in.", energy: "Energija", sleep: "San", hunger: "Glad", question: "Pitanje",
  },
};
export const COACH = { en, de, sr };
export const HABITS = ["water", "steps", "sleep", "shake", "veg", "move"] as const;
