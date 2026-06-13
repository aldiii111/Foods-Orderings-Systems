"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, productController_1.getProducts);
router.post("/", authMiddleware_1.default, productController_1.createProduct);
router.get("/:id", authMiddleware_1.default, productController_1.getProductById);
router.put("/:id", authMiddleware_1.default, productController_1.updateProduct);
router.post("/upload", authMiddleware_1.default, uploadMiddleware_1.default.single("image"), productController_1.uploadImage);
exports.default = router;
