import { useState } from "react";
import { 
  Save, 
  Sliders, 
  Store
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Settings() {
  const [restaurantName, setRestaurantName] = useState("FoodOrder Resto");
  const [ppnRate, setPpnRate] = useState(11);
  const [address, setAddress] = useState("Jl. Margonda Raya No. 100, Depok");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pengaturan Restoran Berhasil Disimpan (Simulasi)!");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Pengaturan Sistem (Settings)</h2>
            <p className="text-xs text-muted-foreground font-medium">Ubah preferensi operasional toko, rates PPN, dan data instansi restoran.</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardHeader className="border-b border-border/20 pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Store className="size-4.5 text-primary" />
                  Identitas Restoran & Usaha
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nama Restoran</label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Alamat Fisik Restoran</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
              <CardHeader className="border-b border-border/20 pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="size-4.5 text-primary" />
                  Konfigurasi Pajak & Keuangan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tarif PPN (%)</label>
                  <input
                    type="number"
                    value={ppnRate}
                    onChange={(e) => setPpnRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">Persentase tarif pajak pertambahan nilai yang diterapkan pada quotation.</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <button type="submit" className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-lg shadow-primary/25 cursor-pointer">
                <Save className="size-4" />
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
