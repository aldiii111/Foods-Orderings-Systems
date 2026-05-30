import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/25">
          <UtensilsCrossed className="size-8 text-primary-foreground" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Food<span className="text-primary">Order</span>
        </h1>

        <p className="mt-3 max-w-md text-base text-muted-foreground">
          Sistem pemesanan makanan sederhana untuk mengelola produk dan inventaris kamu.
        </p>

        <div className="mt-8 flex gap-3">
          {isAuthenticated ? (
            <Link to="/products">
              <Button size="lg">
                Lihat Produk
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button size="lg">
                  Masuk
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}