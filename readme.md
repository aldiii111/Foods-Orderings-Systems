# Food Ordering & Operations System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

Sistem full-stack manajemen pemesanan makanan dan operasional bisnis F&B (*Food & Beverage*). Aplikasi ini mengintegrasikan portal pemesanan mandiri untuk pelanggan (*customer-facing*) dengan dashboard ERP mini untuk staf dan manajemen (pengendalian stok, penerbitan surat penawaran, serta penagihan faktur).

---

## Daftar Isi
- [Latar Belakang & Solusi](#latar-belakang--solusi)
- [Fitur Utama](#fitur-utama)
- [Sorotan Teknis (Engineering Highlights)](#sorotan-teknis-engineering-highlights)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Skema Basis Data](#skema-basis-data)
- [Panduan Menjalankan](#panduan-menjalankan)
  - [Opsi 1: Docker Compose (Disarankan)](#opsi-1-docker-compose-disarankan)
  - [Opsi 2: Manual (Local Development)](#opsi-2-manual-local-development)
- [Akun Demo Pengujian](#akun-demo-pengujian)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Direktori](#struktur-direktori)
- [Git Workflow & Standar Kolaborasi](#git-workflow--standar-kolaborasi)

---

## Latar Belakang & Solusi

Pada operasional bisnis makanan dan katering skala menengah, pencatatan transaksi kasir sering kali terisolasi dari pencatatan persediaan bahan/menu dan pembuatan faktur tagihan pelanggan. Hal ini berisiko menimbulkan *over-selling*, selisih stok fisik (*shrinkage*), dan keterlambatan penagihan piutang.

Proyek ini dibangun sebagai solusi terpadu dengan menghubungkan tiga pilar operasional:
1. **Transaksional Pelanggan**: Pemesanan langsung melalui katalog interaktif dengan kalkulasi otomatis.
2. **Kontrol Persediaan Real-Time**: Mutasi stok otomatis tercatat setiap kali terjadi penyesuaian atau penjualan, dilengkapi kalkulasi HPP (*Cost Price*) terhadap harga jual.
3. **Siklus Finansial**: Alur dokumen formal dari *Quotation* (penawaran harga untuk pesanan partai besar) hingga penerbitan *Invoice* dan pelacakan termin pembayaran.

---

## Fitur Utama

### 1. Portal Pelanggan (Customer Facing)
- **Katalog Menu Interaktif**: Pencarian menu berdasarkan kata kunci dan filter kategori secara responsif.
- **Keranjang Belanja (*Shopping Cart*)**: Kalkulasi kuantitas, harga, dan subtotal dinamis berbasis *local state*.
- **Checkout & Riwayat Pesanan**: Pengiriman pesanan dan pemantauan riwayat status pemesanan pelanggan.

### 2. Dashboard Operasional (Staff)
- **Ringkasan Penjualan & Notifikasi**: Pemantauan metrik penjualan, grafik performa, dan peringatan dini stok menipis (*low stock alert*).
- **Manajemen Mutasi Stok**: Pencatatan riwayat stok masuk (*in*), stok keluar (*out*), dan *adjustment* opname lengkap dengan riwayat user penanggung jawab.
- **Komersial & Penagihan (Quotation & Invoice)**:
  - Pembuatan dokumen penawaran harga (*quotations*) dengan diskon dan pajak.
  - Pembuatan faktur (*invoices*) dengan status pembayaran (*unpaid*, *partial*, *paid*).
- **Master Data**: Pengelolaan data produk (harga modal, harga jual, barcode, SKU), satuan unit (*pcs*, *porsi*, *cup*), kategori, dan direktori pelanggan.
- **Role-Based Access Control (RBAC)**: Proteksi rute navigasi dan endpoint berdasarkan hak akses user (`staff` dan `customer`).

---

## Sorotan Teknis (Engineering Highlights)

- **End-to-End Type Safety**: Menggunakan TypeScript secara ketat di frontend dan backend dengan Prisma Client untuk menghasilkan tipe skema database yang sinkron otomatis.
- **Decoupled Architecture**: Pemisahan jelas antara Express REST API dan React SPA, memungkinkan skalabilitas independen dan kemudahan integrasi dengan platform lain (seperti mobile app atau mesin POS).
- **Optimized Frontend Performance**: Dibangun menggunakan Vite 8, React 19, TailwindCSS v4, serta komponen headless Radix UI / ShadCN untuk performa rendering dan aksesibilitas maksimal.
- **Production-Ready Containerization**: 
  - Docker multi-stage build untuk memperkecil ukuran image frontend dan backend.
  - Nginx Alpine sebagai *reverse proxy* dan penanganan *client-side SPA fallback routing* (mencegah error 404 saat *hard refresh*).
  - Skrip startup otomatis (`docker-entrypoint.sh`) yang menyinkronkan skema database (`prisma db push`) dan menjalankan *data seeder* saat pertama kali dinyalakan.

---

## Arsitektur Sistem

Alur interaksi komponen dalam ekosistem aplikasi:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP Request (Port 5173)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Frontend Container (Nginx)                  │
│  - Static Asset Delivery (Vite React Build)                 │
│  - Client Routing Fallback (try_files -> index.html)        │
│  - Reverse Proxy:                                           │
│      location /api/    --> http://backend:5000/api/         │
│      location /uploads --> http://backend:5000/uploads/     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Internal Network
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend Container (Node.js)                 │
│  - Express.js v5 REST API Framework                         │
│  - JWT Verification & Role-Based Guard (RBAC)               │
│  - Controller Logic, Upload Handler (Multer)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma Engine / TCP Port 5432
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Database Container (PostgreSQL)              │
│  - Relational Storage Engine (Tables, Indexes, Constraints) │
│  - Persistent Docker Volume (postgres_data)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Panduan Menjalankan

### Opsi 1: Docker Compose (Disarankan)

Menjalankan seluruh ekosistem (PostgreSQL, Backend API, Frontend, dan Nginx) hanya dengan satu instruksi:

```bash
# Clone repository
git clone https://github.com/aldiii111/Foods-Orderings-Systems.git
cd Foods-Orderings-Systems

# Jalankan seluruh stack
docker compose up --build -d
```

Aplikasi ready diakses melalui:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **PostgreSQL**: `localhost:5432` (`user: postgres`, `password: postgres`, `database: food_ordering`)

**Perintah Pengelolaan Container:**
```bash
# Memeriksa log aktivitas
docker compose logs -f

# Menghentikan layanan
docker compose down

# Menghentikan dan menghapus seluruh volume basis data
docker compose down -v
```

---

### Opsi 2: Manual (Local Development)

Jika ingin melakukan pengembangan lokal tanpa menggunakan container:

**Prasyarat Lingkungan:**
- Node.js v18+ dan npm
- PostgreSQL v15+ berjalan lokal di port `5432`

#### 1. Setup Backend
```bash
cd backend

# Salin template environment
cp .env.example .env

# Install paket dependensi
npm install

# Sinkronkan model database & generate Prisma client
npx prisma generate
npx prisma db push

# Eksekusi seeder data awal
npm run seed

# Jalankan development server
npm run dev
```
Backend akan aktif di `http://localhost:5000`.

#### 2. Setup Frontend
Buka jendela terminal baru:
```bash
cd frontend

# Salin template environment
cp .env.example .env

# Install dependensi
npm install

# Jalankan Vite server
npm run dev
```
Frontend akan aktif di `http://localhost:5173`.

---

## Akun Demo Pengujian

Data akun berikut telah terisi secara otomatis melalui skrip seeder:

| Peran Akun | Alamat Email | Kata Sandi | Cakupan Hak Akses |
|---|---|---|---|
| **Staff** | `staff@foodordering.com` | `staff123` | Akses operasional, stok opname, input quotation, invoice, dan master data |
| **Customer** | `customer@foodordering.com` | `customer123` | Akses katalog menu, checkout, dan status pesanan |

---

## Dokumentasi API

Seluruh endpoint terpusat pada prefix `/api`. Header `Authorization: Bearer <token>` wajib disertakan pada endpoint yang terproteksi.

| Metode | Endpoint | Hak Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/register` | Publik | Registrasi akun pengguna baru |
| `POST` | `/api/auth/login` | Publik | Otentikasi dan penerbitan token JWT |
| `GET` | `/api/products` | Terautentikasi | Mengambil daftar produk (parameter: `search`, `categoryId`) |
| `POST` | `/api/products` | Staff | Membuat produk baru beserta unggah gambar |
| `PUT` | `/api/products/:id` | Staff | Memperbarui data produk dan stok |
| `DELETE`| `/api/products/:id` | Staff | Menghapus produk |
| `GET` | `/api/categories` | Terautentikasi | Mengambil seluruh master kategori |
| `GET` | `/api/units` | Terautentikasi | Mengambil daftar satuan unit produk |
| `GET` | `/api/stock` | Staff | Mengambil riwayat mutasi persediaan |
| `POST` | `/api/stock` | Staff | Mencatat pergerakan stok (in, out, adjustment) |
| `GET` | `/api/quotations` | Staff | Daftar dan manajemen penawaran harga |
| `POST` | `/api/quotations` | Staff | Menerbitkan surat penawaran harga baru |
| `GET` | `/api/invoices` | Staff | Daftar dan manajemen faktur tagihan |
| `POST` | `/api/invoices` | Staff | Membuat faktur tagihan baru |
| `GET` | `/api/dashboard` | Staff | Mengambil ringkasan statistik dan metrik penjualan |

---

## Struktur Direktori

```
Foods-Orderings-Systems/
├── backend/
│   ├── prisma/             # Skema Prisma ORM, migrasi, dan seed script
│   ├── src/
│   │   ├── controllers/    # Handler logika bisnis API (auth, product, invoice, dll.)
│   │   ├── middleware/     # Otentikasi JWT, validasi role RBAC, upload Multer
│   │   ├── routes/         # Definisi router Express
│   │   └── lib/            # Instance client database
│   ├── server.ts           # Entry point backend server
│   ├── Dockerfile          # Spesifikasi container backend
│   └── docker-entrypoint.sh # Otomatisasi migrasi skema dan seed saat boot
├── frontend/
│   ├── src/
│   │   ├── components/     # UI primitives & layout (Radix UI, Tailwind)
│   │   ├── context/        # Global state autentikasi & JWT decoded session
│   │   ├── page/
│   │   │   ├── auth/       # Halaman login, registrasi, pemilihan role
│   │   │   ├── customer/   # Halaman belanja, keranjang, dan order list
│   │   │   └── staff/      # Halaman ERP (inventaris, quotation, invoice, user)
│   │   └── lib/            # Instance Axios terkonfigurasi otomatis
│   ├── nginx.conf          # Konfigurasi reverse proxy & SPA routing fallback
│   └── Dockerfile          # Multi-stage container build frontend
├── docker-compose.yml      # Orkestrator multi-container (DB, Backend, Frontend)
├── package.json            # Shortcut skrip root proyek
├── GIT_FLOW.md             # Panduan standarisasi branching Git
├── Faq.md                  # Tanya jawab teknis pengembangan
└── readme.md               # Dokumentasi utama proyek
```

---

## Git Workflow & Standar Kolaborasi

Proyek ini menerapkan metodologi **Git Flow yang terstruktur (3-Tier Branching Strategy)** untuk menjamin stabilitas kode, mempermudah pelacakan riwayat perubahan (*traceability*), dan mencerminkan praktik standar kolaborasi tim rekayasa perangkat lunak (*software engineering*):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        3-TIER GIT FLOW ARCHITECTURE                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   main ────────●─────────────────────────●──────────────────── (Prod)  │
│                │                         ↑                             │
│                │ Pull Request (Release)  │                             │
│                ▼                         │                             │
│   staging ─────●─────●─────────●─────────●──────●───────────── (Test)  │
│                      │         ↑                ↑                      │
│        git checkout  │         │ Pull Request   │ Pull Request         │
│                      ▼         │ (Feature Done) │ (Bugfix Done)        │
│   feat/auth ─────────●─────────┘                │                      │
│   feat/invoice ────────────────●────────────────┘                      │
│   fix/cors ───────────────────────────────────────────────────         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Hierarki Branching

| Tingkatan Branch | Nama / Pola | Fungsi & Cakupan Tanggung Jawab |
|---|---|---|
| **Production Tier** | `main` | Menyimpan kode versi produksi (*production-ready*) yang sudah stabil, bebas bug kritis, dan siap di-*deploy* ke pengguna akhir. Tidak diperbolehkan adanya direct commit. |
| **Integration Tier** | `staging` | Pusat pengumpulan seluruh fitur baru dan perbaikan (*single source of truth for QA*). Menjadi tempat pengujian integrasi antara backend dan frontend sebelum dirilis ke `main`. |
| **Feature / Task Tier** | `feat/<fitur>`<br>`fix/<isu>`<br>`<area>-dev` | Branch kerja dengan cakupan spesifik dan terisolasi. Developer mengerjakan satu unit tugas tanpa mengganggu kode di branch utama maupun rekan tim lainnya. |

---

### 2. Siklus Kerja Fitur (Feature Lifecycle)

1. **Inisialisasi Tugas**: Setiap fitur baru selalu dicabangkan dari titik stabil terbaru di branch `staging`:
   ```bash
   git checkout staging && git pull origin staging
   git checkout -b feat/nama-fitur
   ```
2. **Atomic & Monorepo Commits**: Karena proyek ini mencakup backend dan frontend, perubahan yang saling berhubungan (misalnya penambahan endpoint di backend dan implementasi Axios di frontend) di-commit secara terkoordinasi dari root folder agar riwayat perubahan tetap utuh (*atomic*).
3. **Penyelarasan Sebelum Integrasi**: Sebelum mengajukan penggabungan kode, branch kerja wajib melakukan sinkronisasi terbaru dari `staging` guna mendeteksi dan menyelesaikan konflik (*merge conflict resolution*) di tingkat lokal:
   ```bash
   git pull origin staging
   ```
4. **Pull Request & Code Review**: Penggabungan kode ke `staging` maupun `main` dilakukan melalui Pull Request (PR) terdokumentasi (seperti riwayat PR #44, #45, #46, #47 pada repositori ini) untuk memastikan kepatuhan standar kode (*code review*).

---

### 3. Konvensi Pesan Commit (Conventional Commits)

Untuk menjaga histori Git tetap bersih, informatif, dan mudah dibaca oleh tim maupun alat otomatisasi CI/CD, pesan commit mengikuti standarisasi:

| Tipe Commit | Tujuan Penggunaan | Contoh Format |
|---|---|---|
| `feat:` | Penambahan fitur baru ke sistem | `feat(auth): implement jwt login and role guard` |
| `fix:` | Perbaikan bug atau kendala teknis | `fix(api): resolve cors header and db pooler port` |
| `refactor:` | Perubahan struktur kode tanpa mengubah fungsi bisnis | `refactor(auth): simplify role validation logic` |
| `docs:` | Penambahan atau pembaruan dokumentasi | `docs: add comprehensive git flow architecture` |
| `chore:` | Pemeliharaan dependensi atau konfigurasi tooling | `chore(deps): update prisma engine to v5.22` |

> 📖 **Panduan Lengkap & FAQ Tim**:
> - Alur kerja detail step-by-step dan panduan setup terminal kolaborasi tersedia di [GIT_FLOW.md](./GIT_FLOW.md).
> - Tanya jawab teknis mengenai strategi branching dan penanganan branch remote dapat dilihat di [Faq.md](./Faq.md).

---

## Lisensi

Didistribusikan di bawah lisensi **ISC**. Dikembangkan sebagai proyek portofolio sistem full-stack engineering.
