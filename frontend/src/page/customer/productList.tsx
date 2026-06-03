import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  Image as ImageIcon, 
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(search);
      setProducts(data);
    } catch (err: unknown) {
      console.error("Gagal mengambil menu makanan:", err);
      setError("Gagal memuat daftar menu dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      setNotification(`Maaf, stok ${product.name} sedang kosong.`);
      return;
    }

    try {
      const cartData = localStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      
      const existingItemIndex = cart.findIndex((item: { id: number }) => item.id === product.id);
      
      if (existingItemIndex > -1) {
        const currentQty = cart[existingItemIndex].quantity;
        if (currentQty >= product.stock) {
          setNotification(`Gagal! Batas stok ${product.name} telah tercapai.`);
          return;
        }
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Dispatch custom event to notify layout navbar
      window.dispatchEvent(new Event("cart-updated"));
      
      setNotification(`Berhasil menambahkan ${product.name} ke keranjang!`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Gagal menyimpan ke keranjang:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Promosi Premium */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-xl shadow-orange-500/10">
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            Selamat Datang di Restoran Kami
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight">
            Rasakan Kelezatan Terbaik, Siap Diantar!
          </h2>
          <p className="text-orange-50/90 text-sm font-medium">
            Temukan berbagai pilihan menu hidangan lezat dan segar yang dibuat langsung oleh chef profesional kami.
          </p>
        </div>
        {/* Background blobs */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-radial-gradient from-white/10 to-transparent pointer-events-none rounded-full translate-x-20 translate-y-10" />
      </div>

      {/* Control Bar: Search & Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari makanan favorit Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
          <ShoppingBag className="size-4 text-primary" />
          <span>Tersedia {products.length} menu siap dipesan</span>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {notification.includes("Gagal") || notification.includes("Maaf") ? (
            <AlertTriangle className="size-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Connection Error Message */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5 text-destructive p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="size-5 shrink-0" />
          <div className="text-sm font-semibold">{error}</div>
        </Card>
      )}

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="size-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Menu tidak ditemukan</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              {searchQuery ? "Maaf, menu makanan yang Anda cari belum tersedia." : "Restoran belum mengunggah menu makanan saat ini."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-card flex flex-col justify-between group">
              <div>
                {/* Image display */}
                <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                      <ImageIcon className="size-8 mb-1" />
                      <span className="text-[10px]">No image</span>
                    </div>
                  )}
                  
                  {/* Stock status overlay */}
                  {product.stock <= 0 ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
                      Habis
                    </div>
                  ) : product.stock < 10 ? (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded-lg uppercase tracking-wider">
                      Sisa {product.stock} Porsi
                    </span>
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-base text-foreground line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                    {product.description || "Hidangan lezat berkhasiat tinggi racikan chef pilihan."}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 pt-0 mt-2">
                <div className="flex items-center justify-between border-t border-border/30 pt-3">
                  <span className="text-base font-extrabold text-foreground">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 rounded-xl transition-all shadow-md shadow-primary/5 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    Pesan
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
