import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EXERCISES, EXERCISE_BY_NAME } from "@/data/exercises";

type Lang = "en" | "de" | "sr";
const T = {
  en: { how: "How to do it", tap: "Tap an exercise to see how it's done." },
  de: { how: "So geht's", tap: "Tippe auf eine Übung, um zu sehen, wie sie geht." },
  sr: { how: "Kako se radi", tap: "Dodirni vežbu da vidiš kako se radi." },
};

export const exerciseKey = (name: string) => EXERCISE_BY_NAME[name.toLowerCase()];
export const guideHint = (lang: Lang) => T[lang].tap;

/** Exercise name that opens the guide when tapped. */
export const ExerciseName = ({ name, onOpen }: { name: string; onOpen: (key: string) => void }) => {
  const key = exerciseKey(name);
  if (!key) return <>{name}</>;
  return (
    <button type="button" onClick={() => onOpen(key)} className="group inline-flex items-center gap-1.5 text-left underline decoration-dotted decoration-gold/70 underline-offset-4 hover:text-gold">
      {name} <Info className="h-3.5 w-3.5 shrink-0 text-gold opacity-80 group-hover:opacity-100" />
    </button>
  );
};

/** Pop-up with the pictures, steps and the easier/harder version, like the PDF guide. */
export const ExerciseGuide = ({ exKey, lang, onClose }: { exKey: string | null; lang: Lang; onClose: () => void }) => {
  const ex = exKey ? EXERCISES[exKey] : null;
  const t = ex?.[lang];
  return (
    <Dialog open={!!ex} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl p-0 gap-0 border-gold/30 bg-background">
        {ex && t && (
          <>
            <div className="px-6 pt-6 pb-2">
              <div className="font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))] mb-1">{T[lang].how}</div>
              <DialogTitle className="font-display text-4xl font-normal leading-none">{t.title}</DialogTitle>
              <DialogDescription className="sr-only">{t.steps.join(" ")}</DialogDescription>
            </div>
            <div className="mx-6 my-4 grid gap-2 rounded-2xl bg-secondary/50 p-3" style={{ gridTemplateColumns: `repeat(${ex.frames.length}, minmax(0, 1fr))` }}>
              {ex.frames.map((f, i) => (
                <figure key={i} className="text-center">
                  <div className="[&>svg]:w-full [&>svg]:h-auto" dangerouslySetInnerHTML={{ __html: f.svg }} />
                  <figcaption className="font-body text-[9px] tracking-luxe uppercase text-muted-foreground mt-1">{i + 1}. {f.label[lang]}</figcaption>
                </figure>
              ))}
            </div>
            <ol className="px-6 space-y-3">
              {t.steps.map((s, i) => (
                <li key={i} className="flex gap-3 font-body text-sm leading-relaxed">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center font-body text-[11px]">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="m-6 mt-5 rounded-2xl border border-gold/40 p-4 font-body text-sm">
              <span className="mr-2 rounded-full bg-gold/15 text-gold px-2.5 py-1 font-body text-[9px] tracking-luxe uppercase">{t.easyLabel}</span>
              {t.easy}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
