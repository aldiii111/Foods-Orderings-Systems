import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
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
// Endpoint: GET /api/quotations
// Query Params: search (string), status (string: 'PENDING' | 'APPROVED' | 'REJECTED' | '')
// Response: Array of {
//   id: number;
//   quotationNo: string;
//   customerName: string;
//   dateCre,ated: string;
//   dateExpired: string;
//   totalAmount: number;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
// }

const DUMMY_QUOTATIONS = [
  { id: 1, quotationNo: "QTN-2026-001", customerName: "Hotel Santika Premium", dateCreated: "2026-06-01", dateExpired: "2026-06-15", totalAmount: 4500000, status: "APPROVED" },
  { id: 2, quotationNo: "QTN-2026-002", customerName: "Catering Ibu Fatma", dateCreated: "2026-06-02", dateExpired: "2026-06-16", totalAmount: 1800000, status: "PENDING" },
  { id: 3, quotationNo: "QTN-2026-003", customerName: "Universitas Indonesia (Fak. Teknik)", dateCreated: "2026-06-03", dateExpired: "2026-06-17", totalAmount: 12500000, status: "PENDING" },
  { id: 4, quotationNo: "QTN-2026-004", customerName: "PT Global Tech Solutions", dateCreated: "2026-05-28", dateExpired: "2026-06-11", totalAmount: 3200000, status: "APPROVED" },
  { id: 5, quotationNo: "QTN-2026-005", customerName: "Wedding Organizer Sinar", dateCreated: "2026-05-20", dateExpired: "2026-06-03", totalAmount: 8400000, status: "REJECTED" },
];

export function Quotations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const filteredQuotations = DUMMY_QUOTATIONS.filter((q) => {
    const matchesSearch = 
      q.quotationNo.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20">
            <CheckCircle2 className="size-3" />
            Disetujui
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/20 animate-pulse">
            <Clock className="size-3" />
            Menunggu
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100 rounded-lg dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/20">
            <XCircle className="size-3" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const totalAmount = DUMMY_QUOTATIONS.reduce((sum, q) => sum + q.totalAmount, 0);
  const pendingCount = DUMMY_QUOTATIONS.filter(q => q.status === "PENDING").length;
  const approvedCount = DUMMY_QUOTATIONS.filter(q => q.status === "APPROVED").length;

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Quotations (Penawaran Harga)</h2>
            <p className="text-xs text-muted-foreground font-medium">Buat dan kelola penawaran harga porsi makanan besar untuk event.</p>
          </div>
          <Link to="/staff/quotations/create">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-lg shadow-primary/20 cursor-pointer">
              <Plus className="size-4" />
              Buat Penawaran
            </button>
          </Link>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Penawaran</p>
                  <h3 className="text-2xl font-black mt-1">Rp {totalAmount.toLocaleString("id-ID")}</h3>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-muted-foreground">
                  <FileText className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Menunggu Persetujuan</p>
                  <h3 className="text-2xl font-black mt-1">{pendingCount} Penawaran</h3>
                </div>
                <div className="size-10 bg-amber-50 dark:bg-amber-950/20 rounded-xl flex items-center justify-center text-amber-600">
                  <Clock className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Telah Disetujui</p>
                  <h3 className="text-2xl font-black mt-1">{approvedCount} Penawaran</h3>
                </div>
                <div className="size-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Penawaran Ditolak</p>
                  <h3 className="text-2xl font-black mt-1">
                    {DUMMY_QUOTATIONS.filter(q => q.status === "REJECTED").length} Penawaran
                  </h3>
                </div>
                <div className="size-10 bg-rose-50 dark:bg-rose-950/20 rounded-xl flex items-center justify-center text-rose-600">
                  <XCircle className="size-5" />
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap",
                    statusFilter === status 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-muted-foreground"
                  )}
                >
                  {status === "ALL" ? "Semua" : status === "PENDING" ? "Menunggu" : status === "APPROVED" ? "Disetujui" : "Ditolak"}
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
                    <th className="px-6 py-4">Nomor Penawaran</th>
                    <th className="px-6 py-4">Nama Pelanggan</th>
                    <th className="px-6 py-4">Tanggal Dibuat</th>
                    <th className="px-6 py-4">Tanggal Kedaluwarsa</th>
                    <th className="px-6 py-4 text-right">Total Nilai</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm text-foreground">
                  {filteredQuotations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        Tidak ada penawaran harga yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotations.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {q.quotationNo}
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {q.customerName}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                          {q.dateCreated}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                          {q.dateExpired}
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold">
                          Rp {q.totalAmount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(q.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <Link to={`/staff/quotations/${q.id}`}>
                              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
                                <Eye className="size-4" />
                              </button>
                            </Link>
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
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
