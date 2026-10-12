# syntax=docker/dockerfile:1.7
# One multi-stage file, one target per service:
#   docker build -f deploy/Dockerfile --target api .
#   docker build -f deploy/Dockerfile --target check-worker .
#   docker build -f deploy/Dockerfile --target web .
#   docker build -f deploy/Dockerfile --target sandbox .
# NOT VERIFIED in the development environment (no Docker there). Build and run the
# hardening checklist in deploy/README.md before relying on it.

ARG NODE_IMAGE=node:24-bookworm-slim

# ---------------------------------------------------------------- build
FROM ${NODE_IMAGE} AS build
RUN npm install -g pnpm@12.9.1
WORKDIR /src
COPY . .
RUN pnpm install --frozen-lockfile \
 && pnpm --filter @webdizayn/shared build \
 && pnpm --filter @webdizayn/check-engine build \
 && pnpm --filter @webdizayn/api build \
 && pnpm --filter @webdizayn/web build \
 && pnpm install --frozen-lockfile --prod --config.confirmModulesPurge=false

# Common runtime base: no shell tools beyond the slim image, non-root user `node` (uid 1000).
FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
WORKDIR /app
USER node

# ---------------------------------------------------------------- api
# No browser here: CHECK runs in the separate check-worker (CHECK_ENGINE=remote).
FROM runtime AS api
COPY --from=build --chown=root:root /src/node_modules ./node_modules
COPY --from=build --chown=root:root /src/packages ./packages
COPY --from=build --chown=root:root /src/apps/api ./apps/api
WORKDIR /app/apps/api
ENV CHECK_ENGINE=remote
EXPOSE 4000
CMD ["node", "dist/main.js"]

# ---------------------------------------------------------------- check worker
# Chromium + the worker service only. It holds no database URL and no app secrets.
FROM ${NODE_IMAGE} AS check-worker
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-dejavu-core \
 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production \
    CHECK_CHROME_PATH=/usr/bin/chromium \
    HOST=0.0.0.0 \
    PORT=4100
WORKDIR /app
COPY --from=build --chown=root:root /src/node_modules ./node_modules
COPY --from=build --chown=root:root /src/packages ./packages
USER node
EXPOSE 4100
CMD ["node", "packages/check-engine/dist/server-main.js"]

# ---------------------------------------------------------------- web
FROM runtime AS web
COPY --from=build --chown=root:root /src/node_modules ./node_modules
COPY --from=build --chown=root:root /src/packages ./packages
COPY --from=build --chown=root:root /src/apps/web ./apps/web
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]

# ---------------------------------------------------------------- sandbox (RUN preview origin)
FROM runtime AS sandbox
COPY --from=build --chown=root:root /src/apps/sandbox ./apps/sandbox
WORKDIR /app/apps/sandbox
ENV SANDBOX_HOST=0.0.0.0 SANDBOX_PORT=3100
EXPOSE 3100
CMD ["node", "src/main.js"]
