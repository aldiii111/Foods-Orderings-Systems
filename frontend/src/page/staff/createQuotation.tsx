import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Calculator, 
  UserPlus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { productService } from "@/services/productService";
import { erpService } from "@/services/erpService";
import type { Product, Customer } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectedItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  discount: number; // Item level discount
  stock: number;
}

export function CreateQuotation() {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [dateExpired, setDateExpired] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [discount, setDiscount] = useState<number>(0); // Global discount
  const [tax, setTax] = useState<number>(10); // Tax percentage
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load products list for selection
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pRes, cRes] = await Promise.all([
          productService.getProducts(),
          erpService.getCustomers()
        ]);
        const pList = Array.isArray(pRes) ? pRes : (pRes as any).products || [];
        setProductsList(pList);
        setCustomersList(cRes);
        
        if (cRes.length > 0) setSelectedCustomerId(cRes[0].id.toString());
      } catch (err) {
        console.error("Gagal memuat data awal penawaran:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddItemRow = () => {
    if (productsList.length === 0) return;
    
    // Choose first product as default
    const defaultProduct = productsList[0];
    
    // Check if already in list
    const exists = selectedItems.some(item => item.productId === defaultProduct.id);
    if (exists) return;

    setSelectedItems([
      ...selectedItems,
      {
        productId: defaultProduct.id,
        name: defaultProduct.name,
        price: defaultProduct.sellingPrice || defaultProduct.price || 0,
        quantity: 1,
        discount: 0,
        stock: defaultProduct.stock
      }
    ]);
  };

  const handleProductChange = (index: number, productId: number) => {
    const selectedProduct = productsList.find(p => p.id === productId);
    if (!selectedProduct) return;

    const updated = [...selectedItems];
    updated[index] = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.sellingPrice || selectedProduct.price || 0,
      quantity: 1,
      discount: 0,
      stock: selectedProduct.stock
    };
    setSelectedItems(updated);
  };

  const handleItemValueChange = (index: number, field: "quantity" | "discount" | "price", val: number) => {
    if (val < 0) return;
    const updated = [...selectedItems];
    (updated[index] as any)[field] = val;
    setSelectedItems(updated);
  };

  const handleRemoveRow = (index: number) => {
    setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
  };

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + ((item.price - item.discount) * item.quantity), 0);
  const taxAmount = Math.round((subtotal - discount) * (tax / 100));
  const totalAmount = Math.max(subtotal - discount + taxAmount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedCustomerId || !dateExpired || selectedItems.length === 0) {
      setFormError("Mohon lengkapi data pelanggan, tanggal expired, dan minimal 1 item.");
      return;
    }

    setFormLoading(true);
    try {
      await erpService.createQuotation({
        customerId: Number(selectedCustomerId),
        expiryDate: dateExpired,
        notes,
        terms,
        discount,
        tax,
        products: selectedItems
      });
      
      alert("Sukses membuat penawaran harga!");
      navigate("/staff/quotations");
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal menyimpan penawaran.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/staff/quotations" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4.5" />
            </Link>
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Buat Penawaran Baru</h2>
              <p className="text-xs text-muted-foreground font-medium">Buat dokumen penawaran harga untuk prospek pelanggan baru.</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-60 w-full rounded-2xl" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left side: Form & Item Rows */}
              <div className="lg:col-span-2 space-y-6">
                
                {formError && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive font-semibold">{formError}</div>
                )}

                {/* Customer & Info Card */}
                <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Data Pelanggan & Durasi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <UserPlus className="size-3.5 text-primary" />
                          Pelanggan CRM *
                        </label>
                        <select
                          value={selectedCustomerId}
                          onChange={(e) => setSelectedCustomerId(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                          required
                        >
                          <option value="">Pilih Pelanggan...</option>
                          {customersList.map((cust) => (
                            <option key={cust.id} value={cust.id}>{cust.name} ({cust.email || "no email"})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Tanggal Kedaluwarsa Penawaran *
                        </label>
                        <input
                          type="date"
                          value={dateExpired}
                          onChange={(e) => setDateExpired(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Catatan Penawaran</label>
                        <textarea
                          placeholder="Masukkan catatan khusus..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Syarat & Ketentuan</label>
                        <textarea
                          placeholder="Misal: Pembayaran DP 50%, Pelunasan H-1 event..."
                          value={terms}
                          onChange={(e) => setTerms(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items Card */}
                <Card className="border-border/40 shadow-sm rounded-2xl bg-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/60">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Item Penjualan</h3>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-lg cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      Tambah Baris
                    </button>
                  </div>
                  <CardContent className="p-0">
                    {selectedItems.length === 0 ? (
                      <div className="text-center py-10 text-xs text-muted-foreground">
                        Belum ada item ditambahkan. Klik tombol Tambah Baris untuk memasukkan produk.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-slate-50/20">
                              <th className="px-6 py-3">Nama Produk</th>
                              <th className="px-6 py-3 text-right">Harga Unit</th>
                              <th className="px-6 py-3 text-center">Kuantitas</th>
                              <th className="px-6 py-3 text-right">Diskon Item</th>
                              <th className="px-6 py-3 text-right">Total Harga</th>
                              <th className="px-6 py-3 text-center">Hapus</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {selectedItems.map((item, index) => (
                              <tr key={index} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                                <td className="px-6 py-3 min-w-[200px]">
                                  <select
                                    value={item.productId}
                                    onChange={(e) => handleProductChange(index, Number(e.target.value))}
                                    className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                  >
                                    {productsList.map((prod) => (
                                      <option key={prod.id} value={prod.id}>
                                        {prod.name} (Stok: {prod.stock})
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemValueChange(index, "price", Number(e.target.value))}
                                    className="w-20 px-2 py-1 text-right text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg focus:outline-none text-foreground font-semibold font-mono"
                                  />
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex justify-center">
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) => handleItemValueChange(index, "quantity", Number(e.target.value))}
                                      className="w-14 px-2 py-1 text-center text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg focus:outline-none text-foreground font-bold font-mono"
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <input
                                    type="number"
                                    value={item.discount}
                                    onChange={(e) => handleItemValueChange(index, "discount", Number(e.target.value))}
                                    className="w-20 px-2 py-1 text-right text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg focus:outline-none text-foreground font-mono"
                                  />
                                </td>
                                <td className="px-6 py-3 text-right text-xs font-bold font-mono text-foreground">
                                  Rp {((item.price - item.discount) * item.quantity).toLocaleString("id-ID")}
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex justify-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveRow(index)}
                                      className="p-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
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
                  </CardContent>
                </Card>

              </div>

              {/* Right side: Calculation Card & Save */}
              <div className="space-y-6">
                <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calculator className="size-4.5 text-primary" />
                      Kalkulasi Biaya
                    </h3>

                    <div className="space-y-3 pb-4 border-b border-border/40 text-xs">
                      <div className="flex justify-between text-muted-foreground font-semibold">
                        <span>Subtotal</span>
                        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Diskon Global (Rp)</span>
                          <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                            className="w-24 px-2 py-1 text-right text-xs border border-border/60 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Pajak (Tax %)</span>
                          <input
                            type="number"
                            value={tax}
                            onChange={(e) => setTax(Number(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-right text-xs border border-border/60 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
                        <span>Jumlah PPN</span>
                        <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
                      </div>

                      <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t border-dashed">
                        <span>Total Biaya</span>
                        <span className="text-primary text-base">Rp {totalAmount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Link to="/staff/quotations" className="w-1/2">
                        <button
                          type="button"
                          className="w-full py-2 text-xs font-bold border border-border rounded-xl hover:bg-slate-50 transition-all text-foreground cursor-pointer text-center"
                        >
                          Batal
                        </button>
                      </Link>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-1/2 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        {formLoading ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}
