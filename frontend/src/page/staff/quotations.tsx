import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  Download,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";
import type { Quotation } from "@/types";
import { cn } from "@/lib/utils";

export function Quotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    async function loadQuotations() {
      try {
        setLoading(true);
        const data = await erpService.getQuotations();
        setQuotations(data);
      } catch (err: any) {
        console.error("Gagal memuat quotations:", err);
        setError("Gagal mengambil data penawaran harga.");
      } finally {
        setLoading(false);
      }
    }
    loadQuotations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">
            <CheckCircle2 className="size-3" />
            Disetujui
          </span>
        );
      case "PENDING":
      case "DRAFT":
      case "SENT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg">
            <Clock className="size-3" />
            {status}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 rounded-lg">
            <XCircle className="size-3" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-100 rounded-lg">
            {status}
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = "Nomor Penawaran,Pelanggan,Tanggal,Kedaluwarsa,Total,Status\n";
    const rows = quotations.map(q => 
      `"${q.number}","${q.customer?.name || ""}","${q.date}","${q.expiryDate}","${q.totalAmount}","${q.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "foodorder_quotations_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch = 
      q.number.toLowerCase().includes(search.toLowerCase()) ||
      (q.customer?.name || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = quotations.reduce((sum, q) => sum + q.totalAmount, 0);
  const pendingCount = quotations.filter(q => q.status === "PENDING" || q.status === "DRAFT" || q.status === "SENT").length;
  const approvedCount = quotations.filter(q => q.status === "ACCEPTED" || q.status === "APPROVED").length;

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Quotations (Penawaran Harga)</h2>
            <p className="text-xs text-muted-foreground font-medium">Buat dan kelola penawaran harga porsi makanan besar untuk event.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              Ekspor CSV
            </button>
            <Link to="/staff/quotations/create">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md cursor-pointer">
                <Plus className="size-4" />
                Buat Penawaran
              </button>
            </Link>
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
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">Total Penawaran</p>
                  <h3 className="text-xl font-extrabold mt-1">Rp {totalAmount.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-muted-foreground">
                  <FileText className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-mono font-bold">Menunggu Persetujuan</p>
                  <h3 className="text-xl font-extrabold mt-1">{pendingCount} Penawaran</h3>
                </div>
                <div className="size-9 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex items-center justify-center text-amber-600">
                  <Clock className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Telah Disetujui</p>
                  <h3 className="text-xl font-extrabold mt-1">{approvedCount} Penawaran</h3>
                </div>
                <div className="size-9 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-mono">Penawaran Ditolak</p>
                  <h3 className="text-xl font-extrabold mt-1">
                    {quotations.filter(q => q.status === "REJECTED").length} Penawaran
                  </h3>
                </div>
                <div className="size-9 bg-rose-50 dark:bg-rose-950/20 rounded-lg flex items-center justify-center text-rose-600">
                  <XCircle className="size-4.5" />
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
                placeholder="Cari berdasarkan nomor penawaran atau pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["ALL", "DRAFT", "SENT", "ACCEPTED", "REJECTED"].map((status) => (
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
          ) : filteredQuotations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-2xl shadow-sm">
              Tidak ada penawaran harga yang ditemukan.
            </div>
          ) : (
            <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-4">Nomor Penawaran</th>
                      <th className="px-6 py-4">Nama Pelanggan</th>
                      <th className="px-6 py-4">Tanggal Dibuat</th>
                      <th className="px-6 py-4">Tanggal Kedaluwarsa</th>
                      <th className="px-6 py-4 text-right">Total Nilai</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-foreground">
                    {filteredQuotations.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {q.number}
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {q.customer?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(q.date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(q.expiryDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground">
                          Rp {q.totalAmount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(q.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/staff/quotations/${q.id}`}>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-primary flex items-center justify-center cursor-pointer">
                              <Eye className="size-4" />
                            </button>
                          </Link>
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
