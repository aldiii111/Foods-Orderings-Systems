# 🌿 Git Flow — Foods Ordering Systems

Dokumen ini menjelaskan **strategi branching** dan **alur kerja Git** yang digunakan dalam project ini.

---

## 📌 Overview

Project ini menggunakan **Git Flow** yang disederhanakan dengan 3 branch utama:

```
main ← staging ← feature/*
```

```
┌───────────────────────────────────────────────────────────────────────┐
│                         GIT FLOW DIAGRAM                             │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   main ──────●──────────────────────●──────────────────●──── (prod)   │
│              │                      ↑                  ↑              │
│              │                merge │            merge │              │
│              ▼                      │                  │              │
│   staging ───●────●────●────●───────●────●────●────────●──── (test)   │
│                   │    ↑    │            │    ↑                       │
│             merge │    │    │ merge      │    │ merge                 │
│                   ▼    │    ▼            ▼    │                       │
│   feat/A ─────────●────┘                     │                       │
│   feat/B ───────────────●────┘               │                       │
│   feat/C ────────────────────────────●───────┘                       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🌳 Branch Structure

### Branch Utama

| Branch | Deskripsi | Siapa yang merge? |
|--------|-----------|-------------------|
| `main` | Branch **production**. Kode di sini sudah **stabil & tested**. | Merge dari `staging` via Pull Request |
| `staging` | Branch **testing/integration**. Tempat semua fitur digabung sebelum ke `main`. | Merge dari `feature/*` via Pull Request |

### Branch Kerja

| Pattern | Deskripsi | Contoh |
|---------|-----------|--------|
| `feat/<nama-fitur>` | Branch untuk fitur baru | `feat/add-readme-md-for-docs` |
| `feat/<area>/<nama>` | Branch fitur dengan scope area | `feat/example-implement-api` |
| `<area>-dev` | Branch development per area | `backend-dev` |
| `<area>/<scope>` | Branch khusus per area | `frontend/setup` |

### Branch yang Ada Saat Ini

```
main                                → Production (stable)
staging                             → Integration & testing
backend-dev                         → Backend development
feat/add-readme-md-for-docs         → Dokumentasi
feat/example-implement-api          → Contoh implementasi API
frontend/setup                      → Setup awal frontend
```

---

## 🔄 Alur Kerja (Workflow)

### 1. Mulai Fitur Baru

Selalu buat branch baru dari `staging`:

```bash
# Pastikan staging up-to-date
git checkout staging
git pull origin staging

# Buat branch fitur baru
git checkout -b feat/nama-fitur
```

### 2. Kerjakan & Commit

Kerjakan fitur di branch kamu. Gunakan **conventional commit messages**:

```bash
# Format: <type>: <deskripsi singkat>
git add .
git commit -m "feat: tambah halaman login"
```

#### Tipe Commit yang Digunakan

| Prefix | Deskripsi | Contoh |
|--------|-----------|--------|
| `feat` | Fitur baru | `feat: add login page` |
| `fix` | Bug fix | `fix: resolve CORS issue` |
| `add` | Penambahan file/fungsi | `add: function get api` |
| `docs` | Dokumentasi | `docs: update readme` |
| `refactor` | Refactoring kode | `refactor: simplify auth middleware` |
| `chore` | Maintenance | `chore: update dependencies` |
| `style` | Formatting (no logic change) | `style: fix indentation` |

### 3. Push & Buat Pull Request

```bash
# Push branch ke remote
git push origin feat/nama-fitur
```

Lalu buat **Pull Request (PR)** di GitHub:
- **Base branch:** `staging`
- **Compare branch:** `feat/nama-fitur`
- Isi deskripsi PR dengan perubahan yang dilakukan
- Minta review dari team member

### 4. Review & Merge ke Staging

```
feat/nama-fitur  →  (Pull Request)  →  staging
```

- Reviewer melakukan **code review**
- Jika sudah OK, **merge** PR ke `staging`
- Branch fitur bisa di-delete setelah merge

### 5. Release ke Production

Ketika `staging` sudah stabil dan siap release:

```
staging  →  (Pull Request)  →  main
```

- Buat PR dari `staging` ke `main`
- Pastikan semua test sudah pass
- Merge ke `main`

---

## 📊 Visualisasi Alur Lengkap

```
 Developer A                Developer B
     │                          │
     ▼                          ▼
 ┌────────────┐          ┌────────────────────┐
 │ feat/login │          │ feat/product-crud   │
 └─────┬──────┘          └──────────┬──────────┘
       │ Push & PR                  │ Push & PR
       ▼                            ▼
 ┌─────────────────────────────────────────────┐
 │                 staging                      │
 │    (integration, testing, review)            │
 └──────────────────────┬──────────────────────┘
                        │ PR & merge (setelah stable)
                        ▼
              ┌──────────────────┐
              │      main        │
              │   (production)   │
              └──────────────────┘
```

---

## ⚠️ Aturan Penting

### ❌ Yang TIDAK Boleh Dilakukan

1. **Jangan push langsung ke `main`** — Selalu lewat PR dari `staging`
2. **Jangan push langsung ke `staging`** — Selalu lewat PR dari branch fitur
3. **Jangan merge branch fitur langsung ke `main`** — Harus lewat `staging` dulu
4. **Jangan force push** ke `main` atau `staging`

### ✅ Yang HARUS Dilakukan

1. **Selalu buat branch baru** dari `staging` untuk setiap fitur/fix
2. **Selalu buat Pull Request** untuk merge ke `staging` atau `main`
3. **Tulis commit message yang jelas** menggunakan conventional commit
4. **Pull terbaru dari `staging`** sebelum mulai kerja fitur baru
5. **Delete branch** setelah PR sudah di-merge

---

## 🔀 Mengatasi Conflict

Jika ada conflict saat PR, selesaikan di branch fitur kamu:

```bash
# Dari branch fitur kamu
git checkout feat/nama-fitur

# Pull perubahan terbaru dari staging
git pull origin staging

# Resolve conflict di editor
# Setelah selesai:
git add .
git commit -m "fix: resolve merge conflict with staging"
git push origin feat/nama-fitur
```

> **💡 Tips:** Sering-sering pull dari `staging` agar conflict tidak menumpuk.

---

## 📝 Contoh Skenario Nyata

### Skenario: Menambahkan fitur "Keranjang Belanja"

```bash
# 1. Checkout staging & pull terbaru
git checkout staging
git pull origin staging

# 2. Buat branch fitur baru
git checkout -b feat/shopping-cart

# 3. Kerjakan fitur, commit berkala
git add .
git commit -m "feat: add cart model and migration"

git add .
git commit -m "feat: add cart API endpoints"

git add .
git commit -m "feat: add cart UI component"

# 4. Push ke remote
git push origin feat/shopping-cart

# 5. Buat Pull Request di GitHub
#    Base: staging ← Compare: feat/shopping-cart

# 6. Setelah di-review & di-merge, delete branch
git checkout staging
git pull origin staging
git branch -d feat/shopping-cart
```

---

## 🔗 Referensi

- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow Guide](https://docs.github.com/en/get-started/using-git/github-flow)

---

> 📖 Untuk dokumentasi project secara keseluruhan, lihat [`readme.md`](./readme.md)
