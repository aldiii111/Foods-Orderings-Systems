const prisma = require("../lib/prisma");

const getProducts = async (req, res) => {
    try {
        const search = req.query.search || "";

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            image,
        } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                message: "Nama dan harga wajib diisi",
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                image,
            },
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            return res.status(404).json({
                message: "Produk tidak ditemukan",
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            name,
            description,
            price,
            stock,
            image,
        } = req.body;

        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                price,
                stock,
                image,
            },
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.product.delete({
            where: {
                id,
            },
        });

        res.json({
            message: "Produk berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const uploadImage = async (req, res) => {
    try {
        res.json({
            imageUrl: `/uploads/${req.file.filename}`,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadImage,
};