import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Load existing product for edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const product = await productService.getProductById(Number(id));
        setName(product.name);
        setDescription(product.description || "");
        setPrice(String(product.price));
        setStock(String(product.stock));
      } catch {
        setError("Gagal memuat data produk");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price) {
      setError("Nama dan harga wajib diisi");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock || "0", 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Harga harus berupa angka positif");
      return;
    }

    setLoading(true);
    try {
      const data = { name, description: description || undefined, price: priceNum, stock: stockNum };

      if (isEdit) {
        await productService.updateProduct(Number(id), data);
        navigate(`/products/${id}`);
      } else {
        const created = await productService.createProduct(data);
        navigate(`/products/${created.id}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Back */}
      <Link to={isEdit ? `/products/${id}` : "/products"} className="mb-6 inline-block">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Kembali
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
          <CardDescription>
            {isEdit ? "Perbarui informasi produk di bawah ini" : "Isi detail produk yang ingin ditambahkan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="product-name">Nama Produk *</Label>
              <Input
                id="product-name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-description">Deskripsi</Label>
              <Textarea
                id="product-description"
                placeholder="Deskripsi singkat produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="product-price">Harga (Rp) *</Label>
                <Input
                  id="product-price"
                  type="number"
                  placeholder="25000"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-stock">Stok</Label>
                <Input
                  id="product-stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
                <Save className="size-4" data-icon="inline-start" />
                {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
