"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const unitController_1 = require("../controllers/unitController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, unitController_1.getUnits);
router.post("/", authMiddleware_1.default, unitController_1.createUnit);
router.put("/:id", authMiddleware_1.default, unitController_1.updateUnit);
router.delete("/:id", authMiddleware_1.default, unitController_1.deleteUnit);
exports.default = router;
