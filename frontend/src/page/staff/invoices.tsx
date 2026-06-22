import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Receipt, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  Download
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";
import type { Invoice } from "@/types";
import { cn } from "@/lib/utils";

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        setError(null);
        const data = await erpService.getInvoices();
        setInvoices(data);
      } catch (err: any) {
        console.error("Gagal memuat invoices:", err);
        setError("Gagal memuat data invoice tagihan.");
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">
            <CheckCircle2 className="size-3" />
            Lunas
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg">
            <Clock className="size-3" />
            Belum Bayar
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
            <Clock className="size-3" />
            Sebagian
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 rounded-lg">
            <XCircle className="size-3" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-100 rounded-lg">
            {status}
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = "Nomor Invoice,Pelanggan,Tanggal,Total Tagihan,Status Pembayaran\n";
    const rows = invoices.map(inv => 
      `"${inv.number}","${inv.customer?.name || ""}","${inv.date}","${inv.totalAmount}","${inv.paymentStatus}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "foodorder_invoices_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customer?.name || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidSales = invoices.filter(inv => inv.paymentStatus === "PAID").reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Invoices (Faktur Penjualan)</h2>
            <p className="text-xs text-muted-foreground font-medium">Buat dan kelola invoice tagihan makanan event serta pelanggan korporat.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              Ekspor CSV
            </button>
            <Link to="/staff/invoices/create">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md cursor-pointer">
                <Plus className="size-4" />
                Buat Invoice
              </button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive font-semibold">
              {error}
            </div>
          )}
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">Total Penjualan</p>
                  <h3 className="text-xl font-extrabold mt-1">Rp {totalSales.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-muted-foreground">
                  <Receipt className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Terbayar (Paid)</p>
                  <h3 className="text-xl font-extrabold mt-1">Rp {paidSales.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-9 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-mono">Piutang (Receivables)</p>
                  <h3 className="text-xl font-extrabold mt-1">
                    Rp {(totalSales - paidSales).toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="size-9 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex items-center justify-center text-amber-600">
                  <Clock className="size-4.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor invoice atau pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["ALL", "PAID", "UNPAID", "PARTIAL", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap",
                    statusFilter === status 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-muted-foreground"
                  )}
                >
                  {status === "ALL" ? "Semua" : status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-2xl shadow-sm">
              Tidak ada invoice yang ditemukan.
            </div>
          ) : (
            <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-4">Nomor Invoice</th>
                      <th className="px-6 py-4">Nama Pelanggan</th>
                      <th className="px-6 py-4">Tanggal Faktur</th>
                      <th className="px-6 py-4 text-right">Total Tagihan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-foreground">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {inv.number}
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {inv.customer?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(inv.date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground">
                          Rp {inv.totalAmount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(inv.paymentStatus)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => alert(`Detail invoice ${inv.number} bisa dicetak via cetak PDF.`)} 
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-primary flex items-center justify-center cursor-pointer"
                          >
                            <Eye className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
