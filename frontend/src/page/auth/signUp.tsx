import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import type { RegisterRequest } from "@/types/index";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"customer" | "staff" | string>("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedRole = localStorage.getItem('preferredRole');

        if (savedRole === "customer" || savedRole === "staff") {
            setRole(savedRole);
        } else {
            navigate('/choose-role');
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!role) {
            setError("Anda harus memilih role");
            setLoading(false)
            return;
        }

        if (!name || !email || !password || !role) {
            setError("Semua field wajib diisi");
            return;
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        setLoading(true);
        try {
            const payload: RegisterRequest = {
                name,
                email,
                password,
                role
            }
            await authService.register(payload);
            localStorage.removeItem("preferredRole");
            navigate("/login");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Registrasi gagal. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex size-18 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                        <UtensilsCrossed className="size-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Food<span className="text-primary">Order</span>
                    </h1>
                </div>

                <Card className="border-border/50 shadow-xl shadow-black/5">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Buat Akun Baru</CardTitle>
                        <CardDescription>Isi data berikut untuk membuat akun</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                            </div>

                            <Button size="sm" type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
                                {loading ? "Memproses..." : "Daftar"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
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
