"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustStock = exports.getStockMovements = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getStockMovements = async (req, res) => {
    try {
        const movements = await prisma_1.default.stockMovement.findMany({
            orderBy: { timestamp: "desc" },
            include: {
                product: {
                    select: { name: true, sku: true }
                },
                user: {
                    select: { name: true }
                }
            }
        });
        return res.json(movements);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getStockMovements = getStockMovements;
const adjustStock = async (req, res) => {
    try {
        const { productId, type, quantity, notes } = req.body;
        if (!["IN", "OUT", "ADJUSTMENT"].includes(type)) {
            return res.status(400).json({ message: "Invalid movement type. Must be IN, OUT, or ADJUSTMENT" });
        }
        const product = await prisma_1.default.product.findUnique({
            where: { id: parseInt(productId) }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const beforeStock = product.stock;
        let afterStock = beforeStock;
        if (type === "IN") {
            afterStock = beforeStock + parseInt(quantity);
        }
        else if (type === "OUT") {
            afterStock = beforeStock - parseInt(quantity);
        }
        else {
            afterStock = parseInt(quantity);
        }
        if (afterStock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }
        const [movement] = await prisma_1.default.$transaction([
            prisma_1.default.stockMovement.create({
                data: {
                    productId: parseInt(productId),
                    type,
                    quantity: type === "ADJUSTMENT" ? parseInt(quantity) - beforeStock : parseInt(quantity),
                    beforeStock,
                    afterStock,
                    userId: req.user?.id,
                    notes
                }
            }),
            prisma_1.default.product.update({
                where: { id: parseInt(productId) },
                data: { stock: afterStock }
            })
        ]);
        await (0, audit_1.logActivity)("ADJUST_STOCK", `Adjusted stock for product ${product.name}. Type: ${type}, Qty: ${quantity}`, req.user?.id);
        // Low Stock Check Notification
        if (afterStock <= product.minStock) {
            await prisma_1.default.notification.create({
                data: {
                    type: "LOW_STOCK",
                    title: "Stok Menipis",
                    message: `Produk "${product.name}" saat ini memiliki stok ${afterStock} (Min: ${product.minStock}).`
                }
            });
        }
        return res.status(201).json(movement);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.adjustStock = adjustStock;
