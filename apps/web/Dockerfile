# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application files
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]