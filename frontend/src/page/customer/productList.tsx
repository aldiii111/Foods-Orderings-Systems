import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  Image as ImageIcon, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  Check
} from "lucide-react";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

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
      const list = Array.isArray(data) ? data : (data as any).products || [];
      setProducts(list);
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
    const stock = Number(product.stock ?? 0);
    if (stock <= 0) {
      setNotification({ msg: `Maaf, stok ${product.name} sedang kosong.`, type: "error" });
      return;
    }

    try {
      const cartData = localStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      
      const existingItemIndex = cart.findIndex((item: { id: number }) => item.id === product.id);
      
      if (existingItemIndex > -1) {
        const currentQty = cart[existingItemIndex].quantity;
        if (currentQty >= stock) {
          setNotification({ msg: `Gagal! Batas stok ${product.name} telah tercapai.`, type: "error" });
          return;
        }
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: Number(product.price ?? 0),
          image: product.image,
          stock: stock,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Dispatch custom event to notify layout navbar
      window.dispatchEvent(new Event("cart-updated"));
      
      // Feedback check icon temporary state
      setAddedItems((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);

      setNotification({ msg: `Berhasil menambahkan ${product.name} ke keranjang!`, type: "success" });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Gagal menyimpan ke keranjang:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-primary/20 border border-white/10 group">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-wrap transition-transform duration-1000 ease-out group-hover:scale-105" 
          style={{ backgroundImage: `url('/hero_food_banner.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent sm:to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-primary/20" />

        <div className="absolute -right-12 -top-12 size-64 rounded-full bg-secondary/30 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 size-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-amber-300 shadow-lg">
            <Sparkles className="size-3.5 fill-amber-300 animate-pulse" /> Spesial Kuliner Hari Ini
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Nikmati Kelezatan Otentik Terbaik!
          </h1>
          
          <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed max-w-md drop-shadow-xs">
            Pesan hidangan favoritmu dari bahan segar pilihan racikan chef profesional kami. Siap diantar dengan hangat dan cepat!
          </p>

          <div className="pt-2 flex flex-wrap gap-3 items-center text-xs text-white font-semibold">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-xs">
              <Flame className="size-4 text-amber-400 fill-amber-400" /> Chef Recommended
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-xs">
              <Clock className="size-4 text-sky-400" /> Pengiriman Cepat
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 sm:p-5 rounded-2xl border border-border/60 shadow-sm backdrop-blur-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari makanan atau minuman favorit Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground font-medium"
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
          <div className="text-xs text-muted-foreground font-bold flex items-center gap-2">
            <Badge variant="secondary" className="px-2.5 py-1 rounded-xl font-bold bg-primary/10 text-primary border-primary/20">
              <ShoppingBag className="size-3.5 mr-1.5" />
              {products.length} Pilihan Menu
            </Badge>
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 bg-slate-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {notification.type === "error" ? (
            <div className="size-8 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4.5" />
            </div>
          ) : (
            <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4.5" />
            </div>
          )}
          <span className="text-xs font-bold">{notification.msg}</span>
        </div>
      )}

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 text-destructive p-5 rounded-2xl flex items-center gap-3 shadow-xs">
          <AlertTriangle className="size-5 shrink-0" />
          <div className="text-sm font-bold">{error}</div>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="border-border/40 shadow-xs rounded-2xl overflow-hidden bg-card">
              <Skeleton className="aspect-4/3 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <div className="flex justify-between items-center pt-3 border-t border-border/30">
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                  <Skeleton className="h-9 w-1/3 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card/40 rounded-3xl border border-dashed border-border/60 p-8">
          <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <ShoppingBag className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Menu Makanan Tidak Ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {searchQuery ? `Maaf, kata kunci "${searchQuery}" tidak cocok dengan menu yang tersedia saat ini.` : "Belum ada menu yang diunggah oleh pihak restoran."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="border-border/50 shadow-xs hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-card flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-4/3 w-full bg-muted relative overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                      <ImageIcon className="size-10 mb-1" />
                      <span className="text-[10px] font-medium">Foto Belum Tersedia</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {Number(product.stock ?? 0) <= 0 ? (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                      <Badge variant="destructive" className="px-3 py-1 font-black text-xs uppercase tracking-wider rounded-xl">
                        Stok Habis
                      </Badge>
                    </div>
                  ) : Number(product.stock ?? 0) < 10 ? (
                    <Badge variant="secondary" className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-lg uppercase tracking-wider shadow-sm">
                      Sisa {product.stock} Porsi
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold bg-white/90 text-slate-900 dark:bg-slate-900/90 dark:text-white backdrop-blur-md rounded-lg shadow-xs">
                      Ready
                    </Badge>
                  )}
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-extrabold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-9">
                    {product.description || "Hidangan lezat berkhasiat tinggi racikan chef pilihan kami."}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 mt-2">
                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">Harga</span>
                    <span className="text-base font-black text-foreground">
                      Rp {Number(product.price ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={Number(product.stock ?? 0) <= 0}
                    size="sm"
                    className="rounded-xl font-bold text-xs shadow-md shadow-primary/20 cursor-pointer transition-all active:scale-95"
                  >
                    {addedItems[product.id] ? (
                      <>
                        <Check className="size-3.5 mr-1 text-emerald-300" />
                        Ditambah
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5 mr-1" />
                        Pesan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

