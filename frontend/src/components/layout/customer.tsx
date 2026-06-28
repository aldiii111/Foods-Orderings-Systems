import { useEffect, useState } from "react";
import { Link, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  ClipboardList, 
  LogOut, 
  User, 
  Menu as MenuIcon,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { ProductList } from "@/page/customer/productList";
import { Cart } from "@/page/customer/cart";
import { OrderList } from "@/page/customer/orderList";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Customer: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const calculateCartCount = () => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const items = JSON.parse(cart) as { quantity: number }[];
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    calculateCartCount();
    
    // Listen to custom "cart-updated" event
    window.addEventListener("cart-updated", calculateCartCount);
    return () => {
      window.removeEventListener("cart-updated", calculateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Menu Makanan", path: "/customer/menu", icon: UtensilsCrossed, desc: "Pilih hidangan favorit" },
    { 
      name: "Keranjang", 
      path: "/customer/cart", 
      icon: ShoppingCart, 
      badge: cartCount > 0 ? cartCount : undefined,
      desc: "Cek pesanan siap bayar" 
    },
    { name: "Pesanan Saya", path: "/customer/orders", icon: ClipboardList, desc: "Riwayat & status order" }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090A0A] antialiased flex flex-col relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Dynamic Ambient Glows using Brand Signature Colors (#5850EC & #3B82F6) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-primary/15 via-secondary/15 to-amber-500/10 blur-[120px] rounded-full opacity-70 dark:opacity-40 -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl supports-backdrop-filter:bg-card/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/customer/menu" className="flex items-center gap-3 group">
              <div className="relative flex size-10 sm:size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-indigo-600 text-white shadow-md shadow-primary/30 group-hover:scale-105 transition-all duration-300">
                <UtensilsCrossed className="size-5 sm:size-6 text-white transition-transform group-hover:rotate-12 duration-300" />
                <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2.5 bg-amber-400"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-none">
                  Food<span className="text-primary">Order</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1 mt-0.5">
                  <Sparkles className="size-2.5 text-amber-500" /> Premium Dining
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-muted/50 rounded-2xl border border-border/50 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all relative",
                    isActive 
                      ? "text-primary bg-card shadow-sm border border-border/60" 
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  )}
                >
                  <Icon className={cn("size-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "")} />
                  <span>{item.name}</span>
                  {item.badge !== undefined && (
                    <Badge variant="default" className="ml-1 px-1.5 py-0 text-[10px] font-black bg-primary text-white animate-pulse shadow-sm shadow-primary/40 rounded-full h-4 min-w-4 flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
              <div className="size-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                <User className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground leading-tight">Pelanggan</span>
                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-all duration-200"
            >
              <LogOut className="size-3.5 mr-1.5" />
              Keluar
            </Button>
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart Quick Shortcut */}
            <Link to="/customer/cart">
              <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-muted">
                <ShoppingCart className="size-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-black bg-primary text-white rounded-full min-w-4 text-center animate-bounce shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Sheet Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl border-border/60 bg-card">
                  <MenuIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-border/40 flex flex-col">
                <SheetHeader className="p-6 border-b border-border/40 bg-muted/30">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30">
                      <UtensilsCrossed className="size-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-base font-black text-foreground">FoodOrder</span>
                      <span className="text-xs text-muted-foreground font-normal">Navigasi Pelanggan</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Menu Utama</p>
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <SheetClose asChild key={item.name}>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all border",
                            isActive 
                              ? "text-primary bg-primary/10 border-primary/20 shadow-xs" 
                              : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("size-9 rounded-xl flex items-center justify-center", isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                              <Icon className="size-4.5" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="leading-tight">{item.name}</span>
                              <span className="text-[10px] font-normal text-muted-foreground mt-0.5">{item.desc}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.badge !== undefined && (
                              <Badge variant="default" className="px-2 py-0.5 text-[10px] font-black bg-primary text-white rounded-full">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className="size-4 text-muted-foreground/60" />
                          </div>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-border/40 bg-muted/20 space-y-3 mt-auto">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/40">
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      <User className="size-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-foreground">Pelanggan</span>
                      <span className="text-[10px] text-emerald-500 font-semibold">Sesi Aktif</span>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="w-full rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <LogOut className="size-4 mr-2" />
                      Keluar Dari Akun
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Pages Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          <Route index element={<Navigate to="menu" replace />} />
          <Route path="menu" element={<ProductList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="*" element={<Navigate to="menu" replace />} />
        </Routes>
      </main>

      {/* Modern App Footer */}
      <footer className="w-full border-t border-border/40 bg-card/40 py-6 text-center text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="size-4 text-primary" />
            <span className="font-bold text-foreground">FoodOrder System</span>
            <span>&copy; 2026</span>
          </div>
          <p className="text-[11px]">Nikmati hidangan lezat dan berkualitas langsung di meja Anda.</p>
        </div>
      </footer>
    </div>
  );
};

