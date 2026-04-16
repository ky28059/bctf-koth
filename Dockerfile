FROM node:24-alpine

WORKDIR /app
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci
COPY . .

CMD ["npm", "run", "server"]
