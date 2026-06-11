import { Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center mt-70 bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/25">
          <UtensilsCrossed className="size-12 text-primary-foreground" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Food<span className="text-primary">Order</span>
        </h1>

        <p className="mt-3 max-w-md text-md text-muted-foreground">
          Sistem pemesanan makanan sederhana untuk mengelola produk dan inventaris kamu.
        </p>

        <div className="mt-7 flex gap-3">
          {isAuthenticated ? (
            <Link to="/login">
              <Button size="sm">
                Login
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/choose-role">
                <Button size="lg" className="w-full">Mulai Sekarang</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}