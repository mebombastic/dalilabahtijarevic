import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

type Lang = "en" | "de" | "sr";

const copy: Record<Lang, { title: string; body: string; accept: string; decline: string }> = {
  en: {
    title: "We use cookies",
    body: "We use cookies to improve your experience and analyze site traffic. You can accept or decline non-essential cookies.",
    accept: "Accept all",
    decline: "Decline",
  },
  de: {
    title: "Wir verwenden Cookies",
    body: "Wir verwenden Cookies, um dein Erlebnis zu verbessern und den Website-Verkehr zu analysieren. Du kannst nicht-essenzielle Cookies akzeptieren oder ablehnen.",
    accept: "Alle akzeptieren",
    decline: "Ablehnen",
  },
  sr: {
    title: "Koristimo kolačiće",
    body: "Koristimo kolačiće da poboljšamo vaše iskustvo i analiziramo saobraćaj na sajtu. Možete prihvatiti ili odbiti neobavezne kolačiće.",
    accept: "Prihvati sve",
    decline: "Odbij",
  },
};

export const CookieBanner = ({ lang }: { lang: Lang }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("cookie-consent")) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (v: "accept" | "decline") => {
    localStorage.setItem("cookie-consent", v);
    setVisible(false);
  };

  if (!visible) return null;
  const t = copy[lang];

  return (
    <div className="fixed bottom-4 inset-x-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-fade-up">
      <div className="bg-background border border-gold/40 shadow-soft rounded-2xl p-5 relative">
        <button
          onClick={() => choose("decline")}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <Cookie className="h-4 w-4 text-gold" />
          </div>
          <div className="flex-1 pr-4">
            <h3 className="font-display text-lg mb-1">{t.title}</h3>
            <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">{t.body}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => choose("accept")}
                className="btn-shine bg-gold text-primary-foreground hover:bg-gold/90 rounded-xl font-body text-[10px] tracking-luxe uppercase"
              >
                {t.accept}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => choose("decline")}
                className="border-foreground/30 hover:border-gold hover:text-gold rounded-xl font-body text-[10px] tracking-luxe uppercase bg-transparent"
              >
                {t.decline}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
