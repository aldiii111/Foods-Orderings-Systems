import { useEffect, useState } from "react";
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";
import type { Invoice } from "@/types";

export function SalesReports() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Date range filters (mock simulation filters)
  const [dateRange, setDateRange] = useState("ALL");

  useEffect(() => {
    async function loadReportingData() {
      try {
        setLoading(true);
        const invRes = await erpService.getInvoices();
        setInvoices(invRes);
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReportingData();
  }, []);

  const handleExportCSV = () => {
    const headers = "Nomor Faktur,Pelanggan,Tanggal,Total Tagihan,Status Pembayaran\n";
    const rows = invoices.map(inv => 
      `"${inv.number}","${inv.customer?.name || ""}","${inv.date}","${inv.totalAmount}","${inv.paymentStatus}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "foodorder_sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidSales = invoices.filter(inv => inv.paymentStatus === "PAID").reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalItemsSold = invoices.reduce((sum, inv) => {
    return sum + (inv.products?.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0) || 0);
  }, 0);
  const averageOrderVal = invoices.length > 0 ? Math.round(totalSales / invoices.length) : 0;

  // Find top selling items
  const itemSalesMap: Record<string, number> = {};
  invoices.forEach(inv => {
    if (inv.products) {
      inv.products.forEach(p => {
        itemSalesMap[p.name] = (itemSalesMap[p.name] || 0) + Number(p.quantity);
      });
    }
  });

  const sortedTopItems = Object.keys(itemSalesMap)
    .map(name => ({ name, quantity: itemSalesMap[name] }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const maxTopQty = sortedTopItems.reduce((max, item) => Math.max(max, item.quantity), 1);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Laporan Penjualan & Analitik</h2>
            <p className="text-xs text-muted-foreground font-medium">Analisis visual omzet ERP, kuantitas terjual, dan item terpopuler.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all text-foreground cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5 text-emerald-600" />
              Ekspor CSV Laporan
            </button>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-border/60 rounded-xl focus:outline-none text-foreground"
            >
              <option value="ALL">Semua Transaksi</option>
              <option value="THIS_MONTH">Bulan Ini</option>
            </select>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">Omzet Penjualan</p>
                  <h3 className="text-lg font-extrabold mt-1">Rp {totalSales.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <DollarSign className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Dana Terbayar</p>
                  <h3 className="text-lg font-extrabold mt-1">Rp {paidSales.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-9 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-4.5 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">Item Terjual</p>
                  <h3 className="text-lg font-extrabold mt-1">{totalItemsSold} Unit</h3>
                </div>
                <div className="size-9 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center justify-center text-blue-500">
                  <ShoppingBag className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">Rata-rata Faktur</p>
                  <h3 className="text-lg font-extrabold mt-1">Rp {averageOrderVal.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-9 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex items-center justify-center text-purple-500">
                  <BarChart3 className="size-4.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts & Top lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/40 shadow-sm rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="size-4.5 text-primary" />
                  Rincian Penjualan Bulanan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <Skeleton className="h-48 w-full rounded-xl" />
                ) : (
                  <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-border/30">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: "45%" }} />
                      <span className="text-[10px] font-bold text-muted-foreground">Minggu 1</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: "70%" }} />
                      <span className="text-[10px] font-bold text-muted-foreground">Minggu 2</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary hover:bg-primary/90 rounded-t-lg transition-all" style={{ height: "90%" }} />
                      <span className="text-[10px] font-bold text-muted-foreground">Minggu 3</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: "55%" }} />
                      <span className="text-[10px] font-bold text-muted-foreground">Minggu 4</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Produk Terlaris</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : sortedTopItems.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">Belum ada data porsi terjual.</div>
                ) : (
                  sortedTopItems.map((item, idx) => {
                    const ratio = Math.ceil((item.quantity / maxTopQty) * 100);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-foreground">{item.name}</span>
                          <span className="text-muted-foreground font-semibold">{item.quantity} Unit</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${ratio}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
