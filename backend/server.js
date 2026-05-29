const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Backend Berjalan");
});

app.get("/api/products", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Burger",
            price: 25000,
        },
        {
            id: 2,
            name: "Pizza",
            price: 35000,
        },
    ]);
});

app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});