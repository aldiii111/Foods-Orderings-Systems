import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileSignature, 
  AlertTriangle,
  Receipt,
  Check,
  Building,
  Copy,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { erpService } from "@/services/erpService";
import type { Quotation } from "@/types";

export function QuotationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [invoiceConverted, setInvoiceConverted] = useState(false);

  useEffect(() => {
    async function loadQuotation() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await erpService.getQuotationById(Number(id));
        setQuotation(data);
      } catch (err: any) {
        console.error("Gagal memuat detail quotation:", err);
        setError("Quotation tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    }
    loadQuotation();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!quotation) return;
    setActionLoading(true);
    try {
      const updated = await erpService.updateQuotation(quotation.id, { status: newStatus });
      setQuotation(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengubah status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertToInvoice = async () => {
    if (!quotation) return;
    setActionLoading(true);
    try {
      await erpService.convertQuotationToInvoice(quotation.id);
      setInvoiceConverted(true);
      setQuotation({ ...quotation, status: "ACCEPTED" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal melakukan konversi invoice.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!quotation) return;
    setActionLoading(true);
    try {
      const duplicated = await erpService.createQuotation({
        customerId: quotation.customerId,
        notes: `Duplikat dari ${quotation.number}. ${quotation.notes || ""}`,
        terms: quotation.terms,
        discount: quotation.discount,
        tax: quotation.tax,
        products: quotation.products
      });
      alert(`Berhasil menduplikasi penawaran! Nomor baru: ${duplicated.number}`);
      navigate(`/staff/quotations/${duplicated.id}`);
    } catch (err: any) {
      alert("Gagal menduplikasi quotation.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="size-3.5" />
            Disetujui
          </span>
        );
      case "PENDING":
      case "DRAFT":
      case "SENT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg animate-pulse">
            <Clock className="size-3.5" />
            {status}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            <XCircle className="size-3.5" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg">
            {status}
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin size-8 text-primary mx-auto" />
          <p className="text-sm font-semibold text-muted-foreground">Memuat detail penawaran...</p>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="flex-1 p-8 space-y-6 min-h-screen bg-slate-50/50">
        <div className="flex items-center gap-4">
          <Link to="/staff/quotations" className="p-1.5 hover:bg-slate-100 rounded-xl transition-all text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-bold text-foreground">Kembali ke Daftar Penawaran</span>
        </div>
        <Card className="border-destructive/20 shadow-md bg-card p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="size-12 text-destructive mb-3" />
          <h3 className="text-lg font-bold text-foreground">Dokumen Tidak Ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-1">Quotation ID #{id} tidak valid atau telah dihapus.</p>
          <button onClick={() => navigate("/staff/quotations")} className="mt-4 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl">
            Kembali
          </button>
        </Card>
      </div>
    );
  }

  const subtotal = quotation.products.reduce((sum, item) => sum + ((item.price - item.discount) * item.quantity), 0);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased print:bg-white print:p-0">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - hide on print */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            <Link to="/staff/quotations" className="p-1.5 hover:bg-slate-100 rounded-xl transition-all text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4.5" />
            </Link>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-foreground">{quotation.number}</h2>
                {getStatusBadge(quotation.status)}
              </div>
              <p className="text-xs text-muted-foreground font-medium">Pelanggan: {quotation.customer?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              Print Penawaran
            </button>
            <button 
              onClick={handleDuplicate}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              <Copy className="size-3.5" />
              Duplikat
            </button>
            
            {(quotation.status === "PENDING" || quotation.status === "DRAFT" || quotation.status === "SENT") && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("REJECTED")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-xl transition-all border border-rose-500/20 cursor-pointer"
                >
                  <XCircle className="size-3.5" />
                  Tolak
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("ACCEPTED")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-600/90 text-white rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" />
                  Setujui
                </button>
              </>
            )}

            {(quotation.status === "ACCEPTED" || quotation.status === "APPROVED") && !invoiceConverted && (
              <button
                disabled={actionLoading}
                onClick={handleConvertToInvoice}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Receipt className="size-3.5" />
                Konversi ke Invoice
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto print:p-0 print:overflow-visible">
          {invoiceConverted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between print:hidden">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="size-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">Berhasil Dikonversi ke Invoice!</h4>
                  <p className="text-xs font-medium text-emerald-700/80">Dokumen penawaran harga ini telah terdaftar sebagai tagihan (invoice) aktif.</p>
                </div>
              </div>
              <Link to="/staff/invoices">
                <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm">
                  Lihat Invoice
                </button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
            
            {/* Left side: Invoice Details & Items list */}
            <div className="lg:col-span-2 space-y-6 print:space-y-4">
              
              {/* Client & Metadata Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card print:border-none print:shadow-none">
                <CardHeader className="pb-4 border-b border-border/20">
                  <CardTitle className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Building className="size-4.5 text-primary print:hidden" />
                    Informasi Klien & Dokumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Klien / Instansi</p>
                      <h4 className="text-sm font-extrabold text-foreground">{quotation.customer?.name}</h4>
                      <p className="text-xs text-muted-foreground">{quotation.customer?.email}</p>
                      <p className="text-xs text-muted-foreground">{quotation.customer?.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tanggal Penawaran</p>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        {new Date(quotation.date).toLocaleDateString("id-ID", { dateStyle: "long" })}
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valid Hingga</p>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        {new Date(quotation.expiryDate).toLocaleDateString("id-ID", { dateStyle: "long" })}
                      </h4>
                    </div>
                  </div>

                  {quotation.notes && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/40 print:bg-white print:border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Catatan Negosiasi / Syarat & Ketentuan</p>
                      <p className="text-xs text-foreground leading-relaxed">{quotation.notes}</p>
                    </div>
                  )}

                  {quotation.terms && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/40 print:bg-white print:border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Syarat & Ketentuan Tambahan</p>
                      <p className="text-xs text-foreground leading-relaxed">{quotation.terms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card overflow-hidden print:border-none print:shadow-none">
                <CardHeader className="pb-4 border-b border-border/20 bg-slate-50/50 dark:bg-slate-900/60 print:bg-white">
                  <CardTitle className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                    Rincian Item Penawaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-slate-50/20 print:bg-white">
                          <th className="px-6 py-3.5">Menu Makanan</th>
                          <th className="px-6 py-3.5 text-right">Harga Unit</th>
                          <th className="px-6 py-3.5 text-center">Kuantitas</th>
                          <th className="px-6 py-3.5 text-right">Diskon Item</th>
                          <th className="px-6 py-3.5 text-right">Total Harga</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                        {quotation.products.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="px-6 py-4 font-bold text-foreground">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-right font-mono">
                              Rp {item.price.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-center font-bold">
                              {item.quantity} Unit
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                              Rp {item.discount.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-right font-extrabold text-foreground font-mono">
                              Rp {((item.price - item.discount) * item.quantity).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right side: Calculation details & timeline */}
            <div className="space-y-6 print:block print:w-full print:mt-4">
              
              {/* Total Calculation Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card overflow-hidden print:shadow-none print:border-none">
                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center print:bg-white">
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider print:text-black">Kalkulasi Tagihan</span>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3 pb-4 border-b border-border/40 text-xs font-semibold text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-foreground font-mono">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diskon Global</span>
                      <span className="text-rose-600 font-mono">- Rp {quotation.discount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak (PPN {quotation.tax}%)</span>
                      <span className="text-foreground font-mono">
                        Rp {Math.round((subtotal - quotation.discount) * (quotation.tax / 100)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Grand Total</span>
                    <span className="text-lg font-black text-primary font-mono print:text-black">Rp {quotation.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline (hidden on print) */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card print:hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileSignature className="size-4 text-primary" />
                    Timeline Dokumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 pl-6 space-y-6 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 size-4.5 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center shadow-sm" />
                      <div>
                        <h5 className="font-bold text-foreground">Dokumen Penawaran Dibuat</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(quotation.createdAt).toLocaleDateString("id-ID")} - System Log</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 size-4.5 rounded-full border-4 border-card flex items-center justify-center shadow-sm ${
                        quotation.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`} />
                      <div>
                        <h5 className="font-bold text-foreground">Status Negosiasi: {quotation.status}</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Menunjukkan persetujuan atau revisi penawaran.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
