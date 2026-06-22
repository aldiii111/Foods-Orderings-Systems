"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const settingController_1 = require("../controllers/settingController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, settingController_1.getSettings);
router.post("/", authMiddleware_1.default, settingController_1.saveSettings);
exports.default = router;
