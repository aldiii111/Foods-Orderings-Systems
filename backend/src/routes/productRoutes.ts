import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    bulkUpdateProductStatus,
    importProducts,
    uploadImage,
} from "../controllers/productController";

const router = Router();

router.get("/", authMiddleware as any, getProducts);
router.post("/", authMiddleware as any, createProduct);
router.post("/bulk-delete", authMiddleware as any, bulkDeleteProducts);
router.post("/bulk-status", authMiddleware as any, bulkUpdateProductStatus);
router.post("/import", authMiddleware as any, importProducts);
router.post("/upload", authMiddleware as any, upload.single("image"), uploadImage);

router.get("/:id", authMiddleware as any, getProductById);
router.put("/:id", authMiddleware as any, updateProduct);
router.delete("/:id", authMiddleware as any, deleteProduct);

export default router;
