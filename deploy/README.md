# Production deployment (draft)

**Status: NOT VERIFIED.** The development machine has no Docker, so these files have not been
built or run. Do not mark sandbox production hardening as PASS until the checklist below has
been executed on the target infrastructure.

## Services

| Service        | Contains                         | Secrets it may hold                  |
| -------------- | -------------------------------- | ------------------------------------ |
| `web`          | Next.js                          | none                                 |
| `sandbox`      | Static RUN runner (other domain) | none                                 |
| `api`          | NestJS API, no browser           | `DATABASE_URL`, AI key, worker token |
| `check-worker` | Chromium + CHECK worker service  | worker token only                    |
| `postgres`     | Database                         | database password                    |

`check-worker` is on an internal network that reaches only the API: student code executed by
Chromium cannot reach the database, the internet or the API's environment.

## Checklist (run on real infrastructure)

1. Build: `docker compose -f deploy/docker-compose.prod.yml build`.
2. Non-root: `docker compose exec api id -u` (and every other service) prints `1000`.
3. Read-only root FS: `docker compose exec api touch /app/x` fails; `/tmp` is writable.
4. No capabilities: `grep Cap /proc/1/status` inside each container shows `CapEff: 0000000000000000`.
5. Resource limits: `docker stats` shows the memory limits; a CHECK memory bomb ends as
   ERROR/TIMEOUT while the worker keeps serving.
6. Worker isolation: from `check-worker`, `getent hosts postgres` fails and outbound
   connections to the internet fail; `env` shows no `DATABASE_URL`.
7. Chromium sandbox: a CHECK run returns PASSED/FAILED (not ERROR/ENGINE) with
   `CHECK_CHROMIUM_SANDBOX=true`. If the host forbids user namespaces, enable them or use
   gVisor (`runtime: runsc`) rather than turning the Chromium sandbox off.
8. gVisor (if available): uncomment `runtime: runsc`, rerun step 7 and the CHECK test suite.
9. Edge proxy: overwrites `X-Forwarded-For`; `TRUST_PROXY` lists only the proxy/web hosts.
10. Run `pnpm --filter @webdizayn/sandbox e2e` against the deployed web + sandbox origins
    (`WEB_URL`, `SANDBOX_URL`).

## Migration deployment

Migrations are never run by the API in production (`createApp` skips them when
`NODE_ENV=production`). Run them once per release, before starting the new API version:

```bash
docker compose -f deploy/docker-compose.prod.yml run --rm api node dist/db/migrate.js
# without Docker: pnpm --filter @webdizayn/api db:migrate:prod
```

- `migrate.js` is compiled (no dev dependencies) and takes a Postgres advisory lock, so two
  deploy jobs started at once run the migrations one after the other.
- Migrations are additive; CI fails when `schema.ts` and `drizzle/` drift apart.
- Back up the database (below) before applying a release with migrations.

## First administrator

The seed (`db:seed`) is development-only. In production create the first organization
administrator once, with the password passed from the secret manager (never a file in the repo):

```bash
BOOTSTRAP_ADMIN_LOGIN=admin@example.uz BOOTSTRAP_ADMIN_NAME="Ism Familiya" \
BOOTSTRAP_ADMIN_PASSWORD="$(secret-tool …)" \
docker compose -f deploy/docker-compose.prod.yml run --rm -e BOOTSTRAP_ADMIN_LOGIN \
  -e BOOTSTRAP_ADMIN_NAME -e BOOTSTRAP_ADMIN_PASSWORD api node dist/db/bootstrap-admin.js
```

- Does nothing if the organization already has an administrator (safe to re-run).
- The password (12+ characters) is stored as an Argon2id hash, never logged, and must be changed
  on the first sign-in.
- Teachers and students are then created from the admin panel; their temporary passwords are
  shown once (or downloaded once as .xlsx) and are not stored in plain text.

## Electronic textbooks

- `BOOKS_DIR` (`/data/books` in the image, the `books` volume in compose) holds the uploaded
  PDFs and the rendered page images. It is never served directly: pages go out only through
  `GET /books/:id/pages/:n` with a session, a signed URL and a per-request watermark.
- `BOOK_URL_SECRET` (32+ characters, from the secret manager) is **required in production**.
  Every API instance must use the same value, otherwise a URL signed by one instance is
  rejected by another. Rotating it only invalidates page URLs issued in the last 5 minutes.
- Rendering runs in a child process of the API (no database URL or secrets in its env,
  768 MB heap, `BOOK_PROCESS_TIMEOUT_MS`), one book at a time per instance. Books left in
  `PROCESSING` are re-queued when an instance starts — with several instances, upload through
  one admin at a time or move rendering to a dedicated worker.
- A database row without its files (or the reverse) shows as a broken book: restore the
  volume snapshot and the dump from the same night.

## Backups and restore

Strategy (status: **documented, not exercised** on real infrastructure):

| What               | How                                                            | Retention          |
| ------------------ | -------------------------------------------------------------- | ------------------ |
| Nightly full dump  | `deploy/backup.sh` (`pg_dump -Fc`), copied to off-site storage | 14 daily, 8 weekly |
| Point-in-time      | Managed Postgres PITR / WAL archiving where available          | 7 days             |
| Before each deploy | `deploy/backup.sh` with a `pre-deploy` label                   | until next deploy  |
| Textbook files     | Snapshot of the `books` volume (`BOOKS_DIR`), same schedule    | as the dumps       |

- Dumps contain student work and personal data: store them encrypted, in the same
  jurisdiction as the database, with access limited to operators.
- **Restore drill (monthly):** restore the latest dump into a scratch database, run
  `db:migrate:prod` against it, start an API on it and run `GET /health/ready`; record the time
  taken (RTO) and the age of the dump (RPO).

```bash
pg_restore --clean --if-exists --no-owner -d "$RESTORE_DATABASE_URL" webdizayn-<stamp>.dump
```

## Monitoring

- `GET /health` (liveness) and `GET /health/ready` (database required; CHECK worker reported).
- `GET /metrics` (Prometheus text) when `METRICS_TOKEN` is set; scrape with
  `Authorization: Bearer <token>`. Request counts by status class, request duration,
  CHECK queue depth, memory and uptime.
- Logs: one JSON object per line on stdout/stderr (`LOG_FORMAT=json`, default in production),
  each request with `requestId` (also returned as `X-Request-Id` and inside 500 responses).
  Cookies, request bodies, query strings and client IPs are never logged.
- Suggested alerts: readiness failing, 5xx rate, `check_queue_pending` growing, CHECK ERROR
  rate, `ai.output_blocked` audit events.
