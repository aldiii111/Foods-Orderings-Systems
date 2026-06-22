import { useEffect, useState, type FormEvent } from "react";
import { 
  Search, 
  Plus, 
  Shield, 
  UserCheck, 
  Mail,
  X,
  Loader2,
  History,
  Lock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { erpService } from "@/services/erpService";
import type { User, AuditLog } from "@/types";

export function UsersManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // Modal Dialog Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "reset">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");
  const [status, setStatus] = useState("ACTIVE");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [usersData, logsData] = await Promise.all([
          erpService.getUsers(),
          erpService.getAuditLogs()
        ]);
        setUsers(usersData);
        setAuditLogs(logsData);
      } catch (err: any) {
        console.error("Gagal memuat manajemen staf:", err);
        setError("Gagal memuat manajemen staf / Audit log (Pastikan Anda memiliki akses Admin).");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshList = async () => {
    try {
      const usersData = await erpService.getUsers();
      setUsers(usersData);
      const logsData = await erpService.getAuditLogs();
      setAuditLogs(logsData);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("STAFF");
    setStatus("ACTIVE");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setModalType("edit");
    setSelectedUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setStatus(u.status || "ACTIVE");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openResetModal = (u: User) => {
    setModalType("reset");
    setSelectedUser(u);
    setPassword("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    setFormLoading(true);
    try {
      if (modalType === "add") {
        await erpService.createUser({ name, email, password, role, status });
      } else if (modalType === "edit" && selectedUser) {
        await erpService.updateUser(selectedUser.id, { name, email, role, status });
      } else if (modalType === "reset" && selectedUser) {
        await erpService.resetUserPassword(selectedUser.id, { password });
      }
      setIsModalOpen(false);
      refreshList();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal memproses.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Kelola Staf & Keamanan</h2>
            <p className="text-xs text-muted-foreground font-medium">Atur hak akses akun administrator, role RBAC, dan audit aktivitas sistem.</p>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md cursor-pointer">
            <Plus className="size-4" />
            Tambah Akun Staf
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {error && (
            <Card className="border-destructive/20 bg-destructive/5 text-destructive p-4 rounded-xl flex items-center gap-3">
              <Shield className="size-5 shrink-0" />
              <div className="text-xs font-semibold">{error}</div>
            </Card>
          )}

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari akun staf berdasarkan nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total {filteredUsers.length} akun terdaftar
            </div>
          </div>

          {/* Table Card */}
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : (
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
                  <tbody className="divide-y divide-border/40 text-xs text-foreground">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {user.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 font-mono text-[10px]">
                            <Mail className="size-3.5 text-muted-foreground/60" />
                            {user.email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
                            <Shield className="size-3" />
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold border rounded-lg ${
                            user.status === 'ACTIVE'
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            <UserCheck className="size-3" />
                            {user.status === 'ACTIVE' ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditModal(user)} className="px-2.5 py-1 hover:bg-slate-50 text-[10px] font-bold border rounded-lg text-primary cursor-pointer">
                              Edit
                            </button>
                            <button onClick={() => openResetModal(user)} className="px-2.5 py-1 hover:bg-slate-50 text-[10px] font-bold border rounded-lg text-muted-foreground cursor-pointer flex items-center gap-1">
                              <Lock className="size-3" />
                              Reset Password
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Audit Logs Sub-Section */}
          <div className="pt-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider font-mono">
              <History className="size-4 text-primary" />
              Sistem Audit Log (Aktivitas ERP)
            </h3>
            {loading ? (
              <Skeleton className="h-40 w-full rounded-2xl" />
            ) : (
              <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card">
                <div className="max-h-72 overflow-y-auto text-[11px] text-muted-foreground font-mono">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border/40 text-[9px] font-bold uppercase tracking-wider">
                        <th className="p-3">Waktu</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Tindakan</th>
                        <th className="p-3">Detail Parameter</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/20">
                          <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString("id-ID")}</td>
                          <td className="p-3 font-semibold text-foreground">{log.user?.name || "System / Guest"}</td>
                          <td className="p-3"><span className="text-primary font-bold">{log.action}</span></td>
                          <td className="p-3 max-w-md truncate">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">
                {modalType === "add" && "Tambah Akun Staf"}
                {modalType === "edit" && "Edit Pengaturan Akun"}
                {modalType === "reset" && "Reset Sandi Pengguna"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive font-semibold">{formError}</div>
              )}

              {modalType !== "reset" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Staf"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Kontak *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@foodorder.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                    />
                  </div>
                </>
              )}

              {modalType === "add" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Sandi Rahasia"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                  />
                </div>
              )}

              {modalType === "reset" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password Baru *</label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl"
                  />
                </div>
              )}

              {modalType !== "reset" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Role Hak Akses</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="STAFF">Staff</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status Akun</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-border/60 rounded-xl focus:outline-none"
                    >
                      <option value="ACTIVE">Aktif (Active)</option>
                      <option value="INACTIVE">Nonaktif (Inactive)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="submit" disabled={formLoading} className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
                  {formLoading && <Loader2 className="size-3 animate-spin" />}
                  Simpan Akses
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
