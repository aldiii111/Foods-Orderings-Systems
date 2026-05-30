# 🍔 Food Ordering System — Backend

REST API backend untuk sistem pemesanan makanan, dibangun dengan **Express.js v5**, **Prisma ORM**, dan **PostgreSQL**.

---

## 📋 Tech Stack

| Teknologi        | Versi | Deskripsi            |
| ---------------- | ----- | -------------------- |
| **Node.js**      | 18+   | JavaScript runtime   |
| **Express.js**   | v5    | Web framework        |
| **Prisma**       | v6.19 | ORM untuk PostgreSQL |
| **PostgreSQL**   | 15+   | Relational database  |
| **bcryptjs**     | v3    | Password hashing     |
| **jsonwebtoken** | v9    | JWT authentication   |
| **multer**       | v2    | File upload handling |
| **nodemon**      | v3    | Hot reload (dev)     |

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

#### Install PostgreSQL

<details>
<summary><strong>🍎 macOS (Homebrew)</strong></summary>

```bash
# Install PostgreSQL
brew install postgresql@17

# Jalankan sebagai background service
brew services start postgresql@17
```

**Username PostgreSQL di macOS:**

Saat install via Homebrew, PostgreSQL **otomatis membuat user dengan nama yang sama dengan username macOS kamu, tanpa password**. Untuk cek username macOS kamu:

```bash
whoami
# Contoh output: johndoe
```

Jadi `DATABASE_URL` kamu akan seperti ini (tanpa password):

```
postgresql://johndoe@localhost:5432/food_ordering
```

> **⚠️ macOS Tip:** Port **5000** biasanya sudah dipakai oleh **AirPlay Receiver**. Jika kamu mengalami masalah koneksi, pastikan backend berjalan di port lain (misalnya 5001). Cek di `server.js`.

</details>

<details>
<summary><strong>🪟 Windows</strong></summary>

1. Download installer dari [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Jalankan installer dan ikuti wizard
3. **PENTING:** Saat installer meminta password, **catat baik-baik password ini** — kamu akan membutuhkannya untuk `DATABASE_URL`
4. Pastikan centang **pgAdmin** dan **Command Line Tools** saat instalasi
5. PostgreSQL akan otomatis berjalan sebagai Windows Service

Atau via **Chocolatey**:

```powershell
choco install postgresql17
```

**Username PostgreSQL di Windows:**

Saat install di Windows, PostgreSQL membuat user default bernama **`postgres`** dan kamu diminta memasukkan password saat instalasi.

```
# Format DATABASE_URL:
postgresql://postgres:PASSWORD_SAAT_INSTALL@localhost:5432/food_ordering
```

Contoh jika password yang kamu set saat install adalah `admin123`:

```
postgresql://postgres:admin123@localhost:5432/food_ordering
```

**Verifikasi koneksi:**

```powershell
# Buka Command Prompt atau PowerShell, lalu:
psql -U postgres

# Jika berhasil masuk, kamu akan melihat prompt:
# postgres=#

# Ketik \q untuk keluar
```

> **⚠️ Windows Tip:** Jika perintah `psql` tidak ditemukan, tambahkan path PostgreSQL ke System PATH:
>
> - Buka **System Environment Variables**
> - Tambahkan `C:\Program Files\PostgreSQL\17\bin` ke variabel **PATH**

</details>

<details>
<summary><strong>🐧 Linux (Ubuntu/Debian)</strong></summary>

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Jalankan dan aktifkan auto-start
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Username PostgreSQL di Linux:**

Saat install di Linux, PostgreSQL membuat system user bernama **`postgres`** tanpa password. Kamu perlu set password terlebih dahulu:

```bash
# Masuk ke PostgreSQL sebagai user postgres
sudo -u postgres psql

# Set password untuk user postgres (ganti 'password_baru' dengan password pilihanmu)
ALTER USER postgres PASSWORD 'password_baru';

# Keluar dari psql
\q
```

Setelah set password, `DATABASE_URL` kamu akan seperti ini:

```
postgresql://postgres:password_baru@localhost:5432/food_ordering
```

**Alternatif:** Buat user baru sesuai username Linux kamu:

```bash
# Cek username Linux kamu
whoami
# Contoh output: john

# Buat PostgreSQL user sesuai username Linux
sudo -u postgres createuser --superuser john

# Setelah ini kamu bisa pakai tanpa password:
# postgresql://john@localhost:5432/food_ordering
```

</details>

---

### 📌 Ringkasan Username PostgreSQL per OS

| OS                   | Default Username                    | Password                             | Contoh DATABASE_URL                                             |
| -------------------- | ----------------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| **macOS** (Homebrew) | Username macOS kamu (cek: `whoami`) | Tidak perlu                          | `postgresql://john@localhost:5432/food_ordering`                |
| **Windows**          | `postgres`                          | Diset saat instalasi                 | `postgresql://postgres:mypassword@localhost:5432/food_ordering` |
| **Linux**            | `postgres`                          | Harus di-set manual via `ALTER USER` | `postgresql://postgres:mypassword@localhost:5432/food_ordering` |

> **💡 Format DATABASE_URL:**
>
> ```
> postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
> ```
>
> - Jika **tanpa password** (macOS): hilangkan `:PASSWORD` → `postgresql://USERNAME@HOST:PORT/DB`
> - Jika **dengan password**: `postgresql://USERNAME:PASSWORD@HOST:PORT/DB`

---

### Step 1: Masuk ke Folder Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Copy file `.env.example` menjadi `.env`, lalu sesuaikan nilainya:

**macOS / Linux:**

```bash
cp .env.example .env
```

**Windows (Command Prompt):**

```cmd
copy .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

Edit file `.env`:

```env
# Sesuaikan dengan credential PostgreSQL kamu (lihat tabel di atas)
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/food_ordering"

# Ganti dengan secret key random
JWT_SECRET="ganti-dengan-string-random-yang-kuat"
```

**Contoh `.env` per OS:**

<details>
<summary><strong>🍎 macOS</strong></summary>

```env
DATABASE_URL="postgresql://johndoe@localhost:5432/food_ordering"
JWT_SECRET="super-secret-jwt-key-12345"
```

</details>

<details>
<summary><strong>🪟 Windows</strong></summary>

```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/food_ordering"
JWT_SECRET="super-secret-jwt-key-12345"
```

</details>

<details>
<summary><strong>🐧 Linux</strong></summary>

```env
DATABASE_URL="postgresql://postgres:password_baru@localhost:5432/food_ordering"
JWT_SECRET="super-secret-jwt-key-12345"
```

</details>

### Step 4: Buat Database PostgreSQL

**macOS / Linux:**

```bash
createdb food_ordering
```

**Windows (Command Prompt / PowerShell):**

```powershell
createdb -U postgres food_ordering
```

Atau via `psql` (semua OS):

```bash
psql -U postgres -c "CREATE DATABASE food_ordering;"
```

### Step 5: Generate Prisma Client & Jalankan Migrasi

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi untuk membuat tabel di database
npx prisma migrate deploy
```

> **💡 Tips:** Untuk melihat isi database via browser, jalankan:
>
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

| Method | Endpoint             | Auth | Deskripsi               |
| ------ | -------------------- | ---- | ----------------------- |
| `POST` | `/api/auth/register` | ❌   | Registrasi user baru    |
| `POST` | `/api/auth/login`    | ❌   | Login, return JWT token |

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

| Method | Endpoint                    | Deskripsi           |
| ------ | --------------------------- | ------------------- |
| `GET`  | `/api/products`             | List semua produk   |
| `GET`  | `/api/products?search=nasi` | Cari produk by nama |
| `POST` | `/api/products`             | Buat produk baru    |
| `GET`  | `/api/products/:id`         | Detail produk by ID |
| `PUT`  | `/api/products/:id`         | Update produk       |

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

| Method | Endpoint     | Deskripsi                       |
| ------ | ------------ | ------------------------------- |
| `GET`  | `/uploads/*` | Akses file yang sudah di-upload |

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

| Script        | Perintah            | Deskripsi                          |
| ------------- | ------------------- | ---------------------------------- |
| `npm run dev` | `nodemon server.js` | Development mode dengan hot reload |
| `npm start`   | `node server.js`    | Production mode                    |
