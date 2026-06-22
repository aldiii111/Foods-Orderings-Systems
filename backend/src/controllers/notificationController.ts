import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getNotifications = async (req: Request, res: Response): Promise<any> => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });
        const unreadCount = await prisma.notification.count({
            where: { read: false }
        });
        return res.json({ notifications, unreadCount });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const notification = await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
        return res.json(notification);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const markAllRead = async (req: Request, res: Response): Promise<any> => {
    try {
        await prisma.notification.updateMany({
            where: { read: false },
            data: { read: true }
        });
        return res.json({ message: "All notifications marked as read" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
