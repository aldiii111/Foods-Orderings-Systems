# Food Ordering & Operations System

Sistem manajemen restoran dan pemesanan makanan full-stack yang mengintegrasikan portal pemesanan pelanggan dengan sistem operasional back-office (kasir, inventaris stok, penawaran harga, dan penagihan faktur).

---

## Tentang Sistem

Pada bisnis food & beverage (F&B), pencatatan pesanan sering kali terputus dari manajemen persediaan bahan baku dan administrasi penagihan. Sistem ini dibangun untuk mengatasi kendala tersebut dengan menghubungkan seluruh siklus operasional dalam satu platform: mulai dari etalase menu yang dilihat pelanggan, pelacakan mutasi persediaan di dapur/gudang, hingga penerbitan dokumen komersial (*quotation* dan *invoice*).

Aplikasi memisahkan alur kerja ke dalam dua antarmuka utama:

### 1. Portal Pelanggan (Customer Facing)
- **Katalog Menu Dinamis**: Menampilkan menu makanan dan minuman dengan filter kategori dan pencarian instan.
- **Keranjang & Checkout**: Kalkulasi item pesanan dan pengiriman order secara real-time.
- **Riwayat Transaksi**: Pemantauan status pemesanan pelanggan yang terdaftar.

### 2. Dashboard Operasional (Staff & Admin)
- **Manajemen Inventaris & Mutasi Stok**:
  - Pelacakan stok masuk (*in*), keluar (*out*), dan penyesuaian (*adjustment*).
  - Peringatan dini ketika persediaan mendekati batas minimum (*low stock alert*).
  - Kalkulasi margin keuntungan berbasis HPP (*cost price*) dan harga jual (*selling price*).
- **Billing & Dokumen Finansial**:
  - Pembuatan dan konversi *Quotation* (penawaran harga) untuk pesanan katering atau partai besar.
  - Penerbitan *Invoice* dan pencatatan riwayat pelunasan tagihan (*unpaid*, *partial*, *paid*).
- **Master Data**:
  - Manajemen kategori menu, satuan unit (porsi, pcs, cup, botol), dan data kontak pelanggan.
- **Keamanan & Kontrol Akses (RBAC)**:
  - Pembatasan menu dan aksi berdasarkan hak akses staf (`SUPER_ADMIN`, `ADMIN`, `STAFF`, dan `customer`).
  - Pencatatan log aktivitas sistem (*audit log*).

---

## Arsitektur & Desain Sistem

Aplikasi ini menggunakan arsitektur *decoupled* untuk menjaga modularitas antara antarmuka pengguna dan logika bisnis:

```
┌─────────────────────────────────┐
│     Client Browser              │
└────────────────┬────────────────┘
                 │ Port 5173 (Host)
                 ▼
┌─────────────────────────────────┐
│   Frontend (Nginx + React 19)   │
│   - React Router SPA Fallback   │
│   - Reverse Proxy:              │
│       /api/    -> Backend       │
│       /uploads -> Backend       │
└────────────────┬────────────────┘
                 │ HTTP (Port 5000 internal)
                 ▼
┌─────────────────────────────────┐
│   Backend (Express v5 + TS)     │
│   - Autentikasi JWT & Role RBAC │
│   - Validasi & REST Controller  │
│   - File Upload (Multer)        │
└────────────────┬────────────────┘
                 │ TCP (Port 5432 internal)
                 ▼
┌─────────────────────────────────┐
│   Database (PostgreSQL 16)      │
│   - Skema Relasional Prisma ORM │
│   - Volume Data Persisten       │
└─────────────────────────────────┘
```

### Stack Teknologi
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, React Router v7, ShadCN UI / Radix primitives, Axios.
- **Backend**: Express.js v5, TypeScript, Prisma ORM, JSON Web Token (JWT), bcryptjs, Multer.
- **Database & Infrastruktur**: PostgreSQL 16, Docker & Docker Compose, Nginx Alpine.

---

## Panduan Menjalankan

Aplikasi dapat dijalankan secara instan menggunakan Docker (disarankan), atau dijalankan secara manual pada lingkungan lokal.

### Opsi 1: Menjalankan Menggunakan Docker (Instan)

Metode ini otomatis menyiapkan container database PostgreSQL, sinkronisasi skema tabel, pemuatan data awal (*seeding*), serta menjalankan backend dan frontend.

1. **Jalankan seluruh service:**
   ```bash
   docker compose up --build -d
   ```

2. **Akses URL aplikasi:**
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **PostgreSQL**: `localhost:5432` (`user: postgres`, `password: postgres`, `db: food_ordering`)

3. **Perintah manajemen container:**
   ```bash
   # Melihat status log service
   docker compose logs -f

   # Menghentikan service
   docker compose down

   # Reset total database & volume
   docker compose down -v
   ```

---

### Opsi 2: Menjalankan Secara Manual (Local Development)

Gunakan opsi ini jika ingin mengembangkan fitur tanpa perantara container.

**Prasyarat:**
- Node.js v18 atau versi lebih baru
- PostgreSQL aktif pada port `5432`

#### 1. Setup Backend
```bash
cd backend

# Buat file environment dari template
cp .env.example .env
# Sesuaikan DATABASE_URL dan JWT_SECRET di file .env jika kredensial berbeda

# Pasang dependensi
npm install

# Sinkronkan skema Prisma ke database & generate client
npx prisma generate
npx prisma db push

# Isi data awal (admin, staf, menu contoh)
npm run seed

# Jalankan server API
npm run dev
```
Backend berjalan di port `http://localhost:5000`.

#### 2. Setup Frontend
Buka tab terminal baru:
```bash
cd frontend

# Buat file environment dari template
cp .env.example .env

# Pasang dependensi
npm install

# Jalankan server dev Vite
npm run dev
```
Frontend berjalan di port `http://localhost:5173`.

---

## Akun Bawaan (Default Data Seed)

Data akun awal berikut sudah disiapkan secara otomatis saat menjalankan perintah seed atau saat container pertama kali aktif:

| Peran | Alamat Email | Password | Hak Akses |
|---|---|---|---|
| **Administrator** | `admin@foodordering.com` | `admin123` | Akses penuh dashboard, manajemen user, laporan penjualan |
| **Staff Kasir** | `staff@foodordering.com` | `staff123` | Dashboard operasional, mutasi stok, input quotation & invoice |
| **Customer** | *(Dapat mendaftar melalui form Register)* | - | Akses katalog menu & keranjang belanja |

---

## Ringkasan Endpoint API

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/register` | Publik | Registrasi akun baru (Customer/Staff) |
| `POST` | `/api/auth/login` | Publik | Autentikasi user & pengembalian token JWT |
| `GET` | `/api/products` | Terautentikasi | Mengambil daftar produk (filter `search` & `categoryId`) |
| `POST` | `/api/products` | Staff/Admin | Menambah menu baru beserta upload gambar |
| `PUT` | `/api/products/:id` | Staff/Admin | Memperbarui data produk & stok |
| `DELETE` | `/api/products/:id` | Staff/Admin | Menghapus menu dari sistem |
| `GET` | `/api/categories` | Terautentikasi | Mengambil data kategori menu |
| `GET` | `/api/units` | Terautentikasi | Mengambil data satuan (porsi, cup, pcs, dll.) |
| `GET` | `/api/stock` | Staff/Admin | Melihat riwayat mutasi persediaan barang |
| `POST` | `/api/stock` | Staff/Admin | Menambah mutasi stok masuk, keluar, atau penyesuaian |
| `GET` | `/api/quotations` | Staff/Admin | Daftar dan rincian surat penawaran harga |
| `GET` | `/api/invoices` | Staff/Admin | Daftar dan pengelolaan status pembayaran faktur |
| `GET` | `/api/dashboard` | Staff/Admin | Statistik ringkasan penjualan, transaksi, dan notifikasi |

---

## Struktur Direktori

```
Foods-Orderings-Systems/
├── backend/
│   ├── prisma/             # Skema Prisma, migrasi, dan skrip seed awal
│   ├── src/
│   │   ├── controllers/    # Logika bisnis endpoint (auth, product, invoice, dll.)
│   │   ├── middleware/     # Guard JWT, pengecekan RBAC, Multer upload
│   │   ├── routes/         # Pemetaan routing REST API
│   │   └── lib/            # Prisma Client singleton
│   ├── server.ts           # Entry point server Express
│   ├── Dockerfile          # Image build backend
│   └── docker-entrypoint.sh # Skrip auto-sync skema DB & seeder saat startup
├── frontend/
│   ├── src/
│   │   ├── components/     # Komponen UI bersama (button, dialog, card, layout)
│   │   ├── context/        # State autentikasi dan penyimpanan token
│   │   ├── page/
│   │   │   ├── auth/       # Login, register, halaman pemilihan peran
│   │   │   ├── customer/   # Tampilan belanja menu & riwayat transaksi
│   │   │   └── staff/      # Halaman kelola produk, transaksi, dan master data
│   │   └── lib/            # Konfigurasi instance Axios
│   ├── nginx.conf          # Pengaturan reverse proxy dan fallback routing SPA
│   └── Dockerfile          # Multi-stage container build frontend
├── docker-compose.yml      # Orkestrasi container PostgreSQL, backend, dan frontend
├── package.json            # Skrip shortcut terpusat di root
└── readme.md               # Dokumentasi sistem
```
