import { useEffect, useRef, useState } from "react";
import { Camera, Check, Flame, Loader2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { COACH, HABITS } from "@/data/coachText";

type Lang = "en" | "de" | "sr";
// The coach tables are not in the generated Supabase types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as unknown as { from: (t: string) => any };
type DbErr = { code?: string; message?: string } | null;
const missing = (e: DbErr) => !!e && (e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message || ""));

export type Checkin = {
  id: number; user_id: string; week_start: string; weight: number | null; waist: number | null;
  energy: number | null; sleep: number | null; hunger: number | null; note: string | null; question: string | null;
  photo: string | null; reply: string | null; replied_at: string | null; created_at: string;
};

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const mondayOf = (d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(x); };
const fmt = (d: string, lang: Lang) => new Date(d + "T12:00:00").toLocaleDateString(lang === "sr" ? "sr-Latn" : lang, { day: "numeric", month: "short" });

/** Shrink a photo to max 1280 px JPEG before upload. */
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file;
  const s = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((res) => c.toBlob((b) => res(b || file), "image/jpeg", 0.82));
}

export const PhotoThumb = ({ path, className = "" }: { path: string; className?: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { supabase.storage.from("progress").createSignedUrl(path, 3600).then(({ data }) => setUrl(data?.signedUrl ?? null)); }, [path]);
  return url ? <a href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt="" className={`object-cover rounded-xl ${className}`} /></a> : <div className={`rounded-xl bg-secondary ${className}`} />;
};

const Scale = ({ value, onChange, low, high }: { value?: number; onChange: (n: number) => void; low: string; high: string }) => (
  <div>
    <div className="grid grid-cols-5 gap-1.5">{[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)} className={`h-11 rounded-xl border font-body text-sm ${value === n ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background"}`}>{n}</button>))}
    </div>
    <div className="flex justify-between font-body text-[10px] text-muted-foreground mt-1"><span>{low}</span><span>{high}</span></div>
  </div>
);

/* ---------------- weekly check-in (member) ---------------- */
export const WeeklyCheckin = ({ lang, userId, onSaved }: { lang: Lang; userId: string; onSaved?: (w?: number, wa?: number) => Promise<void> }) => {
  const c = COACH[lang].ci;
  const week = mondayOf();
  const [list, setList] = useState<Checkin[] | null>(null);
  const [setup, setSetup] = useState(false);
  const [f, setF] = useState<{ weight?: string; waist?: string; energy?: number; sleep?: number; hunger?: number; note?: string; question?: string }>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => db.from("checkins").select("*").eq("user_id", userId).order("week_start", { ascending: false }).limit(26)
    .then(({ data, error }: { data: Checkin[] | null; error: DbErr }) => { if (missing(error)) setSetup(true); setList(data || []); });
  useEffect(() => { load(); }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const num = (v?: string) => { const n = parseFloat((v || "").replace(",", ".")); return isFinite(n) ? n : null; };
  const send = async () => {
    setBusy(true); setError("");
    let photo: string | null = null;
    if (file) {
      const path = `${userId}/${week}-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage.from("progress").upload(path, await shrink(file), { contentType: "image/jpeg", upsert: false });
      if (upErr) { setError(c.photoErr); setBusy(false); setFile(null); setPreview(null); return; }
      photo = path;
    }
    const row = { user_id: userId, week_start: week, weight: num(f.weight), waist: num(f.waist), energy: f.energy ?? null, sleep: f.sleep ?? null, hunger: f.hunger ?? null,
      note: f.note?.trim() || null, question: f.question?.trim() || null, photo };
    const { error: err } = await db.from("checkins").insert(row);
    if (err) { setError(missing(err) ? c.setup : c.error); setBusy(false); return; }
    if (onSaved && (row.weight || row.waist)) await onSaved(row.weight ?? undefined, row.waist ?? undefined);
    setF({}); setFile(null); setPreview(null); setBusy(false); load();
  };

  if (setup) return <p className="font-body text-sm text-muted-foreground rounded-2xl bg-secondary/50 p-5">{c.setup}</p>;
  if (!list) return <div className="py-6 flex justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  const current = list.find((x) => x.week_start === week);
  const older = list.filter((x) => x.week_start !== week);

  const Card = ({ x }: { x: Checkin }) => (
    <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-body text-[10px] tracking-luxe uppercase text-gold">{c.week} {fmt(x.week_start, lang)}</span>
        <span className="font-body text-xs text-muted-foreground">{[x.weight && `${x.weight} kg`, x.waist && `${x.waist} cm`].filter(Boolean).join(" · ")}</span>
      </div>
      <div className="flex gap-3">
        {x.photo && <PhotoThumb path={x.photo} className="h-24 w-20 shrink-0" />}
        <div className="min-w-0 font-body text-sm space-y-1">
          {(x.energy || x.sleep || x.hunger) && <p className="text-xs text-muted-foreground">{c.energy} {x.energy ?? "–"}/5 · {c.sleep} {x.sleep ?? "–"}/5 · {c.hunger} {x.hunger ?? "–"}/5</p>}
          {x.note && <p>{x.note}</p>}
          {x.question && <p className="text-muted-foreground"><MessageCircle className="inline h-3.5 w-3.5 mr-1 text-gold" />{x.question}</p>}
        </div>
      </div>
      {x.reply ? (
        <div className="rounded-xl bg-[hsl(var(--vermilion)/0.08)] border border-[hsl(var(--vermilion)/0.3)] p-3">
          <div className="font-body text-[10px] tracking-luxe uppercase text-[hsl(var(--vermilion))] mb-1">{c.reply}</div>
          <p className="font-body text-sm whitespace-pre-line">{x.reply}</p>
        </div>
      ) : <p className="font-body text-xs text-muted-foreground">{c.waiting}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      {current ? (
        <>
          <div className="flex items-center gap-2 font-body text-sm"><span className="h-6 w-6 rounded-full bg-[hsl(var(--vermilion))] text-white inline-flex items-center justify-center"><Check className="h-3.5 w-3.5" /></span> {c.sentTitle}</div>
          <Card x={current} />
        </>
      ) : (
        <div className="rounded-2xl bg-secondary/40 p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.weight}</span>
              <Input inputMode="decimal" value={f.weight ?? ""} onChange={(e) => setF({ ...f, weight: e.target.value })} className="h-11 rounded-xl bg-background" /></label>
            <label className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.waist}</span>
              <Input inputMode="decimal" value={f.waist ?? ""} onChange={(e) => setF({ ...f, waist: e.target.value })} className="h-11 rounded-xl bg-background" /></label>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {(["energy", "sleep", "hunger"] as const).map((k) => (
              <div key={k}>
                <div className="font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c[k]}</div>
                <Scale value={f[k]} onChange={(n) => setF({ ...f, [k]: n })} low={k === "hunger" ? c.hungerLow : c.scaleLow} high={k === "hunger" ? c.hungerHigh : c.scaleHigh} />
              </div>
            ))}
          </div>
          <div>
            <div className="font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.photo}</div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const fl = e.target.files?.[0] || null; setFile(fl); setPreview(fl ? URL.createObjectURL(fl) : null); }} />
            <div className="flex items-center gap-3">
              {preview && <img src={preview} alt="" className="h-20 w-16 object-cover rounded-xl" />}
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="rounded-full h-10 px-4 bg-background font-body text-[10px] tracking-luxe uppercase"><Camera className="mr-1.5 h-4 w-4" /> {preview ? c.photoChange : c.photoBtn}</Button>
            </div>
            <p className="font-body text-[11px] text-muted-foreground mt-1">{c.photoNote}</p>
          </div>
          <label className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.note}</span>
            <Textarea value={f.note ?? ""} onChange={(e) => setF({ ...f, note: e.target.value.slice(0, 1000) })} placeholder={c.notePh} rows={3} className="rounded-xl bg-background" /></label>
          <label className="block"><span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{c.question}</span>
            <Textarea value={f.question ?? ""} onChange={(e) => setF({ ...f, question: e.target.value.slice(0, 1000) })} placeholder={c.questionPh} rows={2} className="rounded-xl bg-background" /></label>
          {error && <p role="alert" className="font-body text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>}
          <Button onClick={send} disabled={busy || !(f.weight || f.waist || f.note || f.question || file || f.energy)} className="w-full sm:w-auto rounded-full h-12 px-8 bg-[hsl(var(--vermilion))] text-white hover:bg-[hsl(var(--vermilion)/0.9)] font-body text-[11px] tracking-luxe uppercase">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {c.sending}</> : <><Send className="mr-2 h-4 w-4" /> {c.send}</>}
          </Button>
        </div>
      )}
      {older.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer font-body text-[10px] tracking-luxe uppercase text-muted-foreground hover:text-gold">{c.history} ({older.length})</summary>
          <div className="space-y-3 mt-3">{older.map((x) => <Card key={x.id} x={x} />)}</div>
        </details>
      )}
    </div>
  );
};

/* ---------------- daily habits (member) ---------------- */
type HabitRow = { day: string; done: string[] };
export const habitStreak = (rows: HabitRow[]) => {
  const byDay = new Map(rows.map((r) => [r.day, r.done.length]));
  let n = 0; const d = new Date();
  if ((byDay.get(iso(d)) ?? 0) < 4) d.setDate(d.getDate() - 1); // today not finished yet doesn't break the streak
  while ((byDay.get(iso(d)) ?? 0) >= 4 && n < 366) { n++; d.setDate(d.getDate() - 1); }
  return n;
};

export const Habits = ({ lang, userId }: { lang: Lang; userId: string }) => {
  const c = COACH[lang].hb;
  const today = iso(new Date());
  const [rows, setRows] = useState<HabitRow[] | null>(null);
  const [setup, setSetup] = useState(false);
  useEffect(() => {
    const from = new Date(); from.setDate(from.getDate() - 60);
    db.from("habits").select("day, done").eq("user_id", userId).gte("day", iso(from)).then(({ data, error }: { data: HabitRow[] | null; error: DbErr }) => {
      if (missing(error)) setSetup(true); setRows(data || []);
    });
  }, [userId]);
  if (setup) return <p className="font-body text-sm text-muted-foreground rounded-2xl bg-secondary/50 p-5">{COACH[lang].ci.setup}</p>;
  if (!rows) return <div className="py-6 flex justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  const todayDone = rows.find((r) => r.day === today)?.done || [];
  const toggle = async (h: string) => {
    const next = todayDone.includes(h) ? todayDone.filter((x) => x !== h) : [...todayDone, h];
    setRows([...rows.filter((r) => r.day !== today), { day: today, done: next }]);
    await db.from("habits").upsert({ user_id: userId, day: today, done: next });
  };
  const monday = new Date(mondayOf() + "T12:00:00");
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return iso(d); });
  const dayNames = { en: ["M", "T", "W", "T", "F", "S", "S"], de: ["M", "D", "M", "D", "F", "S", "S"], sr: ["P", "U", "S", "Č", "P", "S", "N"] }[lang];
  const streak = habitStreak(rows);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {HABITS.map((h) => {
          const on = todayDone.includes(h);
          return (
            <button key={h} type="button" onClick={() => toggle(h)} className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left transition active:scale-[0.98] ${on ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-gold"}`}>
              <span className={`h-6 w-6 shrink-0 rounded-full border flex items-center justify-center ${on ? "bg-[hsl(var(--vermilion))] border-[hsl(var(--vermilion))]" : "border-border"}`}>{on && <Check className="h-3.5 w-3.5 text-white" />}</span>
              <span className="font-body text-[13px] leading-tight">{c.items[h]}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {weekDays.map((d, i) => {
            const n = rows.find((r) => r.day === d)?.done.length ?? 0;
            const future = d > today;
            return (
              <div key={d} className="text-center">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-body text-[11px] ${future ? "border border-dashed border-border text-muted-foreground" : n >= 4 ? "bg-[hsl(var(--vermilion))] text-white" : n > 0 ? "bg-secondary" : "border border-border text-muted-foreground"} ${d === today ? "ring-2 ring-offset-2 ring-offset-card ring-primary" : ""}`}>{future ? "" : n}</div>
                <div className="font-body text-[9px] text-muted-foreground mt-1">{dayNames[i]}</div>
              </div>
            );
          })}
        </div>
        {streak > 0 && <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--vermilion))] text-white px-3 py-1.5 font-body text-xs"><Flame className="h-3.5 w-3.5" /> {streak} {c.streak}</span>}
      </div>
      <p className="font-body text-[11px] text-muted-foreground">{c.streakHint}</p>
    </div>
  );
};

/* ---------------- admin: member check-ins + habits ---------------- */
export const AdminCoach = ({ userId, lang, onAnswered }: { userId: string; lang: Lang; onAnswered?: () => void }) => {
  const a = COACH[lang].ad; const c = COACH[lang].ci;
  const [list, setList] = useState<Checkin[] | null>(null);
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const load = () => db.from("checkins").select("*").eq("user_id", userId).order("week_start", { ascending: false }).limit(12).then(({ data }: { data: Checkin[] | null }) => setList(data || []));
  useEffect(() => {
    load();
    const from = new Date(); from.setDate(from.getDate() - 6);
    db.from("habits").select("day, done").eq("user_id", userId).gte("day", iso(from)).then(({ data }: { data: HabitRow[] | null }) => setHabits(data || []));
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  const send = async (id: number) => {
    const reply = (drafts[id] || "").trim(); if (!reply) return;
    setBusy(id);
    await db.from("checkins").update({ reply, replied_at: new Date().toISOString() }).eq("id", id);
    setBusy(null); setDrafts({ ...drafts, [id]: "" }); load(); onAnswered?.();
  };
  const pct = Math.round((habits.reduce((s, r) => s + r.done.length, 0) / (7 * HABITS.length)) * 100);
  return (
    <div className="space-y-3">
      <div className="font-body text-[9px] tracking-luxe uppercase text-gold">{a.habits7}: <span className="text-foreground normal-case tracking-normal text-sm">{pct}%</span></div>
      <div className="font-body text-[9px] tracking-luxe uppercase text-gold">{a.checkins}</div>
      {list === null ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : list.length === 0 ? <p className="font-body text-sm text-muted-foreground">{a.noCheckins}</p> : list.map((x) => (
        <div key={x.id} className={`rounded-2xl border p-4 space-y-2 ${x.reply ? "border-border" : "border-[hsl(var(--vermilion)/0.5)]"}`}>
          <div className="flex flex-wrap justify-between gap-2 font-body text-xs"><b className="font-medium">{c.week} {x.week_start}</b><span className="text-muted-foreground">{[x.weight && `${x.weight} kg`, x.waist && `${x.waist} cm`].filter(Boolean).join(" · ")}</span></div>
          <div className="flex gap-3">
            {x.photo && <PhotoThumb path={x.photo} className="h-28 w-24 shrink-0" />}
            <div className="font-body text-sm space-y-1 min-w-0">
              <p className="text-xs text-muted-foreground">{a.energy} {x.energy ?? "–"}/5 · {a.sleep} {x.sleep ?? "–"}/5 · {a.hunger} {x.hunger ?? "–"}/5</p>
              {x.note && <p>{x.note}</p>}
              {x.question && <p><b className="font-medium text-[hsl(var(--vermilion))]">{a.question}:</b> {x.question}</p>}
            </div>
          </div>
          {x.reply ? <p className="font-body text-sm rounded-xl bg-secondary/60 p-3 whitespace-pre-line"><b className="font-medium">{a.answered}:</b> {x.reply}</p> : (
            <div className="flex flex-col sm:flex-row gap-2">
              <Textarea value={drafts[x.id] || ""} onChange={(e) => setDrafts({ ...drafts, [x.id]: e.target.value })} placeholder={a.replyPh} rows={2} className="rounded-xl" />
              <Button onClick={() => send(x.id)} disabled={busy === x.id || !(drafts[x.id] || "").trim()} className="rounded-xl h-auto sm:w-40 py-3 bg-[hsl(var(--vermilion))] text-white font-body text-[10px] tracking-luxe uppercase">
                {busy === x.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-1.5 h-4 w-4" /> {a.sendReply}</>}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/** Admin: ids of members with an unanswered check-in. */
export const useUnanswered = () => {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const load = () => db.from("checkins").select("user_id").is("reply", null).then(({ data }: { data: { user_id: string }[] | null }) => setIds(new Set((data || []).map((x) => x.user_id))));
  useEffect(() => { load(); }, []);
  return { ids, reload: load };
};
