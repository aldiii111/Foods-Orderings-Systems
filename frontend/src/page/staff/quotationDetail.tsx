import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileSignature, 
  AlertTriangle,
  RotateCcw,
  Receipt,
  Check,
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ====== BACKEND API REQUIREMENT ======
// Endpoint: GET /api/quotations/:id
// Headers: Authorization: Bearer <token>
// Response Body:
// {
//   id: number;
//   quotationNo: string;
//   customerName: string;
//   dateCreated: string;
//   dateExpired: string;
//   notes: string;
//   createdBy: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
//   subtotal: number;
//   tax: number;
//   totalAmount: number;
//   items: Array<{
//     productId: number;
//     name: string;
//     price: number;
//     quantity: number;
//     image: string | null;
//   }>;
// }
//
// Endpoint for status update: PATCH /api/quotations/:id/status
// Request Body: { status: 'APPROVED' | 'REJECTED', reason?: string }
//
// Endpoint for invoice conversion: POST /api/invoices/convert-from-quotation
// Request Body: { quotationId: number }

interface QuotationItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface QuotationDetailData {
  id: number;
  quotationNo: string;
  customerName: string;
  dateCreated: string;
  dateExpired: string;
  notes: string;
  createdBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  subtotal: number;
  tax: number;
  totalAmount: number;
  items: QuotationItem[];
}

const INITIAL_QUOTATIONS: Record<number, QuotationDetailData> = {
  1: { 
    id: 1, 
    quotationNo: "QTN-2026-001", 
    customerName: "Hotel Santika Premium", 
    dateCreated: "2026-06-01", 
    dateExpired: "2026-06-15", 
    notes: "Request khusus porsi prasmanan premium untuk acara ulang tahun korporat ke-25. Makanan disajikan hangat.",
    createdBy: "Budi (Senior Staff)",
    status: "APPROVED", 
    subtotal: 4054054,
    tax: 445946,
    totalAmount: 4500000,
    items: [
      { productId: 101, name: "Nasi Tumpeng Nusantara", price: 350000, quantity: 5, image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60" },
      { productId: 102, name: "Sate Ayam Madura", price: 25000, quantity: 100, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=60" },
      { productId: 103, name: "Es Cendol Durian", price: 15000, quantity: 100, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  2: { 
    id: 2, 
    quotationNo: "QTN-2026-002", 
    customerName: "Catering Ibu Fatma", 
    dateCreated: "2026-06-02", 
    dateExpired: "2026-06-16", 
    notes: "Pengiriman ke Jl. Margonda No. 12 pagi hari jam 07:00 WIB untuk sarapan panitia.",
    createdBy: "Dewi (Sales Staff)",
    status: "PENDING", 
    subtotal: 1621621,
    tax: 178379,
    totalAmount: 1800000,
    items: [
      { productId: 104, name: "Nasi Uduk Spesial Komplit", price: 15000, quantity: 100, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&auto=format&fit=crop&q=60" },
      { productId: 105, name: "Gorengan Bakwan Jagung", price: 3000, quantity: 100, image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  3: { 
    id: 3, 
    quotationNo: "QTN-2026-003", 
    customerName: "Universitas Indonesia (Fak. Teknik)", 
    dateCreated: "2026-06-03", 
    dateExpired: "2026-06-17", 
    notes: "Acara Seminar Internasional FTUI. Menu dipisah-pisah box individual dengan branding logo UI.",
    createdBy: "Andi (Staff)",
    status: "PENDING", 
    subtotal: 11261261,
    tax: 1238739,
    totalAmount: 12500000,
    items: [
      { productId: 106, name: "Nasi Kotak Ayam Bakar Taliwang", price: 35000, quantity: 300, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=60" },
      { productId: 107, name: "Jus Alpukat Mentega", price: 20000, quantity: 100, image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  4: { 
    id: 4, 
    quotationNo: "QTN-2026-004", 
    customerName: "PT Global Tech Solutions", 
    dateCreated: "2026-05-28", 
    dateExpired: "2026-06-11", 
    notes: "Meeting kuartal direksi. Layanan buffet di ruang VIP.",
    createdBy: "Budi (Senior Staff)",
    status: "APPROVED", 
    subtotal: 2882882,
    tax: 317118,
    totalAmount: 3200000,
    items: [
      { productId: 108, name: "Buffet Mewah Nusantara", price: 80000, quantity: 40, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  5: { 
    id: 5, 
    quotationNo: "QTN-2026-005", 
    customerName: "Wedding Organizer Sinar", 
    dateCreated: "2026-05-20", 
    dateExpired: "2026-06-03", 
    notes: "Ditolak karena klien meminta potongan diskon 25% yang melebihi batas kebijakan margin perusahaan.",
    createdBy: "Dewi (Sales Staff)",
    status: "REJECTED", 
    subtotal: 7567567,
    tax: 832433,
    totalAmount: 8400000,
    items: [
      { productId: 109, name: "Paket Catering Pernikahan Silver", price: 84000, quantity: 100, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&auto=format&fit=crop&q=60" }
    ]
  }
};

export function QuotationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<QuotationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceConverted, setInvoiceConverted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching from backend API
    const timer = setTimeout(() => {
      if (id && INITIAL_QUOTATIONS[Number(id)]) {
        setQuotation(INITIAL_QUOTATIONS[Number(id)]);
      } else {
        setQuotation(null);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  const handleUpdateStatus = (newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (!quotation) return;
    setActionLoading(true);

    // Simulate PATCH API request
    setTimeout(() => {
      setQuotation({
        ...quotation,
        status: newStatus
      });
      setActionLoading(false);
    }, 300);
  };

  const handleConvertToInvoice = () => {
    if (!quotation) return;
    setActionLoading(true);

    // Simulate POST API request to convert quotation to invoice
    setTimeout(() => {
      setInvoiceConverted(true);
      setActionLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
            <CheckCircle2 className="size-3.5" />
            Disetujui
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 animate-pulse">
            <Clock className="size-3.5" />
            Menunggu Persetujuan
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
            <XCircle className="size-3.5" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  // Expiration countdown
  const getDaysRemaining = (expDate: string) => {
    const today = new Date();
    const expiry = new Date(expDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50/50 dark:bg-background">
        <div className="text-center space-y-3">
          <div className="animate-spin inline-block size-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
            <span className="sr-only">Memuat...</span>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Memuat detail penawaran...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex-1 p-8 space-y-6 min-h-screen bg-slate-50/50 dark:bg-background">
        <div className="flex items-center gap-4">
          <Link to="/staff/quotations" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-bold text-foreground">Kembali ke Daftar Penawaran</span>
        </div>
        <Card className="border-destructive/20 shadow-md bg-card/60 p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="size-12 text-destructive mb-3" />
          <h3 className="text-lg font-bold text-foreground">Dokumen Tidak Ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-1">Quotation ID #{id} tidak valid atau telah dihapus.</p>
          <button onClick={() => navigate("/staff/quotations")} className="mt-4 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/95 transition-all">
            Kembali
          </button>
        </Card>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(quotation.dateExpired);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background antialiased">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/staff/quotations" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4.5" />
            </Link>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-foreground">{quotation.quotationNo}</h2>
                {getStatusBadge(quotation.status)}
              </div>
              <p className="text-xs text-muted-foreground font-medium">Diajukan oleh {quotation.createdBy}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert("Mengunduh file PDF Penawaran (Simulasi)...")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold border border-border/60 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all text-foreground cursor-pointer"
            >
              <Download className="size-3.5" />
              Download PDF
            </button>
            
            {quotation.status === "PENDING" && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("REJECTED")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-xl transition-all cursor-pointer border border-rose-500/20"
                >
                  <XCircle className="size-3.5" />
                  Tolak
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus("APPROVED")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-600/90 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  <CheckCircle2 className="size-3.5" />
                  Setujui
                </button>
              </>
            )}

            {quotation.status === "APPROVED" && !invoiceConverted && (
              <button
                disabled={actionLoading}
                onClick={handleConvertToInvoice}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-md shadow-primary/25 cursor-pointer"
              >
                <Receipt className="size-3.5" />
                Konversi ke Invoice
              </button>
            )}

            {quotation.status === "REJECTED" && (
              <button
                disabled={actionLoading}
                onClick={() => handleUpdateStatus("PENDING")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-border/60 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Buka Kembali
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {invoiceConverted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Invoice Details & Items list */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Client & Metadata Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardHeader className="pb-4 border-b border-border/20">
                  <CardTitle className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Building className="size-4.5 text-primary" />
                    Informasi Klien & Dokumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nama Klien / Instansi</p>
                      <h4 className="text-sm font-extrabold text-foreground">{quotation.customerName}</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tanggal Penawaran</p>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Calendar className="size-4 text-muted-foreground" />
                        {quotation.dateCreated}
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valid Hingga</p>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="size-4 text-muted-foreground" />
                        {quotation.dateExpired}
                      </h4>
                    </div>
                  </div>

                  {quotation.notes && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/40">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Catatan Negosiasi / Syarat & Ketentuan</p>
                      <p className="text-xs text-foreground leading-relaxed">{quotation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card overflow-hidden">
                <CardHeader className="pb-4 border-b border-border/20 bg-slate-50/50 dark:bg-slate-900/60">
                  <CardTitle className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText className="size-4.5 text-primary" />
                    Rincian Item Penawaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-slate-50/20">
                          <th className="px-6 py-3.5">Menu Makanan</th>
                          <th className="px-6 py-3.5 text-right">Harga Porsi</th>
                          <th className="px-6 py-3.5 text-center">Kuantitas</th>
                          <th className="px-6 py-3.5 text-right">Total Harga</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-sm">
                        {quotation.items.map((item) => (
                          <tr key={item.productId} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="size-11 rounded-lg object-cover bg-slate-100" />
                                ) : (
                                  <div className="size-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground">
                                    <FileText className="size-4" />
                                  </div>
                                )}
                                <div>
                                  <h5 className="font-bold text-foreground text-xs sm:text-sm">{item.name}</h5>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prod ID: {item.productId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-xs sm:text-sm">
                              Rp {item.price.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-xs sm:text-sm">
                              {item.quantity} porsi
                            </td>
                            <td className="px-6 py-4 text-right font-extrabold text-foreground text-xs sm:text-sm">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
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
            <div className="space-y-6">
              
              {/* Total Calculation Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">Kalkulasi Tagihan</span>
                  {daysLeft > 0 ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded dark:bg-amber-950/40 dark:text-amber-300">
                      Sisa {daysLeft} hari
                    </span>
                  ) : quotation.status === "PENDING" ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded dark:bg-rose-950/40 dark:text-rose-300">
                      Kedaluwarsa
                    </span>
                  ) : null}
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3 pb-4 border-b border-border/40 text-xs font-semibold text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-foreground">Rp {quotation.subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PPN (11%)</span>
                      <span className="text-foreground">Rp {quotation.tax.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Grand Total</span>
                    <span className="text-lg font-black text-primary">Rp {quotation.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Status Tracking / Timeline Card */}
              <Card className="border-border/40 shadow-sm rounded-2xl bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileSignature className="size-4 text-primary" />
                    Timeline Dokumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 pl-6 space-y-6 text-xs">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 size-4.5 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center shadow-sm" />
                      <div>
                        <h5 className="font-bold text-foreground">Dokumen Penawaran Dibuat</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{quotation.dateCreated} - Oleh Staff</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 size-4.5 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center shadow-sm" />
                      <div>
                        <h5 className="font-bold text-foreground">Sent to Client / Negosiasi</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Draf penawaran dikirim secara elektronik</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 size-4.5 rounded-full border-4 border-card flex items-center justify-center shadow-sm ${
                        quotation.status === 'APPROVED' ? 'bg-emerald-500' :
                        quotation.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-400'
                      }`} />
                      <div>
                        <h5 className="font-bold text-foreground">
                          {quotation.status === 'APPROVED' ? 'Persetujuan Diterima' :
                           quotation.status === 'REJECTED' ? 'Negosiasi Ditolak' : 'Menunggu Respons Klien'}
                        </h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {quotation.status === 'APPROVED' ? 'Klien menyetujui semua harga penawaran' :
                           quotation.status === 'REJECTED' ? 'Quotation ditolak oleh staff / klien' : 'Belum ada keputusan formal'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    {invoiceConverted && (
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 size-4.5 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center shadow-sm" />
                        <div>
                          <h5 className="font-bold text-foreground">Konversi ke Invoice Selesai</h5>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Invoice aktif diterbitkan</p>
                        </div>
                      </div>
                    )}
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
