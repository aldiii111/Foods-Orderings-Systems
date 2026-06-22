import { Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getStockMovements = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const movements = await prisma.stockMovement.findMany({
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
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const adjustStock = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { productId, type, quantity, notes } = req.body;
        
        if (!["IN", "OUT", "ADJUSTMENT"].includes(type)) {
            return res.status(400).json({ message: "Invalid movement type. Must be IN, OUT, or ADJUSTMENT" });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const beforeStock = product.stock;
        let afterStock = beforeStock;

        if (type === "IN") {
            afterStock = beforeStock + parseInt(quantity);
        } else if (type === "OUT") {
            afterStock = beforeStock - parseInt(quantity);
        } else {
            afterStock = parseInt(quantity);
        }

        if (afterStock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        const [movement] = await prisma.$transaction([
            prisma.stockMovement.create({
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
            prisma.product.update({
                where: { id: parseInt(productId) },
                data: { stock: afterStock }
            })
        ]);

        await logActivity("ADJUST_STOCK", `Adjusted stock for product ${product.name}. Type: ${type}, Qty: ${quantity}`, req.user?.id);
        
        // Low Stock Check Notification
        if (afterStock <= product.minStock) {
            await prisma.notification.create({
                data: {
                    type: "LOW_STOCK",
                    title: "Stok Menipis",
                    message: `Produk "${product.name}" saat ini memiliki stok ${afterStock} (Min: ${product.minStock}).`
                }
            });
        }

        return res.status(201).json(movement);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
