# MARCOS

Premium trading-community website built with Next.js, React, TypeScript,
Tailwind CSS and GSAP.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftilinkkr%2Fmarcoswebsite&project-name=marcos&repository-name=marcoswebsite)

The public website and bundled Insights article deploy without credentials.
Supabase powers production submissions, admin authentication, blog publishing,
private uploads and application audit events after the documented environment
variables and migration are configured.

## One-click Vercel deployment

1. Select **Deploy with Vercel** above.
2. Connect the GitHub account that can access this repository.
3. Keep the detected framework as **Next.js**.
4. Deploy. No output-directory override is required.

For the correct production canonical URL, add:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Apply the migration and follow [`supabase/README.md`](./supabase/README.md).
Keep the Supabase service-role key, cron secret, Upstash credentials, payment
provider secrets and webhook secrets server-side.

See [`.env.example`](./.env.example) for optional analytics, monitoring,
Supabase, Redis and future payment-provider configuration.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add local credentials only when a
service is enabled.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run test:stress
npm run test:e2e
npm run build
```

The legacy FastAPI prototype is retained in [`backend/`](./backend/README.md)
for reference and tests, but it is not bundled into or trusted by the Vercel
production deployment.
