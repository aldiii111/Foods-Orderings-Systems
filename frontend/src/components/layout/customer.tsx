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
  X 
} from "lucide-react";
import { ProductList } from "@/page/customer/productList";
import { Cart } from "@/page/customer/cart";
import { OrderList } from "@/page/customer/orderList";
import { cn } from "@/lib/utils";

export const Customer: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: "Menu Makanan", path: "/customer/menu", icon: UtensilsCrossed },
    { 
      name: "Keranjang", 
      path: "/customer/cart", 
      icon: ShoppingCart, 
      badge: cartCount > 0 ? cartCount : undefined 
    },
    { name: "Pesanan Saya", path: "/customer/orders", icon: ClipboardList }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link to="/customer/menu" className="flex items-center gap-2.5 group">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Food<span className="text-primary">Order</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-all relative",
                    isActive 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <Icon className="size-4.5" />
                  <span>{item.name}</span>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-[10px] font-extrabold bg-primary text-white rounded-full min-w-5 text-center animate-bounce shadow-md">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-foreground">
              <User className="size-3.5 text-primary" />
              <span>Customer</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Keluar
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart shortcut in mobile header */}
            <Link to="/customer/cart" className="relative p-2 text-muted-foreground hover:text-foreground">
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 px-1 py-0.5 text-[8px] font-extrabold bg-primary text-white rounded-full min-w-4 text-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <MenuIcon className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border/40 bg-card px-4 py-3 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    isActive 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4.5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-primary text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <User className="size-3.5 text-primary" />
                <span>Pelanggan</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Pages Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<Navigate to="menu" replace />} />
          <Route path="menu" element={<ProductList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="*" element={<Navigate to="menu" replace />} />
        </Routes>
      </main>
    </div>
  );
};
