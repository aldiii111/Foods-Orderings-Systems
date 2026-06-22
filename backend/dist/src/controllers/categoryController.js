"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return res.json(categories);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name, description, status, order } = req.body;
        const category = await prisma_1.default.category.create({
            data: {
                name,
                description,
                status: status || "ACTIVE",
                order: order !== undefined ? parseInt(order) : 0,
            }
        });
        await (0, audit_1.logActivity)("CREATE_CATEGORY", `Created category ${name}`, req.user?.id);
        return res.status(201).json(category);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status, order } = req.body;
        const category = await prisma_1.default.category.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                status,
                order: order !== undefined ? parseInt(order) : undefined,
            }
        });
        await (0, audit_1.logActivity)("UPDATE_CATEGORY", `Updated category ID ${id}`, req.user?.id);
        return res.json(category);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.category.delete({
            where: { id: parseInt(id) }
        });
        await (0, audit_1.logActivity)("DELETE_CATEGORY", `Deleted category ID ${id}`, req.user?.id);
        return res.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteCategory = deleteCategory;
const reorderCategories = async (req, res) => {
    try {
        const { ids } = req.body; // Array of IDs in the new order
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid category IDs array" });
        }
        await prisma_1.default.$transaction(ids.map((id, index) => prisma_1.default.category.update({
            where: { id: parseInt(id) },
            data: { order: index }
        })));
        await (0, audit_1.logActivity)("REORDER_CATEGORIES", "Reordered categories", req.user?.id);
        return res.json({ message: "Categories reordered successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.reorderCategories = reorderCategories;
