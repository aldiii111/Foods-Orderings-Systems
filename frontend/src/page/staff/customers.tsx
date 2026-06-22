import { useEffect, useState, type FormEvent } from "react";
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Edit,
  Trash2,
  Download,
  Building,
  FileText,
  Receipt,
  X,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";
import type { Customer } from "@/types";

export function CustomersManage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");

  // Modal Dialog Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Customer Detail Drawer/View State
  const [activeDetailCustomer, setActiveDetailCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "quotations" | "invoices">("info");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError(null);
        const data = await erpService.getCustomers();
        setCustomers(data);
      } catch (err: any) {
        console.error("Gagal memuat customers:", err);
        setError("Gagal memuat data pelanggan.");
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const refreshList = async () => {
    try {
      const data = await erpService.getCustomers();
      setCustomers(data);
      if (activeDetailCustomer) {
        const updated = data.find((c: Customer) => c.id === activeDetailCustomer.id);
        if (updated) {
          // Fetch full customer details with relations
          const fullDetail = await erpService.getCustomerById(updated.id);
          setActiveDetailCustomer(fullDetail);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Customer, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering detail card open
    setModalType("edit");
    setSelectedCustomer(c);
    setName(c.name);
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setAddress(c.address || "");
    setNotes(c.notes || "");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenDetail = async (c: Customer) => {
    try {
      const fullCust = await erpService.getCustomerById(c.id);
      setActiveDetailCustomer(fullCust);
      setActiveTab("info");
    } catch (err) {
      alert("Gagal memuat detail pelanggan");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name) {
      setFormError("Nama pelanggan wajib diisi.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = { name, email, phone, address, notes };
      if (modalType === "add") {
        await erpService.createCustomer(payload);
      } else if (modalType === "edit" && selectedCustomer) {
        await erpService.updateCustomer(selectedCustomer.id, payload);
      }
      setIsModalOpen(false);
      refreshList();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal memproses data.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus data pelanggan ini? Semua transaksi terkait akan terpengaruh.")) return;
    try {
      await erpService.deleteCustomer(id);
      refreshList();
    } catch (err) {
      alert("Gagal menghapus data pelanggan");
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Nama,Email,Phone,Address,Notes,Total Belanja\n";
    const rows = customers.map(c => 
      `"${c.id}","${c.name}","${c.email || ""}","${c.phone || ""}","${c.address || ""}","${c.notes || ""}","${c.totalPurchases}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "foodorder_customers_crm.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">CRM Directory (Pelanggan)</h2>
            <p className="text-xs text-muted-foreground font-medium">Data kontak klien, profil korporat, riwayat pesanan, dan total pembelian.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              Ekspor CSV
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md cursor-pointer">
              <Plus className="size-4" />
              Tambah Pelanggan
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive font-semibold">
              {error}
            </div>
          )}
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari pelanggan berdasarkan nama, email, telepon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Menampilkan {filteredCustomers.length} pelanggan terdaftar
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-2xl shadow-sm">
              Tidak ada data pelanggan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map(customer => (
                <Card 
                  key={customer.id} 
                  onClick={() => handleOpenDetail(customer)}
                  className="border-border/40 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all bg-card relative group cursor-pointer hover:border-primary/40"
                >
                  <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => openEditModal(customer, e)} className="size-7 rounded-md bg-white border dark:bg-slate-900 text-primary flex items-center justify-center shadow-sm hover:scale-105 cursor-pointer">
                      <Edit className="size-3.5" />
                    </button>
                    <button onClick={(e) => handleDelete(customer.id, e)} className="size-7 rounded-md bg-white border dark:bg-slate-900 text-rose-600 flex items-center justify-center shadow-sm hover:scale-105 cursor-pointer">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {customer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-foreground text-sm line-clamp-1">{customer.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-mono">ID: CUST-{customer.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-border/20 text-[11px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="size-3.5 text-muted-foreground/60" />
                        <span className="truncate">{customer.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-3.5 text-muted-foreground/60" />
                        <span>{customer.phone || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-muted-foreground/60 shrink-0" />
                        <span className="line-clamp-1">{customer.address || "-"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Customer Detail Overlay Drawer */}
      {activeDetailCustomer && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border/60 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-6 border-b border-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-black">
                {activeDetailCustomer.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{activeDetailCustomer.name}</h3>
                <p className="text-[9px] font-mono text-muted-foreground">Total Belanja: Rp {activeDetailCustomer.totalPurchases.toLocaleString("id-ID")}</p>
              </div>
            </div>
            <button onClick={() => setActiveDetailCustomer(null)} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer text-muted-foreground">
              <X className="size-4.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border/40 text-xs">
            {([
              { id: "info", label: "Profil & Info", icon: Building },
              { id: "quotations", label: "Quotations", icon: FileText },
              { id: "invoices", label: "Invoices", icon: Receipt }
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-mono">Alamat Pengiriman</span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl">{activeDetailCustomer.address || "Belum diatur"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-mono">Kontak Email</span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl">{activeDetailCustomer.email || "Belum diatur"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-mono">Catatan Internal CRM</span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl whitespace-pre-line">{activeDetailCustomer.notes || "Tidak ada catatan internal"}</p>
                </div>
              </div>
            )}

            {activeTab === "quotations" && (
              <div className="space-y-3">
                {!activeDetailCustomer.quotations || activeDetailCustomer.quotations.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">Belum ada penawaran dibuat.</p>
                ) : (
                  activeDetailCustomer.quotations.map(q => (
                    <div key={q.id} className="p-3.5 border rounded-xl flex justify-between items-center bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-foreground">{q.number}</h4>
                        <span className="text-[10px] text-muted-foreground font-mono">{new Date(q.date).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-foreground">Rp {q.totalAmount.toLocaleString("id-ID")}</span>
                        <div className="text-[10px] font-bold text-primary">{q.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="space-y-3">
                {!activeDetailCustomer.invoices || activeDetailCustomer.invoices.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">Belum ada invoice terekam.</p>
                ) : (
                  activeDetailCustomer.invoices.map(inv => (
                    <div key={inv.id} className="p-3.5 border rounded-xl flex justify-between items-center bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-foreground">{inv.number}</h4>
                        <span className="text-[10px] text-muted-foreground font-mono">{new Date(inv.date).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-foreground">Rp {inv.totalAmount.toLocaleString("id-ID")}</span>
                        <div className="text-[10px] font-bold text-emerald-600">{inv.paymentStatus}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">
                {modalType === "add" ? "Tambah Pelanggan Baru" : "Edit Pelanggan"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive font-semibold">{formError}</div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Pelanggan / Korporat *</label>
                <input
                  type="text"
                  required
                  placeholder="PT ABC Indonesia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Kontak</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">No. Telepon / HP</label>
                  <input
                    type="text"
                    placeholder="0812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alamat Pengiriman</label>
                <textarea
                  placeholder="Alamat lengkap..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Catatan Internal</label>
                <textarea
                  placeholder="Keterangan tambahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={formLoading} className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
                  {formLoading && <Loader2 className="size-3 animate-spin" />}
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
