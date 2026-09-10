import { supabase } from "./supabase";
import { calculateRiskLevel } from "./risk";
import { sampleLocations, type LocationRecord } from "../data/mockData";

export type FieldReport = { id: string; reporter_name: string; phone?: string | null; location_id: string; report_type: string; severity: string; description: string; observed_at: string; reviewed: boolean; created_at: string; };
export type AlertRecord = { id: string; location_id: string; title: string; message: string; severity: string; status: string; created_at: string; };
export type SensorReading = { id: string; location_id: string; moisture_pct: number; source: string; recorded_at: string; };
type ReportInsert = Omit<FieldReport, "id" | "created_at" | "reviewed"> & { user_id?: string | null };
type AlertInsert = Omit<AlertRecord, "id" | "created_at" | "status"> & { user_id?: string | null };
type ReadingInsert = Omit<SensorReading, "id" | "recorded_at"> & { user_id?: string | null };

export async function loadLocations(): Promise<LocationRecord[]> {
  const { data, error } = await supabase.from("locations").select("*").order("name");
  if (error) throw error;
  return (data?.length ? data : sampleLocations).map((location) => ({ ...location, weather: typeof location.weather === "string" ? JSON.parse(location.weather) : location.weather, risk_level: calculateRiskLevel(location.rainfall_mm, location.slope_degrees, location.past_landslide, location.soil_moisture_pct) }));
}

export async function seedLocationsIfEmpty() {
  const { count, error } = await supabase.from("locations").select("id", { count: "exact", head: true });
  if (error) throw error;
  if (!count) { const rows = sampleLocations.map(({ risk_level: _risk, ...location }) => ({ ...location, weather: location.weather })); const { error: insertError } = await supabase.from("locations").insert(rows); if (insertError) throw insertError; }
}

export async function updateLocation(id: string, patch: Partial<LocationRecord>) {
  const next = { ...patch } as Partial<LocationRecord>;
  if (next.rainfall_mm !== undefined || next.slope_degrees !== undefined || next.past_landslide !== undefined || next.soil_moisture_pct !== undefined) {
    const { data: existing } = await supabase.from("locations").select("rainfall_mm,slope_degrees,past_landslide,soil_moisture_pct").eq("id", id).single();
    if (existing) next.risk_level = calculateRiskLevel(next.rainfall_mm ?? existing.rainfall_mm, next.slope_degrees ?? existing.slope_degrees, next.past_landslide ?? existing.past_landslide, next.soil_moisture_pct ?? existing.soil_moisture_pct);
  }
  const { error } = await supabase.from("locations").update(next).eq("id", id);
  if (error) throw error;
}

export async function loadReports() { const { data, error } = await supabase.from("field_reports").select("*").order("created_at", { ascending: false }); if (error) throw error; return (data || []) as FieldReport[]; }
export async function createReport(report: ReportInsert) { const { data, error } = await supabase.from("field_reports").insert({ ...report, reviewed: false }).select().single(); if (error) throw error; return data as FieldReport; }
export async function markReportReviewed(id: string, reviewed: boolean) { const { error } = await supabase.from("field_reports").update({ reviewed }).eq("id", id); if (error) throw error; }
export async function loadAlerts() { const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false }); if (error) throw error; return (data || []) as AlertRecord[]; }
export async function createAlert(alert: AlertInsert) { const { data, error } = await supabase.from("alerts").insert({ ...alert, status: "active" }).select().single(); if (error) throw error; return data as AlertRecord; }
export async function loadSensorReadings() { const { data, error } = await supabase.from("sensor_readings").select("*").order("recorded_at", { ascending: false }).limit(120); if (error) throw error; return (data || []) as SensorReading[]; }
export async function createSensorReading(reading: ReadingInsert) { const { data, error } = await supabase.from("sensor_readings").insert(reading).select().single(); if (error) throw error; return data as SensorReading; }
