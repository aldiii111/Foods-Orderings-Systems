import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: "Email atau password salah",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Email atau password salah",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET || "",
            {
                expiresIn: "1d",
            }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email sudah digunakan",
            });
        }

        if (
            role &&
            !["customer", "staff"].includes(role)
        ) {
            return res.status(400).json({
                message: "Role tidak valid",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "customer",
            },
        });

        return res.status(201).json({
            message: "Register berhasil",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
