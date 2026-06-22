"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const logActivity = async (action, details, userId) => {
    try {
        const detailStr = typeof details === "string" ? details : JSON.stringify(details);
        await prisma_1.default.auditLog.create({
            data: {
                action,
                details: detailStr,
                userId: userId || null,
            }
        });
    }
    catch (e) {
        console.error("Failed to log activity:", e);
    }
};
exports.logActivity = logActivity;
