# 📖 FAQ – Git Branching Guide

<details>
<summary><strong>📌 1. Bagaimana cara membuat branch baru?</strong></summary>

<br>

**Langkah 1 — Pastikan branch `staging` ada secara lokal**
Jika belum ada, lakukan fetch dari remote terlebih dahulu:

```bash
git fetch <nama-remote>
```

**Langkah 2 — Checkout ke branch `staging` dari remote**

```bash
git checkout -b staging <nama-remote>/staging
```

> Perintah di atas akan membuat branch `staging` lokal yang melacak `staging` pada remote.

**Langkah 3 — Buat branch baru dari `staging`**

```bash
git checkout -b <nama-branch-baru>
```

> Sekarang Anda berada di branch baru yang berbasiskan `staging`.

</details>

---

<details>
<summary><strong>📌 2. Bagaimana cara mencoba (checkout) branch orang lain?</strong></summary>

<br>

**Langkah 1 — Pastikan semua perubahan di branch lokal Anda sudah di-add dan commit**

```bash
git add .
```

```bash
git commit -m "Simpan perubahan sebelum beralih branch"
```

**Langkah 2 — Fetch update terbaru dari remote**

```bash
git fetch origin
```

**Langkah 3 — Checkout ke branch orang lain**

```bash
git checkout -b <nama-branch> origin/<nama-branch>
```

> Perintah ini membuat branch lokal `<nama-branch>` yang melacak branch yang sama pada remote `origin`.

</details>

---

### 💡 Tips Tambahan

- Gunakan `git branch -vv` untuk melihat branch mana yang melacak remote mana.
- Jika ingin kembali ke branch sebelumnya, cukup jalankan `git checkout -`
- Untuk menghapus branch lokal yang sudah tidak diperlukan:

  ```bash
  git branch -d <nama-branch>
  ```

---

> **📝 Catatan:** Gantilah `<nama-remote>` dengan nama remote Anda (mis. `origin`) dan `<nama-branch-baru>` atau `<nama-branch>` dengan nama branch yang diinginkan.
