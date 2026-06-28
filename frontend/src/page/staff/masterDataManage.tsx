import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Tag, Scale, Loader2, X, AlertTriangle } from "lucide-react";
import { erpService } from "@/services/erpService";
import type { Category, Unit } from "@/types";

export function MasterDataManage() {
  const [activeTab, setActiveTab] = useState<"category" | "unit">("category");
  
  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSymbol, setFormSymbol] = useState(""); // Only for unit
  const [formDescription, setFormDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, unitRes] = await Promise.all([
        erpService.getCategories(),
        erpService.getUnits()
      ]);
      setCategories(catRes);
      setUnits(unitRes);
    } catch (err: any) {
      console.error(err);
      setError("Gagal memuat data master.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedItem(null);
    setFormName("");
    setFormSymbol("");
    setFormDescription("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalType("edit");
    setSelectedItem(item);
    setFormName(item.name);
    setFormSymbol(item.symbol || "");
    setFormDescription(item.description || "");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Nama wajib diisi.");
      return;
    }
    if (activeTab === "unit" && !formSymbol.trim()) {
      setFormError("Simbol unit wajib diisi.");
      return;
    }

    setFormLoading(true);
    try {
      if (activeTab === "category") {
        const payload = { name: formName, description: formDescription };
        if (modalType === "add") {
          await erpService.createCategory(payload);
        } else {
          await erpService.updateCategory(selectedItem.id, payload);
        }
      } else {
        const payload = { name: formName, symbol: formSymbol, description: formDescription };
        if (modalType === "add") {
          await erpService.createUnit(payload);
        } else {
          await erpService.updateUnit(selectedItem.id, payload);
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    try {
      if (activeTab === "category") {
        await erpService.deleteCategory(id);
      } else {
        await erpService.deleteUnit(id);
      }
      loadData();
    } catch (err: any) {
      alert("Gagal menghapus item. Mungkin item ini sedang digunakan oleh produk.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Master Data</h2>
          <p className="text-xs text-muted-foreground font-medium">Kelola Kategori Produk dan Satuan Unit.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="size-4" />
          Tambah {activeTab === "category" ? "Kategori" : "Satuan Unit"}
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive font-semibold flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-destructive" />
            <span>{error}</span>
          </div>
        )}

        {/* Custom Tabs */}
        <div className="flex gap-2 border-b border-border/40 pb-2">
          <button
            onClick={() => setActiveTab("category")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-xl border-b-2 transition-colors cursor-pointer ${
              activeTab === "category" 
                ? "border-primary text-primary bg-primary/5" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-slate-100"
            }`}
          >
            <Tag className="size-4" />
            Kategori
          </button>
          <button
            onClick={() => setActiveTab("unit")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-xl border-b-2 transition-colors cursor-pointer ${
              activeTab === "unit" 
                ? "border-primary text-primary bg-primary/5" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-slate-100"
            }`}
          >
            <Scale className="size-4" />
            Satuan Unit
          </button>
        </div>

        {/* Tables */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        ) : activeTab === "category" ? (
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4">Nama Kategori</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs">
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">Belum ada kategori.</td>
                  </tr>
                )}
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 text-center text-muted-foreground font-mono">{cat.id}</td>
                    <td className="p-4 font-bold text-foreground">{cat.name}</td>
                    <td className="p-4 text-muted-foreground">{cat.description || "-"}</td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="size-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-primary flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id!)}
                          className="size-7 rounded-md hover:bg-rose-100/50 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4">Nama Satuan</th>
                  <th className="p-4">Simbol</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs">
                {units.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Belum ada satuan unit.</td>
                  </tr>
                )}
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 text-center text-muted-foreground font-mono">{unit.id}</td>
                    <td className="p-4 font-bold text-foreground">{unit.name}</td>
                    <td className="p-4 font-mono text-primary font-semibold">{unit.symbol}</td>
                    <td className="p-4 text-muted-foreground">{unit.description || "-"}</td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(unit)}
                          className="size-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-primary flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(unit.id!)}
                          className="size-7 rounded-md hover:bg-rose-100/50 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-lg font-bold text-foreground">
                {modalType === "add" ? "Tambah" : "Edit"} {activeTab === "category" ? "Kategori" : "Satuan Unit"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive font-semibold">{formError}</div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama {activeTab === "category" ? "Kategori" : "Satuan"} *</label>
                <input
                  type="text"
                  placeholder={activeTab === "category" ? "Misal: Minuman Dingin" : "Misal: Kilogram"}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              {activeTab === "unit" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Simbol Unit *</label>
                  <input
                    type="text"
                    placeholder="Misal: Kg, gr, Pcs"
                    value={formSymbol}
                    onChange={(e) => setFormSymbol(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Deskripsi</label>
                <textarea
                  placeholder="Keterangan opsional..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={formLoading} className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
                  {formLoading && <Loader2 className="size-3 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
