// ============ Auth Types ============

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: "customer" | "staff" | string;
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: "customer" | "staff" | string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: "customer" | "staff" | string;
    };
}

// ============ Product Types ============

export interface Category {
    id: number;
    name: string;
    description: string | null;
    status: string;
    order: number;
    _count?: {
        products: number;
    };
    createdAt: string;
}

export interface Unit {
    id: number;
    name: string;
    symbol: string;
    description: string | null;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    sku: string | null;
    barcode: string | null;
    description: string | null;
    costPrice: number;
    sellingPrice: number;
    price: number; // fallback mapping
    stock: number;
    minStock: number;
    status: string;
    image: string | null;
    categoryId: number | null;
    category: Category | null;
    unitId: number | null;
    unit: Unit | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    sku?: string;
    barcode?: string;
    categoryId?: number | null;
    unitId?: number | null;
    description?: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
    status: string;
    image?: string | null;
}

// ============ Stock Movements ============

export interface StockMovement {
    id: number;
    productId: number;
    product: {
        name: string;
        sku: string | null;
    };
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    beforeStock: number;
    afterStock: number;
    userId: number | null;
    user: {
        name: string;
    } | null;
    notes: string | null;
    timestamp: string;
}

// ============ Customer ============

export interface Customer {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    totalPurchases: number;
    totalQuotations: number;
    totalInvoices: number;
    createdAt: string;
    updatedAt: string;
    quotations?: Quotation[];
    invoices?: Invoice[];
}

// ============ Quotation ============

export interface QuotationProduct {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
}

export interface Quotation {
    id: number;
    number: string;
    customerId: number;
    customer: Customer;
    date: string;
    expiryDate: string;
    status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED" | string;
    discount: number;
    tax: number;
    notes: string | null;
    terms: string | null;
    totalAmount: number;
    products: QuotationProduct[];
    createdAt: string;
    updatedAt: string;
}

// ============ Invoice ============

export interface PaymentRecord {
    date: string;
    amount: number;
    method: string;
    notes?: string;
}

export interface Invoice {
    id: number;
    number: string;
    customerId: number;
    customer: Customer;
    date: string;
    paymentStatus: "UNPAID" | "PARTIAL" | "PAID" | "CANCELLED" | string;
    totalAmount: number;
    discount: number;
    tax: number;
    products: QuotationProduct[];
    paymentHistory: PaymentRecord[];
    createdAt: string;
    updatedAt: string;
}

// ============ Audit Log ============

export interface AuditLog {
    id: number;
    action: string;
    details: string | null;
    userId: number | null;
    user: {
        name: string;
        email: string;
    } | null;
    timestamp: string;
}

// ============ API Error ============

export interface ApiError {
    message: string;
}

// ============ Dashboard Types ============

export interface DashboardData {
    kpis: {
        totalProducts: number;
        totalStock: number;
        totalCustomers: number;
        totalQuotations: number;
        totalInvoices: number;
        totalRevenue: number;
        monthlyRevenue: number;
        monthlySales: number;
        lowStockProducts: number;
        pendingQuotations: number;
    };
    charts: {
        revenueTrend: { date: string; revenue: number }[];
        categoryDistribution: { name: string; productCount: number; stockCount: number }[];
        stockDistribution: { name: string; value: number }[];
        customerGrowth: { month: string; count: number }[];
    };
    recentActivities: {
        id: number;
        action: string;
        details: string | null;
        timestamp: string;
        user?: { name: string } | null;
    }[];
}
