import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { clearLocal } from "@/lib/plan";

type Lang = "en" | "de" | "sr";
const T = {
  en: { open: "Delete my account", title: "Delete your account?", text: "This permanently deletes your account, your plan, your progress and your food log. It can't be undone. Your membership ends too.",
    type: "Type DELETE to confirm", word: "DELETE", cancel: "Cancel", confirm: "Delete forever", done: "Your account has been deleted.",
    error: "Something went wrong. Please try again or text Dalila on Instagram.", setup: "Deleting accounts isn't switched on yet. Please text Dalila on Instagram and she'll delete it for you.", admin: "The admin account can't be deleted here." },
  de: { open: "Mein Konto löschen", title: "Konto löschen?", text: "Dein Konto, dein Plan, dein Fortschritt und dein Ernährungstagebuch werden dauerhaft gelöscht. Das kann nicht rückgängig gemacht werden. Auch deine Mitgliedschaft endet.",
    type: "Tippe LÖSCHEN zur Bestätigung", word: "LÖSCHEN", cancel: "Abbrechen", confirm: "Endgültig löschen", done: "Dein Konto wurde gelöscht.",
    error: "Etwas ist schiefgelaufen. Versuche es noch einmal oder schreib Dalila auf Instagram.", setup: "Das Löschen ist noch nicht eingerichtet. Schreib Dalila auf Instagram, sie löscht es für dich.", admin: "Das Admin-Konto kann hier nicht gelöscht werden." },
  sr: { open: "Obriši moj nalog", title: "Obrisati nalog?", text: "Ovo trajno briše tvoj nalog, plan, napredak i dnevnik ishrane. Ne može se vratiti. Članstvo se takođe završava.",
    type: "Upiši OBRIŠI da potvrdiš", word: "OBRIŠI", cancel: "Otkaži", confirm: "Obriši zauvek", done: "Tvoj nalog je obrisan.",
    error: "Nešto nije u redu. Pokušaj ponovo ili piši Dalili na Instagramu.", setup: "Brisanje naloga još nije uključeno. Piši Dalili na Instagramu i ona će ga obrisati.", admin: "Admin nalog ne može da se obriše ovde." },
};

export const DeleteAccount = ({ lang }: { lang: Lang }) => {
  const c = T[lang];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ok = word.trim().toUpperCase() === c.word;

  const remove = async () => {
    if (!ok) return;
    setBusy(true); setError("");
    const { error: err } = await (supabase.rpc as unknown as (fn: string) => Promise<{ error: { code?: string; message?: string } | null }>)("delete_my_account");
    if (err) {
      setBusy(false);
      setError(/admin/i.test(err.message || "") ? c.admin : err.code === "PGRST202" || /could not find|does not exist/i.test(err.message || "") ? c.setup : c.error);
      return;
    }
    clearLocal();
    try { sessionStorage.clear(); } catch { /* ignore */ }
    await supabase.auth.signOut({ scope: "local" });
    setOpen(false);
    alert(c.done);
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="text-center pt-4">
        <button onClick={() => { setOpen(true); setWord(""); setError(""); }} className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-luxe uppercase text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" /> {c.open}
        </button>
      </div>
      <Dialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl">
          <DialogTitle className="font-display text-3xl font-normal">{c.title}</DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground leading-relaxed">{c.text}</DialogDescription>
          <label className="block mt-2">
            <span className="block font-body text-[10px] tracking-luxe uppercase text-muted-foreground mb-1.5">{c.type}</span>
            <Input value={word} onChange={(e) => setWord(e.target.value)} autoComplete="off" className="h-12 rounded-xl" />
          </label>
          {error && <p role="alert" className="font-body text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end mt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy} className="rounded-full h-11 px-6 font-body text-[10px] tracking-luxe uppercase">{c.cancel}</Button>
            <Button onClick={remove} disabled={!ok || busy} className="rounded-full h-11 px-6 bg-destructive text-white hover:bg-destructive/90 font-body text-[10px] tracking-luxe uppercase">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="mr-1.5 h-4 w-4" /> {c.confirm}</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
