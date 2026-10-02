FROM node:24.20.0-alpine AS build

WORKDIR /app

# @prisma/client necesita openssl
RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
# prisma generate exige que DATABASE_URL exista, aunque no conecta a la base.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build
RUN npm prune --omit=dev

FROM node:24.20.0-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]
