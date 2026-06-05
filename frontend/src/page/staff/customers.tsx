import { useState } from "react";
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Edit
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ====== BACKEND API REQUIREMENT ======
// Endpoint: GET /api/customers
// Response: Array of {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   totalOrders: number;
// }

const DUMMY_CUSTOMERS = [
  { id: 1, name: "Hotel Santika Premium", email: "info@santikapremium.com", phone: "021-5551234", address: "Jl. Hayam Wuruk No. 125, Jakarta", totalOrders: 14 },
  { id: 2, name: "PT Global Tech Solutions", email: "finance@globaltech.co.id", phone: "021-8884321", address: "Sudirman Central Business District, Jakarta", totalOrders: 9 },
  { id: 3, name: "Catering Ibu Fatma", email: "fatma.catering@gmail.com", phone: "0812-3456-7890", address: "Jl. Margonda Raya No. 45, Depok", totalOrders: 27 },
];

export function CustomersManage() {
  const [search, setSearch] = useState("");

  const filteredCustomers = DUMMY_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Kelola Pelanggan (Customers)</h2>
            <p className="text-xs text-muted-foreground font-medium">Data kontak klien, institusi korporat, dan riwayat pesanan.</p>
          </div>
          <button onClick={() => alert("Tambah pelanggan baru (Slicing/Mock)")} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-lg shadow-primary/20 cursor-pointer">
            <Plus className="size-4" />
            Tambah Pelanggan
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari pelanggan berdasarkan nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Menampilkan {filteredCustomers.length} pelanggan terdaftar
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <Card key={customer.id} className="border-border/40 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-card relative group">
                <button onClick={() => alert(`Edit ${customer.name}`)} className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105 cursor-pointer">
                  <Edit className="size-4 text-primary" />
                </button>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground text-sm sm:text-base line-clamp-1">{customer.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">Total: {customer.totalOrders} Pesanan</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-border/20 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="line-clamp-1">{customer.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
