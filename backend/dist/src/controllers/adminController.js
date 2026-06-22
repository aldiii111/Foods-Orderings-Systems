"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.resetPassword = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const audit_1 = require("../lib/audit");
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        });
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "Email is already taken" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "STAFF",
                status: status || "ACTIVE"
            }
        });
        await (0, audit_1.logActivity)("CREATE_USER_BY_ADMIN", `Created user ${email} with role ${role}`, req.user?.id);
        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, role, status } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id },
            data: { name, email, role, status }
        });
        await (0, audit_1.logActivity)("UPDATE_USER_BY_ADMIN", `Updated user ID ${id}`, req.user?.id);
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
const resetPassword = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.default.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
        await (0, audit_1.logActivity)("RESET_PASSWORD_BY_ADMIN", `Reset password for user ID ${id}`, req.user?.id);
        return res.json({ message: "Password reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.resetPassword = resetPassword;
const getAuditLogs = async (req, res) => {
    try {
        const logs = await prisma_1.default.auditLog.findMany({
            include: {
                user: { select: { name: true, email: true } }
            },
            orderBy: { timestamp: "desc" },
            take: 100
        });
        return res.json(logs);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAuditLogs = getAuditLogs;
