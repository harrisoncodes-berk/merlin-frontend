import { useAuth } from "@/contexts/AuthProvider";

export default function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="fixed top-3 right-3 z-50 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-200 shadow hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 md:top-4 md:right-4"
      aria-label="Sign out"
      title="Sign out"
    >
      Logout
    </button>
  );
}
