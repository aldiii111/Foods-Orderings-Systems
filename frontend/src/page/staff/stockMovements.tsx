import { useEffect, useState, type FormEvent } from "react";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sliders,
  Search, 
  Download,
  Plus,
  Loader2,
  X,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";
import { productService } from "@/services/productService";
import type { StockMovement, Product } from "@/types";
import { cn } from "@/lib/utils";

export function StockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT" | "ADJUSTMENT">("ALL");

  // Adjust Stock Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [adjustType, setAdjustType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN");
  const [quantity, setQuantity] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mRes, pRes] = await Promise.all([
          erpService.getStockMovements(),
          productService.getProducts()
        ]);
        setMovements(mRes);
        const pList = Array.isArray(pRes) ? pRes : (pRes as any).products || [];
        setProducts(pList);
      } catch (err: any) {
        console.error("Failed to load stock movements:", err);
        setError("Gagal memuat data mutasi stok.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshData = async () => {
    try {
      const mRes = await erpService.getStockMovements();
      setMovements(mRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedProductId || quantity === "") {
      setFormError("Produk dan quantity wajib diisi.");
      return;
    }

    setFormLoading(true);
    try {
      await erpService.adjustStock({
        productId: Number(selectedProductId),
        type: adjustType,
        quantity: Number(quantity),
        notes
      });
      setIsAdjustModalOpen(false);
      setSelectedProductId("");
      setQuantity("");
      setNotes("");
      refreshData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal mengubah stok.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Tanggal,Produk,SKU,Tipe,Jumlah,Stok Sebelum,Stok Sesudah,Staf,Catatan\n";
    const rows = movements.map(m => 
      `"${m.id}","${m.timestamp}","${m.product?.name || ""}","${m.product?.sku || ""}","${m.type}","${m.quantity}","${m.beforeStock}","${m.afterStock}","${m.user?.name || ""}","${m.notes || ""}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "foodorder_stock_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const filteredMovements = movements.filter((m) => {
    const matchesSearch = 
      (m.product?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.product?.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.notes || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === "ALL" || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Riwayat Stok (Stock History)</h2>
            <p className="text-xs text-muted-foreground font-medium">Log komprehensif alur masuk, keluar, dan penyesuaian barang inventaris.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border border-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              Ekspor CSV
            </button>
            <button
              onClick={() => setIsAdjustModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="size-4" />
              Sesuaikan Stok
            </button>
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
          {/* Stats Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">Total Transaksi</p>
                  <h3 className="text-xl font-extrabold mt-1">{movements.length} Mutasi</h3>
                </div>
                <div className="size-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-muted-foreground">
                  <History className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Total Masuk (IN)</p>
                  <h3 className="text-xl font-extrabold mt-1">
                    +{movements.filter(m => m.type === "IN").reduce((sum, m) => sum + m.quantity, 0)} Unit
                  </h3>
                </div>
                <div className="size-9 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center text-emerald-600">
                  <ArrowUpRight className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-mono">Total Keluar (OUT)</p>
                  <h3 className="text-xl font-extrabold mt-1">
                    -{movements.filter(m => m.type === "OUT").reduce((sum, m) => sum + Math.abs(m.quantity), 0)} Unit
                  </h3>
                </div>
                <div className="size-9 bg-rose-50 dark:bg-rose-950/20 rounded-lg flex items-center justify-center text-rose-600">
                  <ArrowDownRight className="size-4.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider font-mono">Penyesuaian (ADJ)</p>
                  <h3 className="text-xl font-extrabold mt-1">
                    {movements.filter(m => m.type === "ADJUSTMENT").length} Log
                  </h3>
                </div>
                <div className="size-9 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex items-center justify-center text-purple-600">
                  <Sliders className="size-4.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk, SKU, atau keterangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 border border-border/60 bg-slate-50 dark:bg-slate-900 rounded-xl p-1 shrink-0">
                {(["ALL", "IN", "OUT", "ADJUSTMENT"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer",
                      filterType === type 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type === "ALL" ? "Semua" : type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table container */}
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-2xl shadow-sm">
              Tidak ada riwayat pergerakan stok yang cocok.
            </div>
          ) : (
            <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-4">Waktu</th>
                      <th className="px-6 py-4">Nama Produk / SKU</th>
                      <th className="px-6 py-4">Tipe</th>
                      <th className="px-6 py-4 text-right">Sebelum</th>
                      <th className="px-6 py-4 text-right">Mutasi</th>
                      <th className="px-6 py-4 text-right">Sesudah</th>
                      <th className="px-6 py-4">Petugas</th>
                      <th className="px-6 py-4">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-foreground">
                    {filteredMovements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4 text-[10px] text-muted-foreground font-mono">
                          {formatDate(m.timestamp)}
                        </td>
                        <td className="px-6 py-4">
                          <h4 className="font-bold text-foreground">{m.product?.name || "Produk Dihapus"}</h4>
                          <span className="text-[10px] text-muted-foreground font-mono">{m.product?.sku || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex px-2 py-0.5 rounded text-[10px] font-bold",
                            m.type === "IN" && "bg-emerald-50 text-emerald-700",
                            m.type === "OUT" && "bg-rose-50 text-rose-700",
                            m.type === "ADJUSTMENT" && "bg-purple-50 text-purple-700"
                          )}>
                            {m.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-muted-foreground">{m.beforeStock}</td>
                        <td className={cn(
                          "px-6 py-4 text-right font-bold font-mono",
                          m.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-foreground">{m.afterStock}</td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">{m.user?.name || "System"}</td>
                        <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{m.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Adjust Stock Dialog Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">Disesuaikan Stok Manual</h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive font-semibold">{formError}</div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Produk *</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="">Pilih Produk...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Jenis Penyesuaian</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="IN">Stok Masuk (IN)</option>
                    <option value="OUT">Stok Keluar (OUT)</option>
                    <option value="ADJUSTMENT">Pembaruan Nilai (ADJ)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Jumlah Unit *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alasan / Catatan</label>
                <textarea
                  placeholder="Keterangan penyesuaian..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={formLoading} className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
                  {formLoading && <Loader2 className="size-3 animate-spin" />}
                  Proses Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
