import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, User, ChefHat, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ChooseRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"customer" | "staff" | string>("");

  const handleSelectRole = () => {
    if (selectedRole) {
      localStorage.setItem("preferredRole", selectedRole);
      navigate("/register"); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <UtensilsCrossed className="size-6 text-white some amaz_foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">FoodOrder</h1>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/5">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Siapa Anda?</CardTitle>
            <CardDescription>
              Silakan pilih jenis peran Anda untuk melanjutkan masuk ke sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedRole("customer")}
                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 outline-none hover:bg-accent/50 ${
                  selectedRole === "customer"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/60 bg-card"
                }`}
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    selectedRole === "customer"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <User className="size-5" />
                </div>
                <div className="space-y-1 pr-2">
                  <div className="font-medium text-sm text-foreground leading-none">
                    Pelanggan
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Pesan makanan & nikmati hidangan favoritmu
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("staff")}
                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 outline-none hover:bg-accent/50 ${
                  selectedRole === "staff"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/60 bg-card"
                }`}
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    selectedRole === "staff"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <ChefHat className="size-5" />
                </div>
                <div className="space-y-1 pr-2">
                  <div className="font-medium text-sm text-foreground leading-none">
                    Staff Restoran
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Kelola menu, stok, dan proses semua pesanan
                  </p>
                </div>
              </button>
            </div>

            <Button
              onClick={handleSelectRole}
              className="w-full"
              disabled={!selectedRole}
            >
              Lanjutkan
              <ChevronRight className="ml-2 size-4" />
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}