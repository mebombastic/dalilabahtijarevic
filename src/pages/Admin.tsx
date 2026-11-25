import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, Clock, Crown, Loader2, RefreshCw, Search, ShieldAlert, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthDialog } from "@/components/AuthDialog";
import { SectionLabel, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useLang } from "@/i18n";
import { useAuth, isAdmin, PLAN_NAMES, type PlanId } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminFoodSummary } from "@/components/FoodCalculator";

type Entry = { d: string; w?: string; wa?: string; sq?: string; pu?: string; su?: string; pl?: string };
type Member = {
  id: string; email: string; created_at: string; last_sign_in_at: string | null;
  user_meta: { name?: string; plan?: PlanId; payment_reported?: string; progress?: Entry[]; lang?: string; done?: { k: string; d: string; r?: string }[]; profile?: { weight?: number; height?: number; target?: number; goals?: string[] } };
  app_meta: { membership?: string; activated_at?: string; role?: string };
};
type Filter = "all" | "waiting" | "paid" | "active" | "free";

// The admin functions live in Supabase (supabase/admin.sql); they are not in the generated types.
const rpc = supabase.rpc.bind(supabase) as unknown as (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : "");

const Admin = () => {
  const { lang, setLang, t } = useLang();
  const a = t.admin; const m = t.member;
  const { user, loading, refresh } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [setupMissing, setSetupMissing] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [startDates, setStartDates] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const admin = isAdmin(user);

  const load = useCallback(async () => {
    setBusy(true); setError(""); setSetupMissing(false);
    const { data, error: err } = await rpc("admin_list_members");
    if (err) {
      if (/function|does not exist|schema cache/i.test(err.message)) setSetupMissing(true); else setError(a.error);
    } else setMembers((data as Member[]) || []);
    setBusy(false);
  }, [a.error]);

  useEffect(() => { if (admin) load(); }, [admin, load]);
  // make sure a freshly granted admin role is in the session
  useEffect(() => { if (user && !admin) refresh(); }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusOf = (mb: Member): Filter => {
    if (mb.app_meta.membership === "active") return "active";
    if (!mb.user_meta.plan) return "free";
    return mb.user_meta.payment_reported ? "paid" : "waiting";
  };
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: members.length, waiting: 0, paid: 0, active: 0, free: 0 };
    members.forEach((mb) => { c[statusOf(mb)]++; });
    return c;
  }, [members]);
  const shown = members.filter((mb) => {
    const s = q.trim().toLowerCase();
    const okQ = !s || mb.email.toLowerCase().includes(s) || (mb.user_meta.name || "").toLowerCase().includes(s);
    return okQ && (filter === "all" || statusOf(mb) === filter);
  });

  const setMembership = async (mb: Member, status: "active" | "inactive") => {
    setSavingId(mb.id);
    const start = startDates[mb.id] || new Date().toISOString().slice(0, 10);
    const { error: err } = await rpc("admin_set_membership", { target: mb.id, status, start_date: start });
    if (err) setError(a.error); else await load();
    setSavingId(null);
  };
  const setPlan = async (mb: Member, plan: PlanId) => {
    setSavingId(mb.id);
    const { error: err } = await rpc("admin_set_plan", { target: mb.id, plan });
    if (err) setError(a.error); else await load();
    setSavingId(null);
  };

  const badge = (s: Filter) => {
    const map: Record<Filter, [string, string]> = {
      active: [a.active, "bg-[hsl(140_45%_40%/0.15)] text-[hsl(140_45%_28%)]"],
      paid: [a.paid, "bg-vermilion text-white"],
      waiting: [a.waiting, "bg-[hsl(40_90%_55%/0.2)] text-[hsl(30_70%_30%)]"],
      free: [a.free, "bg-secondary text-muted-foreground"],
      all: ["", ""],
    };
    return <span className={`inline-flex rounded-full px-3 py-1 font-body text-[9px] tracking-wide-2 uppercase whitespace-nowrap ${map[s][1]}`}>{map[s][0]}</span>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader onAuth={() => setAuthOpen(true)} />
      <main className="container mx-auto pt-24 md:pt-32 pb-16 md:pb-20">
        {loading ? (
          <div className="py-24 flex justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : !user || !admin ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <ShieldAlert className="h-10 w-10 text-gold mx-auto mb-4" />
            <h1 className="font-display text-4xl mb-3">{a.nav}</h1>
            <p className="font-body text-muted-foreground mb-6">{a.notAdmin}</p>
            {!user ? <Button onClick={() => setAuthOpen(true)} className="rounded-full h-12 px-8 bg-primary text-primary-foreground font-body text-[11px] tracking-luxe uppercase">{m.signIn}</Button>
              : <Button asChild variant="outline" className="rounded-full h-12 px-8 bg-transparent font-body text-[11px] tracking-luxe uppercase"><Link to="/account">{m.account}</Link></Button>}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <SectionLabel>{a.nav}</SectionLabel>
                <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-6xl leading-none">{a.title}</h1>
                <p className="font-body text-sm text-muted-foreground mt-3 max-w-xl">{a.sub}</p>
              </div>
              <Button onClick={load} disabled={busy} variant="outline" className="rounded-full h-11 px-5 bg-transparent font-body text-[10px] tracking-luxe uppercase">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} {a.refresh}
              </Button>
            </div>

            {setupMissing && <p className="rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 font-body text-sm mb-6">{a.setupNeeded}</p>}
            {error && <p role="alert" className="rounded-2xl bg-destructive/10 text-destructive p-4 font-body text-sm mb-6">{error}</p>}

            {/* stats + filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {([["all", a.total, Users], ["paid", a.paid, Check], ["waiting", a.waiting, Clock], ["active", a.active, Crown], ["free", a.free, Users]] as const).map(([k, label, Icon]) => (
                <button key={k} onClick={() => setFilter(k)} className={`text-left rounded-2xl border p-4 transition-colors ${filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-gold/50"}`}>
                  <div className="font-body text-[9px] tracking-luxe uppercase opacity-80 inline-flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {label}</div>
                  <div className="font-display text-4xl leading-none mt-2">{counts[k]}</div>
                </button>
              ))}
            </div>
            <div className="relative mb-5 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={a.search} className="pl-11 h-12 rounded-full bg-card" />
            </div>

            <ul className="space-y-3">
              {shown.length === 0 && !busy && <li className="font-body text-sm text-muted-foreground py-8 text-center">{a.empty}</li>}
              {shown.map((mb) => {
                const st = statusOf(mb);
                const isOpen = openId === mb.id;
                const prog = (mb.user_meta.progress || []).slice().reverse();
                return (
                  <li key={mb.id} className="rounded-3xl border border-border bg-card overflow-hidden">
                    <button onClick={() => setOpenId(isOpen ? null : mb.id)} className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_1fr_auto_auto] gap-3 items-center p-4 md:px-6 text-left">
                      <span className="min-w-0">
                        <span className="block font-display text-xl leading-tight truncate">{mb.user_meta.name || mb.email.split("@")[0]}{mb.app_meta.role === "admin" ? " ★" : ""}</span>
                        <span className="block font-body text-xs text-muted-foreground truncate">{mb.email}</span>
                      </span>
                      <span className="hidden md:block font-body text-sm">{mb.user_meta.plan ? PLAN_NAMES[mb.user_meta.plan] : <span className="text-muted-foreground">{a.noPlan}</span>}</span>
                      <span className="hidden md:block font-body text-xs text-muted-foreground">{a.joined} {fmt(mb.created_at)}</span>
                      {badge(st)}
                      <ChevronDown className={`hidden md:block h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border p-4 md:p-6 grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3 font-body text-sm">
                            <div><div className="text-[9px] tracking-luxe uppercase text-gold">{a.plan}</div>
                              <select value={mb.user_meta.plan || ""} onChange={(e) => setPlan(mb, e.target.value as PlanId)} disabled={savingId === mb.id}
                                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3">
                                <option value="" disabled>{a.noPlan}</option>
                                <option value="Strong-and-Toned">Strong &amp; Toned</option>
                                <option value="VIP-1-1">VIP 1:1</option>
                              </select></div>
                            <div><div className="text-[9px] tracking-luxe uppercase text-gold">{a.lastLogin}</div><div className="mt-3">{fmt(mb.last_sign_in_at) || a.never}</div></div>
                            {mb.user_meta.payment_reported && <div className="col-span-2"><div className="text-[9px] tracking-luxe uppercase text-gold">{a.paidOn}</div><div className="mt-1">{fmt(mb.user_meta.payment_reported)}</div></div>}
                            {mb.app_meta.membership === "active" && mb.app_meta.activated_at && <div className="col-span-2"><div className="text-[9px] tracking-luxe uppercase text-gold">{a.start}</div><div className="mt-1">{fmt(mb.app_meta.activated_at)}</div></div>}
                          </div>
                          <div className="flex flex-wrap items-end gap-3">
                            {mb.app_meta.membership !== "active" ? (<>
                              <label className="font-body text-[9px] tracking-luxe uppercase text-gold">{a.start}
                                <Input type="date" value={startDates[mb.id] || new Date().toISOString().slice(0, 10)} onChange={(e) => setStartDates({ ...startDates, [mb.id]: e.target.value })} className="mt-1 h-11 rounded-xl" />
                              </label>
                              <Button onClick={() => setMembership(mb, "active")} disabled={savingId === mb.id || !mb.user_meta.plan} className="h-11 rounded-full px-6 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[10px] tracking-luxe uppercase">
                                {savingId === mb.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> {a.activate}</>}
                              </Button>
                            </>) : (
                              <Button onClick={() => setMembership(mb, "inactive")} disabled={savingId === mb.id} variant="outline" className="h-11 rounded-full px-6 bg-transparent font-body text-[10px] tracking-luxe uppercase">
                                {savingId === mb.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="mr-2 h-4 w-4" /> {a.deactivate}</>}
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-body text-[9px] tracking-luxe uppercase text-gold mb-2">{a.progress}</div>
                          {prog.length === 0 ? <p className="font-body text-sm text-muted-foreground">{a.noProgress}</p> : (
                            <div className="overflow-x-auto"><table className="w-full min-w-[460px] font-body text-xs border-collapse">
                              <thead><tr className="text-left text-muted-foreground">{[m.date, m.weight, m.waist, m.squat, m.pushup, m.situp, m.plank].map((h) => <th key={h} className="font-normal py-1.5 pr-2">{h}</th>)}</tr></thead>
                              <tbody>{prog.map((e, i) => <tr key={i} className="border-t border-border">{[e.d, e.w, e.wa, e.sq, e.pu, e.su, e.pl].map((v, k) => <td key={k} className="py-1.5 pr-2">{v || "—"}</td>)}</tr>)}</tbody>
                            </table></div>
                          )}
                        </div>
                        <div>
                          <div className="font-body text-[9px] tracking-luxe uppercase text-gold mb-2">{{ en: "Workouts", de: "Trainings", sr: "Treninzi" }[lang]}</div>
                          {(() => {
                            const dn = (mb.user_meta.done || []).slice().sort((a, b) => b.d.localeCompare(a.d));
                            const pf = mb.user_meta.profile;
                            const wk = dn.filter((x) => Date.now() - new Date(x.d + "T12:00:00").getTime() < 7 * 864e5).length;
                            return (
                              <div className="font-body text-sm space-y-1">
                                <p>{{ en: "Done in total", de: "Insgesamt erledigt", sr: "Ukupno urađeno" }[lang]}: <b className="font-medium">{dn.length}</b> · {{ en: "last 7 days", de: "letzte 7 Tage", sr: "poslednjih 7 dana" }[lang]}: <b className="font-medium">{wk}</b>{dn[0] ? <> · {{ en: "last", de: "zuletzt", sr: "poslednji" }[lang]}: {dn[0].d}{dn[0].r ? ` (${dn[0].r})` : ""}</> : null}</p>
                                {pf && <p className="text-muted-foreground text-xs">{pf.height} cm · {pf.weight} kg{pf.target ? ` → ${pf.target} kg` : ""}{pf.goals?.length ? ` · ${pf.goals.join(", ")}` : ""}</p>}
                              </div>
                            );
                          })()}
                        </div>
                        <AdminFoodSummary userId={mb.id} lang={lang} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>
      <SiteFooter onAuth={() => setAuthOpen(true)} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode="login" lang={lang} onLangChange={setLang} />
    </div>
  );
};

export default Admin;
