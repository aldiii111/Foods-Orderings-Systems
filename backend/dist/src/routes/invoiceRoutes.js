"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const invoiceController_1 = require("../controllers/invoiceController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, invoiceController_1.getInvoices);
router.post("/", authMiddleware_1.default, invoiceController_1.createInvoice);
router.get("/:id", authMiddleware_1.default, invoiceController_1.getInvoiceById);
router.put("/:id/payment", authMiddleware_1.default, invoiceController_1.updateInvoicePaymentStatus);
router.delete("/:id", authMiddleware_1.default, invoiceController_1.deleteInvoice);
exports.default = router;
