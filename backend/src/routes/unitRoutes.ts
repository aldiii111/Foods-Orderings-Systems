import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getUnits, createUnit, updateUnit, deleteUnit } from "../controllers/unitController";

const router = Router();
router.get("/", authMiddleware as any, getUnits);
router.post("/", authMiddleware as any, createUnit);
router.put("/:id", authMiddleware as any, updateUnit);
router.delete("/:id", authMiddleware as any, deleteUnit);

export default router;
