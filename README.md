# MARCOS

Premium trading-community website built with Next.js, React, TypeScript,
Tailwind CSS and GSAP.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftilinkkr%2Fmarcoswebsite&project-name=marcos&repository-name=marcoswebsite)

The public website and bundled Insights article deploy without credentials.
Contact, team-application and checkout submissions remain unavailable until the
separate FastAPI service has been deployed and its public HTTPS URL is added to
Vercel.

## One-click Vercel deployment

1. Select **Deploy with Vercel** above.
2. Connect the GitHub account that can access this repository.
3. Keep the detected framework as **Next.js**.
4. Deploy. No output-directory override is required.

For the correct production canonical URL, add:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

When the API is deployed, add both:

```text
NEXT_PUBLIC_MARCOS_API_URL=https://api.your-domain.example
MARCOS_API_URL=https://api.your-domain.example
```

Set the backend `APP_BASE_URL` to the exact Vercel production origin. Keep
`MARCOS_ADMIN_KEY`, database credentials, Supabase service-role keys, payment
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
npm run test:e2e
npm run build
```

The FastAPI source is retained in [`backend/`](./backend/README.md), but it is
not bundled into the Vercel frontend deployment. Production backend storage
must use PostgreSQL rather than the included local SQLite setup.
