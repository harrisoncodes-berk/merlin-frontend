import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { setAuthTokenProvider } from "@/api/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setIsLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const accessToken = session?.access_token ?? null;
  const user = session?.user ?? null;

  const tokenRef = useRef<string | null>(null);
  tokenRef.current = accessToken;

  useLayoutEffect(() => {
    setAuthTokenProvider(() => tokenRef.current);
  }, []);

  const isAuthReady = !!accessToken && !isLoading;

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }
  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      accessToken,
      isLoading,
      isAuthReady,
      signInWithGoogle,
      signOut,
    }),
    [user, session, accessToken, isLoading, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
