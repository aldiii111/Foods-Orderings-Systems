"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToInvoice = exports.deleteQuotation = exports.updateQuotation = exports.createQuotation = exports.getQuotationById = exports.getQuotations = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getQuotations = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || undefined;
        const quotations = await prisma_1.default.quotation.findMany({
            where: {
                status,
                OR: [
                    { number: { contains: search, mode: "insensitive" } },
                    { customer: { name: { contains: search, mode: "insensitive" } } }
                ]
            },
            include: { customer: true },
            orderBy: { date: "desc" }
        });
        return res.json(quotations);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getQuotations = getQuotations;
const getQuotationById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const quotation = await prisma_1.default.quotation.findUnique({
            where: { id },
            include: { customer: true }
        });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        return res.json(quotation);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getQuotationById = getQuotationById;
const createQuotation = async (req, res) => {
    try {
        const { customerId, date, expiryDate, status, discount, tax, notes, terms, products // array of { productId, name, quantity, price, discount }
         } = req.body;
        if (!customerId || !products || products.length === 0) {
            return res.status(400).json({ message: "Customer and products are required" });
        }
        // Auto calculation
        let subtotal = 0;
        for (const item of products) {
            const itemPrice = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            const itemDisc = Number(item.discount) || 0;
            subtotal += (itemPrice - itemDisc) * qty;
        }
        const discAmount = Number(discount) || 0;
        const taxRate = Number(tax) || 0;
        const totalAmount = (subtotal - discAmount) * (1 + taxRate / 100);
        // Generate Quotation Number
        const count = await prisma_1.default.quotation.count();
        const number = `QT-${Date.now().toString().slice(-4)}-${(count + 1).toString().padStart(4, "0")}`;
        const quotation = await prisma_1.default.quotation.create({
            data: {
                number,
                customerId: Number(customerId),
                date: date ? new Date(date) : new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days
                status: status || "DRAFT",
                discount: discAmount,
                tax: taxRate,
                notes,
                terms,
                totalAmount,
                products
            },
            include: { customer: true }
        });
        // Update customer total quotations count
        await prisma_1.default.customer.update({
            where: { id: Number(customerId) },
            data: {
                totalQuotations: { increment: 1 }
            }
        });
        await (0, audit_1.logActivity)("CREATE_QUOTATION", `Created quotation ${number}`, req.user?.id);
        return res.status(201).json(quotation);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createQuotation = createQuotation;
const updateQuotation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { customerId, date, expiryDate, status, discount, tax, notes, terms, products } = req.body;
        const currentQuotation = await prisma_1.default.quotation.findUnique({ where: { id } });
        if (!currentQuotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        // Recalculate
        let totalAmount = currentQuotation.totalAmount;
        if (products) {
            let subtotal = 0;
            for (const item of products) {
                const itemPrice = Number(item.price) || 0;
                const qty = Number(item.quantity) || 1;
                const itemDisc = Number(item.discount) || 0;
                subtotal += (itemPrice - itemDisc) * qty;
            }
            const discAmount = discount !== undefined ? Number(discount) : currentQuotation.discount;
            const taxRate = tax !== undefined ? Number(tax) : currentQuotation.tax;
            totalAmount = (subtotal - discAmount) * (1 + taxRate / 100);
        }
        const updated = await prisma_1.default.quotation.update({
            where: { id },
            data: {
                customerId: customerId ? Number(customerId) : undefined,
                date: date ? new Date(date) : undefined,
                expiryDate: expiryDate ? new Date(expiryDate) : undefined,
                status,
                discount: discount !== undefined ? Number(discount) : undefined,
                tax: tax !== undefined ? Number(tax) : undefined,
                notes,
                terms,
                totalAmount,
                products: products || undefined
            },
            include: { customer: true }
        });
        if (status === "ACCEPTED" && currentQuotation.status !== "ACCEPTED") {
            await prisma_1.default.notification.create({
                data: {
                    type: "QUOTATION_ACCEPTED",
                    title: "Penawaran Diterima",
                    message: `Penawaran "${updated.number}" telah diterima oleh pelanggan.`
                }
            });
        }
        else if (status === "REJECTED" && currentQuotation.status !== "REJECTED") {
            await prisma_1.default.notification.create({
                data: {
                    type: "QUOTATION_REJECTED",
                    title: "Penawaran Ditolak",
                    message: `Penawaran "${updated.number}" telah ditolak oleh pelanggan.`
                }
            });
        }
        await (0, audit_1.logActivity)("UPDATE_QUOTATION", `Updated quotation ID ${id}`, req.user?.id);
        return res.json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateQuotation = updateQuotation;
const deleteQuotation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const q = await prisma_1.default.quotation.findUnique({ where: { id } });
        if (q) {
            await prisma_1.default.customer.update({
                where: { id: q.customerId },
                data: { totalQuotations: { decrement: 1 } }
            });
        }
        await prisma_1.default.quotation.delete({ where: { id } });
        await (0, audit_1.logActivity)("DELETE_QUOTATION", `Deleted quotation ID ${id}`, req.user?.id);
        return res.json({ message: "Quotation deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteQuotation = deleteQuotation;
const convertToInvoice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const quotation = await prisma_1.default.quotation.findUnique({
            where: { id },
            include: { customer: true }
        });
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        // Generate Invoice Number
        const count = await prisma_1.default.invoice.count();
        const invoiceNumber = `INV-${Date.now().toString().slice(-4)}-${(count + 1).toString().padStart(4, "0")}`;
        const invoice = await prisma_1.default.invoice.create({
            data: {
                number: invoiceNumber,
                customerId: quotation.customerId,
                date: new Date(),
                paymentStatus: "UNPAID",
                discount: quotation.discount,
                tax: quotation.tax,
                totalAmount: quotation.totalAmount,
                products: quotation.products || []
            }
        });
        // Update quotation status
        await prisma_1.default.quotation.update({
            where: { id },
            data: { status: "ACCEPTED" }
        });
        // Update Customer invoices count & purchases count
        await prisma_1.default.customer.update({
            where: { id: quotation.customerId },
            data: {
                totalInvoices: { increment: 1 }
            }
        });
        await prisma_1.default.notification.create({
            data: {
                type: "NEW_INVOICE",
                title: "Invoice Baru Dibuat",
                message: `Invoice "${invoiceNumber}" telah dibuat dari Penawaran "${quotation.number}".`
            }
        });
        await (0, audit_1.logActivity)("CONVERT_QUOTATION_TO_INVOICE", `Converted Quotation ${quotation.number} to Invoice ${invoiceNumber}`, req.user?.id);
        return res.status(201).json(invoice);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.convertToInvoice = convertToInvoice;
