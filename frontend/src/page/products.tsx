import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Package, ImageOff } from "lucide-react";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (searchQuery?: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getProducts(searchQuery);
      setProducts(data);
    } catch {
      setError("Gagal memuat produk. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search || undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daftar Produk</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola semua produk makanan kamu di sini
          </p>
        </div>
        <Link to="/products/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="search-products"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
            <Package className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium">Belum ada produk</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? `Tidak ditemukan produk untuk "${search}"` : "Mulai dengan menambahkan produk pertama"}
          </p>
          {!search && (
            <Link to="/products/new" className="mt-4">
              <Button size="sm">
                <Plus className="size-4" data-icon="inline-start" />
                Tambah Produk
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5">
                {/* Image */}
                <div className="flex h-40 items-center justify-center bg-muted/50">
                  {product.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}/${product.image}`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff className="size-8 text-muted-foreground/40" />
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="text-base font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-semibold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                      Stok: {product.stock}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
