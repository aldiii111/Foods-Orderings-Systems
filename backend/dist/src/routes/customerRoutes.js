"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const customerController_1 = require("../controllers/customerController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, customerController_1.getCustomers);
router.post("/", authMiddleware_1.default, customerController_1.createCustomer);
router.post("/import", authMiddleware_1.default, customerController_1.importCustomers);
router.get("/:id", authMiddleware_1.default, customerController_1.getCustomerById);
router.put("/:id", authMiddleware_1.default, customerController_1.updateCustomer);
router.delete("/:id", authMiddleware_1.default, customerController_1.deleteCustomer);
exports.default = router;
