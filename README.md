# SlopeSafe NER

SlopeSafe NER is an authenticated landslide-risk monitoring workspace for the North Eastern Region of India. It uses React, Vite, Leaflet, Recharts, and Supabase Auth plus Postgres. Reports, alerts, editable location indicators, and soil-moisture readings are stored in Supabase for access across signed-in sessions.

## Run locally

```bash
pnpm install
pnpm dev
```

The project uses the Supabase values supplied for this workspace. The local development environment is configured through `.env.local`; for another environment, provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` through the hosting provider's environment settings.

## One-time Supabase setup

Open the Supabase SQL editor for `qdhzhluhjxtuklddzhle` and run [`supabase/schema.sql`](./supabase/schema.sql). This creates the `locations`, `field_reports`, `alerts`, and `sensor_readings` tables, indexes, and row-level security policies. The first signed-in session seeds the ten NER location records if the locations table is empty.

Email/password authentication is handled by Supabase Auth. Depending on the project's Auth settings, new accounts may need to confirm their email before the first sign-in.

## Features

- Email/password registration and login.
- Dashboard with risk counts, rainfall chart, alert queue, and moisture watch.
- Leaflet risk map with North East India locations, filters, risk legend, and location detail links.
- Location details with automatic four-indicator risk calculation: rainfall, slope, soil moisture, and past landslide history.
- Weather summary cards for all ten NER locations.
- Soil-moisture monitoring page with readings stored in Supabase.
- Validated field reports stored in Supabase and a review queue for authenticated operators.
- Location administration table where editing rainfall, slope, past landslide history, or moisture automatically recalculates the saved risk level.
- Vercel SPA rewrite in `vercel.json` for direct route refreshes.

## Risk rules

High risk is calculated when high rainfall and high slope combine, when a past landslide is paired with rainfall of at least 90 mm, or when saturated soil moisture is paired with rainfall of at least 90 mm. Medium risk is exactly one active indicator. Low risk is no active indicator. Soil moisture is classified as Dry below 40%, Moist from 40% through 69%, and Saturated at 70% or above.

## Validation

```bash
pnpm vitest run client/src/lib/supabase.test.ts
pnpm run check
pnpm run build
```
