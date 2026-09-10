import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Activity, ArrowRight, LockKeyhole, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Convert simple username to synthetic email for Supabase Auth engine
  const userEmail = `${username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")}@slopesafe.local`;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) return;

    setBusy(true);

    if (mode === "login") {
      const result = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });
      setBusy(false);
      if (result.error) {
        toast.error("Invalid username or password");
        return;
      }
      toast.success("Welcome back!");
    } else {
      const result = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: { data: { full_name: username.trim() } },
      });
      setBusy(false);
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      // If user already existed or created, sign in immediately without email step
      if (!result.data.session) {
        const loginAgain = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        });
        if (loginAgain.error) {
          toast.error("Account created. Please sign in with your password.");
          setMode("login");
          return;
        }
      }
      toast.success("Account created! Logged in immediately.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#20312b] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#173c34] p-12 text-[#f4f2e9] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full border border-[#a4c8af]/25" />
        <div className="absolute -bottom-32 -left-12 h-96 w-96 rounded-full border border-[#a4c8af]/20" />
        <div className="relative flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#d9ee74] text-[#173c34]">
            <Activity size={20} />
          </span>{" "}
          SlopeSafe NER
        </div>
        <div className="relative max-w-lg">
          <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-[#b6d7bd] uppercase">
            North East India · Risk intelligence
          </p>
          <h1 className="font-display text-6xl leading-[0.98] tracking-[-0.055em]">
            Observe the slope. Move before the slide.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#c7dccb]">
            One workspace for terrain signals, field reports, and instant access without email verification.
          </p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-[#b6d7bd]">
          <ShieldCheck size={18} /> Simple Username + Password Login Enabled
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#173c34] text-[#d9ee74]">
                <Activity size={20} />
              </span>{" "}
              SlopeSafe NER
            </div>
          </div>
          <div className="mb-9">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#668274] uppercase">
              Direct Account Access
            </p>
            <h2 className="font-display text-4xl tracking-[-0.04em]">
              {mode === "login" ? "Welcome back." : "Create your account instantly."}
            </h2>
            <p className="mt-3 text-[#6b7b74]">
              {mode === "login"
                ? "Enter your username and password to log in."
                : "Choose a username and password to enter the workspace directly."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Username</span>
              <span className="relative block">
                <User className="field-icon" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="field pl-11"
                  placeholder="e.g. operator1"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <span className="relative block">
                <LockKeyhole className="field-icon" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  className="field pl-11"
                  placeholder="Your secret password"
                />
              </span>
            </label>
            <button disabled={busy} className="button-primary w-full justify-center">
              {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account & enter"}
              <ArrowRight size={17} />
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-7 w-full text-center text-sm font-semibold text-[#527361] hover:text-[#173c34]"
          >
            {mode === "login"
              ? "Need an account? Register here"
              : "Already registered? Sign in"}
          </button>
        </div>
      </section>
    </div>
  );
}
