import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
    getCustomers,
    createCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    importCustomers
} from "../controllers/customerController";

const router = Router();
router.get("/", authMiddleware as any, getCustomers);
router.post("/", authMiddleware as any, createCustomer);
router.post("/import", authMiddleware as any, importCustomers);
router.get("/:id", authMiddleware as any, getCustomerById);
router.put("/:id", authMiddleware as any, updateCustomer);
router.delete("/:id", authMiddleware as any, deleteCustomer);

export default router;
