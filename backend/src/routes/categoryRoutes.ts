import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories } from "../controllers/categoryController";

const router = Router();
router.get("/", authMiddleware as any, getCategories);
router.post("/", authMiddleware as any, createCategory);
router.post("/reorder", authMiddleware as any, reorderCategories);
router.put("/:id", authMiddleware as any, updateCategory);
router.delete("/:id", authMiddleware as any, deleteCategory);

export default router;
