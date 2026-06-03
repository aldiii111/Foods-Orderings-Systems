import { useEffect, useState } from "react";
import { 
  Package, 
  Users2, 
  ArrowUpRight, 
  Layers,
  Sparkles,
  AlertTriangle,
  Boxes
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboardService";
import { productService } from "@/services/productService";
import type { DashboardData, Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard statistics and products list in parallel
        const [statsData, productsData] = await Promise.all([
          dashboardService.getDashboard(),
          productService.getProducts()
        ]);
        
        setStats(statsData);
        setProducts(productsData);
      } catch (err: unknown) {
        console.error("Gagal memuat data dashboard:", err);
        setError("Gagal memuat data dari server. Harap periksa koneksi Anda.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter low stock items (stock < 10)
  const lowStockItems = products.filter(p => p.stock < 10);

  // Sort products by id/creation desc to get recent products
  const recentProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-slate-50/50 dark:bg-background">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg rounded-2xl">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Kesalahan Koneksi</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
            >
              Coba Lagi
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h2>
            <p className="text-xs text-muted-foreground font-medium">Selamat datang kembali! Berikut adalah ringkasan hari ini.</p>
          </div>
          {stats?.quote && !loading && (
            <div className="hidden md:flex items-center gap-2 max-w-sm px-3 py-1.5 rounded-lg bg-primary/5 text-xs text-primary font-medium italic border border-primary/10">
              <Sparkles className="size-3.5 shrink-0 animate-pulse" />
              <span>"{stats.quote}"</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Quote in mobile */}
          {stats?.quote && !loading && (
            <div className="md:hidden flex items-center gap-2 p-3 rounded-lg bg-primary/5 text-xs text-primary font-medium italic border border-primary/10">
              <Sparkles className="size-3.5 shrink-0" />
              <span>"{stats.quote}"</span>
            </div>
          )}

          {/* Cards Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Products Card */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Produk</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <h3 className="text-2xl font-bold text-foreground">{stats?.totalProducts ?? 0}</h3>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="size-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                    <Package className="size-5" />
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-600">
                    <ArrowUpRight className="size-3" />
                    +100% API
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Stock Card */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Stok</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <h3 className="text-2xl font-bold text-foreground">{stats?.totalStock ?? 0} porsi</h3>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="size-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                    <Boxes className="size-5" />
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-600">
                    <ArrowUpRight className="size-3" />
                    Aktif
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Customers Card */}
            <Card className="border-border/40 shadow-sm rounded-2xl sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Pelanggan</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <h3 className="text-2xl font-bold text-foreground">{stats?.totalCustomers ?? 0}</h3>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="size-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                    <Users2 className="size-5" />
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground">
                    Role Customer
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities and Stock Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="lg:col-span-2">
              <Card className="border-border/40 shadow-sm rounded-2xl h-full">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    Aktivitas Produk Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border/40 -mt-2">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-4">
                        <div className="space-y-2 w-1/3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))
                  ) : recentProducts.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Belum ada produk yang terdaftar.
                    </div>
                  ) : (
                    recentProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {product.description || "Tidak ada deskripsi"}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-bold text-foreground">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                          <div className="flex flex-col items-end gap-1 w-24">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg border bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                              Stok: {product.stock}
                            </span>
                            <span className="text-[9px] text-muted-foreground">Baru Ditambahkan</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Alert */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Stok Menipis
                </CardTitle>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                  Stok &lt; 10
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3.5 border border-border/50 rounded-xl space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))
                ) : lowStockItems.length === 0 ? (
                  <div className="text-center py-8 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Semua stok produk aman!
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div key={item.id} className="p-3.5 border border-border/50 rounded-xl bg-white/50 dark:bg-card/30 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">{item.name}</h4>
                          <p className="text-[9px] text-muted-foreground uppercase">ID: PROD-{item.id}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Stok: {item.stock}</span>
                          <p className="text-[10px] text-muted-foreground">Kritis</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rose-500 rounded-full" 
                          style={{ width: `${Math.max(item.stock, 0) * 10}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}