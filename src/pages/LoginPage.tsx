import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export default function LoginPage() {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const from = (location.state?.from as any)?.pathname ?? "/";

  useEffect(() => {
    if (!isLoading && user) {
      navigate(from, { replace: true });
    }
  }, [isLoading, user, from, navigate]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold">Sign in</h1>
        <p className="mb-6 text-sm text-slate-400">
          Use your Google account to continue to Merlin.
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Continue with Google
        </button>
        <p className="mt-4 text-xs text-slate-500">
          You’ll be redirected to Google, then back here.
        </p>
      </div>
    </main>
  );
}
