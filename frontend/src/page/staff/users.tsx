import { useState } from "react";
import { 
  Search, 
  Plus, 
  Shield, 
  UserCheck, 
  Mail 
} from "lucide-react";
import { Card } from "@/components/ui/card";

// ====== BACKEND API REQUIREMENT ======
// Endpoint: GET /api/users
// Response: Array of {
//   id: number;
//   name: string;
//   email: string;
//   role: 'staff' | 'admin';
//   status: 'ACTIVE' | 'INACTIVE';
// }

const DUMMY_USERS = [
  { id: 1, name: "Budi Santoso", email: "budi@foodorder.com", role: "admin", status: "ACTIVE" },
  { id: 2, name: "Siti Rahma", email: "siti@foodorder.com", role: "staff", status: "ACTIVE" },
  { id: 3, name: "Andi Wijaya", email: "andi@foodorder.com", role: "staff", status: "ACTIVE" },
  { id: 4, name: "Dewi Lestari", email: "dewi@foodorder.com", role: "staff", status: "INACTIVE" },
];

export function UsersManage() {
  const [search, setSearch] = useState("");

  const filteredUsers = DUMMY_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Kelola Staf (Staff Management)</h2>
            <p className="text-xs text-muted-foreground font-medium">Atur hak akses akun administrator dan akun staf lapangan.</p>
          </div>
          <button onClick={() => alert("Tambah staf baru (Slicing/Mock)")} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-lg shadow-primary/20 cursor-pointer">
            <Plus className="size-4" />
            Tambah Akun
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
                placeholder="Cari akun staf berdasarkan nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total {filteredUsers.length} akun terdaftar
            </div>
          </div>

          {/* Table Card */}
          <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Nama Staf</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role / Hak Akses</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm text-foreground">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="size-3.5" />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/20">
                          <Shield className="size-3" />
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold border rounded-lg ${
                          user.status === 'ACTIVE'
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20"
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                        }`}>
                          <UserCheck className="size-3" />
                          {user.status === 'ACTIVE' ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => alert(`Ubah status ${user.name}`)} className="px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-primary cursor-pointer border border-border">
                            Ubah Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
