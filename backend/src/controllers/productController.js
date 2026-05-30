const prisma = require("../lib/prisma");

const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();

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

module.exports = {
    getProducts,
    createProduct,
};