import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getSettings = async (req: Request, res: Response): Promise<any> => {
    try {
        const dbSettings = await prisma.setting.findMany();
        const settings: Record<string, string> = {};
        dbSettings.forEach(s => {
            settings[s.key] = s.value;
        });

        const defaults: Record<string, string> = {
            companyName: "FoodOrder ERP",
            companyEmail: "info@foodorder.com",
            companyPhone: "+62 812-3456-7890",
            companyAddress: "Jakarta, Indonesia",
            currency: "IDR",
            taxRate: "10",
            emailTemplateQuotation: "Dear {{customerName}},\n\nPlease find attached our quotation {{number}} for your review.\n\nBest regards,\nFoodOrder Team",
            emailTemplateInvoice: "Dear {{customerName}},\n\nHere is your invoice {{number}} totaling {{amount}}.\n\nBest regards,\nFoodOrder Team",
        };

        const merged = { ...defaults, ...settings };
        return res.json(merged);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const saveSettings = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const body = req.body; // Key-value object
        const operations = Object.keys(body).map(key => {
            return prisma.setting.upsert({
                where: { key },
                update: { value: String(body[key]) },
                create: { key, value: String(body[key]) }
            });
        });

        await prisma.$transaction(operations);
        await logActivity("UPDATE_SETTINGS", "Updated system settings", req.user?.id);
        return res.json({ message: "Settings saved successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
