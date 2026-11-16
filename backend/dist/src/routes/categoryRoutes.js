"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, categoryController_1.getCategories);
router.post("/", authMiddleware_1.default, categoryController_1.createCategory);
router.post("/reorder", authMiddleware_1.default, categoryController_1.reorderCategories);
router.put("/:id", authMiddleware_1.default, categoryController_1.updateCategory);
router.delete("/:id", authMiddleware_1.default, categoryController_1.deleteCategory);
exports.default = router;
