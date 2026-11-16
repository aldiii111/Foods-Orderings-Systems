FROM node:20-alpine

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package definitions
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (termasuk ts-node & devDeps untuk compile & seed)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Buat folder uploads
RUN mkdir -p uploads

# Salin script entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
