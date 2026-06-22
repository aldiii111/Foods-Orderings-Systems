"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCustomers = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const audit_1 = require("../lib/audit");
const getCustomers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const customers = await prisma_1.default.customer.findMany({
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const customer = await prisma_1.default.customer.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getCustomerById = getCustomerById;
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, notes } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Customer name is required" });
        }
        const customer = await prisma_1.default.customer.create({
            data: { name, email: email || null, phone, address, notes }
        });
        await prisma_1.default.notification.create({
            data: {
                type: "NEW_CUSTOMER",
                title: "Pelanggan Baru",
                message: `Pelanggan baru bernama "${name}" telah ditambahkan.`
            }
        });
        await (0, audit_1.logActivity)("CREATE_CUSTOMER", `Created customer ${name}`, req.user?.id);
        return res.status(201).json(customer);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, phone, address, notes } = req.body;
        const customer = await prisma_1.default.customer.update({
            where: { id },
            data: { name, email: email || null, phone, address, notes }
        });
        await (0, audit_1.logActivity)("UPDATE_CUSTOMER", `Updated customer ID ${id}`, req.user?.id);
        return res.json(customer);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.default.customer.delete({ where: { id } });
        await (0, audit_1.logActivity)("DELETE_CUSTOMER", `Deleted customer ID ${id}`, req.user?.id);
        return res.json({ message: "Customer deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteCustomer = deleteCustomer;
const importCustomers = async (req, res) => {
    try {
        const { customers } = req.body;
        if (!Array.isArray(customers)) {
            return res.status(400).json({ message: "Invalid customers list" });
        }
        const created = [];
        for (const item of customers) {
            if (!item.name)
                continue;
            const c = await prisma_1.default.customer.create({
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
        await (0, audit_1.logActivity)("IMPORT_CUSTOMERS", `Imported ${created.length} customers`, req.user?.id);
        return res.json({ message: "Import success", count: created.length });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.importCustomers = importCustomers;
