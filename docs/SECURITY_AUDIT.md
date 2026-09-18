# MARCOS security audit

## [Vulnerability Finding] Undeployed API dependency — High — CWE-693 / OWASP A05

**Reference:** `src/components/forms/ContactForm.tsx`, `TeamApplicationForm.tsx`, and `CheckoutFlow.tsx` previously sent customer data to `NEXT_PUBLIC_MARCOS_API_URL`, while `.vercelignore` excludes `backend/`.

**Exploit mechanism:** Production submissions failed or could be redirected to an incorrectly configured public endpoint. A public API base URL also expanded the CORS and perimeter surface.

**Hardened replacement:** All forms now use same-origin Next.js route handlers. Server routes validate origin, body size, rate limit, Zod schema, and file signatures before server-only Supabase writes.

## [Vulnerability Finding] Shared static administrator key with insecure fallback — Critical — CWE-798 / OWASP A07

**Reference:** `backend/app/config.py` previously defaulted `MARCOS_ADMIN_KEY` to `development-only-change-me`; legacy admin endpoints accepted `X-Admin-Key`.

**Exploit mechanism:** A missing production secret resulted in a predictable administrative credential. Shared keys have no individual identity, revocation, MFA context, or reliable attribution.

**Hardened replacement:** The fallback was removed. The production admin uses Supabase Auth cookie sessions, a three-email server allowlist, `admin_users`, fresh `getUser()` verification, and RLS-backed authorization. The legacy backend remains excluded from Vercel.

## [Vulnerability Finding] Missing CSP and permissive framing — High — CWE-79/CWE-1021 / OWASP A03

**Reference:** `src/lib/security/headers.ts` lacked CSP and used `X-Frame-Options: SAMEORIGIN`.

**Exploit mechanism:** Injection bugs would have fewer browser-side restrictions, and same-origin framing could support clickjacking in a compromised sibling route.

**Hardened replacement:** A restrictive CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, HSTS, COOP, CORP, no-sniff, strict referrer policy, and restrictive permissions policy are applied globally. `unsafe-inline` remains for Next.js runtime compatibility; moving to per-request nonces would force dynamic rendering and materially harm the animation-heavy public site.

## [Vulnerability Finding] Public form abuse and oversized uploads — High — CWE-770/CWE-400 / OWASP A04

**Reference:** public form clients previously depended on the legacy backend and had no Vercel-layer distributed throttle.

**Exploit mechanism:** Automated requests could consume database, function, and storage resources; MIME labels could be spoofed.

**Hardened replacement:** Upstash sliding-window limits, fail-closed production behavior, content-length caps, honeypot handling, file byte signatures, private buckets, randomized object paths, and short-lived signed attachment URLs.

## [Vulnerability Finding] Insufficient database authorization boundary — High — CWE-862 / OWASP A01

**Reference:** no deployed Supabase schema or RLS policy existed.

**Exploit mechanism:** A future table exposed through the Data API could leak or permit unauthorized mutation if grants and RLS were omitted.

**Hardened replacement:** Every public-schema table has RLS enabled. Public roles can only select published blogs. Admin policies call a fixed-search-path private authorization function. Service-role access exists only in `server-only` modules and route handlers.

## [Vulnerability Finding] Incomplete operational audit trail — Medium — CWE-778 / OWASP A09

**Reference:** legacy shared-key administration could not reliably identify an actor.

**Exploit mechanism:** Blog, submission, and authorization changes could not be attributed or investigated.

**Hardened replacement:** Immutable database triggers record table mutations; route handlers add actor, pseudonymized IP, user agent, action, and safe metadata. Full authentication events should be enabled in Supabase Auth Audit Logs. Sensitive form payloads are not copied into audit metadata.

## Network and DNS hardening

- Vercel already serves as the reverse proxy and hides a fixed application origin; there is no customer-controlled origin IP to expose.
- Keep TLS/HSTS on Vercel and enable Vercel Firewall managed rules, bot protection, and request challenge rules for `/admin`, `/api/admin/*`, and public form endpoints.
- Enable DNSSEC at the registrar after `markos.in` finishes WHOIS verification and becomes publicly delegated.
- Do not place Cloudflare in front of Vercel merely to “hide an IP”; it adds a second TLS/DNS control plane without hiding a dedicated origin. If Cloudflare is adopted later, restrict traffic with authenticated origin pulls or a verified shared header and document ownership of redirects, caching, and WAF rules.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, Upstash credentials, payment secrets, or the IP hash salt through `NEXT_PUBLIC_*` variables.

## Remaining operator actions

- Revoke the OpenAI API key that was pasted into chat history and create a replacement; it was not found in the repository.
- Configure Supabase and Vercel secrets, invite the three admins, apply the migration, and enable Auth Audit Logs.
- Configure Vercel Firewall rules in the dashboard; perimeter mutations were not made without explicit rule approval.
- Run `npm run test:stress` against production after the database is populated. Pass `STRESS_ADMIN_COOKIE` only through a local environment variable and never commit it.
