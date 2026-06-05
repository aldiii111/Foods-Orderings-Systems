import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag,
  Calendar,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesReports() {
  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Laporan Penjualan (Sales Reports)</h2>
            <p className="text-xs text-muted-foreground font-medium">Analisis visual omzet restoran, porsi terjual, dan performa menu.</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border/60 bg-slate-50 dark:bg-slate-900 rounded-xl transition-all text-foreground cursor-pointer">
            <Calendar className="size-3.5" />
            Bulan Ini
            <ChevronDown className="size-3.5" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Pendapatan</p>
                  <h3 className="text-2xl font-black mt-1">Rp 17.900.000</h3>
                  <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="size-3" /> +12% dibanding bulan lalu
                  </span>
                </div>
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <DollarSign className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Porsi Terjual</p>
                  <h3 className="text-2xl font-black mt-1">645 Porsi</h3>
                  <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="size-3" /> +8% dibanding bulan lalu
                  </span>
                </div>
                <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <ShoppingBag className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Rata-rata Order</p>
                  <h3 className="text-2xl font-black mt-1">Rp 1.250.000</h3>
                  <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-0.5 mt-1">
                    -3% dibanding bulan lalu
                  </span>
                </div>
                <div className="size-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                  <BarChart3 className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pure CSS Charts & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/40 shadow-sm rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="size-4.5 text-primary" />
                  Grafik Penjualan Mingguan (Simulasi)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-border/30">
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
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Menu Terlaris</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">Nasi Goreng Spesial</span>
                    <span className="text-muted-foreground font-semibold">185 porsi</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">Sate Ayam Madura</span>
                    <span className="text-muted-foreground font-semibold">120 porsi</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">Es Teh Manis</span>
                    <span className="text-muted-foreground font-semibold">240 porsi</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
