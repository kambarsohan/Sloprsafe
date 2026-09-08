export type WeatherSnapshot = {
  temperature_c: number;
  humidity_pct: number;
  wind_kmph: number;
  forecast_summary: string;
};

export type LocationRecord = {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  rainfall_mm: number;
  slope_degrees: number;
  past_landslide: boolean;
  soil_moisture_pct: number;
  weather: WeatherSnapshot;
  risk_level: "Low" | "Medium" | "High";
  updated_at?: string;
};

export const sampleLocations: LocationRecord[] = [
  { id: "shillong", name: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933, rainfall_mm: 128, slope_degrees: 34, past_landslide: true, soil_moisture_pct: 78, weather: { temperature_c: 19, humidity_pct: 88, wind_kmph: 14, forecast_summary: "Heavy rain expected in next 24 hours" }, risk_level: "High" },
  { id: "gangtok", name: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065, rainfall_mm: 92, slope_degrees: 31, past_landslide: true, soil_moisture_pct: 72, weather: { temperature_c: 16, humidity_pct: 84, wind_kmph: 10, forecast_summary: "Rain bands likely overnight" }, risk_level: "High" },
  { id: "aizawl", name: "Aizawl", state: "Mizoram", lat: 23.7271, lng: 92.7176, rainfall_mm: 74, slope_degrees: 38, past_landslide: false, soil_moisture_pct: 64, weather: { temperature_c: 23, humidity_pct: 76, wind_kmph: 8, forecast_summary: "Cloudy with brief showers" }, risk_level: "Medium" },
  { id: "itanagar", name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053, rainfall_mm: 116, slope_degrees: 22, past_landslide: true, soil_moisture_pct: 68, weather: { temperature_c: 24, humidity_pct: 82, wind_kmph: 12, forecast_summary: "Persistent rainfall through today" }, risk_level: "High" },
  { id: "kohima", name: "Kohima", state: "Nagaland", lat: 25.6751, lng: 94.1086, rainfall_mm: 58, slope_degrees: 33, past_landslide: false, soil_moisture_pct: 51, weather: { temperature_c: 22, humidity_pct: 70, wind_kmph: 7, forecast_summary: "Overcast, mostly dry" }, risk_level: "Medium" },
  { id: "imphal", name: "Imphal", state: "Manipur", lat: 24.817, lng: 93.9368, rainfall_mm: 41, slope_degrees: 18, past_landslide: false, soil_moisture_pct: 34, weather: { temperature_c: 26, humidity_pct: 62, wind_kmph: 11, forecast_summary: "Clear skies" }, risk_level: "Low" },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, rainfall_mm: 102, slope_degrees: 12, past_landslide: false, soil_moisture_pct: 73, weather: { temperature_c: 28, humidity_pct: 79, wind_kmph: 15, forecast_summary: "Thunderstorms possible this evening" }, risk_level: "Medium" },
  { id: "agartala", name: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868, rainfall_mm: 36, slope_degrees: 9, past_landslide: false, soil_moisture_pct: 42, weather: { temperature_c: 29, humidity_pct: 67, wind_kmph: 9, forecast_summary: "Warm with light cloud cover" }, risk_level: "Medium" },
  { id: "dimapur", name: "Dimapur", state: "Nagaland", lat: 25.8629, lng: 93.7533, rainfall_mm: 88, slope_degrees: 17, past_landslide: false, soil_moisture_pct: 61, weather: { temperature_c: 27, humidity_pct: 73, wind_kmph: 13, forecast_summary: "Scattered rain showers" }, risk_level: "Medium" },
  { id: "mangan", name: "Mangan", state: "Sikkim", lat: 27.5095, lng: 88.534, rainfall_mm: 132, slope_degrees: 42, past_landslide: true, soil_moisture_pct: 86, weather: { temperature_c: 14, humidity_pct: 91, wind_kmph: 18, forecast_summary: "Very wet conditions; heavy rain expected" }, risk_level: "High" },
];

export const reportTypes = ["Rockfall", "Road blockage", "Slope cracking", "Drainage overflow", "Waterlogging", "Other"];
export const severities = ["Low", "Medium", "High", "Critical"];
