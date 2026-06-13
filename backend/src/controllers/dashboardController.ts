import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboard = async (req: Request, res: Response): Promise<any> => {
    try {
        const products = await prisma.product.findMany();

        const totalProducts = products.length;

        const totalStock = products.reduce(
            (sum, product) => sum + product.stock,
            0
        );

        return res.json({
            totalProducts,
            totalStock,
            totalCustomers: 0,
            quote: "Good food is the foundation of genuine happiness."
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
