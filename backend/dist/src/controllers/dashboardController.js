"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getDashboard = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany();
        const totalProducts = products.length;
        const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
        return res.json({
            totalProducts,
            totalStock,
            totalCustomers: 0,
            quote: "Good food is the foundation of genuine happiness."
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.getDashboard = getDashboard;
