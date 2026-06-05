import { useState } from "react";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Download,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ====== BACKEND API REQUIREMENT ======
// Endpoint: GET /api/inventory/stock-movements
// Query Params: search (string), type (string: 'IN' | 'OUT' | ''), startDate (string), endDate (string)
// Response: Array of {
//   id: number;
//   date: string;
//   productName: string;
//   sku: string;
//   type: 'IN' | 'OUT';
//   quantity: number;
//   staffName: string;
//   notes: string;
// }

const DUMMY_MOVEMENTS = [
  { id: 1, date: "2026-06-03T18:30:00Z", productName: "Nasi Goreng Spesial", sku: "NGS-001", type: "IN", quantity: 50, staffName: "Budi Santoso", notes: "Persiapan stok makan malam" },
  { id: 2, date: "2026-06-03T17:45:00Z", productName: "Ayam Bakar Madu", sku: "ABM-002", type: "OUT", quantity: 12, staffName: "Siti Rahma", notes: "Order meja #14 & #16" },
  { id: 3, date: "2026-06-03T15:20:00Z", productName: "Es Teh Manis", sku: "ETM-003", type: "IN", quantity: 100, staffName: "Andi Wijaya", notes: "Restock sirup & teh" },
  { id: 4, date: "2026-06-03T12:10:00Z", productName: "Nasi Goreng Spesial", sku: "NGS-001", type: "OUT", quantity: 30, staffName: "Siti Rahma", notes: "Penjualan jam makan siang" },
  { id: 5, date: "2026-06-02T21:00:00Z", productName: "Es Teh Manis", sku: "ETM-003", type: "OUT", quantity: 45, staffName: "Andi Wijaya", notes: "Total closing shift 2" },
  { id: 6, date: "2026-06-02T10:00:00Z", productName: "Sate Ayam Madura", sku: "SAM-004", type: "IN", quantity: 80, staffName: "Budi Santoso", notes: "Bahan sate datang dari supplier" },
  { id: 7, date: "2026-06-02T09:30:00Z", productName: "Sate Ayam Madura", sku: "SAM-004", type: "OUT", quantity: 5, staffName: "Budi Santoso", notes: "Uji rasa chef (quality check)" },
];

export function StockMovements() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL");

  const filteredMovements = DUMMY_MOVEMENTS.filter((m) => {
    const matchesSearch = 
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      m.notes.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === "ALL" || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Riwayat Stok (Stock Movements)</h2>
            <p className="text-xs text-muted-foreground font-medium">Log komprehensif alur masuk dan keluar barang inventaris.</p>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer">
            <Download className="size-3.5" />
            Ekspor CSV
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Mutasi</p>
                  <h3 className="text-2xl font-black mt-1">{DUMMY_MOVEMENTS.length} Transaksi</h3>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-muted-foreground">
                  <History className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Stok Masuk (IN)</p>
                  <h3 className="text-2xl font-black mt-1">
                    +{DUMMY_MOVEMENTS.filter(m => m.type === "IN").reduce((sum, m) => sum + m.quantity, 0)} Porsi
                  </h3>
                </div>
                <div className="size-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600">
                  <ArrowUpRight className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Stok Keluar (OUT)</p>
                  <h3 className="text-2xl font-black mt-1">
                    -{DUMMY_MOVEMENTS.filter(m => m.type === "OUT").reduce((sum, m) => sum + m.quantity, 0)} Porsi
                  </h3>
                </div>
                <div className="size-10 bg-rose-50 dark:bg-rose-950/20 rounded-xl flex items-center justify-center text-rose-600">
                  <ArrowDownRight className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk, SKU, atau keterangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5 border border-border/60 bg-slate-50 dark:bg-slate-900 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setFilterType("ALL")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                    filterType === "ALL" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType("IN")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                    filterType === "IN" ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setFilterType("OUT")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                    filterType === "OUT" ? "bg-rose-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Keluar
                </button>
              </div>

              {/* Date Filter (Simulation) */}
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold border border-border/60 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 transition-all text-foreground shrink-0 cursor-pointer">
                <Calendar className="size-3.5 text-primary" />
                Pilih Tanggal
              </button>
            </div>
          </div>

          {/* Table Card */}
          <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Nama Produk</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Tipe</th>
                    <th className="px-6 py-4 text-right">Jumlah</th>
                    <th className="px-6 py-4">Staf</th>
                    <th className="px-6 py-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm text-foreground">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        Tidak ada riwayat pergerakan stok yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                          {formatDate(m.date)}
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {m.productName}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                          {m.sku}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-lg border",
                            m.type === "IN" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20" 
                              : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/20"
                          )}>
                            {m.type === "IN" ? "Masuk" : "Keluar"}
                          </span>
                        </td>
                        <td className={cn(
                          "px-6 py-4 text-right font-extrabold",
                          m.type === "IN" ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {m.type === "IN" ? "+" : "-"}{m.quantity}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          {m.staffName}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">
                          {m.notes}
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
