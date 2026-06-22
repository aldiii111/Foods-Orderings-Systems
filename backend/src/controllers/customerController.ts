import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/audit";
import { CustomRequest } from "../types";

export const getCustomers = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = (req.query.search as string) || "";
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } }
                ]
            },
            orderBy: { name: "asc" }
        });
        return res.json(customers);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCustomerById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                quotations: { orderBy: { date: "desc" } },
                invoices: { orderBy: { date: "desc" } }
            }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.json(customer);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createCustomer = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { name, email, phone, address, notes } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Customer name is required" });
        }

        const customer = await prisma.customer.create({
            data: { name, email: email || null, phone, address, notes }
        });

        await prisma.notification.create({
            data: {
                type: "NEW_CUSTOMER",
                title: "Pelanggan Baru",
                message: `Pelanggan baru bernama "${name}" telah ditambahkan.`
            }
        });

        await logActivity("CREATE_CUSTOMER", `Created customer ${name}`, req.user?.id);
        return res.status(201).json(customer);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateCustomer = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { name, email, phone, address, notes } = req.body;

        const customer = await prisma.customer.update({
            where: { id },
            data: { name, email: email || null, phone, address, notes }
        });

        await logActivity("UPDATE_CUSTOMER", `Updated customer ID ${id}`, req.user?.id);
        return res.json(customer);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteCustomer = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        await prisma.customer.delete({ where: { id } });
        await logActivity("DELETE_CUSTOMER", `Deleted customer ID ${id}`, req.user?.id);
        return res.json({ message: "Customer deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const importCustomers = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { customers } = req.body;
        if (!Array.isArray(customers)) {
            return res.status(400).json({ message: "Invalid customers list" });
        }

        const created = [];
        for (const item of customers) {
            if (!item.name) continue;
            const c = await prisma.customer.create({
                data: {
                    name: item.name,
                    email: item.email || null,
                    phone: item.phone || null,
                    address: item.address || null,
                    notes: item.notes || null
                }
            });
            created.push(c);
        }

        await logActivity("IMPORT_CUSTOMERS", `Imported ${created.length} customers`, req.user?.id);
        return res.json({ message: "Import success", count: created.length });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
