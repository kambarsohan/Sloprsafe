import { useEffect, useState } from "react";
import { Cloud, CloudLightning, CloudRain, Droplets, RefreshCw, Search, Sun, Wind, Thermometer, Radio, Navigation } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { fetchLiveWeather, type LiveWeatherData } from "../lib/weather";
import { toast } from "sonner";

function WeatherIcon({ summary, code }: { summary: string; code?: number }) {
  if (code !== undefined && code >= 95) return <CloudLightning size={24} className="text-[#d97706]" />;
  const lower = summary.toLowerCase();
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("shower") || lower.includes("wet")) {
    return <CloudRain size={24} className="text-[#2563eb]" />;
  }
  if (lower.includes("cloud") || lower.includes("overcast") || lower.includes("fog")) {
    return <Cloud size={24} className="text-[#64748b]" />;
  }
  return <Sun size={24} className="text-[#eab308]" />;
}

export default function Weather() {
  const { locations } = useApp();
  const [liveDataMap, setLiveDataMap] = useState<Record<string, LiveWeatherData>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [fetchingAll, setFetchingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAllWeather = async () => {
    if (!locations.length) return;
    setFetchingAll(true);
    const newMap: Record<string, LiveWeatherData> = { ...liveDataMap };

    await Promise.all(
      locations.map(async (location) => {
        try {
          const live = await fetchLiveWeather(location.lat, location.lng);
          newMap[location.id] = live;
        } catch (e) {
          console.warn(`Could not fetch live weather for ${location.name}`, e);
        }
      })
    );

    setLiveDataMap(newMap);
    setFetchingAll(false);
    toast.success("Live weather updated for all monitoring locations");
  };

  useEffect(() => {
    loadAllWeather();
  }, [locations.length]);

  const refreshSingle = async (locationId: string, lat: number, lng: number) => {
    setLoadingMap((prev) => ({ ...prev, [locationId]: true }));
    try {
      const live = await fetchLiveWeather(lat, lng);
      setLiveDataMap((prev) => ({ ...prev, [locationId]: live }));
      toast.success(`Updated weather for location`);
    } catch {
      toast.error("Failed to update live weather");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [locationId]: false }));
    }
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Real-Time Atmospheric Broadcast</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef8f2] px-2.5 py-0.5 text-[11px] font-bold text-[#24784f]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e9565] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2e9565]"></span>
              </span>
              LIVE Open-Meteo Signal
            </span>
          </div>
          <h2 className="page-title">Live Weather Casting</h2>
          <p className="page-subtitle">
            Real-time satellite and meteorological weather feeds across all North East India terrain monitoring stations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadAllWeather}
            disabled={fetchingAll}
            className="button-primary"
          >
            <RefreshCw size={17} className={fetchingAll ? "animate-spin" : ""} />
            {fetchingAll ? "Updating Live Feed..." : "Refresh Live Weather"}
          </button>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718279]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search station or state (e.g., Shillong, Sikkim)..."
            className="field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#668274]">
          <Radio size={15} className="text-[#2e9565]" />
          <span>Showing <strong>{filteredLocations.length}</strong> active meteorological stations</span>
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredLocations.map((location) => {
          const live = liveDataMap[location.id];
          const isLoading = loadingMap[location.id];

          const temp = live ? live.temperature_c : location.weather.temperature_c;
          const humidity = live ? live.humidity_pct : location.weather.humidity_pct;
          const wind = live ? live.wind_kmph : location.weather.wind_kmph;
          const summary = live ? live.forecast_summary : location.weather.forecast_summary;
          const precip = live ? live.precipitation_mm : location.rainfall_mm;

          return (
            <article
              key={location.id}
              className="card-surface flex flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.16em] text-[#668274] uppercase">
                      {location.state}
                    </span>
                    <h3 className="font-display text-2xl tracking-[-0.04em] text-[#173c34]">
                      {location.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#89978f]">
                      <Navigation size={11} /> {location.lat.toFixed(2)}°N, {location.lng.toFixed(2)}°E
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf3ea] p-2">
                      <WeatherIcon summary={summary} code={live?.weather_code} />
                    </span>
                    {live ? (
                      <span className="rounded-full bg-[#d9ee74] px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-[#173c34] uppercase">
                        LIVE API
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#edf3ea] px-2 py-0.5 text-[9px] font-semibold text-[#718279]">
                        CACHED
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-baseline justify-between">
                  <div>
                    <span className="font-display text-5xl tracking-[-0.06em] text-[#173c34]">
                      {temp}°
                    </span>
                    <span className="ml-1 text-sm font-semibold text-[#668274]">C</span>
                    {live?.temp_max !== undefined && live?.temp_min !== undefined && (
                      <p className="mt-1 text-xs text-[#718279]">
                        H: {live.temp_max}° · L: {live.temp_min}°
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#173c34]">{summary}</p>
                    {live?.fetched_at && (
                      <p className="mt-0.5 text-[10px] text-[#89978f]">Updated {live.fetched_at}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#edf0eb] pt-4">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#527361]">
                    <Droplets size={15} className="text-[#3b82f6]" />
                    <div>
                      <span className="block text-[10px] text-[#89978f] uppercase">Humidity</span>
                      <strong>{humidity}%</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#527361]">
                    <Wind size={15} className="text-[#64748b]" />
                    <div>
                      <span className="block text-[10px] text-[#89978f] uppercase">Wind</span>
                      <strong>{wind} km/h</strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-[#527361]">
                    <CloudRain size={15} className="text-[#2563eb]" />
                    <div className="text-right">
                      <span className="block text-[10px] text-[#89978f] uppercase">Precipitation</span>
                      <strong className="text-[#173c34]">{precip} mm</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => refreshSingle(location.id, location.lat, location.lng)}
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#dce5dd] bg-[#fbfdf9] py-2 text-xs font-semibold text-[#527361] transition-colors hover:bg-[#edf3ea]"
                >
                  <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                  {isLoading ? "Fetching Live Data..." : "Refresh Station"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
