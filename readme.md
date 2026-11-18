# Food Ordering System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Project web full-stack untuk sistem pemesanan makanan dan manajemen operasional restoran sederhana. Project ini dibuat sebagai sarana pembelajaran dan eksplorasi dalam merancang aplikasi web modern yang menghubungkan sisi pelanggan (*customer*) dan sisi staf/internal (*back-office*).

---

## Tentang Project

Sistem ini membagi fungsi aplikasi menjadi dua bagian utama:

1. **Halaman Pelanggan (Customer)**:
   - Melihat katalog makanan dan minuman dengan filter kategori.
   - Mengelola keranjang belanja dan melakukan proses checkout pesanan.
   - Melihat riwayat pesanan yang sudah dibuat.

2. **Dashboard Staf (Staff)**:
   - **Katalog Menu**: Menambah, mengubah harga, stok, dan foto menu makanan.
   - **Manajemen Stok**: Mencatat mutasi stok (masuk, keluar, penyesuaian) serta notifikasi stok minimum.
   - **Quotation & Invoice**: Membuat surat penawaran harga dan tagihan pesanan (status belum bayar, sebagian, lunas).
   - **Master Data**: Mengatur kategori menu dan satuan produk (porsi, pcs, cup, dll.).

---

## Latar Belakang & Tujuan Pembelajaran

Project ini dibuat untuk mempelajari beberapa konsep penting dalam pengembangan web full-stack:

- **Relasi Data yang Saling Terhubung**: Mempelajari bagaimana menghubungkan data transaksi pesanan dengan pemotongan stok otomatis dan perhitungan HPP (*cost price* vs *selling price*) menggunakan PostgreSQL dan Prisma ORM.
- **Pemisahan Frontend dan Backend (Decoupled Architecture)**: Melatih pembuatan REST API mandiri menggunakan Express.js TypeScript yang dikonsumsi oleh aplikasi React (Vite).
- **Type Safety**: Memanfaatkan TypeScript di sisi client dan server untuk meminimalkan bug data saat pengembangan.
- **Kontainerisasi dengan Docker**: Mempelajari cara membungkus frontend, backend, dan database ke dalam Docker Compose agar aplikasi mudah dijalankan di komputer mana pun tanpa instalasi manual yang rumit.
- **Praktik Git Flow**: Menerapkan alur branching yang rapi (`feat/*` → `staging` → `main`) untuk membiasakan standar kolaborasi tim perangkat lunak.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, React Router v7, ShadCN UI / Radix primitives, Axios.
- **Backend**: Node.js, Express.js v5, TypeScript, Prisma ORM, JWT, bcryptjs, Multer.
- **Database**: PostgreSQL 16 (kompatibel dengan Supabase / Neon / PostgreSQL lokal).
- **DevOps**: Docker, Docker Compose, Nginx.

---

## Cara Menjalankan

Aplikasi dapat dijalankan dengan dua cara: menggunakan Docker (direkomendasikan) atau manual di komputer lokal.

### Opsi 1: Menggunakan Docker Compose (Instan)

Pastikan Docker sudah terpasang dan aktif di komputer Anda.

1. **Jalankan container**:
   ```bash
   docker compose up --build -d
   ```
2. **Buka di browser**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - Database PostgreSQL lokal: `localhost:5432`

3. **Perintah tambahan**:
   ```bash
   # Melihat log aktivitas
   docker compose logs -f

   # Menghentikan container
   docker compose down
   ```

---

### Opsi 2: Menjalankan Manual (Local Development)

**Prasyarat**: Node.js (v18+) dan PostgreSQL lokal yang sedang berjalan.

1. **Setup Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Sesuaikan DATABASE_URL di file .env jika perlu

   npm install
   npx prisma db push
   npm run seed
   npm run dev
   ```
   Backend berjalan di `http://localhost:5000`.

2. **Setup Frontend**:
   Buka terminal baru:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
   Frontend berjalan di `http://localhost:5173`.

---

## Akun untuk Pengujian

Database sudah dilengkapi data awal (*seeder*) untuk mempermudah uji coba fitur:

| Peran | Email | Password | Keterangan |
|---|---|---|---|
| **Staff** | `staff@foodordering.com` | `staff123` | Masuk ke dashboard staf untuk kelola produk, stok, quotation, dan invoice |
| **Customer** | `customer@foodordering.com` | `customer123` | Masuk ke katalog menu dan keranjang pemesanan |

*(Pengguna baru juga dapat mendaftar langsung melalui menu Register di halaman awal).*

---

## Alur Kerja Git (Git Workflow)

Untuk menjaga histori perubahan tetap rapi dan melatih alur kerja tim, proyek ini menggunakan strategi branching sederhana:

```
main (Production)
  ↑
staging (Integration & Testing)
  ↑
feat/nama-fitur (Fitur Baru)
```

- **`feat/*`**: Setiap fitur dikerjakan di branch terpisah yang dibuat dari `staging`.
- **`staging`**: Tempat penggabungan fitur-fitur baru untuk diuji coba sebelum dirilis. Penggabungan dilakukan melalui Pull Request (PR).
- **`main`**: Branch utama yang berisi versi aplikasi yang sudah stabil dan siap digunakan.

---

## Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan eksplorasi pribadi di bawah lisensi **ISC**.
