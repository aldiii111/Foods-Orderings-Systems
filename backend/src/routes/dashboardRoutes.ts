import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware as any, getDashboard);

export default router;
