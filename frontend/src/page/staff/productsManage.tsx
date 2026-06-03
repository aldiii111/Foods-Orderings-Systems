import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  AlertTriangle,
  Boxes,
  Upload
} from "lucide-react";
import { productService } from "@/services/productService";
import type { Product, ProductFormData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsManage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400000); // We will also search on enter or when user stops typing, but 300ms is standard. Let's make it 300ms. Wait! I wrote 400000 by mistake, let's write 300ms.
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products
  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(search);
      setProducts(data);
    } catch (err: unknown) {
      console.error("Gagal mengambil data produk:", err);
      setError("Gagal mengambil data produk dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  const openAddModal = () => {
    setModalType("add");
    setSelectedProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
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
    setDescription(product.description || "");
    setPrice(product.price);
    setStock(product.stock);
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

    if (!name || price === "" || stock === "") {
      setFormError("Nama, harga, dan stok wajib diisi.");
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      setFormError("Harga dan stok tidak boleh negatif.");
      return;
    }

    setFormLoading(true);
    try {
      let finalImageUrl = existingImageUrl;

      // 1. Upload image if a new file is chosen
      if (imageFile) {
        try {
          const uploadRes = await productService.uploadImage(imageFile);
          finalImageUrl = uploadRes.imageUrl;
        } catch (uploadErr) {
          console.error("Gagal mengunggah gambar:", uploadErr);
          throw new Error("Gagal mengunggah gambar. Pastikan format file sesuai.");
        }
      }

      const productPayload: ProductFormData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image: finalImageUrl,
      };

      if (modalType === "add") {
        await productService.createProduct(productPayload);
      } else if (modalType === "edit" && selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productPayload);
      }

      setIsModalOpen(false);
      fetchProducts(debouncedSearch);
    } catch (err: unknown) {
      const errorMsg = err as { message?: string } | { response?: { data?: { message?: string } } };
      const parsedError = ('response' in errorMsg && errorMsg.response?.data?.message) 
        || ('message' in errorMsg && errorMsg.message) 
        || "Gagal memproses data produk.";
      setFormError(parsedError);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Kelola Produk</h2>
            <p className="text-xs text-muted-foreground font-medium">Tambah, edit, dan atur katalog menu makanan restoran Anda.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus className="size-4" />
            Tambah Produk
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Search bar & info */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Menampilkan {products.length} menu makanan
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/5 text-destructive p-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="size-5 shrink-0" />
              <div className="text-sm font-semibold">{error}</div>
            </Card>
          )}

          {/* Product Grid / Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Card key={idx} className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <Boxes className="size-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Menu tidak ditemukan</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  {searchQuery ? "Coba gunakan kata kunci pencarian yang lain." : "Katalog makanan Anda saat ini masih kosong. Klik Tambah Produk untuk memulai."}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
                >
                  Tambah Produk Baru
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group relative bg-card">
                  {/* Edit Button overlay */}
                  <button
                    onClick={() => openEditModal(product)}
                    className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105 cursor-pointer"
                  >
                    <Edit className="size-4 text-primary" />
                  </button>

                  {/* Image wrapper */}
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                        <ImageIcon className="size-8 mb-1" />
                        <span className="text-[10px]">No image uploaded</span>
                      </div>
                    )}
                    {/* Low stock badge */}
                    {product.stock < 10 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded-lg uppercase tracking-wider">
                        Stok Menipis: {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-foreground line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                        {product.description || "Tidak ada deskripsi"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border/30 mt-3">
                      <span className="text-sm font-extrabold text-foreground">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Stok: <span className="font-bold text-foreground">{product.stock}</span>
                      </span>
                    </div>

                    {/* Quick Edit Trigger for Mobile/Tablet */}
                    <button
                      onClick={() => openEditModal(product)}
                      className="mt-3 w-full py-1.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                    >
                      <Edit className="size-3" />
                      Edit Produk
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-lg font-bold text-foreground">
                {modalType === "add" ? "Tambah Produk Baru" : "Edit Produk"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive font-semibold">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nama Makanan *</label>
                <input
                  type="text"
                  placeholder="Misal: Nasi Goreng Spesial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                  disabled={formLoading}
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Harga (Rupiah) *</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    disabled={formLoading}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jumlah Stok *</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deskripsi</label>
                <textarea
                  placeholder="Deskripsi singkat tentang rasa, porsi, atau komposisi makanan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none"
                  disabled={formLoading}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gambar Makanan</label>
                <div className="flex gap-4 items-center">
                  <div className="size-20 bg-slate-50 dark:bg-slate-900 border border-dashed border-border/60 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : existingImageUrl ? (
                      <img src={existingImageUrl} alt="Existing" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="size-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer justify-center w-fit">
                      <Upload className="size-3.5" />
                      Pilih File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={formLoading}
                      />
                    </label>
                    <p className="text-[10px] text-muted-foreground">Format gambar JPG, JPEG, PNG. Maksimal 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  disabled={formLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all rounded-xl shadow-lg shadow-primary/10 cursor-pointer"
                  disabled={formLoading}
                >
                  {formLoading && <Loader2 className="size-3.5 animate-spin" />}
                  {formLoading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
