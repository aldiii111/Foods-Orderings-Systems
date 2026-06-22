"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllRead = exports.markAsRead = exports.getNotifications = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma_1.default.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });
        const unreadCount = await prisma_1.default.notification.count({
            where: { read: false }
        });
        return res.json({ notifications, unreadCount });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const notification = await prisma_1.default.notification.update({
            where: { id },
            data: { read: true }
        });
        return res.json(notification);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllRead = async (req, res) => {
    try {
        await prisma_1.default.notification.updateMany({
            where: { read: false },
            data: { read: true }
        });
        return res.json({ message: "All notifications marked as read" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.markAllRead = markAllRead;
