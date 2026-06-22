import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { Sidebars } from "@/components/Sidebar";
import Dashboard from "@/page/staff/dashboard";
import { ProductsManage } from "@/page/staff/productsManage";
import { StockMovements } from "@/page/staff/stockMovements";
import { Quotations } from "@/page/staff/quotations";
import { CreateQuotation } from "@/page/staff/createQuotation";
import { QuotationDetail } from "@/page/staff/quotationDetail";
import { Invoices } from "@/page/staff/invoices";
import { CreateInvoice } from "@/page/staff/createInvoice";
import { SalesReports } from "@/page/staff/salesReports";
import { CustomersManage } from "@/page/staff/customers";
import { UsersManage } from "@/page/staff/users";
import { Settings } from "@/page/staff/settings";

import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  ChevronRight,
  Command,
  CheckCheck,
  X
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { erpService } from "@/services/erpService";

export const Staff: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  
  // Header dropdown states
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch notifications initially and set timer
    async function loadNotifications() {
      try {
        const data = await erpService.getNotifications();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        console.error(err);
      }
    }
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Listen to keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await erpService.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Build breadcrumbs path
  const pathnames = location.pathname.split("/").filter(x => x);

  // Search routing
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Direct user to inventory search or similar
    setIsSearchOpen(false);
    navigate(`/staff/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <SidebarProvider>
      <Sidebars />
      <SidebarInset className="flex flex-col flex-1 min-w-0">
        
        {/* Unified Top Navbar */}
        <header className="h-14 border-b border-border/40 bg-card/60 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
          
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">FoodOrder</span>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const formattedName = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
              
              if (value === "staff") return null;

              return (
                <React.Fragment key={to}>
                  <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                  {isLast ? (
                    <span className="text-xs font-bold text-foreground truncate max-w-[120px] sm:max-w-[200px]">{formattedName}</span>
                  ) : (
                    <Link to={to} className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors truncate max-w-[120px]">
                      {formattedName}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            
            {/* Ctrl + K Search trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border/60 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-medium text-muted-foreground transition-colors cursor-pointer"
            >
              <Search className="size-3.5" />
              <span>Pencarian Global...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 border rounded bg-slate-100 font-mono text-[9px] uppercase shadow-sm">
                <Command className="size-2" />K
              </kbd>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center relative cursor-pointer"
              >
                <Bell className="size-4.5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border border-card">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border/50 rounded-2xl shadow-xl z-50 p-2 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 pb-2">
                    <span className="font-bold text-foreground">Notification Center</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="size-3" />
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-border/20">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">Tidak ada notifikasi baru</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-3 space-y-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                          <h5 className="font-bold text-foreground flex justify-between">
                            {notif.title}
                            {!notif.read && <span className="size-1.5 rounded-full bg-primary inline-block self-center" />}
                          </h5>
                          <p className="text-muted-foreground text-[10px] leading-relaxed">{notif.message}</p>
                          <span className="text-[8px] text-muted-foreground/60 block">{new Date(notif.createdAt).toLocaleDateString("id-ID")}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {role?.substring(0, 2) || "ST"}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-2xl shadow-xl z-50 p-2 text-xs animate-in fade-in duration-200">
                  <div className="px-3 py-2 border-b border-border/40 mb-1">
                    <p className="font-bold text-foreground truncate">Staf FoodOrder</p>
                    <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit mt-1">
                      {role || "STAFF"}
                    </span>
                  </div>
                  
                  <Link to="/staff/settings">
                    <button 
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground cursor-pointer"
                    >
                      <User className="size-4 text-muted-foreground" />
                      Profil Saya
                    </button>
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/20 cursor-pointer mt-1 border-t border-border/20"
                  >
                    <LogOut className="size-4" />
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Global Search Pop-up Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] p-4">
            <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-border/40 p-4">
                <Search className="size-4.5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari menu makanan, SKU, kode barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 text-sm bg-transparent border-none focus:outline-none text-foreground"
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)} 
                  className="size-6 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full flex items-center justify-center text-muted-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </form>
              <div className="p-4 text-[10px] text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <span>Tekan <span className="font-bold">Enter</span> untuk memulai pencarian.</span>
                <span>Tekan <kbd className="border bg-card px-1 rounded shadow-sm">ESC</kbd> untuk keluar.</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Routes Screen */}
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsManage />} />
          <Route path="stock-movements" element={<StockMovements />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="quotations/create" element={<CreateQuotation />} />
          <Route path="quotations/:id" element={<QuotationDetail />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="sales-reports" element={<SalesReports />} />
          <Route path="customers" element={<CustomersManage />} />
          <Route path="users" element={<UsersManage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>

      </SidebarInset>
    </SidebarProvider>
  );
}