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
