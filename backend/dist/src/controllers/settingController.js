"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSettings = exports.getSettings = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getSettings = async (req, res) => {
    try {
        const dbSettings = await prisma_1.default.setting.findMany();
        const settings = {};
        dbSettings.forEach(s => {
            settings[s.key] = s.value;
        });
        const defaults = {
            companyName: "FoodOrder ERP",
            companyEmail: "info@foodorder.com",
            companyPhone: "+62 812-3456-7890",
            companyAddress: "Jakarta, Indonesia",
            currency: "IDR",
            taxRate: "10",
            emailTemplateQuotation: "Dear {{customerName}},\n\nPlease find attached our quotation {{number}} for your review.\n\nBest regards,\nFoodOrder Team",
            emailTemplateInvoice: "Dear {{customerName}},\n\nHere is your invoice {{number}} totaling {{amount}}.\n\nBest regards,\nFoodOrder Team",
        };
        const merged = { ...defaults, ...settings };
        return res.json(merged);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getSettings = getSettings;
const saveSettings = async (req, res) => {
    try {
        const body = req.body; // Key-value object
        const operations = Object.keys(body).map(key => {
            return prisma_1.default.setting.upsert({
                where: { key },
                update: { value: String(body[key]) },
                create: { key, value: String(body[key]) }
            });
        });
        await prisma_1.default.$transaction(operations);
        await (0, audit_1.logActivity)("UPDATE_SETTINGS", "Updated system settings", req.user?.id);
        return res.json({ message: "Settings saved successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.saveSettings = saveSettings;
