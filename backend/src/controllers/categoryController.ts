import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return res.json(categories);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { name, description, status, order } = req.body;
        const category = await prisma.category.create({
            data: {
                name,
                description,
                status: status || "ACTIVE",
                order: order !== undefined ? parseInt(order) : 0,
            }
        });
        await logActivity("CREATE_CATEGORY", `Created category ${name}`, req.user?.id);
        return res.status(201).json(category);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, description, status, order } = req.body;
        const category = await prisma.category.update({
            where: { id: parseInt(id as string) },
            data: {
                name,
                description,
                status,
                order: order !== undefined ? parseInt(order) : undefined,
            }
        });
        await logActivity("UPDATE_CATEGORY", `Updated category ID ${id}`, req.user?.id);
        return res.json(category);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await prisma.category.delete({
            where: { id: parseInt(id as string) }
        });
        await logActivity("DELETE_CATEGORY", `Deleted category ID ${id}`, req.user?.id);
        return res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const reorderCategories = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { ids } = req.body; // Array of IDs in the new order
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid category IDs array" });
        }
        await prisma.$transaction(
            ids.map((id, index) =>
                prisma.category.update({
                    where: { id: parseInt(id as string) },
                    data: { order: index }
                })
            )
        );
        await logActivity("REORDER_CATEGORIES", "Reordered categories", req.user?.id);
        return res.json({ message: "Categories reordered successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
