# syntax=docker/dockerfile:1.7
# Combat Sports Intelligence — Socket.io Realtime Service
# Multi-stage build for production

ARG NODE_VERSION=20
ARG PNPM_VERSION=9.1.0

# ─── Stage 1: base ────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# ─── Stage 2: deps ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY apps/realtime-service/package.json ./apps/realtime-service/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ─── Stage 3: builder ─────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/realtime-service/node_modules ./apps/realtime-service/node_modules

COPY turbo.json ./
COPY packages/types/ ./packages/types/
COPY packages/config/ ./packages/config/
COPY apps/realtime-service/ ./apps/realtime-service/

RUN pnpm --filter @combat-sports/realtime-service build

# ─── Stage 4: runner ──────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 socketio

COPY --from=builder --chown=socketio:nodejs /app/apps/realtime-service/dist ./dist
COPY --from=builder /app/apps/realtime-service/node_modules ./node_modules
COPY --from=builder /app/apps/realtime-service/package.json ./

USER socketio

EXPOSE 5000
ENV PORT=5000

CMD ["node", "dist/index.js"]
