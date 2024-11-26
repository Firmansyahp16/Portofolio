# Gunakan image Node.js sebagai base image
FROM node:22.11.0

# Install pnpm secara global
RUN npm install -g pnpm@9.14.2 && npm cache clean --force

# Set working directory
WORKDIR /usr/src/app

# Salin file package.json dan pnpm-lock.yaml
COPY pnpm-lock.yaml ./

RUN pnpm fetch

# Salin seluruh kode aplikasi
COPY . ./

# Install dependencies menggunakan pnpm
RUN pnpm install --offline

# Build aplikasi LoopBack (jika menggunakan TypeScript)
RUN pnpm build

# Ekspose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["pnpm", "start"]