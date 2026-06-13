import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    uploadImage,
} from "../controllers/productController";

const router = Router();

router.get("/", authMiddleware as any, getProducts);
router.post("/", authMiddleware as any, createProduct);
router.get("/:id", authMiddleware as any, getProductById);
router.put("/:id", authMiddleware as any, updateProduct);
router.post(
    "/upload",
    authMiddleware as any,
    upload.single("image"),
    uploadImage
);

export default router;
