import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Calculator, 
  UserPlus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { productService } from "@/services/productService";
import type { Product } from "@/types";

// ====== BACKEND API REQUIREMENT ======
// Endpoint 1: GET /api/products (Untuk mencari dan menambahkan produk ke baris penawaran)
// Endpoint 2: GET /api/customers (Untuk auto-complete pilihan pelanggan)
// Endpoint 3: POST /api/quotations
// Body Payload: {
//   customerName: string;
//   dateExpired: string;
//   notes: string;
//   items: Array<{
//     productId: number;
//     quantity: number;
//     price: number;
//   }>;
//   subtotal: number;
//   tax: number;
//   totalAmount: number;
// }

interface SelectedItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export function CreateQuotation() {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>([]);
  
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [dateExpired, setDateExpired] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // Load products list for selection
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getProducts();
        setProductsList(data);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    }
    loadProducts();
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
        price: defaultProduct.price,
        quantity: 1,
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
      price: selectedProduct.price,
      quantity: 1,
      stock: selectedProduct.stock
    };
    setSelectedItems(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    if (qty <= 0) return;
    const updated = [...selectedItems];
    updated[index].quantity = qty;
    setSelectedItems(updated);
  };

  const handleRemoveRow = (index: number) => {
    setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
  };

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.11);
  const totalAmount = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !dateExpired || selectedItems.length === 0) {
      alert("Mohon lengkapi data pelanggan, tanggal expired, dan minimal 1 item.");
      return;
    }

    // Process submission simulation
    const quotations = JSON.parse(localStorage.getItem("dummy-quotations") || "[]");
    const newQuotation = {
      id: quotations.length + 10,
      quotationNo: `QTN-2026-0${quotations.length + 6}`,
      customerName,
      dateCreated: new Date().toISOString().split('T')[0],
      dateExpired,
      totalAmount,
      status: "PENDING"
    };

    quotations.unshift(newQuotation);
    localStorage.setItem("dummy-quotations", JSON.stringify(quotations));
    
    alert(`Sukses membuat penawaran harga ${newQuotation.quotationNo}!`);
    navigate("/staff/quotations");
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
              <p className="text-xs text-muted-foreground font-medium">Buat dokumen negosiasi harga porsi besar dengan pelanggan.</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Form & Item Rows */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer & Info Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Data Pelanggan & Durasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <UserPlus className="size-3.5 text-primary" />
                        Nama Pelanggan / Institusi *
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: PT Agung Podomoro Group"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        Tanggal Kedaluwarsa Penawaran *
                      </label>
                      <input
                        type="date"
                        value={dateExpired}
                        onChange={(e) => setDateExpired(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Catatan Internal / Negosiasi</label>
                    <textarea
                      placeholder="Masukkan detail khusus, syarat ketentuan pembayaran, dll..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Items Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/60">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Item Makanan & Jumlah</h3>
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
                            <th className="px-6 py-3 text-right">Harga Porsi</th>
                            <th className="px-6 py-3 text-center">Kuantitas</th>
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
                                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                                >
                                  {productsList.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                      {prod.name} (Stok: {prod.stock})
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-3 text-right text-xs font-bold">
                                Rp {item.price.toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex justify-center">
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                                    className="w-16 px-2 py-1 text-center text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-bold"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right text-xs font-extrabold text-foreground">
                                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
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
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="size-4.5 text-primary" />
                    Kalkulasi Biaya
                  </h3>

                  <div className="space-y-3 pb-4 border-b border-border/40 text-xs">
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Subtotal</span>
                      <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>PPN (11%)</span>
                      <span>Rp {tax.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-foreground pt-1">
                      <span>Total Biaya</span>
                      <span className="text-primary text-base">Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link to="/staff/quotations" className="w-1/2">
                      <button
                        type="button"
                        className="w-full py-2.5 text-xs font-bold border border-border/60 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all text-foreground cursor-pointer text-center"
                      >
                        Batal
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="w-1/2 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-lg shadow-primary/10 cursor-pointer"
                    >
                      <Save className="size-3.5" />
                      Simpan
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
