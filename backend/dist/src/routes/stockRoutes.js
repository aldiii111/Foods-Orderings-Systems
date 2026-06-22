"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const stockController_1 = require("../controllers/stockController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, stockController_1.getStockMovements);
router.post("/adjust", authMiddleware_1.default, stockController_1.adjustStock);
exports.default = router;
