"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const quotationController_1 = require("../controllers/quotationController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, quotationController_1.getQuotations);
router.post("/", authMiddleware_1.default, quotationController_1.createQuotation);
router.get("/:id", authMiddleware_1.default, quotationController_1.getQuotationById);
router.put("/:id", authMiddleware_1.default, quotationController_1.updateQuotation);
router.delete("/:id", authMiddleware_1.default, quotationController_1.deleteQuotation);
router.post("/:id/convert-invoice", authMiddleware_1.default, quotationController_1.convertToInvoice);
exports.default = router;
