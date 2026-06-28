import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = (req.query.search as string) || "";
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        const status = req.query.status as string || undefined;
        
        // Sorting
        const sortBy = (req.query.sortBy as string) || "createdAt";
        const order = (req.query.order as string) === "asc" ? "asc" : "desc";

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const whereClause: any = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { barcode: { contains: search, mode: "insensitive" } }
            ]
        };

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        if (status) {
            whereClause.status = status;
        }

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where: whereClause,
                include: {
                    category: true,
                    unit: true
                },
                orderBy: { [sortBy]: order },
                skip,
                take: limit
            }),
            prisma.product.count({ where: whereClause })
        ]);

        return res.json({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const {
            name,
            sku,
            barcode,
            categoryId,
            unitId,
            description,
            costPrice,
            sellingPrice,
            stock,
            minStock,
            status,
            image
        } = req.body;

        if (!name || sellingPrice === undefined) {
            return res.status(400).json({ message: "Product Name and Selling Price are required" });
        }

        const product = await prisma.product.create({
            data: {
                name,
                sku: sku || null,
                barcode: barcode || null,
                categoryId: categoryId ? Number(categoryId) : null,
                unitId: unitId ? Number(unitId) : null,
                description,
                costPrice: costPrice !== undefined ? Number(costPrice) : 0,
                sellingPrice: Number(sellingPrice),
                stock: stock !== undefined ? Number(stock) : 0,
                minStock: minStock !== undefined ? Number(minStock) : 0,
                status: status || "ACTIVE",
                image
            },
            include: {
                category: true,
                unit: true
            }
        });

        // Log initial stock movement if stock > 0
        if (stock && Number(stock) > 0) {
            await prisma.stockMovement.create({
                data: {
                    productId: product.id,
                    type: "IN",
                    quantity: Number(stock),
                    beforeStock: 0,
                    afterStock: Number(stock),
                    userId: req.user?.id,
                    notes: "Stok awal produk baru"
                }
            });
        }

        await logActivity("CREATE_PRODUCT", `Created product ${name} with SKU ${sku}`, req.user?.id);
        return res.status(201).json(product);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                unit: true,
                stockMovements: {
                    orderBy: { timestamp: "desc" },
                    take: 10,
                    include: {
                        user: { select: { name: true } }
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json(product);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const {
            name,
            sku,
            barcode,
            categoryId,
            unitId,
            description,
            costPrice,
            sellingPrice,
            stock,
            minStock,
            status,
            image
        } = req.body;

        const currentProduct = await prisma.product.findUnique({ where: { id } });
        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

    
        if (stock !== undefined && Number(stock) !== currentProduct.stock) {
            const beforeStock = currentProduct.stock;
            const afterStock = Number(stock);
            await prisma.stockMovement.create({
                data: {
                    productId: id,
                    type: "ADJUSTMENT",
                    quantity: afterStock - beforeStock,
                    beforeStock,
                    afterStock,
                    userId: req.user?.id,
                    notes: "Stok disesuaikan di menu edit produk"
                }
            });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                sku: sku || null,
                barcode: barcode || null,
                categoryId: categoryId ? Number(categoryId) : null,
                unitId: unitId ? Number(unitId) : null,
                description,
                costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
                sellingPrice: sellingPrice !== undefined ? Number(sellingPrice) : undefined,
                stock: stock !== undefined ? Number(stock) : undefined,
                minStock: minStock !== undefined ? Number(minStock) : undefined,
                status,
                image
            },
            include: {
                category: true,
                unit: true
            }
        });

        await logActivity("UPDATE_PRODUCT", `Updated product ID ${id}`, req.user?.id);
        return res.json(product);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        await prisma.product.delete({ where: { id } });
        await logActivity("DELETE_PRODUCT", `Deleted product ID ${id}`, req.user?.id);
        return res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const bulkDeleteProducts = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid product IDs" });
        }
        await prisma.product.deleteMany({
            where: { id: { in: ids.map(Number) } }
        });
        await logActivity("BULK_DELETE_PRODUCTS", `Deleted products count: ${ids.length}`, req.user?.id);
        return res.json({ message: "Products deleted in bulk" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const bulkUpdateProductStatus = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { ids, status } = req.body;
        if (!Array.isArray(ids) || !status) {
            return res.status(400).json({ message: "Invalid parameters" });
        }
        await prisma.product.updateMany({
            where: { id: { in: ids.map(Number) } },
            data: { status }
        });
        await logActivity("BULK_STATUS_PRODUCT", `Updated status to ${status} for ${ids.length} products`, req.user?.id);
        return res.json({ message: `Products status updated to ${status}` });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const importProducts = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { products } = req.body; // Array of product data
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Invalid products list" });
        }

        const createdProducts = [];
        for (const item of products) {
            // Find category and unit by name or create if needed
            let categoryId = null;
            if (item.category) {
                const cat = await prisma.category.upsert({
                    where: { name: item.category },
                    update: {},
                    create: { name: item.category }
                });
                categoryId = cat.id;
            }

            let unitId = null;
            if (item.unit) {
                const unit = await prisma.unit.upsert({
                    where: { symbol: item.unit },
                    update: {},
                    create: { name: item.unit, symbol: item.unit }
                });
                unitId = unit.id;
            }

            const p = await prisma.product.create({
                data: {
                    name: item.name,
                    sku: item.sku || null,
                    barcode: item.barcode || null,
                    description: item.description || null,
                    costPrice: Number(item.costPrice) || 0,
                    sellingPrice: Number(item.sellingPrice) || Number(item.price) || 0,
                    stock: Number(item.stock) || 0,
                    minStock: Number(item.minStock) || 0,
                    status: item.status || "ACTIVE",
                    categoryId,
                    unitId
                }
            });

            if (p.stock > 0) {
                await prisma.stockMovement.create({
                    data: {
                        productId: p.id,
                        type: "IN",
                        quantity: p.stock,
                        beforeStock: 0,
                        afterStock: p.stock,
                        userId: req.user?.id,
                        notes: "Imported product"
                    }
                });
            }
            createdProducts.push(p);
        }

        await logActivity("IMPORT_PRODUCTS", `Imported ${createdProducts.length} products`, req.user?.id);
        return res.json({ message: "Import success", count: createdProducts.length });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const uploadImage = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not found" });
        }
        return res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
