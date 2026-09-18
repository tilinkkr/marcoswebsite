# MARCOS legacy checkout backend

This prototype is not deployed by Vercel and is not part of the production
trust boundary. Production submissions and administration use the Next.js
route handlers and Supabase schema in the repository root.

FastAPI + SQLAlchemy 2 checkout evidence service for membership and indicator orders. SQLite is the development database; application code uses portable ORM types and can move to PostgreSQL through `DATABASE_URL`.

## Local development

```powershell
cd backend
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements-dev.txt
.venv\Scripts\alembic upgrade head
.venv\Scripts\python seed.py
.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

The development API reference is available at `http://localhost:8000/docs`. Production mode disables it.

The current fixed-window limiter is process-local and suitable only for this mock single-process service. Replace it with a shared Redis/Upstash-backed limiter before horizontal production deployment.

## Configuration

- `DATABASE_URL=sqlite:///./marcos.db`
- `APP_BASE_URL=http://localhost:3000` controls the single allowed browser origin.
- `MARCOS_ADMIN_KEY` has no fallback and is required only when running this legacy service locally. Never expose it to the browser.

The risk policy has one source in `app/policy.py`. Update `RISK_POLICY_VERSION` whenever approved wording changes. Keep the matching frontend display version in sync. The policy, consent state, server-resolved price, UTC acceptance time and identity details are snapshotted per agreement.

## Payment verification

Customer submission only moves an order to `payment_submitted`. It never grants access. An authorized operator calls `POST /api/v1/admin/payments/{payment_id}/decision` with `X-Admin-Key` after checking the real business payment account. The frontend uses the business-supplied `/public/images/payments/marcos-upi-qr.png` asset.

## SQLite to PostgreSQL

1. Provision PostgreSQL and back up existing records.
2. Set `DATABASE_URL=postgresql+psycopg://user:password@host/database`.
3. Install the included `psycopg` driver and run `alembic upgrade head`.
4. Run the backend test suite against a disposable PostgreSQL database, then migrate data through a reviewed export/import process.

`LargeBinary` maps SQLite BLOB to PostgreSQL BYTEA without application changes. At production scale, move PDF/screenshot bytes to private object storage and retain protected metadata, hashes and object keys in the database.

## Privacy, retention and legal review

Agreement PDFs, IP addresses, user agents and payment screenshots are personal data. Define access controls, retention/deletion schedules, breach handling and regional privacy obligations before launch. PDFs are returned only with an unguessable order token and `no-store` headers.

`LEGAL_REVIEW_REQUIRED`: qualified counsel must approve Terms, Risk Disclosure, Privacy, Refund/Cancellation policy, electronic acceptance wording and retention policy before production. The current technical acknowledgement does not itself establish legal compliance.

## Load testing

Locust is the only load-test runner. With the API running:

```powershell
.venv\Scripts\locust -f locustfile.py --headless -u 10 -r 5 -t 15s --host http://localhost:8000
```

SQLite is development storage. Its write-concurrency limits mean local throughput is not a production capacity estimate. Use PostgreSQL for production multi-user writes; the database URL and Alembic migrations remain configuration-driven.
