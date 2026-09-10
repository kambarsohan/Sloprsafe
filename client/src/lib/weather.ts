export type LiveWeatherData = {
  temperature_c: number;
  humidity_pct: number;
  wind_kmph: number;
  precipitation_mm: number;
  forecast_summary: string;
  weather_code: number;
  temp_max?: number;
  temp_min?: number;
  is_live: boolean;
  fetched_at: string;
};

export function decodeWmoCode(code: number): { summary: string; category: "clear" | "cloudy" | "rain" | "snow" | "thunder" } {
  if (code === 0) return { summary: "Clear sky", category: "clear" };
  if (code === 1) return { summary: "Mainly clear", category: "clear" };
  if (code === 2) return { summary: "Partly cloudy", category: "cloudy" };
  if (code === 3) return { summary: "Overcast", category: "cloudy" };
  if (code >= 45 && code <= 48) return { summary: "Fog / Haze", category: "cloudy" };
  if (code >= 51 && code <= 55) return { summary: "Light drizzle", category: "rain" };
  if (code >= 56 && code <= 57) return { summary: "Freezing drizzle", category: "rain" };
  if (code >= 61 && code <= 63) return { summary: "Moderate rain", category: "rain" };
  if (code >= 64 && code <= 65) return { summary: "Heavy rainfall", category: "rain" };
  if (code >= 66 && code <= 67) return { summary: "Freezing rain", category: "rain" };
  if (code >= 71 && code <= 77) return { summary: "Snowfall", category: "snow" };
  if (code >= 80 && code <= 82) return { summary: "Heavy rain showers", category: "rain" };
  if (code >= 85 && code <= 86) return { summary: "Snow showers", category: "snow" };
  if (code >= 95 && code <= 99) return { summary: "Thunderstorm with rain", category: "thunder" };
  return { summary: "Variable weather", category: "cloudy" };
}

export async function fetchLiveWeather(lat: number, lng: number): Promise<LiveWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current;
  const daily = data.daily;
  const decoded = decodeWmoCode(current.weather_code);

  return {
    temperature_c: Math.round(current.temperature_2m),
    humidity_pct: Math.round(current.relative_humidity_2m),
    wind_kmph: Math.round(current.wind_speed_10m),
    precipitation_mm: Number((current.precipitation || daily?.precipitation_sum?.[0] || 0).toFixed(1)),
    forecast_summary: decoded.summary,
    weather_code: current.weather_code,
    temp_max: daily?.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : undefined,
    temp_min: daily?.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : undefined,
    is_live: true,
    fetched_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
