import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Activity, ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    setBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    if (mode === "register" && !result.data.session) toast.success("Account created. Check your email to confirm access.");
    else toast.success("Signed in to SlopeSafe NER.");
  }

  return <div className="min-h-screen bg-[#f5f7f3] text-[#20312b] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
    <section className="relative hidden overflow-hidden bg-[#173c34] p-12 text-[#f4f2e9] lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full border border-[#a4c8af]/25" />
      <div className="absolute -bottom-32 -left-12 h-96 w-96 rounded-full border border-[#a4c8af]/20" />
      <div className="relative flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#d9ee74] text-[#173c34]"><Activity size={20} /></span> SlopeSafe NER</div>
      <div className="relative max-w-lg">
        <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-[#b6d7bd] uppercase">North East India · Risk intelligence</p>
        <h1 className="font-display text-6xl leading-[0.98] tracking-[-0.055em]">Observe the slope. Move before the slide.</h1>
        <p className="mt-7 max-w-md text-lg leading-8 text-[#c7dccb]">One workspace for terrain signals, field reports, and the people who turn early observations into safer decisions.</p>
      </div>
      <div className="relative flex items-center gap-3 text-sm text-[#b6d7bd]"><ShieldCheck size={18} /> Data access is protected by Supabase Auth</div>
    </section>
    <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-md">
        <div className="mb-10 lg:hidden"><div className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#173c34] text-[#d9ee74]"><Activity size={20} /></span> SlopeSafe NER</div></div>
        <div className="mb-9"><p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#668274] uppercase">Secure workspace access</p><h2 className="font-display text-4xl tracking-[-0.04em]">{mode === "login" ? "Welcome back." : "Create your operator account."}</h2><p className="mt-3 text-[#6b7b74]">{mode === "login" ? "Sign in to view monitoring data and submit reports." : "Register to add reports and sensor readings to the live workspace."}</p></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && <label className="block"><span className="mb-2 block text-sm font-semibold">Full name</span><input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="field" placeholder="Ananya Sharma" /></label>}
          <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><span className="relative block"><Mail className="field-icon" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="field pl-11" placeholder="operator@example.com" /></span></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><span className="relative block"><LockKeyhole className="field-icon" size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="field pl-11" placeholder="At least 6 characters" /></span></label>
          <button disabled={busy} className="button-primary w-full justify-center">{busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}<ArrowRight size={17} /></button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-7 w-full text-center text-sm font-semibold text-[#527361] hover:text-[#173c34]">{mode === "login" ? "Need an account? Register here" : "Already registered? Sign in"}</button>
        <p className="mt-10 text-center text-xs leading-5 text-[#89968f]">Your account controls access to operational records. Do not use this workspace as a replacement for official emergency services.</p>
      </div>
    </section>
  </div>;
}
