# 🍔 Food Ordering System — Backend

REST API backend untuk sistem pemesanan makanan, dibangun dengan **Express.js v5**, **Prisma ORM**, dan **PostgreSQL**.

---

## 📋 Tech Stack

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | v5 | Web framework |
| **Prisma** | v6.19 | ORM untuk PostgreSQL |
| **PostgreSQL** | 15+ | Relational database |
| **bcryptjs** | v3 | Password hashing |
| **jsonwebtoken** | v9 | JWT authentication |
| **multer** | v2 | File upload handling |
| **nodemon** | v3 | Hot reload (dev) |

---

## 📁 Struktur Folder

```
backend/
├── server.js                 # Entry point — Express server (port 5000)
├── prisma.config.ts          # Konfigurasi Prisma
├── .env                      # Environment variables (tidak di-commit)
├── .env.example              # Template environment variables
├── prisma/
│   ├── schema.prisma         # Database schema (Product & User)
│   └── migrations/           # Migration history
└── src/
    ├── lib/
    │   └── prisma.js         # Prisma Client instance
    ├── config/
    │   └── db.js             # Database config (legacy)
    ├── controllers/
    │   ├── authController.js     # Login & Register logic
    │   └── productController.js  # CRUD Product logic
    ├── middleware/
    │   ├── authMiddleware.js     # JWT token verification
    │   └── uploadMiddleware.js   # Multer file upload config
    └── routes/
        ├── authRoutes.js         # Auth endpoints
        └── productRoutes.js      # Product endpoints
```

---

## 🚀 Cara Running

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** v18 atau lebih baru → [Download](https://nodejs.org)
- **PostgreSQL** v15 atau lebih baru

#### Install PostgreSQL (macOS via Homebrew)

```bash
brew install postgresql@17
brew services start postgresql@17
```

---

### Step 1: Clone & Masuk ke Folder Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Copy file `.env.example` menjadi `.env`, lalu sesuaikan nilainya:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Sesuaikan dengan credential PostgreSQL kamu
DATABASE_URL="postgresql://your_username@localhost:5432/food_ordering"

# Ganti dengan secret key random
JWT_SECRET="ganti-dengan-string-random-yang-kuat"
```

> **💡 Tips:** Di macOS (Homebrew), default user PostgreSQL = username macOS kamu, tanpa password.
> Contoh: `postgresql://nurrohmanmarduki@localhost:5432/food_ordering`

### Step 4: Buat Database PostgreSQL

```bash
createdb food_ordering
```

Atau via `psql`:

```bash
psql -U your_username -c "CREATE DATABASE food_ordering;"
```

### Step 5: Generate Prisma Client & Jalankan Migrasi

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi untuk membuat tabel di database
npx prisma migrate deploy
```

> **💡 Tips:** Untuk melihat isi database via browser, jalankan:
> ```bash
> npx prisma studio
> ```

### Step 6: (Opsional) Buat Folder Uploads

Folder ini digunakan untuk menyimpan file gambar yang di-upload:

```bash
mkdir -p uploads
```

### Step 7: Jalankan Server

```bash
# Development mode (hot reload dengan nodemon)
npm run dev

# Production mode
npm start
```

✅ Server berjalan di **http://localhost:5000**

Untuk verifikasi, buka browser atau jalankan:

```bash
curl http://localhost:5000
# Output: "Backend Berjalan"
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/auth/register` | ❌ | Registrasi user baru |
| `POST` | `/api/auth/login` | ❌ | Login, return JWT token |

#### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Register berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Products (Memerlukan JWT Token)

Semua endpoint product memerlukan header `Authorization: Bearer <token>`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/products` | List semua produk |
| `GET` | `/api/products?search=nasi` | Cari produk by nama |
| `POST` | `/api/products` | Buat produk baru |
| `GET` | `/api/products/:id` | Detail produk by ID |
| `PUT` | `/api/products/:id` | Update produk |

#### Contoh: Get All Products

```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Contoh: Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Nasi Goreng",
    "description": "Nasi goreng spesial",
    "price": 25000,
    "stock": 50
  }'
```

---

### Static Files

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/uploads/*` | Akses file yang sudah di-upload |

---

## 🗄️ Database Schema

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│           Product               │    │             User                │
├─────────────────────────────────┤    ├─────────────────────────────────┤
│ id          Int (PK, Auto)      │    │ id        Int (PK, Auto)       │
│ name        String              │    │ name      String               │
│ description String?             │    │ email     String (Unique)      │
│ price       Float               │    │ password  String (Hashed)      │
│ image       String?             │    │ role      String (default:USER)│
│ stock       Int (default: 0)    │    │ createdAt DateTime             │
│ createdAt   DateTime            │    │                                │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

---

## 🛠️ Scripts

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| `npm run dev` | `nodemon server.js` | Development mode dengan hot reload |
| `npm start` | `node server.js` | Production mode |
