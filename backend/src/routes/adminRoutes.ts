import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { rbacMiddleware } from "../middleware/rbacMiddleware";
import {
    getUsers,
    createUser,
    updateUser,
    resetPassword,
    getAuditLogs
} from "../controllers/adminController";

const router = Router();

// Protect all admin endpoints with ADMIN and SUPER_ADMIN roles
router.use(authMiddleware as any);
router.use(rbacMiddleware(["ADMIN", "SUPER_ADMIN"]) as any);

router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.put("/users/:id/reset-password", resetPassword);
router.get("/audit-logs", getAuditLogs);

export default router;
