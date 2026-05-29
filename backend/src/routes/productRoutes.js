const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Burger",
            price: 25000
        },
        {
            id: 2,
            name: "Pizza",
            price: 35000
        }
    ]);
});

module.exports = router;