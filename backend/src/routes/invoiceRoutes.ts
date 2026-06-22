import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
    getInvoices,
    createInvoice,
    getInvoiceById,
    updateInvoicePaymentStatus,
    deleteInvoice
} from "../controllers/invoiceController";

const router = Router();
router.get("/", authMiddleware as any, getInvoices);
router.post("/", authMiddleware as any, createInvoice);
router.get("/:id", authMiddleware as any, getInvoiceById);
router.put("/:id/payment", authMiddleware as any, updateInvoicePaymentStatus);
router.delete("/:id", authMiddleware as any, deleteInvoice);

export default router;
