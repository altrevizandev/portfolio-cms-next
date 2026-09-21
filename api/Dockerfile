FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install --global pnpm@10.33.0 --fetch-retries=5 --fetch-retry-mintimeout=10000 --fetch-retry-maxtimeout=60000
RUN pnpm install --frozen-lockfile

# DEV

FROM base AS dev

COPY . .

EXPOSE 3333

CMD ["pnpm", "dev"]

# BUILD

FROM base AS build

COPY . .

RUN pnpm exec prisma generate
RUN pnpm run build

# PROD

FROM base AS prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src/services/email/templates ./dist/src/services/email/templates
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=build /usr/src/app/package.json ./package.json


EXPOSE 3333

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm exec prisma generate && pnpm exec prisma db seed && node dist/src/server.js"]
