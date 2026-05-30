import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil, ImageOff, Package, CalendarDays } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data);
      } catch {
        setError("Produk tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Skeleton className="mb-6 h-8 w-32" />
        <Card>
          <Skeleton className="h-64 w-full rounded-none" />
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
            <Package className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium">{error || "Produk tidak ditemukan"}</h3>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/products")}>
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Kembali
          </Button>
        </Link>
        <Link to={`/products/${product.id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="size-4" data-icon="inline-start" />
            Edit
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="flex h-64 items-center justify-center bg-muted/50">
          {product.image ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}/${product.image}`}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff className="size-12 text-muted-foreground/30" />
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
              Stok: {product.stock}
            </Badge>
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          {product.description && (
            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Deskripsi</h3>
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <span>Ditambahkan {formatDate(product.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
