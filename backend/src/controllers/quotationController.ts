import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getQuotations = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = (req.query.search as string) || "";
        const status = (req.query.status as string) || undefined;
        
        const quotations = await prisma.quotation.findMany({
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
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getQuotationById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: { customer: true }
        });

        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        return res.json(quotation);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createQuotation = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const {
            customerId,
            date,
            expiryDate,
            status,
            discount,
            tax,
            notes,
            terms,
            products // array of { productId, name, quantity, price, discount }
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
        const count = await prisma.quotation.count();
        const number = `QT-${Date.now().toString().slice(-4)}-${(count + 1).toString().padStart(4, "0")}`;

        const quotation = await prisma.quotation.create({
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
        await prisma.customer.update({
            where: { id: Number(customerId) },
            data: {
                totalQuotations: { increment: 1 }
            }
        });

        await logActivity("CREATE_QUOTATION", `Created quotation ${number}`, req.user?.id);
        return res.status(201).json(quotation);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateQuotation = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const {
            customerId,
            date,
            expiryDate,
            status,
            discount,
            tax,
            notes,
            terms,
            products
        } = req.body;

        const currentQuotation = await prisma.quotation.findUnique({ where: { id } });
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

        const updated = await prisma.quotation.update({
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
            await prisma.notification.create({
                data: {
                    type: "QUOTATION_ACCEPTED",
                    title: "Penawaran Diterima",
                    message: `Penawaran "${updated.number}" telah diterima oleh pelanggan.`
                }
            });
        } else if (status === "REJECTED" && currentQuotation.status !== "REJECTED") {
            await prisma.notification.create({
                data: {
                    type: "QUOTATION_REJECTED",
                    title: "Penawaran Ditolak",
                    message: `Penawaran "${updated.number}" telah ditolak oleh pelanggan.`
                }
            });
        }

        await logActivity("UPDATE_QUOTATION", `Updated quotation ID ${id}`, req.user?.id);
        return res.json(updated);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteQuotation = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const q = await prisma.quotation.findUnique({ where: { id } });
        if (q) {
            await prisma.customer.update({
                where: { id: q.customerId },
                data: { totalQuotations: { decrement: 1 } }
            });
        }
        await prisma.quotation.delete({ where: { id } });
        await logActivity("DELETE_QUOTATION", `Deleted quotation ID ${id}`, req.user?.id);
        return res.json({ message: "Quotation deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const convertToInvoice = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: { customer: true }
        });

        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        // Generate Invoice Number
        const count = await prisma.invoice.count();
        const invoiceNumber = `INV-${Date.now().toString().slice(-4)}-${(count + 1).toString().padStart(4, "0")}`;

        const invoice = await prisma.invoice.create({
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
        await prisma.quotation.update({
            where: { id },
            data: { status: "ACCEPTED" }
        });

        // Update Customer invoices count & purchases count
        await prisma.customer.update({
            where: { id: quotation.customerId },
            data: {
                totalInvoices: { increment: 1 }
            }
        });

        await prisma.notification.create({
            data: {
                type: "NEW_INVOICE",
                title: "Invoice Baru Dibuat",
                message: `Invoice "${invoiceNumber}" telah dibuat dari Penawaran "${quotation.number}".`
            }
        });

        await logActivity("CONVERT_QUOTATION_TO_INVOICE", `Converted Quotation ${quotation.number} to Invoice ${invoiceNumber}`, req.user?.id);
        return res.status(201).json(invoice);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
