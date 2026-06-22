import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getUsers = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { name, email, password, role, status } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "Email is already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "STAFF",
                status: status || "ACTIVE"
            }
        });

        await logActivity("CREATE_USER_BY_ADMIN", `Created user ${email} with role ${role}`, req.user?.id);
        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { name, email, role, status } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { name, email, role, status }
        });

        await logActivity("UPDATE_USER_BY_ADMIN", `Updated user ID ${id}`, req.user?.id);
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        await logActivity("RESET_PASSWORD_BY_ADMIN", `Reset password for user ID ${id}`, req.user?.id);
        return res.json({ message: "Password reset successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAuditLogs = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const logs = await prisma.auditLog.findMany({
            include: {
                user: { select: { name: true, email: true } }
            },
            orderBy: { timestamp: "desc" },
            take: 100
        });
        return res.json(logs);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
