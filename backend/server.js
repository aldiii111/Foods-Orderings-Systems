require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Berjalan");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"))

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

