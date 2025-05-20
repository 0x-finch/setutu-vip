# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server ./apps/server
RUN npm install -g pnpm@10.6.4 && pnpm install --frozen-lockfile
RUN pnpm --filter server build

# Production stage
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN npm install -g pnpm@10.6.4 && pnpm --dir apps/server install --prod --frozen-lockfile
WORKDIR /app/apps/server
ENV PORT=9000
EXPOSE 9000
# Explicitly disable entrypoint to prevent npm run start
ENTRYPOINT []
# Debug and run pnpm start
CMD ["/bin/sh", "-c", "echo 'Running pnpm start' && pnpm --version && pnpm --filter server start"]