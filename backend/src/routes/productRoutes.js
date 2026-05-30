const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
} = require("../controllers/productController");


router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, createProduct);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, updateProduct);
module.exports = router;