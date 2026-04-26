# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=${VITE_API_URL}

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
RUN npm install -g serve@14
WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4173/ || exit 1

CMD ["serve", "-s", "dist", "-l", "4173"]
