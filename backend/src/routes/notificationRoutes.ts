import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getNotifications, markAsRead, markAllRead } from "../controllers/notificationController";

const router = Router();
router.get("/", authMiddleware as any, getNotifications);
router.put("/mark-all-read", authMiddleware as any, markAllRead);
router.put("/:id/read", authMiddleware as any, markAsRead);

export default router;
