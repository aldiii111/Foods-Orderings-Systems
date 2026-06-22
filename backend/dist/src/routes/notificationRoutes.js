"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, notificationController_1.getNotifications);
router.put("/mark-all-read", authMiddleware_1.default, notificationController_1.markAllRead);
router.put("/:id/read", authMiddleware_1.default, notificationController_1.markAsRead);
exports.default = router;
