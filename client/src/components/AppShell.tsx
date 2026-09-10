import { Link, useLocation } from "wouter";
import { Activity, Bell, ChevronDown, ClipboardList, CloudRain, LayoutDashboard, LogOut, Map, Menu, Radio, Settings2, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useApp } from "../contexts/AppContext";
import { toast } from "sonner";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/map", label: "Risk map", icon: Map },
  { href: "/weather", label: "Weather", icon: CloudRain },
  { href: "/sensors", label: "Sensor readings", icon: Radio },
  { href: "/report", label: "Field report", icon: ClipboardList },
  { href: "/admin", label: "Manage locations", icon: Settings2 },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, alerts } = useApp();
  const highAlerts = alerts.filter((alert) => alert.severity === "High" || alert.severity === "Critical").length;

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("You have been signed out.");
  }

  return <div className="min-h-screen bg-[#f5f7f3] text-[#20312b]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-[#dce5dd] bg-[#f9fbf7] px-5 py-6 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between px-2"><Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#173c34] text-[#d9ee74]"><Activity size={20} /></span><span><strong className="block font-display text-xl tracking-[-0.04em]">SlopeSafe</strong><small className="block text-[10px] font-bold tracking-[0.18em] text-[#72907e] uppercase">NER monitoring</small></span></Link><button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
      <div className="my-8 rounded-2xl bg-[#edf3ea] p-3"><div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-[#527361] uppercase"><span className="h-2 w-2 rounded-full bg-[#2e9565]" /> Workspace online</div><p className="mt-2 text-xs leading-5 text-[#708279]">Supabase data connection is active for your account.</p></div>
      <nav className="space-y-1">{nav.map(({ href, label, icon: Icon }) => { const active = href === "/" ? location === "/" : location.startsWith(href); return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`nav-link ${active ? "nav-link-active" : ""}`}><Icon size={18} strokeWidth={active ? 2.4 : 1.9} /><span>{label}</span>{label === "Field report" && <span className="ml-auto rounded-full bg-[#d9ee74] px-2 py-0.5 text-[10px] font-bold text-[#173c34]">NEW</span>}</Link>; })}</nav>
      <div className="mt-auto border-t border-[#dce5dd] pt-5"><Link href="/admin" className="mb-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#60766b] hover:bg-[#edf3ea]"><ShieldCheck size={17} /><span>Data & access</span></Link><div className="flex items-center gap-3 rounded-2xl bg-[#173c34] p-3 text-[#f4f2e9]"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#d9ee74] text-sm font-bold text-[#173c34]">{(user?.user_metadata?.full_name || user?.email || "Operator").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{user?.user_metadata?.full_name || (user?.email ? "@" + user.email.split("@")[0] : "Operator")}</p><p className="truncate text-[10px] text-[#afcbb6]">{user?.email ? "@" + user.email.split("@")[0] : "Public Access"}</p></div>{user && <button aria-label="Sign out" onClick={signOut} className="text-[#b9d9c0] hover:text-white"><LogOut size={16} /></button>}</div></div>
    </aside>
    {mobileOpen && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-[#173c34]/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}
    <main className="min-h-screen lg:pl-[250px]"><header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-[#dce5dd]/80 bg-[#f5f7f3]/90 px-5 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><button className="rounded-xl p-2 hover:bg-[#e9f0e9] lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div><p className="text-[11px] font-bold tracking-[0.18em] text-[#789184] uppercase">North Eastern Region</p><h1 className="font-display text-lg tracking-[-0.03em]">Slope intelligence workspace</h1></div></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-[#d8e5da] bg-[#fbfdf9] px-3 py-2 text-xs font-semibold text-[#668274] sm:flex"><span className="h-2 w-2 rounded-full bg-[#2e9565]" /> Data synced</div><Link href="/admin" className="relative grid h-10 w-10 place-items-center rounded-full border border-[#dce5dd] bg-[#fbfdf9] text-[#60766b] hover:bg-white"><Bell size={17} />{highAlerts > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#e95e4f] px-1 text-[9px] font-bold text-white">{highAlerts}</span>}</Link><button className="hidden items-center gap-1 rounded-xl px-2 py-2 text-sm font-semibold text-[#60766b] hover:bg-[#e9f0e9] sm:flex"><span className="max-w-[130px] truncate">{user?.user_metadata?.full_name || (user?.email ? "@" + user.email.split("@")[0] : "Operator")}</span><ChevronDown size={15} /></button></div></header><div className="px-5 py-7 sm:px-8 sm:py-9">{children}</div></main>
  </div>;
}
