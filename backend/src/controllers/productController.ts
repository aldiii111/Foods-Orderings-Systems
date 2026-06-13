import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = (req.query.search as string) || "";

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });

        return res.json(products);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            name,
            description,
            price,
            stock,
            image,
        } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                message: "Nama dan harga wajib diisi",
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: stock !== undefined ? Number(stock) : 0,
                image,
            },
        });

        return res.status(201).json(product);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);

        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            return res.status(404).json({
                message: "Produk tidak ditemukan",
            });
        }

        return res.json(product);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);

        const {
            name,
            description,
            price,
            stock,
            image,
        } = req.body;

        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                price: price !== undefined ? Number(price) : undefined,
                stock: stock !== undefined ? Number(stock) : undefined,
                image,
            },
        });

        return res.json(product);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const uploadImage = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File tidak ditemukan",
            });
        }
        return res.json({
            imageUrl: `/uploads/${req.file.filename}`,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
