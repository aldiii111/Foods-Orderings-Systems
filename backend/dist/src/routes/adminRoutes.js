"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Protect all admin endpoints with ADMIN and SUPER_ADMIN roles
router.use(authMiddleware_1.default);
router.use((0, rbacMiddleware_1.rbacMiddleware)(["ADMIN", "SUPER_ADMIN"]));
router.get("/users", adminController_1.getUsers);
router.post("/users", adminController_1.createUser);
router.put("/users/:id", adminController_1.updateUser);
router.put("/users/:id/reset-password", adminController_1.resetPassword);
router.get("/audit-logs", adminController_1.getAuditLogs);
exports.default = router;
