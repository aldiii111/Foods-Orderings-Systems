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

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "https://foods-orderings-systems.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
      ];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});

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

app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});
