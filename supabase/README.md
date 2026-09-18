# MARCOS Supabase setup

1. Create a Supabase project and apply the migration in `supabase/migrations` with the Supabase CLI.
2. In Authentication settings, disable public sign-ups and anonymous sign-ins. Keep email confirmation enabled.
3. Invite exactly three administrators through Authentication > Users.
4. Set `MARCOS_ADMIN_EMAILS` in Vercel to those exact three lowercase email addresses.
5. Set the Supabase URL, publishable key, and service-role key in Vercel. The service-role key is server-only.
6. Set random values for `CRON_SECRET` (at least 32 bytes), `AUDIT_IP_HASH_SALT`, and the Upstash REST credentials.
7. Enable database-backed Auth Audit Logs in Supabase if sign-in event visibility is required.
8. Redeploy production. The first authorized sign-in creates the matching `admin_users` row. The database trigger refuses a fourth active admin.

The Vercel cron calls `/api/cron/supabase-heartbeat` daily. The operation is an idempotent upsert, so duplicate delivery is safe. Daily scheduling avoids the month-boundary gaps produced by `*/6` day-of-month cron expressions and guarantees activity within six days when Vercel delivery succeeds.
