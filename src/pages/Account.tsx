import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Crown, Sparkles, Download, Lock, LogOut, MessageCircle, Clock, TrendingUp, Loader2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthDialog } from "@/components/AuthDialog";
import { SectionLabel, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useLang } from "@/i18n";
import { useAuth, isActive, isAdmin, hasPlan, hasVip, userPlan, PLAN_NAMES, type PlanId } from "@/hooks/use-auth";
import { FoodCalculator } from "@/components/FoodCalculator";
import { openInstagramApp } from "@/lib/instagram";
import { PersonalPlan } from "@/components/PersonalPlan";
import { DeleteAccount } from "@/components/DeleteAccount";
import { QUIZ } from "@/data/quizText";
import { clearLocal, isAnswers, loadLocal, nutrition as calcNutrition, type Answers, type Done } from "@/lib/plan";
import { ProgressChart } from "@/components/ProgressChart";
import { Habits, WeeklyCheckin } from "@/components/CoachTools";
import { COACH } from "@/data/coachText";
import { useNavigate } from "react-router-dom";
import { ExerciseGuide } from "@/components/ExerciseGuide";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import pKit from "@/assets/p-kit.webp";
import { supabase } from "@/integrations/supabase/client";
import { MEMBER_PLANS } from "@/data/memberPlans";
import { IG_DM } from "@/data/catalog";
import f1Vanilla from "@/assets/f1-vanilla.webp";
import f1Chocolate from "@/assets/f1-chocolate.webp";
import f1Raspberry from "@/assets/f1-raspberry.webp";
import pTea from "@/assets/p-tea.webp";
import pFibre from "@/assets/p-fibreconc.webp";
import pShaker from "@/assets/p-shaker.webp";
import pBioniq from "@/assets/p-bioniq.webp";
import pSkin from "@/assets/p-skin.webp";
import coachBubble from "@/assets/coach-bubble.webp";

const IMG: Record<string, string> = { "f1-vanilla": f1Vanilla, "f1-chocolate": f1Chocolate, "f1-raspberry": f1Raspberry, "p-tea": pTea, "p-fibreconc": pFibre, "p-shaker": pShaker, "p-bioniq": pBioniq, "p-skin": pSkin };
const DAYS = { en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], sr: ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"] };
type Entry = { d: string; w?: string; wa?: string; sq?: string; pu?: string; su?: string; pl?: string };
const card = "min-w-0 rounded-3xl border border-border bg-card p-5 md:p-8";

const Account = () => {
  const { lang, setLang, t } = useLang();
  const m = t.member;
  const { user, loading, signOut, refresh } = useAuth();
  const [params, setParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("login");
  const openAuth = (mode: "register" | "login") => { setAuthMode(mode); setAuthOpen(true); };

  // switching plan from the Plans page while still waiting for payment
  useEffect(() => {
    const p = params.get("plan");
    if (user && (p === "Strong-and-Toned" || p === "VIP-1-1") && !isActive(user) && user.user_metadata?.plan !== p) {
      supabase.auth.updateUser({ data: { plan: p } }).then(() => refresh());
      params.delete("plan"); setParams(params, { replace: true });
    }
  }, [user, params, setParams, refresh]);

  const active = isActive(user);
  const navigate = useNavigate();
  const profile: Answers | null = isAnswers(user?.user_metadata?.profile) ? (user!.user_metadata.profile as Answers) : null;
  // answers from the quiz taken before signing up -> save them to the account once
  useEffect(() => {
    if (!user) return;
    const local = loadLocal();
    if (local && JSON.stringify(local) !== JSON.stringify(user.user_metadata?.profile)) {
      supabase.auth.updateUser({ data: { profile: local } }).then(() => { clearLocal(); refresh(); });
    } else if (local) clearLocal();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (loading || !user || profile || isAdmin(user) || loadLocal()) return;
    let skipped = false; try { skipped = sessionStorage.getItem("quiz-skip") === "1"; } catch { /* ignore */ }
    if (!skipped) navigate("/start", { replace: true });
  }, [loading, user?.id, !!profile]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (window.location.hash === "#plan") setTimeout(() => document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" }), 400); }, []);
  const planChosen = hasPlan(user);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [choosing, setChoosing] = useState<PlanId | null>(null);
  useEffect(() => {
    if (!user || active || planChosen) return;
    let seen = false;
    try { seen = sessionStorage.getItem("upgrade-seen") === "1"; } catch { /* ignore */ }
    if (!seen) { setUpgradeOpen(true); try { sessionStorage.setItem("upgrade-seen", "1"); } catch { /* ignore */ } }
  }, [user, active, planChosen]);
  const choosePlan = async (p: PlanId) => {
    setChoosing(p);
    await supabase.auth.updateUser({ data: { plan: p } });
    await refresh();
    setChoosing(null); setUpgradeOpen(false);
  };
  const slug: PlanId = userPlan(user);
  const data = MEMBER_PLANS[slug][lang];
  const name = (user?.user_metadata?.name as string) || "";
  const reported = Boolean(user?.user_metadata?.payment_reported);

  const [exKey, setExKey] = useState<string | null>(null);

  const entries: Entry[] = useMemo(() => ((user?.user_metadata?.progress as Entry[]) || []).slice().reverse(), [user]);
  const [form, setForm] = useState<Entry>({ d: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const saveEntry = async () => {
    setSaving(true);
    const prev = ((user?.user_metadata?.progress as Entry[]) || []).slice(-40);
    await supabase.auth.updateUser({ data: { progress: [...prev, form] } });
    await refresh();
    setSaving(false); setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000);
    setForm({ d: new Date().toISOString().slice(0, 10) });
  };
  const reportPaid = async () => { await supabase.auth.updateUser({ data: { payment_reported: new Date().toISOString() } }); await refresh(); };

  const pdf = `${import.meta.env.BASE_URL}plans/Dalila-${slug}-${lang.toUpperCase()}.pdf`;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader onAuth={openAuth} />

      {loading ? (
        <div className="min-h-[70vh] flex items-center justify-center font-body text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> {m.loading}</div>
      ) : !user ? (
        <section className="min-h-[80vh] flex items-center justify-center px-6 pt-24">
          <div className="text-center max-w-md">
            <SectionLabel>{m.account}</SectionLabel>
            <h1 className="font-display text-5xl mb-4">{m.title}</h1>
            <p className="font-body text-muted-foreground mb-8">{m.signInNeeded}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => openAuth("login")} className="rounded-full h-12 px-8 bg-primary text-primary-foreground font-body text-[11px] tracking-luxe uppercase">{m.signIn}</Button>
              <Button asChild variant="outline" className="rounded-full h-12 px-8 bg-transparent font-body text-[11px] tracking-luxe uppercase"><Link to="/plans">{m.create}</Link></Button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* welcome band */}
          <section className="bg-stage text-[hsl(37_40%_90%)] pt-24 md:pt-28 pb-10 md:pb-12">
            <div className="container mx-auto flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-3">{m.account}</div>
                <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-6xl leading-none">{m.hello}{name ? "," : ""} <em className="gold-text">{name || ""}{name ? "." : ""}</em></h1>
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(37_40%_90%/0.25)] px-4 py-2 font-body text-[11px] tracking-wide-2 uppercase"><Crown className="h-3.5 w-3.5 text-gold" /> {m.plan}: {planChosen ? PLAN_NAMES[slug] : m.free}</span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-[11px] tracking-wide-2 uppercase ${active ? "bg-[hsl(140_45%_40%/0.25)] text-[hsl(140_60%_80%)]" : "bg-vermilion/20 text-[hsl(6_90%_80%)]"}`}>
                    {active ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />} {m.status}: {active ? m.active : planChosen ? m.pending : m.free}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {!active && <Button onClick={() => setUpgradeOpen(true)} className="btn-shine flex-1 sm:flex-none rounded-full h-11 px-6 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[10px] tracking-luxe uppercase"><Sparkles className="mr-2 h-4 w-4" /> {m.upgrade}</Button>}
                {active && <Button asChild className="flex-1 sm:flex-none rounded-full h-11 px-6 bg-[hsl(37_40%_90%)] text-primary hover:bg-[hsl(37_40%_95%)] font-body text-[10px] tracking-luxe uppercase"><a href={pdf} download><Download className="mr-2 h-4 w-4" /> {m.download}</a></Button>}
                <Button onClick={() => signOut()} variant="outline" className="rounded-full h-11 px-5 shrink-0 bg-transparent border-[hsl(37_40%_90%/0.35)] text-[hsl(37_40%_90%)] hover:text-gold font-body text-[10px] tracking-luxe uppercase"><LogOut className="mr-2 h-4 w-4" /> {m.logout}</Button>
              </div>
            </div>
          </section>

          <main className="container mx-auto py-8 md:py-14 space-y-5 md:space-y-6">
            {/* personal plan from the quiz */}
            <section id="plan" className={`${card} scroll-mt-24`}>
              <SectionLabel>{QUIZ[lang].plan.title}</SectionLabel>
              {profile ? (
                <>
                  <p className="font-body text-xs text-muted-foreground -mt-2 mb-5">{QUIZ[lang].plan.sub}</p>
                  <PersonalPlan answers={profile} lang={lang} unlocked={active || isAdmin(user)} onExercise={setExKey} onRedo={() => navigate("/start")}
                    startFallback={user.created_at} done={(user.user_metadata?.done as Done[]) || []}
                    onDone={async (next) => { await supabase.auth.updateUser({ data: { done: next } }); await refresh(); }} />
                </>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="font-body text-sm text-muted-foreground max-w-md">{QUIZ[lang].plan.start}</p>
                  <Button onClick={() => navigate("/start")} className="btn-shine rounded-full h-12 px-7 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[11px] tracking-luxe uppercase">{QUIZ[lang].plan.startBtn}</Button>
                </div>
              )}
            </section>

            {!active && !planChosen && (
              <section className={`${card} border-vermilion/40 flex flex-wrap items-center justify-between gap-6`}>
                <div className="max-w-xl">
                  <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-2">{m.free}</div>
                  <h2 className="font-display text-3xl sm:text-4xl mb-3">{m.upgradeTitle}</h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{m.noPlanText}</p>
                </div>
                <Button onClick={() => setUpgradeOpen(true)} className="btn-shine w-full sm:w-auto rounded-full h-12 px-8 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[11px] tracking-luxe uppercase"><Sparkles className="mr-2 h-4 w-4" /> {m.upgrade}</Button>
              </section>
            )}

            {!active && planChosen && (
              <section className={`${card} border-vermilion/40`}>
                <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-2">{m.status}</div>
                <h2 className="font-display text-3xl sm:text-4xl mb-5">{m.payTitle}</h2>
                <ol className="grid sm:grid-cols-3 gap-3 mb-6">
                  {m.paySteps.map((s, i) => {
                    const done = i === 0 || (i === 1 && reported);
                    return (
                      <li key={s} className={`rounded-2xl border p-4 flex items-center gap-3 ${done ? "border-gold/40 bg-secondary/50" : "border-border"}`}>
                        <span className={`h-8 w-8 rounded-full inline-flex items-center justify-center font-display text-lg ${done ? "bg-vermilion text-white" : "bg-secondary"}`}>{done ? <Check className="h-4 w-4" /> : i + 1}</span>
                        <span className="font-body text-sm">{s}</span>
                      </li>
                    );
                  })}
                </ol>
                <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6">{reported ? m.paidThanks : m.payText}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="w-full sm:w-auto rounded-full h-12 px-7 bg-vermilion text-white hover:bg-vermilion/90 font-body text-[11px] tracking-luxe uppercase"><a href={IG_DM} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> {m.payDetails}</a></Button>
                  {!reported && <Button onClick={reportPaid} variant="outline" className="flex-1 sm:flex-none rounded-full h-12 px-7 bg-transparent font-body text-[11px] tracking-luxe uppercase"><Check className="mr-2 h-4 w-4" /> {m.paid}</Button>}
                  <Button onClick={() => setUpgradeOpen(true)} variant="ghost" className="rounded-full h-12 px-5 font-body text-[11px] tracking-luxe uppercase">{m.changePlan}</Button>
                </div>
              </section>
            )}

            <div className={`relative ${active ? "" : "select-none"}`}>
              {!active && (
                <div className="absolute inset-0 z-20 flex items-start justify-center pt-24 bg-background/40 backdrop-blur-[6px] rounded-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-body text-[11px] tracking-luxe uppercase shadow-soft"><Lock className="h-4 w-4" /> {m.locked}</span>
                </div>
              )}
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 ${active ? "" : "pointer-events-none"}`} aria-hidden={!active}>
                {/* weekly check-in */}
                <section className={`${card} lg:col-span-2`}>
                  <SectionLabel>{COACH[lang].ci.label}</SectionLabel>
                  <p className="font-body text-xs text-muted-foreground -mt-2 mb-5">{COACH[lang].ci.sub}</p>
                  {active || isAdmin(user) ? <WeeklyCheckin lang={lang} userId={user.id} onSaved={async (w, wa) => {
                    const prev = ((user.user_metadata?.progress as Entry[]) || []).slice(-40);
                    await supabase.auth.updateUser({ data: { progress: [...prev, { d: new Date().toISOString().slice(0, 10), ...(w ? { w: String(w) } : {}), ...(wa ? { wa: String(wa) } : {}) }] } });
                    await refresh();
                  }} /> : null}
                </section>

                {/* daily habits */}
                <section className={card}>
                  <SectionLabel>{COACH[lang].hb.label}</SectionLabel>
                  <p className="font-body text-xs text-muted-foreground -mt-2 mb-5">{COACH[lang].hb.sub}</p>
                  {active || isAdmin(user) ? <Habits lang={lang} userId={user.id} /> : null}
                </section>

                {/* products */}
                <section className={`${card} lg:col-span-1`}>
                  <SectionLabel>{m.products}</SectionLabel>
                  <p className="font-body text-xs text-muted-foreground -mt-2 mb-4">{m.productsSub}</p>
                  <ul className="space-y-3">
                    {data.routine.map((r) => (
                      <li key={r.time + r.title} className="flex items-center gap-4 rounded-2xl border border-border p-3">
                        <span className="h-16 w-14 shrink-0 rounded-xl bg-secondary flex items-end justify-center overflow-hidden">
                          <img src={IMG[r.img]} alt="" className={r.photo ? "h-full w-full object-cover" : "h-[88%] w-auto object-contain"} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-body text-[10px] tracking-luxe uppercase text-gold">{r.time} · {r.when}</span>
                          <span className="block font-display text-lg leading-tight">{r.title}</span>
                          <span className="block font-body text-xs text-muted-foreground">{r.how}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-body text-[11px] text-muted-foreground mt-4">{data.need}</p>
                </section>

                {/* progress */}
                <section className={`${card} lg:col-span-2`}>
                  <SectionLabel>{m.progress}</SectionLabel>
                  <p className="font-body text-xs text-muted-foreground -mt-2 mb-5">{m.progressSub}</p>
                  <ProgressChart entries={entries} lang={lang} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {([["d", m.date, "date"], ["w", m.weight, "number"], ["wa", m.waist, "number"], ["sq", m.squat, "number"], ["pu", m.pushup, "number"], ["su", m.situp, "number"], ["pl", m.plank, "number"]] as const).map(([k, label, type]) => (
                      <label key={k} className="block">
                        <span className="block font-body text-[9px] tracking-luxe uppercase text-muted-foreground mb-1">{label}</span>
                        <Input type={type} inputMode={type === "number" ? "decimal" : undefined} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="h-11 rounded-xl bg-secondary/40" />
                      </label>
                    ))}
                    <Button onClick={saveEntry} disabled={saving || !active} className="self-end h-11 rounded-xl bg-primary text-primary-foreground font-body text-[10px] tracking-luxe uppercase">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : savedMsg ? <><Check className="mr-1 h-4 w-4" /> {m.saved}</> : <><TrendingUp className="mr-1 h-4 w-4" /> {m.save}</>}
                    </Button>
                  </div>
                  <div className="overflow-x-auto mt-5">
                    {entries.length === 0 ? <p className="font-body text-sm text-muted-foreground">{m.noEntries}</p> : (
                      <table className="w-full min-w-[480px] border-collapse font-body text-[13px] sm:text-sm">
                        <thead><tr className="text-left text-[10px] tracking-wide-2 uppercase text-gold">
                          {[m.date, m.weight, m.waist, m.squat, m.pushup, m.situp, m.plank].map((h) => <th key={h} className="font-normal py-2 pr-3">{h}</th>)}
                        </tr></thead>
                        <tbody>{entries.map((e, i) => (
                          <tr key={i} className="border-t border-border">{[e.d, e.w, e.wa, e.sq, e.pu, e.su, e.pl].map((v, k) => <td key={k} className="py-2 pr-3">{v || "—"}</td>)}</tr>
                        ))}</tbody>
                      </table>
                    )}
                  </div>
                </section>

                {/* coach */}
                <section className={`${card} lg:col-span-3 flex flex-col lg:flex-row items-start lg:items-center gap-x-6`}>
                  <img src={coachBubble} alt="Dalila" className="h-16 w-16 rounded-full object-cover ring-2 ring-gold mb-4" />
                  <div className="font-script text-3xl text-gold leading-none mb-2">Dalila</div>
                  <p className="font-body text-sm text-muted-foreground mb-6 lg:mb-0 lg:flex-1">{m.coach}</p>
                  <Button asChild className="mt-auto lg:mt-0 rounded-full h-12 px-7 bg-primary text-primary-foreground font-body text-[11px] tracking-luxe uppercase"><a href={IG_DM} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Instagram</a></Button>
                </section>

                {/* food calculator (VIP) */}
                <section className={`${card} lg:col-span-3`}>
                  <div className="flex flex-wrap items-center gap-x-3">
                    <SectionLabel>{lang === "de" ? "Smart-Plate-Rechner" : lang === "sr" ? "Smart Plate kalkulator" : "Smart Plate Calculator"}</SectionLabel>
                    <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 font-body text-[9px] tracking-luxe uppercase"><Crown className="h-3 w-3" /> VIP</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground -mt-2 mb-5 inline-flex items-start gap-1.5"><Utensils className="h-3.5 w-3.5 shrink-0 mt-px text-gold" />{lang === "de" ? "Stell jeden Teller grammgenau zusammen — Kalorien, Eiweiß, Kohlenhydrate und Fett werden sofort berechnet." : lang === "sr" ? "Složi svaki tanjir na gram — kalorije, proteini, ugljeni hidrati i masti se računaju odmah." : "Build every plate to the gram — calories, protein, carbs and fat are calculated instantly."}</p>
                  <FoodCalculator lang={lang} userId={user.id} unlocked={hasVip(user)}
                    defaultGoal={profile ? (() => { const nn = calcNutrition(profile); return { k: nn.kcal, p: nn.protein }; })() : undefined}
                    pending={!active && slug === "VIP-1-1"}
                    onUpgrade={() => (active ? (openInstagramApp() || window.open(IG_DM, "_blank", "noopener")) : setUpgradeOpen(true))} />
                </section>
              </div>
            </div>
            {!isAdmin(user) && <DeleteAccount lang={lang} />}
          </main>
        </>
      )}

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-3xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-0 gap-0 rounded-3xl border-gold/30 bg-background">
          <div className="bg-stage text-[hsl(37_40%_90%)] px-6 md:px-10 pt-8 pb-7 text-center">
            <div className="font-body text-[10px] tracking-luxe uppercase text-gold mb-2 inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> {m.upgrade}</div>
            <DialogTitle className="font-display text-4xl md:text-5xl font-normal">{m.upgradeTitle}</DialogTitle>
            <DialogDescription className="font-body text-sm text-[hsl(37_40%_90%/0.75)] max-w-md mx-auto mt-3">{m.upgradeSub}</DialogDescription>
          </div>
          <div className="grid md:grid-cols-2 gap-4 p-5 md:p-8">
            {([
              { id: "Strong-and-Toned" as PlanId, name: "Strong & Toned", tag: t.plans.strongTag, feats: t.plans.strong, imgs: [pShaker, f1Chocolate], dark: false },
              { id: "VIP-1-1" as PlanId, name: "VIP 1:1", tag: t.plans.vipTag, feats: t.plans.vip, imgs: [pKit], dark: true },
            ]).map((c) => (
              <div key={c.id} className={`rounded-3xl p-6 flex flex-col border ${c.dark ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"} ${planChosen && slug === c.id ? "ring-2 ring-[hsl(var(--vermilion))]" : ""}`}>
                <div className="h-24 flex items-end justify-center gap-1 mb-4">
                  {c.imgs.map((src, k) => <img key={k} src={src} alt="" className="h-full w-auto object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]" />)}
                </div>
                <div className={`font-body text-[10px] tracking-luxe uppercase mb-1 ${c.dark ? "text-[hsl(var(--vermilion))]" : "text-gold"}`}>{c.tag}</div>
                <h3 className="font-display text-3xl mb-4">{c.name}</h3>
                <ul className="space-y-2 mb-6">
                  {c.feats.map((f) => <li key={f} className="flex gap-2.5 font-body text-[13px] leading-snug"><Check className="h-4 w-4 shrink-0 mt-0.5 text-[hsl(var(--vermilion))]" /> {f}</li>)}
                </ul>
                <Button onClick={() => choosePlan(c.id)} disabled={choosing !== null}
                  className={`mt-auto h-11 rounded-full font-body text-[10px] tracking-luxe uppercase ${c.dark ? "bg-vermilion text-white hover:bg-vermilion/90" : "bg-primary text-primary-foreground"}`}>
                  {choosing === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{m.choose} {c.name}</>}
                </Button>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 text-center">
            <p className="font-body text-xs text-muted-foreground mb-3">{t.plans.note}</p>
            <button onClick={() => setUpgradeOpen(false)} className="font-body text-[10px] tracking-luxe uppercase text-muted-foreground hover:text-gold">{m.later}</button>
          </div>
        </DialogContent>
      </Dialog>

      <ExerciseGuide exKey={exKey} lang={lang} onClose={() => setExKey(null)} />
      <SiteFooter onAuth={openAuth} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} lang={lang} onLangChange={setLang} />
    </div>
  );
};

export default Account;
