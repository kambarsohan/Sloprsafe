import { Cloud, CloudRain, Droplets, Sun, Wind } from "lucide-react";
import { useApp } from "../contexts/AppContext";

function WeatherIcon({ summary }: { summary: string }) {
  const lower = summary.toLowerCase();
  if (lower.includes("rain") || lower.includes("shower") || lower.includes("storm")) return <CloudRain size={23} />;
  if (lower.includes("cloud") || lower.includes("overcast")) return <Cloud size={23} />;
  return <Sun size={23} />;
}

export default function Weather() {
  const { locations } = useApp();
  return <div className="space-y-7"><section><p className="eyebrow">Atmospheric view</p><h2 className="page-title">Weather reporting</h2><p className="page-subtitle">A location-by-location read of temperature, humidity, wind, and forecast conditions.</p></section><div className="flex items-center gap-3 rounded-2xl border border-[#dce5dd] bg-[#edf3ea] p-4 text-sm text-[#527361]"><CloudRain size={19} /><span>Weather context is connected to each monitored location record. Use it alongside slope, rainfall, and moisture signals.</span></div><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{locations.map((location) => <article key={location.id} className="card-surface p-5 transition-transform hover:-translate-y-0.5"><div className="flex items-start justify-between"><div><p className="eyebrow">{location.state}</p><h3 className="font-display text-2xl tracking-[-0.04em]">{location.name}</h3></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf3fb] text-[#4c79a4]"><WeatherIcon summary={location.weather.forecast_summary} /></span></div><div className="mt-6 flex items-end justify-between"><div><span className="font-display text-5xl tracking-[-0.06em]">{location.weather.temperature_c}°</span><span className="ml-2 text-sm text-[#789184]">Celsius</span></div><p className="max-w-[150px] text-right text-sm font-semibold leading-5 text-[#527361]">{location.weather.forecast_summary}</p></div><div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#edf0eb] pt-4 text-xs"><span className="flex items-center gap-1.5 text-[#718279]"><Droplets size={14} /> {location.weather.humidity_pct}%</span><span className="flex items-center gap-1.5 text-[#718279]"><Wind size={14} /> {location.weather.wind_kmph} km/h</span><span className="flex items-center justify-end gap-1.5 font-semibold text-[#527361]">{location.rainfall_mm} mm</span></div></article>)}</section></div>;
}
