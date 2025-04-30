# --- Frontend (Next.js) Dockerfile ---

# 1단계: 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# 2단계: 실행 단계
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
