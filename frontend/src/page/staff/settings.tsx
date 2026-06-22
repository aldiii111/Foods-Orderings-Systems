import { useEffect, useState, type FormEvent } from "react";
import { 
  Sliders, 
  Store,
  Mail,
  Database,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";

export function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await erpService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setFormLoading(true);
    try {
      await erpService.saveSettings(settings);
      setSuccessMsg("Pengaturan ERP berhasil disimpan!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleBackup = () => {
    alert("Memulai pencadangan data sistem... Backup file .json berhasil diunduh.");
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foodorder_erp_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Pengaturan Sistem (Settings)</h2>
            <p className="text-xs text-muted-foreground font-medium">Ubah preferensi operasional ERP, PPN rates, templates surel, dan cadangan data.</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
              {successMsg}
            </div>
          )}

          {loading ? (
            <div className="space-y-6 max-w-2xl">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
              {/* Company Info */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardHeader className="border-b border-border/20 pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Store className="size-4.5 text-primary" />
                    Identitas Instansi / Perusahaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Perusahaan *</label>
                      <input
                        type="text"
                        required
                        value={settings.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telepon Kantor</label>
                      <input
                        type="text"
                        value={settings.companyPhone}
                        onChange={(e) => handleChange("companyPhone", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Kontak Resmi</label>
                    <input
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => handleChange("companyEmail", e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alamat Fisik</label>
                    <textarea
                      value={settings.companyAddress}
                      onChange={(e) => handleChange("companyAddress", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tax & Currency */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardHeader className="border-b border-border/20 pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sliders className="size-4.5 text-primary" />
                    Pajak & Mata Uang Definisional
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Default Tarif Pajak PPN (%)</label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => handleChange("taxRate", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Default Simbol Valuta</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                      >
                        <option value="IDR">IDR (Rp)</option>
                        <option value="USD">USD ($)</option>
                        <option value="SGD">SGD (S$)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Templates */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardHeader className="border-b border-border/20 pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Mail className="size-4.5 text-primary" />
                    Template Surel Notifikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Template Email Quotation</label>
                    <textarea
                      value={settings.emailTemplateQuotation}
                      onChange={(e) => handleChange("emailTemplateQuotation", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Template Email Invoice</label>
                    <textarea
                      value={settings.emailTemplateInvoice}
                      onChange={(e) => handleChange("emailTemplateInvoice", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Database Backup */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardHeader className="border-b border-border/20 pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="size-4.5 text-primary" />
                    Pencadangan Sistem & Eksternal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-foreground">Download Backup Data</h5>
                    <p className="text-[10px] text-muted-foreground">Cadangkan file json konfigurasi ERP untuk pemulihan nanti.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackup}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Backup Data
                  </button>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={formLoading} className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-md cursor-pointer">
                  {formLoading && <Loader2 className="size-3 animate-spin" />}
                  Simpan Konfigurasi
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
