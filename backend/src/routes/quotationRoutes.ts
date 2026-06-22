import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
    getQuotations,
    createQuotation,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    convertToInvoice
} from "../controllers/quotationController";

const router = Router();
router.get("/", authMiddleware as any, getQuotations);
router.post("/", authMiddleware as any, createQuotation);
router.get("/:id", authMiddleware as any, getQuotationById);
router.put("/:id", authMiddleware as any, updateQuotation);
router.delete("/:id", authMiddleware as any, deleteQuotation);
router.post("/:id/convert-invoice", authMiddleware as any, convertToInvoice);

export default router;
