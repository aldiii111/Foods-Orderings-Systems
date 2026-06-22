import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Users2, 
  Layers,
  Sparkles,
  AlertTriangle,
  Boxes,
  FileText,
  Receipt,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { erpService } from "@/services/erpService";
import type { DashboardData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const stats = await erpService.getDashboard();
        setData(stats);
      } catch (err: any) {
        console.error("Failed to load dashboard:", err);
        setError("Gagal memuat data dashboard. Silakan periksa koneksi backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

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

  // Format Currency
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Find max revenue for chart scaling
  const maxRevenue = data?.charts?.revenueTrend?.reduce((max, item) => Math.max(max, item.revenue), 1) || 1;

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Business Intelligence Dashboard</h2>
            <p className="text-xs text-muted-foreground font-medium">Ringkasan operasional, analitik penjualan, dan manajemen stok.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 max-w-sm px-3 py-1.5 rounded-lg bg-primary/5 text-xs text-primary font-medium italic border border-primary/10">
            <Sparkles className="size-3.5 shrink-0 animate-pulse" />
            <span>SaaS ERP System Aktif</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Quick Actions Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/staff/products")}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Package className="size-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Kelola Produk</p>
                  <p className="text-[10px] text-muted-foreground">Tambah & Atur Stok</p>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => navigate("/staff/quotations/create")}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="size-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Buat Penawaran</p>
                  <p className="text-[10px] text-muted-foreground">Quotation Baru</p>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => navigate("/staff/invoices/create")}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Receipt className="size-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Buat Invoice</p>
                  <p className="text-[10px] text-muted-foreground">Catat Penjualan</p>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => navigate("/staff/customers")}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users2 className="size-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Tambah Pelanggan</p>
                  <p className="text-[10px] text-muted-foreground">CRM Directory</p>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Cards KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Pendapatan</p>
                  {loading ? (
                    <Skeleton className="h-7 w-28" />
                  ) : (
                    <h3 className="text-xl font-extrabold text-foreground">{formatIDR(data?.kpis?.totalRevenue ?? 0)}</h3>
                  )}
                  <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                    <TrendingUp className="size-3" />
                    <span>Lunas Terverifikasi</span>
                  </p>
                </div>
                <div className="size-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <DollarSign className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Omset Bulan Ini</p>
                  {loading ? (
                    <Skeleton className="h-7 w-28" />
                  ) : (
                    <h3 className="text-xl font-extrabold text-foreground">{formatIDR(data?.kpis?.monthlyRevenue ?? 0)}</h3>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Jumlah Transaksi: {data?.kpis?.monthlySales ?? 0}
                  </p>
                </div>
                <div className="size-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                  <TrendingUp className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* Total Products & Stock */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Item & Total Stok</p>
                  {loading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <h3 className="text-xl font-extrabold text-foreground">
                      {data?.kpis?.totalProducts ?? 0} <span className="text-xs text-muted-foreground font-normal">({data?.kpis?.totalStock ?? 0} Unit)</span>
                    </h3>
                  )}
                  <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    <span>{data?.kpis?.lowStockProducts ?? 0} Stok Menipis</span>
                  </p>
                </div>
                <div className="size-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                  <Package className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* Quotations & CRM Stats */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Penawaran & CRM</p>
                  {loading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <h3 className="text-xl font-extrabold text-foreground">
                      {data?.kpis?.totalQuotations ?? 0} <span className="text-xs text-muted-foreground font-normal">({data?.kpis?.totalCustomers ?? 0} Pelanggan)</span>
                    </h3>
                  )}
                  <p className="text-[10px] text-blue-600 font-medium">
                    {data?.kpis?.pendingQuotations ?? 0} Butuh Tindak Lanjut
                  </p>
                </div>
                <div className="size-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                  <FileText className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Line chart alternative using SVG */}
            <Card className="border-border/40 shadow-sm rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Tren Pendapatan Harian (30 Hari Terakhir)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-48 w-full rounded-lg" />
                ) : !data?.charts?.revenueTrend || data.charts.revenueTrend.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">Belum ada transaksi terekam.</div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-44 flex items-end gap-1.5 w-full border-b border-l border-border/50 pb-2 pl-2">
                      {data.charts.revenueTrend.map((item, index) => {
                        const percent = (item.revenue / maxRevenue) * 100;
                        return (
                          <div 
                            key={index} 
                            className="flex-1 flex flex-col items-center justify-end h-full group relative"
                          >
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-[9px] py-1 px-2 rounded z-20 whitespace-nowrap shadow">
                              {item.date}: {formatIDR(item.revenue)}
                            </div>
                            <div 
                              style={{ height: `${Math.max(percent, 4)}%` }}
                              className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-sm group-hover:opacity-90 transition-all"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[9px] text-muted-foreground">
                      <span>30 Hari Lalu</span>
                      <span>Hari Ini</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category / Stock Distribution */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Boxes className="size-4 text-purple-600" />
                  Komposisi Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : !data?.charts?.categoryDistribution || data.charts.categoryDistribution.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">Kategori kosong</div>
                ) : (
                  <div className="space-y-4">
                    {data.charts.categoryDistribution.slice(0, 4).map((cat, idx) => {
                      const totalProducts = data.kpis.totalProducts || 1;
                      const ratio = Math.ceil((cat.productCount / totalProducts) * 100);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-foreground">{cat.name}</span>
                            <span className="text-muted-foreground">{cat.productCount} Item ({ratio}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Low Stock alert lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit Logs / Activity feed */}
            <Card className="border-border/40 shadow-sm rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="size-4 text-primary animate-pulse" />
                  Audit Log & Log Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : !data?.recentActivities || data.recentActivities.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">Belum ada aktivitas terekam.</div>
                ) : (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {data.recentActivities.map((act, actIdx) => (
                        <li key={act.id}>
                          <div className="relative pb-6">
                            {actIdx !== data.recentActivities.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border/40" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-border/40 flex items-center justify-center">
                                  <Layers className="size-3.5 text-muted-foreground" />
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-xs font-semibold text-foreground">
                                    {act.action.replace(/_/g, " ")}{" "}
                                    <span className="font-normal text-muted-foreground">
                                      ({act.details || "-"})
                                    </span>
                                  </p>
                                </div>
                                <div className="text-right text-[10px] whitespace-nowrap text-muted-foreground shrink-0">
                                  <time dateTime={act.timestamp}>
                                    {new Date(act.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions / System Health */}
            <Card className="border-border/40 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Status Kritis & Stok Menipis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 dark:border-rose-950/20 dark:bg-rose-950/5 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-rose-900 dark:text-rose-400">Total Stok Kritis</p>
                        <p className="text-[10px] text-muted-foreground">Memerlukan PO Pembelian segera</p>
                      </div>
                      <span className="text-lg font-black text-rose-700">{data?.kpis?.lowStockProducts ?? 0}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 dark:border-blue-950/20 dark:bg-blue-950/5 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-blue-900 dark:text-blue-400">Penawaran Pending</p>
                        <p className="text-[10px] text-muted-foreground">Menunggu persetujuan customer</p>
                      </div>
                      <span className="text-lg font-black text-blue-700">{data?.kpis?.pendingQuotations ?? 0}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}