
const prisma = require("../lib/prisma");

const getProducts = async (req, res) => {
    try {
        const search = req.query.search || "";
        const page = number(req.query.page) || 1;
        const limit = number(req.query.limit) || 10;
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                }
            }
        })

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
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
                message: "produk tidak ditemukan",
            });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });

    }
}

const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description, price, stock } = req.body;
        const product = await prisma.product.update({
            where: {
                id,

            },
            data: {
                name,
                description,
                price,
                stock,

            }
        });
        res.json(product)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}




module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
};