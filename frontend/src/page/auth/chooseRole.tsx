import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function ChooseRole() {
  const selectRole = (role: "customer" | "staff") => {
    localStorage.setItem("preferredRole", role);
    window.location.href = "/login"; // atau gunakan navigate
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Siapa Anda?</h2>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => selectRole("customer")}
            className="flex items-center w-full p-4 border rounded-lg hover:border-primary transition group"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="text-left">
              <h3 className="font-medium">Pelanggan</h3>
              <p className="text-sm text-muted-foreground">Pesan makanan & nikmati hidangan</p>
            </div>
          </Button>

          <Button
            onClick={() => selectRole("staff")}
            className="flex items-center w-full p-4 border rounded-lg hover:border-primary transition group"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div className="text-left">
              <h3 className="font-medium">Staff Restoran</h3>
              <p className="text-sm text-muted-foreground">Kelola menu, stok, dan pesanan</p>
            </div>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-primary font-medium">
            Masuk di sini
          </Link>
        </p>
      </Card>
    </div>
  );
}