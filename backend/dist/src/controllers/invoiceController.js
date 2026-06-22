"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoicePaymentStatus = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getInvoices = async (req, res) => {
    try {
        const search = req.query.search || "";
        const paymentStatus = req.query.paymentStatus || undefined;
        const invoices = await prisma_1.default.invoice.findMany({
            where: {
                paymentStatus,
                OR: [
                    { number: { contains: search, mode: "insensitive" } },
                    { customer: { name: { contains: search, mode: "insensitive" } } }
                ]
            },
            include: { customer: true },
            orderBy: { date: "desc" }
        });
        return res.json(invoices);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getInvoices = getInvoices;
const getInvoiceById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const invoice = await prisma_1.default.invoice.findUnique({
            where: { id },
            include: { customer: true }
        });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.json(invoice);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getInvoiceById = getInvoiceById;
const createInvoice = async (req, res) => {
    try {
        const { customerId, date, paymentStatus, discount, tax, products, paymentHistory } = req.body;
        if (!customerId || !products || products.length === 0) {
            return res.status(400).json({ message: "Customer and products are required" });
        }
        // Subtotal calculation
        let subtotal = 0;
        for (const item of products) {
            const itemPrice = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            const itemDisc = Number(item.discount) || 0;
            subtotal += (itemPrice - itemDisc) * qty;
            // Deduct stock for products
            await prisma_1.default.product.update({
                where: { id: Number(item.productId) },
                data: {
                    stock: { decrement: Number(qty) }
                }
            });
            // Stock log
            const product = await prisma_1.default.product.findUnique({ where: { id: Number(item.productId) } });
            if (product) {
                await prisma_1.default.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: "OUT",
                        quantity: Number(qty),
                        beforeStock: product.stock + Number(qty),
                        afterStock: product.stock,
                        userId: req.user?.id,
                        notes: `Penjualan invoice`
                    }
                });
                if (product.stock <= product.minStock) {
                    await prisma_1.default.notification.create({
                        data: {
                            type: "LOW_STOCK",
                            title: "Stok Menipis",
                            message: `Produk "${product.name}" saat ini memiliki stok ${product.stock} (Min: ${product.minStock}).`
                        }
                    });
                }
            }
        }
        const discAmount = Number(discount) || 0;
        const taxRate = Number(tax) || 0;
        const totalAmount = (subtotal - discAmount) * (1 + taxRate / 100);
        // Generate Invoice Number
        const count = await prisma_1.default.invoice.count();
        const number = `INV-${Date.now().toString().slice(-4)}-${(count + 1).toString().padStart(4, "0")}`;
        const invoice = await prisma_1.default.invoice.create({
            data: {
                number,
                customerId: Number(customerId),
                date: date ? new Date(date) : new Date(),
                paymentStatus: paymentStatus || "UNPAID",
                discount: discAmount,
                tax: taxRate,
                totalAmount,
                products,
                paymentHistory: paymentHistory || []
            },
            include: { customer: true }
        });
        // Update customer total purchases and total invoices count
        const incrementPurchases = paymentStatus === "PAID" ? totalAmount : 0;
        await prisma_1.default.customer.update({
            where: { id: Number(customerId) },
            data: {
                totalInvoices: { increment: 1 },
                totalPurchases: { increment: incrementPurchases }
            }
        });
        await prisma_1.default.notification.create({
            data: {
                type: "NEW_INVOICE",
                title: "Invoice Baru",
                message: `Invoice baru "${number}" telah dibuat untuk pelanggan.`
            }
        });
        await (0, audit_1.logActivity)("CREATE_INVOICE", `Created invoice ${number}`, req.user?.id);
        return res.status(201).json(invoice);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createInvoice = createInvoice;
const updateInvoicePaymentStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { paymentStatus, payments } = req.body; // payments is an array of paymentHistory
        const currentInvoice = await prisma_1.default.invoice.findUnique({ where: { id } });
        if (!currentInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        const updated = await prisma_1.default.invoice.update({
            where: { id },
            data: {
                paymentStatus,
                paymentHistory: payments || undefined
            },
            include: { customer: true }
        });
        // If status changed to PAID, add to customer purchases
        if (paymentStatus === "PAID" && currentInvoice.paymentStatus !== "PAID") {
            await prisma_1.default.customer.update({
                where: { id: currentInvoice.customerId },
                data: {
                    totalPurchases: { increment: currentInvoice.totalAmount }
                }
            });
        }
        await (0, audit_1.logActivity)("UPDATE_INVOICE_PAYMENT", `Updated payment status of invoice ${currentInvoice.number} to ${paymentStatus}`, req.user?.id);
        return res.json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateInvoicePaymentStatus = updateInvoicePaymentStatus;
const deleteInvoice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const inv = await prisma_1.default.invoice.findUnique({ where: { id } });
        if (inv) {
            await prisma_1.default.customer.update({
                where: { id: inv.customerId },
                data: {
                    totalInvoices: { decrement: 1 },
                    totalPurchases: inv.paymentStatus === "PAID" ? { decrement: inv.totalAmount } : undefined
                }
            });
        }
        await prisma_1.default.invoice.delete({ where: { id } });
        await (0, audit_1.logActivity)("DELETE_INVOICE", `Deleted invoice ID ${id}`, req.user?.id);
        return res.json({ message: "Invoice deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteInvoice = deleteInvoice;
