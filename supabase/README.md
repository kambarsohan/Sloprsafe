# Supabase setup

1. Open the SQL editor for the SlopeSafe NER Supabase project.
2. Run `schema.sql` in full.
3. Confirm Email provider is enabled under Authentication → Providers.
4. Add the deployed site URL under Authentication → URL Configuration if email confirmation is enabled.
5. Deploy the Vite app with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` set in the hosting environment.

The client uses only the publishable key. Row-level security policies require an authenticated user for monitoring data access and associate new reports, alerts, and sensor readings with that user's Auth ID.
