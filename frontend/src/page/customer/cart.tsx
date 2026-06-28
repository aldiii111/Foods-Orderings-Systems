import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  AlertTriangle,
  CheckCircle2,
  Receipt
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
}

export function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCart = () => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        setCartItems(JSON.parse(cart));
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newItems));
    setCartItems(newItems);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.stock) {
          setErrorMsg(`Stok maksimal untuk ${item.name} adalah ${item.stock} porsi.`);
          setTimeout(() => setErrorMsg(null), 3000);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 10000 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cartItems.length === 0) {
      setErrorMsg("Keranjang belanja Anda kosong.");
      return;
    }

    if (!address.trim()) {
      setErrorMsg("Alamat pengiriman wajib diisi.");
      return;
    }

    try {
      // Load existing orders
      const existingOrdersStr = localStorage.getItem("orders");
      const orders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        items: cartItems,
        subtotal,
        deliveryFee,
        total,
        address,
        notes,
        paymentMethod: paymentMethod === "cod" ? "Bayar di Tempat (COD)" : "QRIS / E-Wallet",
        status: "Diproses"
      };

      orders.unshift(newOrder); // Add to the top of list
      localStorage.setItem("orders", JSON.stringify(orders));
      
      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      
      setCheckoutSuccess(true);
      setTimeout(() => {
        navigate("/customer/orders");
      }, 2000);
    } catch (err) {
      console.error("Gagal melakukan checkout:", err);
      setErrorMsg("Terjadi kesalahan saat memproses pesanan.");
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="size-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="size-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Pesanan Berhasil Dibuat!</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Terima kasih! Pesanan Anda sedang diproses. Halaman akan dialihkan ke Riwayat Pesanan Anda.
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-card border border-border/40 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm">
        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <ShoppingBag className="size-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Keranjang Anda Kosong</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            Belum ada menu makanan yang dipilih. Jelajahi menu kami sekarang juga!
          </p>
        </div>
        <Link to="/customer/menu">
          <button className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/15 cursor-pointer">
            Pesan Makanan Sekarang
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Toast Alert */}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-rose-600 text-white rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <AlertTriangle className="size-5 shrink-0" />
          <span className="text-xs font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Cart Items List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ShoppingBag className="size-5 text-primary" />
          Daftar Keranjang Belanja ({cartItems.length} menu)
        </h3>

        <div className="space-y-4.5">
          {cartItems.map((item) => (
            <Card key={item.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card">
              <CardContent className="p-4 flex gap-4 items-center">
                {/* Product Image */}
                <div className="size-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="size-6 text-muted-foreground/45" />
                  )}
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Rp {Number(item.price ?? 0).toLocaleString("id-ID")} / porsi
                    </p>
                    <span className="inline-block text-[10px] text-muted-foreground">Stok: {item.stock}</span>
                  </div>

                  <div className="flex items-center gap-4.5 self-start sm:self-center">
                    {/* Controls */}
                    <div className="flex items-center border border-border/60 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Checkout Sidebar Card */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Receipt className="size-5 text-primary" />
          Detail Pembayaran & Checkout
        </h3>

        <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleCheckout} className="space-y-5">
              {/* Order Summary list */}
              <div className="space-y-3 pb-4 border-b border-border/40">
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Ongkos Kirim</span>
                  <span>Rp {deliveryFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-foreground pt-1">
                  <span>Total Bayar</span>
                  <span className="text-primary text-base">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  Alamat Pengiriman *
                </label>
                <textarea
                  placeholder="Masukkan alamat lengkap rumah Anda..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none"
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Catatan Pesanan
                </label>
                <input
                  type="text"
                  placeholder="Misal: Sendok tidak usah, sambal dipisah..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <CreditCard className="size-3.5 text-primary" />
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`px-3 py-2.5 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/10"
                        : "border-border/60 bg-slate-50 dark:bg-slate-900 text-muted-foreground hover:bg-slate-100"
                    }`}
                  >
                    COD (Cash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className={`px-3 py-2.5 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      paymentMethod === "qris"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/10"
                        : "border-border/60 bg-slate-50 dark:bg-slate-900 text-muted-foreground hover:bg-slate-100"
                    }`}
                  >
                    QRIS E-Wallet
                  </button>
                </div>
              </div>

              {/* Submit Checkout */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer text-center"
              >
                Buat Pesanan & Checkout
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
