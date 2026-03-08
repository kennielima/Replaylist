FROM node:18-alpine AS dev
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma
RUN npm install
RUN npm run prisma:generate
COPY . .
EXPOSE 4001
CMD ["npm", "run", "dev"]

FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN npm install
RUN npm run prisma:generate

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/generated ./generated

# RUN npm install --production
# CMD ["node", "dist/index.js"]
EXPOSE 3000
CMD ["npm", "start"]