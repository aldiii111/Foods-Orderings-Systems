const express = require("express");

const router = express.Router();

const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

module.exports = router;