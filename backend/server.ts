import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import productRoutes from "./src/routes/productRoutes";
import authRoutes from "./src/routes/authRoutes";
import dashboardRoutes from "./src/routes/dashboardRoutes";

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

app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});
