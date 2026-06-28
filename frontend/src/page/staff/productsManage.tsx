import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  AlertTriangle,
  Boxes,
  Loader2,
  X,
  Image as ImageIcon
} from "lucide-react";
import { productService } from "@/services/productService";
import { erpService } from "@/services/erpService";
import type { Product, Category, Unit } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsManage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Selection state for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [minStock, setMinStock] = useState<number | "">("");
  const [status, setStatus] = useState("ACTIVE");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [prodRes, catRes, unitRes] = await Promise.all([
          productService.getProducts(),
          erpService.getCategories(),
          erpService.getUnits()
        ]);
        
        // Product structure contains backend paginated wrapper or array
        const list = Array.isArray(prodRes) ? prodRes : (prodRes as any).products || [];
        setProducts(list);
        setCategories(catRes);
        setUnits(unitRes);
      } catch (err: any) {
        console.error("Gagal memuat data awal inventory:", err);
        setError("Gagal memuat data dari server.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const refreshProductsList = async () => {
    try {
      const prodRes = await productService.getProducts();
      const list = Array.isArray(prodRes) ? prodRes : (prodRes as any).products || [];
      setProducts(list);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedProduct(null);
    setName("");
    setSku("");
    setBarcode("");
    setCategoryId(categories[0]?.id?.toString() || "");
    setUnitId(units[0]?.id?.toString() || "");
    setDescription("");
    setCostPrice("");
    setSellingPrice("");
    setStock("");
    setMinStock("");
    setStatus("ACTIVE");
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalType("edit");
    setSelectedProduct(product);
    setName(product.name);
    setSku(product.sku || "");
    setBarcode(product.barcode || "");
    setCategoryId(product.categoryId?.toString() || "");
    setUnitId(product.unitId?.toString() || "");
    setDescription(product.description || "");
    setCostPrice(product.costPrice);
    setSellingPrice(product.sellingPrice || product.price || 0);
    setStock(product.stock);
    setMinStock(product.minStock || 0);
    setStatus(product.status || "ACTIVE");
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(product.image);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || sellingPrice === "" || stock === "") {
      setFormError("Nama, Harga Jual, dan Stok wajib diisi.");
      return;
    }

    setFormLoading(true);
    try {
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        const uploadRes = await productService.uploadImage(imageFile);
        finalImageUrl = uploadRes.imageUrl;
      }

      const payload: any = {
        name,
        sku: sku || undefined,
        barcode: barcode || undefined,
        categoryId: categoryId ? Number(categoryId) : null,
        unitId: unitId ? Number(unitId) : null,
        description,
        costPrice: Number(costPrice) || 0,
        sellingPrice: Number(sellingPrice),
        stock: Number(stock),
        minStock: Number(minStock) || 0,
        status,
        image: finalImageUrl
      };

      if (modalType === "add") {
        await productService.createProduct(payload);
      } else if (modalType === "edit" && selectedProduct) {
        await productService.updateProduct(selectedProduct.id, payload);
      }

      setIsModalOpen(false);
      refreshProductsList();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal menyimpan produk.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      await erpService.deleteProduct(id);
      refreshProductsList();
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  // Bulk operations
  const toggleSelectProduct = (id: number) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selectedProductIds.length} produk terpilih?`)) return;
    try {
      await erpService.bulkDeleteProducts(selectedProductIds);
      setSelectedProductIds([]);
      refreshProductsList();
    } catch (err) {
      alert("Gagal menghapus produk terpilih");
    }
  };

  const handleBulkStatusChange = async (statusVal: string) => {
    try {
      await erpService.bulkUpdateProductStatus(selectedProductIds, statusVal);
      setSelectedProductIds([]);
      refreshProductsList();
    } catch (err) {
      alert("Gagal mengubah status produk");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Nama,SKU,Barcode,Kategori,Satuan,Harga Beli,Harga Jual,Stok,Min Stok,Status\n";
    const rows = products.map(p => 
      `"${p.id}","${p.name}","${p.sku || ""}","${p.barcode || ""}","${p.category?.name || ""}","${p.unit?.symbol || ""}","${p.costPrice}","${p.sellingPrice}","${p.stock}","${p.minStock}","${p.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "foodorder_inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV Mock-loader
  const handleImportCSV = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      
      // Parse header and items
      const importedList = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(val => val.replace(/"/g, ""));
        if (values.length < 2) continue;
        
        importedList.push({
          name: values[1],
          sku: values[2] || undefined,
          barcode: values[3] || undefined,
          category: values[4] || undefined,
          unit: values[5] || undefined,
          costPrice: Number(values[6]) || 0,
          sellingPrice: Number(values[7]) || Number(values[8]) || 0,
          stock: Number(values[8]) || 0,
          minStock: Number(values[9]) || 0,
          status: values[10] || "ACTIVE"
        });
      }

      if (importedList.length === 0) {
        alert("File CSV tidak valid atau kosong.");
        return;
      }

      try {
        setLoading(true);
        await erpService.importProducts(importedList);
        alert(`Berhasil mengimpor ${importedList.length} produk!`);
        refreshProductsList();
      } catch (err) {
        alert("Gagal mengimpor produk");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // Filters & sorting logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategoryFilter === "" || p.categoryId?.toString() === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === "" || p.status === selectedStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a: any, b: any) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Katalog Inventory</h2>
            <p className="text-xs text-muted-foreground font-medium">Kelola SKU, barcode, harga beli/jual, kategori, dan batas stok minimum.</p>
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors rounded-xl cursor-pointer">
              <Upload className="size-3.5" />
              Impor CSV
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors rounded-xl cursor-pointer"
            >
              <Download className="size-3.5" />
              Ekspor CSV
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="size-4" />
              Tambah Produk
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive font-semibold flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari SKU, Barcode, Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                <option value="">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                <option value="">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Nonaktif</option>
              </select>

              {/* Sort field Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                <option value="name">Urut Nama</option>
                <option value="stock">Urut Stok</option>
                <option value="sellingPrice">Urut Harga Jual</option>
                <option value="createdAt">Urut Tanggal</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="px-3 py-1.5 text-xs font-semibold border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground cursor-pointer"
              >
                {sortOrder === "asc" ? "A-Z / Naik" : "Z-A / Turun"}
              </button>
            </div>
          </div>

          {/* Bulk Actions overlay */}
          {selectedProductIds.length > 0 && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-6 py-3 rounded-xl">
              <span className="text-xs font-bold text-primary">{selectedProductIds.length} produk terpilih</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusChange("ACTIVE")}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-slate-950 border border-border text-foreground hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <CheckCircle className="size-3.5 text-emerald-600" />
                  Aktifkan
                </button>
                <button
                  onClick={() => handleBulkStatusChange("INACTIVE")}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-slate-950 border border-border text-foreground hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <XCircle className="size-3.5 text-rose-600" />
                  Nonaktifkan
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-lg cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  Hapus Massal
                </button>
              </div>
            </div>
          )}

          {/* Inventory Table Grid */}
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <Boxes className="size-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Produk tidak ditemukan</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">Coba gunakan kata kunci lain atau bersihkan filter pencarian.</p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.length === filteredProducts.length}
                          onChange={toggleSelectAll}
                          className="rounded border-border focus:ring-primary text-primary"
                        />
                      </th>
                      <th className="p-4">SKU / Nama</th>
                      <th className="p-4">Kategori / Satuan</th>
                      <th className="p-4 text-right">Harga Beli</th>
                      <th className="p-4 text-right">Harga Jual</th>
                      <th className="p-4 text-center">Stok</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-xs">
                    {filteredProducts.map((p) => {
                      const isLowStock = p.stock <= p.minStock;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.includes(p.id)}
                              onChange={() => toggleSelectProduct(p.id)}
                              className="rounded border-border focus:ring-primary text-primary"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 bg-slate-50 dark:bg-slate-900 border border-border/50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                                ) : (
                                  <ImageIcon className="size-4.5 text-muted-foreground/60" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground">{p.name}</h4>
                                <span className="text-[10px] text-muted-foreground font-mono">{p.sku || "NO-SKU"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-foreground">{p.category?.name || "-"}</span>
                            <div className="text-[10px] text-muted-foreground">{p.unit?.symbol || p.unit?.name || "-"}</div>
                          </td>
                          <td className="p-4 text-right font-mono text-muted-foreground">
                            Rp {p.costPrice.toLocaleString("id-ID")}
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-foreground">
                            Rp {(p.sellingPrice || p.price || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isLowStock 
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400" 
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            }`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === "ACTIVE" 
                                ? "bg-emerald-50 text-emerald-700" 
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {p.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => openEditModal(p)}
                                className="size-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-primary flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Edit className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="size-7 rounded-md hover:bg-rose-100/50 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-lg font-bold text-foreground">
                {modalType === "add" ? "Tambah Produk Inventory" : "Edit Produk"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive font-semibold">{formError}</div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Produk *</label>
                <input
                  type="text"
                  placeholder="Misal: Nasi Goreng Spesial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SKU</label>
                  <input
                    type="text"
                    placeholder="FOOD-NG-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Barcode (GTIN / UPC)</label>
                  <input
                    type="text"
                    placeholder="8991234567890"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kategori *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Satuan Unit *</label>
                  <select
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="">-- Pilih Satuan Unit --</option>
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Harga Beli *</label>
                  <input
                    type="number"
                    placeholder="12000"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Harga Jual *</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stok Saat Ini *</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Batas Stok Minimum *</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="ACTIVE">Aktif (Tampil)</option>
                  <option value="INACTIVE">Nonaktif (Sembunyikan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Deskripsi</label>
                <textarea
                  placeholder="Keterangan detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gambar Makanan</label>
                <div className="flex gap-4 items-center">
                  <div className="size-14 bg-slate-50 dark:bg-slate-900 border border-dashed border-border/60 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : existingImageUrl ? (
                      <img src={existingImageUrl} alt="Existing" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="size-5 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer">
                    <Upload className="size-3.5" />
                    Pilih File
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={formLoading} className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
                  {formLoading && <Loader2 className="size-3 animate-spin" />}
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
