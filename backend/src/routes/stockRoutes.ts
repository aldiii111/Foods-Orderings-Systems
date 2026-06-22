import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getStockMovements, adjustStock } from "../controllers/stockController";

const router = Router();
router.get("/", authMiddleware as any, getStockMovements);
router.post("/adjust", authMiddleware as any, adjustStock);

export default router;
