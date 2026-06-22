"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnits = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getUnits = async (req, res) => {
    try {
        const units = await prisma_1.default.unit.findMany({
            orderBy: { name: "asc" }
        });
        return res.json(units);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getUnits = getUnits;
const createUnit = async (req, res) => {
    try {
        const { name, symbol, description } = req.body;
        const unit = await prisma_1.default.unit.create({
            data: { name, symbol, description }
        });
        await (0, audit_1.logActivity)("CREATE_UNIT", `Created unit ${name} (${symbol})`, req.user?.id);
        return res.status(201).json(unit);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createUnit = createUnit;
const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, symbol, description } = req.body;
        const unit = await prisma_1.default.unit.update({
            where: { id: parseInt(id) },
            data: { name, symbol, description }
        });
        await (0, audit_1.logActivity)("UPDATE_UNIT", `Updated unit ID ${id}`, req.user?.id);
        return res.json(unit);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateUnit = updateUnit;
const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.unit.delete({
            where: { id: parseInt(id) }
        });
        await (0, audit_1.logActivity)("DELETE_UNIT", `Deleted unit ID ${id}`, req.user?.id);
        return res.json({ message: "Unit deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteUnit = deleteUnit;
