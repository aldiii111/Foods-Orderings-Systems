import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  CreditCard,
  ChefHat
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  notes: string;
  paymentMethod: string;
  status: string;
}

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const ordersData = localStorage.getItem("orders");
      if (ordersData) {
        setOrders(JSON.parse(ordersData));
      }
    } catch {
      setOrders([]);
    }
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-card border border-border/40 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm">
        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <ClipboardList className="size-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Belum Ada Pesanan</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            Anda belum pernah memesan makanan apapun. Silakan kunjungi menu kami terlebih dahulu!
          </p>
        </div>
        <Link to="/customer/menu">
          <button className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/15 cursor-pointer">
            Lihat Menu Makanan
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <ClipboardList className="size-5 text-primary" />
        Riwayat Pemesanan Saya
      </h3>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card">
            {/* Header info */}
            <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/30">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-foreground">{order.id}</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-lg border bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30">
                    <Clock className="size-3 animate-spin" />
                    {order.status}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span>{formatDate(order.date)}</span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Total Pembayaran</span>
                <span className="text-base font-extrabold text-primary">
                  Rp {order.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <CardContent className="p-6 space-y-5">
              {/* Items ordered */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Menu Yang Dipesan
                </span>
                <div className="divide-y divide-border/40">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="size-5 text-muted-foreground/50" />
                          )}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h5>
                          <span className="text-xs text-muted-foreground">
                            {item.quantity} porsi x Rp {item.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                {/* Delivery Info */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" />
                    Alamat Antar
                  </span>
                  <p className="text-xs text-foreground font-semibold leading-relaxed">
                    {order.address}
                  </p>
                  {order.notes && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                      Catatan: "{order.notes}"
                    </p>
                  )}
                </div>

                {/* Payment Info */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="size-3.5 text-primary" />
                    Metode Pembayaran
                  </span>
                  <p className="text-xs text-foreground font-semibold">
                    {order.paymentMethod}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium pt-1">
                    <ChefHat className="size-3.5 text-primary shrink-0" />
                    <span>Dapur sedang menyiapkan masakan Anda.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
