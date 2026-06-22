import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getSettings, saveSettings } from "../controllers/settingController";

const router = Router();
router.get("/", authMiddleware as any, getSettings);
router.post("/", authMiddleware as any, saveSettings);

export default router;
