# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web ./apps/web
RUN npm install -g pnpm@10.6.4 && pnpm install --frozen-lockfile
RUN pnpm --filter web build

# Production stage
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN npm install -g pnpm@10.6.4 && pnpm --dir apps/web install --prod --frozen-lockfile
WORKDIR /app/apps/web
ENV PORT=8000
EXPOSE 8000
# Explicitly disable entrypoint to prevent npm run start
ENTRYPOINT []
# Debug and run pnpm start
CMD ["/bin/sh", "-c", "echo 'Running pnpm start' && pnpm --version && pnpm --filter web start"]