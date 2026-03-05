FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY public ./public
COPY .contentlayer ./.contentlayer
COPY content ./content
COPY .env.local ./.env.local
COPY .next/standalone ./
COPY .next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
