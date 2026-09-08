import { useMemo, useState, type ComponentType } from "react";
import { Link } from "wouter";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { Filter, Navigation, Search } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { moistureBand, riskTone } from "../lib/risk";
import type { RiskLevel } from "../lib/risk";

const LeafletMap = MapContainer as unknown as ComponentType<any>;
const LeafletTile = TileLayer as unknown as ComponentType<any>;
const LeafletCircle = CircleMarker as unknown as ComponentType<any>;

function FitMap({ locations }: { locations: { lat: number; lng: number }[] }) {
  const map = useMap();
  if (locations.length) map.fitBounds(locations.map((l) => [l.lat, l.lng] as [number, number]), { padding: [22, 22] });
  return null;
}

export default function RiskMap() {
  const { locations } = useApp();
  const [state, setState] = useState("All states");
  const [risk, setRisk] = useState<"All risks" | RiskLevel>("All risks");
  const [query, setQuery] = useState("");
  const states = Array.from(new Set(locations.map((l) => l.state))).sort();
  const filtered = useMemo(() => locations.filter((l) => (state === "All states" || l.state === state) && (risk === "All risks" || l.risk_level === risk) && `${l.name} ${l.state}`.toLowerCase().includes(query.toLowerCase())), [locations, state, risk, query]);

  return <div className="space-y-7"><section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Spatial overview</p><h2 className="page-title">Risk map</h2><p className="page-subtitle">Navigate the monitored locations across the North Eastern Region.</p></div><div className="flex items-center gap-2 rounded-2xl border border-[#dce5dd] bg-[#fbfdf9] px-4 py-3 text-xs font-semibold text-[#668274]"><Navigation size={15} /> {filtered.length} of {locations.length} locations visible</div></section><section className="card-surface overflow-hidden"><div className="flex flex-col gap-3 border-b border-[#e5ebe4] p-4 sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="field-icon" size={16} /><input className="field pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a location or state" /></label><select className="field sm:w-48" value={state} onChange={(e) => setState(e.target.value)}><option>All states</option>{states.map((item) => <option key={item}>{item}</option>)}</select><select className="field sm:w-36" value={risk} onChange={(e) => setRisk(e.target.value as typeof risk)}><option>All risks</option><option>High</option><option>Medium</option><option>Low</option></select></div><div className="relative h-[520px]"><LeafletMap center={[25.8, 92.8]} zoom={6} scrollWheelZoom className="z-0 h-full w-full"><LeafletTile attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FitMap locations={filtered} />{filtered.map((location) => { const tone = riskTone(location.risk_level); const band = moistureBand(location.soil_moisture_pct); const fillColor = location.risk_level === "High" ? "#e95e4f" : location.risk_level === "Medium" ? "#d39b35" : "#2e9565"; return <LeafletCircle key={location.id} center={[location.lat, location.lng]} radius={10} pathOptions={{ color: fillColor, fillColor, fillOpacity: 0.86, weight: 3 }}><Popup><div className="min-w-[190px] text-[#20312b]"><p className="text-[10px] font-bold tracking-[0.14em] text-[#789184] uppercase">{location.state}</p><h3 className="mt-1 text-base font-bold">{location.name}</h3><div className="my-3 grid grid-cols-2 gap-2 text-xs"><span>Risk <strong className={tone.text}>{location.risk_level}</strong></span><span>Moisture <strong className={band.text}>{location.soil_moisture_pct}%</strong></span><span>Rainfall <strong>{location.rainfall_mm} mm</strong></span><span>Slope <strong>{location.slope_degrees}°</strong></span></div><Link href={`/locations/${location.id}`} className="inline-flex rounded-lg bg-[#173c34] px-3 py-2 text-xs font-bold text-white">View location</Link></div></Popup></LeafletCircle>; })}</LeafletMap><div className="absolute bottom-4 left-4 z-[500] rounded-2xl border border-[#dce5dd] bg-[#fbfdf9]/95 p-4 shadow-lg backdrop-blur"><div className="mb-3 flex items-center gap-2 text-xs font-bold"><Filter size={14} className="text-[#527361]" /> Risk legend</div><div className="space-y-2 text-xs text-[#66786d]"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#e95e4f]" /> High · immediate review</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#d39b35]" /> Medium · watch</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#2e9565]" /> Low · stable signal</span></div></div></div></section></div>;
}
