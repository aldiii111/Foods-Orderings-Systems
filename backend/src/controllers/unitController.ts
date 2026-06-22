import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getUnits = async (req: Request, res: Response): Promise<any> => {
    try {
        const units = await prisma.unit.findMany({
            orderBy: { name: "asc" }
        });
        return res.json(units);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createUnit = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { name, symbol, description } = req.body;
        const unit = await prisma.unit.create({
            data: { name, symbol, description }
        });
        await logActivity("CREATE_UNIT", `Created unit ${name} (${symbol})`, req.user?.id);
        return res.status(201).json(unit);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUnit = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, symbol, description } = req.body;
        const unit = await prisma.unit.update({
            where: { id: parseInt(id as string) },
            data: { name, symbol, description }
        });
        await logActivity("UPDATE_UNIT", `Updated unit ID ${id}`, req.user?.id);
        return res.json(unit);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUnit = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await prisma.unit.delete({
            where: { id: parseInt(id as string) }
        });
        await logActivity("DELETE_UNIT", `Deleted unit ID ${id}`, req.user?.id);
        return res.json({ message: "Unit deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
