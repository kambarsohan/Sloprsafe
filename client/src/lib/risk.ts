import type { LocationRecord } from "../data/mockData";

export type RiskLevel = "Low" | "Medium" | "High";

export function calculateRiskLevel(
  rainfall_mm: number,
  slope_degrees: number,
  past_landslide: boolean,
  soil_moisture_pct: number,
): RiskLevel {
  const highRainfall = rainfall_mm >= 100;
  const highSlope = slope_degrees >= 30;
  const highMoisture = soil_moisture_pct >= 70;
  const indicatorCount = [highRainfall, highSlope, highMoisture, past_landslide].filter(Boolean).length;

  if ((highRainfall && highSlope) || (past_landslide && rainfall_mm >= 90) || (highMoisture && rainfall_mm >= 90)) return "High";
  if (indicatorCount === 1) return "Medium";
  return "Low";
}

export function withCalculatedRisk(location: LocationRecord): LocationRecord {
  return { ...location, risk_level: calculateRiskLevel(location.rainfall_mm, location.slope_degrees, location.past_landslide, location.soil_moisture_pct) };
}

export function moistureBand(value: number) {
  if (value >= 70) return { label: "Saturated", color: "#e95e4f", track: "bg-[#f8d4ce]", text: "text-[#c74335]" };
  if (value >= 40) return { label: "Moist", color: "#d39b35", track: "bg-[#f5e7bf]", text: "text-[#a06c14]" };
  return { label: "Dry", color: "#2e9565", track: "bg-[#d8eee2]", text: "text-[#24784f]" };
}

export function riskTone(risk: RiskLevel) {
  if (risk === "High") return { bg: "bg-[#fff0ed]", text: "text-[#c74335]", border: "border-[#f4c7c0]", dot: "bg-[#e95e4f]" };
  if (risk === "Medium") return { bg: "bg-[#fff8e9]", text: "text-[#a06c14]", border: "border-[#f0dcaa]", dot: "bg-[#d39b35]" };
  return { bg: "bg-[#eef8f2]", text: "text-[#24784f]", border: "border-[#bfe3cf]", dot: "bg-[#2e9565]" };
}

export function riskIcon(risk: RiskLevel) {
  return risk === "High" ? "!" : risk === "Medium" ? "~" : "✓";
}

export function formatDate(date?: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}
