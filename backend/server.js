require("dotenv").config();

const express = require("express");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Berjalan");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});