const prisma = require("../lib/prisma");

const getDashboard = async (req, res) => {
    try {
        const products = await prisma.product.findMany();

        const totalProducts = products.length;

        const totalStock = products.reduce(
            (sum, product) => sum + product.stock,
            0
        );

        res.json({
            totalProducts,
            totalStock,
            totalCustomers: 0,
            quote: "Good food is the foundation of genuine happiness."
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getDashboard,
};