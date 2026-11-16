import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import productRoutes from "./src/routes/productRoutes";
import authRoutes from "./src/routes/authRoutes";
import dashboardRoutes from "./src/routes/dashboardRoutes";
import categoryRoutes from "./src/routes/categoryRoutes";
import unitRoutes from "./src/routes/unitRoutes";
import stockRoutes from "./src/routes/stockRoutes";
import quotationRoutes from "./src/routes/quotationRoutes";
import invoiceRoutes from "./src/routes/invoiceRoutes";
import customerRoutes from "./src/routes/customerRoutes";
import adminRoutes from "./src/routes/adminRoutes";
import notificationRoutes from "./src/routes/notificationRoutes";
import settingRoutes from "./src/routes/settingRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.url);
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.send("Backend Berjalan");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
