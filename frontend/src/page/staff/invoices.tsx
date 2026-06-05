import { useState } from "react";
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
import { cn } from "@/lib/utils";

// ====== BACKEND API REQUIREMENT ======
// Endpoint: GET /api/invoices
// Query Params: search (string), status (string: 'PAID' | 'UNPAID' | 'OVERDUE' | '')
// Response: Array of {
//   id: number;
//   invoiceNo: string;
//   customerName: string;
//   dateCreated: string;
//   dateDue: string;
//   totalAmount: number;
//   status: 'PAID' | 'UNPAID' | 'OVERDUE';
// }

const DUMMY_INVOICES = [
  { id: 1, invoiceNo: "INV-2026-001", customerName: "Hotel Santika Premium", dateCreated: "2026-06-01", dateDue: "2026-06-15", totalAmount: 4500000, status: "PAID" },
  { id: 2, invoiceNo: "INV-2026-002", customerName: "PT Global Tech Solutions", dateCreated: "2026-06-02", dateDue: "2026-06-16", totalAmount: 3200000, status: "UNPAID" },
  { id: 3, invoiceNo: "INV-2026-003", customerName: "Catering Ibu Fatma", dateCreated: "2026-06-02", dateDue: "2026-06-16", totalAmount: 1800000, status: "PAID" },
  { id: 4, invoiceNo: "INV-2026-004", customerName: "Wedding Organizer Sinar", dateCreated: "2026-05-15", dateDue: "2026-05-30", totalAmount: 8400000, status: "OVERDUE" },
];

export function Invoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "UNPAID" | "OVERDUE">("ALL");

  const filteredInvoices = DUMMY_INVOICES.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20">
            <CheckCircle2 className="size-3" />
            Lunas
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/20">
            <Clock className="size-3" />
            Belum Bayar
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100 rounded-lg dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/20">
            <XCircle className="size-3" />
            Jatuh Tempo
          </span>
        );
      default:
        return null;
    }
  };

  const totalSales = DUMMY_INVOICES.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidSales = DUMMY_INVOICES.filter(inv => inv.status === "PAID").reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Invoices (Faktur Penjualan)</h2>
            <p className="text-xs text-muted-foreground font-medium">Buat dan kelola invoice tagihan makanan event serta pelanggan korporat.</p>
          </div>
          <Link to="/staff/invoices/create">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-lg shadow-primary/20 cursor-pointer">
              <Plus className="size-4" />
              Buat Invoice
            </button>
          </Link>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Penjualan Kotor</p>
                  <h3 className="text-2xl font-black mt-1">Rp {totalSales.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-muted-foreground">
                  <Receipt className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Dana Masuk (Terbayar)</p>
                  <h3 className="text-2xl font-black mt-1">Rp {paidSales.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Piutang (Belum Terbayar)</p>
                  <h3 className="text-2xl font-black mt-1">
                    Rp {(totalSales - paidSales).toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="size-10 bg-amber-50 dark:bg-amber-950/20 rounded-xl flex items-center justify-center text-amber-600">
                  <Clock className="size-5" />
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(["ALL", "PAID", "UNPAID", "OVERDUE"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                    statusFilter === status 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-muted-foreground"
                  )}
                >
                  {status === "ALL" ? "Semua" : status === "PAID" ? "Lunas" : status === "UNPAID" ? "Belum Lunas" : "Jatuh Tempo"}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Nomor Invoice</th>
                    <th className="px-6 py-4">Nama Pelanggan</th>
                    <th className="px-6 py-4">Tanggal Faktur</th>
                    <th className="px-6 py-4">Jatuh Tempo</th>
                    <th className="px-6 py-4 text-right">Total Tagihan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm text-foreground">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        Tidak ada invoice yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {inv.invoiceNo}
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {inv.customerName}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                          {inv.dateCreated}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                          {inv.dateDue}
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold">
                          Rp {inv.totalAmount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(inv.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => alert(`Membuka Invoice ${inv.invoiceNo} (Slicing/Mock)`)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
                              <Eye className="size-4" />
                            </button>
                            <button onClick={() => alert(`Mengunduh PDF Invoice ${inv.invoiceNo} (Slicing/Mock)`)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
                              <Download className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
