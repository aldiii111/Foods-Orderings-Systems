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
const categoryRoutes_1 = __importDefault(require("./src/routes/categoryRoutes"));
const unitRoutes_1 = __importDefault(require("./src/routes/unitRoutes"));
const stockRoutes_1 = __importDefault(require("./src/routes/stockRoutes"));
const quotationRoutes_1 = __importDefault(require("./src/routes/quotationRoutes"));
const invoiceRoutes_1 = __importDefault(require("./src/routes/invoiceRoutes"));
const customerRoutes_1 = __importDefault(require("./src/routes/customerRoutes"));
const adminRoutes_1 = __importDefault(require("./src/routes/adminRoutes"));
const notificationRoutes_1 = __importDefault(require("./src/routes/notificationRoutes"));
const settingRoutes_1 = __importDefault(require("./src/routes/settingRoutes"));
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
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/units", unitRoutes_1.default);
app.use("/api/stock", stockRoutes_1.default);
app.use("/api/quotations", quotationRoutes_1.default);
app.use("/api/invoices", invoiceRoutes_1.default);
app.use("/api/customers", customerRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/settings", settingRoutes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
    });
}
exports.default = app;
