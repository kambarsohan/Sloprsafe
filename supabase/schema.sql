-- SlopeSafe NER Supabase schema
-- Run this file once in the Supabase SQL editor for project qdhzhluhjxtuklddzhle.

create extension if not exists pgcrypto;

create table if not exists public.locations (
  id text primary key,
  name text not null,
  state text not null,
  lat double precision not null,
  lng double precision not null,
  rainfall_mm numeric not null default 0,
  slope_degrees numeric not null default 0,
  past_landslide boolean not null default false,
  soil_moisture_pct numeric not null default 0 check (soil_moisture_pct between 0 and 100),
  weather jsonb not null default '{}'::jsonb,
  risk_level text not null default 'Low' check (risk_level in ('Low', 'Medium', 'High')),
  updated_at timestamptz not null default now()
);

create table if not exists public.field_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reporter_name text not null,
  phone text,
  location_id text not null references public.locations(id) on delete cascade,
  report_type text not null,
  severity text not null,
  description text not null,
  observed_at timestamptz not null,
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id text not null references public.locations(id) on delete cascade,
  title text not null,
  message text not null,
  severity text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.sensor_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id text not null references public.locations(id) on delete cascade,
  moisture_pct numeric not null check (moisture_pct between 0 and 100),
  source text not null default 'Manual field sensor',
  recorded_at timestamptz not null default now()
);

create index if not exists field_reports_created_at_idx on public.field_reports(created_at desc);
create index if not exists alerts_created_at_idx on public.alerts(created_at desc);
create index if not exists sensor_readings_recorded_at_idx on public.sensor_readings(recorded_at desc);

alter table public.locations enable row level security;
alter table public.field_reports enable row level security;
alter table public.alerts enable row level security;
alter table public.sensor_readings enable row level security;

drop policy if exists "Authenticated users can read locations" on public.locations;
create policy "Authenticated users can read locations" on public.locations for select to authenticated using (true);
drop policy if exists "Authenticated users can update locations" on public.locations;
create policy "Authenticated users can update locations" on public.locations for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can insert locations" on public.locations;
create policy "Authenticated users can insert locations" on public.locations for insert to authenticated with check (true);

drop policy if exists "Authenticated users can read reports" on public.field_reports;
create policy "Authenticated users can read reports" on public.field_reports for select to authenticated using (true);
drop policy if exists "Users can submit reports" on public.field_reports;
create policy "Users can submit reports" on public.field_reports for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Authenticated users can review reports" on public.field_reports;
create policy "Authenticated users can review reports" on public.field_reports for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can read alerts" on public.alerts;
create policy "Authenticated users can read alerts" on public.alerts for select to authenticated using (true);
drop policy if exists "Users can create alerts" on public.alerts;
create policy "Users can create alerts" on public.alerts for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read sensor readings" on public.sensor_readings;
create policy "Authenticated users can read sensor readings" on public.sensor_readings for select to authenticated using (true);
drop policy if exists "Users can create sensor readings" on public.sensor_readings;
create policy "Users can create sensor readings" on public.sensor_readings for insert to authenticated with check (auth.uid() = user_id);

-- Optional: enable realtime for the live dashboard after the schema is applied.
-- alter publication supabase_realtime add table public.locations, public.field_reports, public.alerts, public.sensor_readings;
