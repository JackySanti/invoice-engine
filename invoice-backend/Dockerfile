# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./

# Skip Puppeteer's bundled Chrome download during npm install
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

# Install system Chromium + required shared libraries for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnspr4 \
    libnss3 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 5000

CMD ["node", "dist/main"]
