# 🍔 Food Ordering System — Frontend

Frontend untuk sistem pemesanan makanan, dibangun dengan **React 19**, **TypeScript**, **Vite**, **TailwindCSS v4**, dan **ShadCN UI**.

---

## 📋 Tech Stack

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **React** | v19 | UI Library |
| **TypeScript** | v6 | Type-safe JavaScript |
| **Vite** | v8 | Build tool & dev server |
| **TailwindCSS** | v4 | Utility-first CSS framework |
| **ShadCN UI** | v4 (radix-nova) | Component library |
| **React Router** | v7 | Client-side routing |
| **Axios** | v1.16 | HTTP client |
| **Lucide React** | v1.17 | Icon library |

---

## 📁 Struktur Folder

```
frontend/
├── vite.config.ts            # Konfigurasi Vite (React + Tailwind plugin)
├── components.json           # Konfigurasi ShadCN UI
├── tsconfig.json             # TypeScript config
├── tsconfig.app.json         # TypeScript config untuk app
├── .env                      # Environment variables (tidak di-commit)
├── .env.example              # Template environment variables
└── src/
    ├── App.tsx               # Root component + Router setup
    ├── App.css               # Design system (CSS variables, Tailwind theme)
    ├── components/
    │   ├── sidebarComp.tsx   # Sidebar component
    │   └── ui/               # ShadCN UI components (auto-generated)
    ├── hooks/
    │   ├── getProduct.ts     # Hook untuk fetch data produk
    │   └── use-mobile.ts     # Hook untuk deteksi perangkat mobile
    ├── lib/
    │   ├── api.ts            # Axios instance (HTTP client config)
    │   └── utils.ts          # Utility functions (cn helper)
    └── page/
        └── home.tsx          # Halaman utama
```

---

## 🚀 Cara Running

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** v18 atau lebih baru → [Download](https://nodejs.org)
- **Backend server** sudah berjalan di `http://localhost:5000` (lihat `backend/readme.md`)

---

### Step 1: Masuk ke Folder Frontend

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` jika perlu:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

> **💡 Tips:** Variabel environment di Vite **harus** diawali prefix `VITE_` agar bisa diakses di browser.
> Akses di kode: `import.meta.env.VITE_API_BASE_URL`

### Step 4: Jalankan Development Server

```bash
npm run dev
```

✅ Frontend berjalan di **http://localhost:5173**

Buka browser dan akses URL tersebut.

---

## 🛠️ Scripts

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| `npm run dev` | `vite` | Jalankan dev server dengan hot reload |
| `npm run build` | `tsc -b && vite build` | Build untuk production |
| `npm run preview` | `vite preview` | Preview hasil build production |
| `npm run lint` | `eslint .` | Jalankan linter |

---

## 🎨 Design System

Frontend menggunakan design system berbasis **CSS Variables** yang didefinisikan di `src/App.css`.

### Warna Utama

| Variable | Light Mode | Dark Mode | Deskripsi |
|----------|------------|-----------|-----------|
| `--primary` | `#5850EC` | `#6366F1` | Brand color (Indigo/Purple) |
| `--secondary` | `#3B82F6` | `#3B82F6` | Secondary (Bright Blue) |
| `--destructive` | `#EF4444` | — | Error/Alert |
| `--success` | `#10B981` | — | Success state |
| `--warning` | `#F59E0B` | — | Warning state |

### ShadCN UI

Komponen UI menggunakan ShadCN dengan style **radix-nova**. Untuk menambah komponen baru:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# dll.
```

Komponen akan otomatis ditambahkan ke `src/components/ui/`.

---

## 🔗 Koneksi ke Backend

Frontend berkomunikasi dengan backend melalui Axios instance yang dikonfigurasi di `src/lib/api.ts`.

### Penggunaan

```typescript
import api from "@/lib/api";

// GET request
const response = await api.get("/products");

// POST request dengan auth token
const response = await api.post("/products", {
  name: "Nasi Goreng",
  price: 25000,
}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Endpoint yang Tersedia

Lihat dokumentasi lengkap API di `backend/readme.md`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login, dapat JWT token |
| `GET` | `/products` | List produk |
| `POST` | `/products` | Buat produk baru |
| `GET` | `/products/:id` | Detail produk |
| `PUT` | `/products/:id` | Update produk |

---

## 📦 Menambah Halaman Baru

1. Buat file di `src/page/`:
   ```typescript
   // src/page/products.tsx
   export function Products() {
     return <div>Products Page</div>;
   }
   ```

2. Daftarkan route di `src/App.tsx`:
   ```tsx
   import { Products } from "@/page/products";

   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/products" element={<Products />} />
   </Routes>
   ```
