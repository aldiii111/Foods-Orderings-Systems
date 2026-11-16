"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.importProducts = exports.bulkUpdateProductStatus = exports.bulkDeleteProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getProducts = async (req, res) => {
    try {
        const search = req.query.search || "";
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        const status = req.query.status || undefined;
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? "asc" : "desc";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const whereClause = {
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
        const [products, total] = await prisma_1.default.$transaction([
            prisma_1.default.product.findMany({
                where: whereClause,
                include: {
                    category: true,
                    unit: true
                },
                orderBy: { [sortBy]: order },
                skip,
                take: limit
            }),
            prisma_1.default.product.count({ where: whereClause })
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        const { name, sku, barcode, categoryId, unitId, description, costPrice, sellingPrice, stock, minStock, status, image } = req.body;
        if (!name || sellingPrice === undefined) {
            return res.status(400).json({ message: "Product Name and Selling Price are required" });
        }
        const product = await prisma_1.default.product.create({
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
        if (stock && Number(stock) > 0) {
            await prisma_1.default.stockMovement.create({
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
        await (0, audit_1.logActivity)("CREATE_PRODUCT", `Created product ${name} with SKU ${sku}`, req.user?.id);
        return res.status(201).json(product);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma_1.default.product.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, sku, barcode, categoryId, unitId, description, costPrice, sellingPrice, stock, minStock, status, image } = req.body;
        const currentProduct = await prisma_1.default.product.findUnique({ where: { id } });
        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (stock !== undefined && Number(stock) !== currentProduct.stock) {
            const beforeStock = currentProduct.stock;
            const afterStock = Number(stock);
            await prisma_1.default.stockMovement.create({
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
        const product = await prisma_1.default.product.update({
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
        await (0, audit_1.logActivity)("UPDATE_PRODUCT", `Updated product ID ${id}`, req.user?.id);
        return res.json(product);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.default.product.delete({ where: { id } });
        await (0, audit_1.logActivity)("DELETE_PRODUCT", `Deleted product ID ${id}`, req.user?.id);
        return res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid product IDs" });
        }
        await prisma_1.default.product.deleteMany({
            where: { id: { in: ids.map(Number) } }
        });
        await (0, audit_1.logActivity)("BULK_DELETE_PRODUCTS", `Deleted products count: ${ids.length}`, req.user?.id);
        return res.json({ message: "Products deleted in bulk" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.bulkDeleteProducts = bulkDeleteProducts;
const bulkUpdateProductStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;
        if (!Array.isArray(ids) || !status) {
            return res.status(400).json({ message: "Invalid parameters" });
        }
        await prisma_1.default.product.updateMany({
            where: { id: { in: ids.map(Number) } },
            data: { status }
        });
        await (0, audit_1.logActivity)("BULK_STATUS_PRODUCT", `Updated status to ${status} for ${ids.length} products`, req.user?.id);
        return res.json({ message: `Products status updated to ${status}` });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.bulkUpdateProductStatus = bulkUpdateProductStatus;
const importProducts = async (req, res) => {
    try {
        const { products } = req.body; // Array of product data
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Invalid products list" });
        }
        const createdProducts = [];
        for (const item of products) {
            let categoryId = null;
            if (item.category) {
                const cat = await prisma_1.default.category.upsert({
                    where: { name: item.category },
                    update: {},
                    create: { name: item.category }
                });
                categoryId = cat.id;
            }
            let unitId = null;
            if (item.unit) {
                const unit = await prisma_1.default.unit.upsert({
                    where: { symbol: item.unit },
                    update: {},
                    create: { name: item.unit, symbol: item.unit }
                });
                unitId = unit.id;
            }
            const p = await prisma_1.default.product.create({
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
                await prisma_1.default.stockMovement.create({
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
        await (0, audit_1.logActivity)("IMPORT_PRODUCTS", `Imported ${createdProducts.length} products`, req.user?.id);
        return res.json({ message: "Import success", count: createdProducts.length });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.importProducts = importProducts;
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not found" });
        }
        return res.json({ imageUrl: `/uploads/${req.file.filename}` });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.uploadImage = uploadImage;
