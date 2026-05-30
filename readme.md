# 🍔 Food Ordering System

Aplikasi full-stack sistem pemesanan makanan dengan fitur autentikasi, manajemen produk, dan upload gambar.

---

## 🏗️ Arsitektur

```
Foods-Orderings-Systems/
├── backend/          → REST API (Express.js + Prisma + PostgreSQL)
├── frontend/         → Web Client (React + TypeScript + Vite + TailwindCSS)
└── readme.md         → Dokumentasi ini
```

```
┌──────────────────┐       HTTP        ┌──────────────────┐       SQL        ┌──────────────────┐
│                  │   (port 5173)     │                  │   (port 5432)    │                  │
│     Frontend     │ ───────────────── │     Backend      │ ──────────────── │   PostgreSQL     │
│   React + Vite   │   Axios / REST    │   Express.js     │     Prisma       │   Database       │
│                  │                   │   (port 5000)    │                  │                  │
└──────────────────┘                   └──────────────────┘                  └──────────────────┘
```

---

## 📋 Tech Stack

### Backend
| Teknologi | Deskripsi |
|-----------|-----------|
| **Express.js v5** | Web framework REST API |
| **Prisma v6** | ORM untuk PostgreSQL |
| **PostgreSQL** | Relational database |
| **JWT** | Autentikasi berbasis token |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |

### Frontend
| Teknologi | Deskripsi |
|-----------|-----------|
| **React 19** | UI Library |
| **TypeScript** | Type-safe JavaScript |
| **Vite v8** | Build tool & dev server |
| **TailwindCSS v4** | Utility-first CSS |
| **ShadCN UI** | Component library (radix-nova) |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |

---

## ✨ Fitur

- 🔐 **Autentikasi** — Register & Login dengan JWT
- 🛒 **Manajemen Produk** — CRUD produk makanan (nama, deskripsi, harga, stok)
- 🔍 **Pencarian** — Cari produk berdasarkan nama
- 📷 **Upload Gambar** — Upload gambar produk via Multer
- 🎨 **Design System** — UI premium dengan dark mode support
- 🛡️ **Role-based** — Sistem role User (default) untuk kontrol akses

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ → [Download](https://nodejs.org)
- **PostgreSQL** v15+ → Lihat panduan install di bawah
- **Git** → [Download](https://git-scm.com)

#### Install PostgreSQL

<details>
<summary><strong>🍎 macOS</strong></summary>

```bash
# Via Homebrew
brew install postgresql@17
brew services start postgresql@17
```

</details>

<details>
<summary><strong>🪟 Windows</strong></summary>

1. Download installer dari [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Jalankan installer, ikuti wizard (catat password yang diset untuk user `postgres`)
3. Pastikan centang **pgAdmin** dan **Command Line Tools**
4. PostgreSQL akan otomatis berjalan sebagai Windows Service

Atau via **Chocolatey**:
```powershell
choco install postgresql17
```

</details>

<details>
<summary><strong>🐧 Linux (Ubuntu/Debian)</strong></summary>

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

</details>

### 1. Clone Repository

```bash
git clone https://github.com/aldiii111/Foods-Orderings-Systems.git
cd Foods-Orderings-Systems
```

### 2. Setup Database

**macOS / Linux:**
```bash
createdb food_ordering
```

**Windows (Command Prompt / PowerShell):**
```powershell
# Jika PostgreSQL ada di PATH:
createdb -U postgres food_ordering

# Atau via psql:
psql -U postgres -c "CREATE DATABASE food_ordering;"
```

> **💡 Note:** Di Windows, kamu akan diminta memasukkan password `postgres` yang diset saat instalasi.

### 3. Setup & Jalankan Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env dari template
cp .env.example .env
# Edit .env → sesuaikan DATABASE_URL dan JWT_SECRET

# Generate Prisma Client & jalankan migrasi
npx prisma generate
npx prisma migrate deploy

# Jalankan server
npm run dev
```

✅ Backend berjalan di **http://localhost:5000**

### 4. Setup & Jalankan Frontend

```bash
cd frontend

# Install dependencies
npm install

# Buat file .env dari template
cp .env.example .env

# Jalankan dev server
npm run dev
```

✅ Frontend berjalan di **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/auth/register` | ❌ | Registrasi user baru |
| `POST` | `/api/auth/login` | ❌ | Login, return JWT token |
| `GET` | `/api/products` | ✅ | List semua produk |
| `GET` | `/api/products?search=keyword` | ✅ | Cari produk by nama |
| `POST` | `/api/products` | ✅ | Buat produk baru |
| `GET` | `/api/products/:id` | ✅ | Detail produk by ID |
| `PUT` | `/api/products/:id` | ✅ | Update produk |

> Dokumentasi API lengkap tersedia di [`backend/readme.md`](./backend/readme.md)

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

## 📖 Dokumentasi Detail

| Dokumen | Deskripsi |
|---------|-----------|
| [`backend/readme.md`](./backend/readme.md) | Setup backend, API docs, contoh curl |
| [`frontend/readme.md`](./frontend/readme.md) | Setup frontend, design system, panduan development |

---

## 👥 Tim

Dibangun oleh tim **Foods Ordering Systems**.

## 📄 License

ISC
