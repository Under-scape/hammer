# Étape 1 : Build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm clean-install

COPY . .
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "5000"]
