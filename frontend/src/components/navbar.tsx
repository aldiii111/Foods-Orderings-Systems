import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, UtensilsCrossed, Package } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/products" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <UtensilsCrossed className="size-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">FoodOrder</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link to="/products">
            <Button
              variant={isActive("/products") ? "secondary" : "ghost"}
              size="sm"
            >
              <Package className="size-4" data-icon="inline-start" />
              Produk
            </Button>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="size-4" data-icon="inline-start" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
