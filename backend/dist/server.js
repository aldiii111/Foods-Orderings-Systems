"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./src/routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./src/routes/dashboardRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.get("/", (req, res) => {
    res.send("Backend Berjalan");
});
app.use("/api/products", productRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});
