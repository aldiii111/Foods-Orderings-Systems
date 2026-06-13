"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.updateProduct = exports.getProductById = exports.createProduct = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getProducts = async (req, res) => {
    try {
        const search = req.query.search || "";
        const products = await prisma_1.default.product.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
        return res.json(products);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image, } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({
                message: "Nama dan harga wajib diisi",
            });
        }
        const product = await prisma_1.default.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: stock !== undefined ? Number(stock) : 0,
                image,
            },
        });
        return res.status(201).json(product);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.createProduct = createProduct;
const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma_1.default.product.findUnique({
            where: {
                id,
            },
        });
        if (!product) {
            return res.status(404).json({
                message: "Produk tidak ditemukan",
            });
        }
        return res.json(product);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description, price, stock, image, } = req.body;
        const product = await prisma_1.default.product.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                price: price !== undefined ? Number(price) : undefined,
                stock: stock !== undefined ? Number(stock) : undefined,
                image,
            },
        });
        return res.json(product);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.updateProduct = updateProduct;
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File tidak ditemukan",
            });
        }
        return res.json({
            imageUrl: `/uploads/${req.file.filename}`,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.uploadImage = uploadImage;
