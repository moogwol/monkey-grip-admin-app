# --- Build stage ---
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

# --- Production stage ---
FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "build/server/index.js"]
