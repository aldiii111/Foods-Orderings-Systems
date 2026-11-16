#!/bin/sh
set -e

echo "Menghubungkan ke database..."
# Push skema prisma ke PostgreSQL
npx prisma db push --skip-generate

# Jalankan seeder jika AUTO_SEED diatur ke true
if [ "$AUTO_SEED" = "true" ]; then
  echo "Menjalankan database seed..."
  npm run seed || echo "Seed gagal atau data sudah ada."
fi

echo "Ready to. run backend server..."
exec "$@"
