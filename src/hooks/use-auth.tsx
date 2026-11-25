import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type PlanId = "Strong-and-Toned" | "VIP-1-1";
export const PLAN_NAMES: Record<PlanId, string> = { "Strong-and-Toned": "Strong & Toned", "VIP-1-1": "VIP 1:1" };

type Ctx = { user: User | null; session: Session | null; loading: boolean; signOut: () => Promise<void>; refresh: () => Promise<void> };
const AuthContext = createContext<Ctx>({ user: null, session: null, loading: true, signOut: async () => {}, refresh: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    const { data } = await supabase.auth.refreshSession();
    if (data.session) setSession(data.session);
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, signOut: async () => { await supabase.auth.signOut(); }, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/** Membership is active only when set on the server (app_metadata), which clients cannot change. */
export const isActive = (u: User | null) => u?.app_metadata?.membership === "active";
export const isAdmin = (u: User | null) => u?.app_metadata?.role === "admin";
export const hasPlan = (u: User | null) => u?.user_metadata?.plan === "VIP-1-1" || u?.user_metadata?.plan === "Strong-and-Toned";
/** VIP features: admins, or an active membership whose paid plan (set by the admin) is VIP. */
export const hasVip = (u: User | null) =>
  isAdmin(u) || (isActive(u) && ((u?.app_metadata?.paid_plan as string | undefined) ?? u?.user_metadata?.plan) === "VIP-1-1");
export const userPlan = (u: User | null): PlanId => (u?.user_metadata?.plan === "VIP-1-1" ? "VIP-1-1" : "Strong-and-Toned");
