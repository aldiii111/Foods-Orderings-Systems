const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    uploadImage,
} = require("../controllers/productController");

router.get("/", authMiddleware, getProducts);

router.post("/", authMiddleware, createProduct);

router.get("/:id", authMiddleware, getProductById);

router.put("/:id", authMiddleware, updateProduct);

router.post(
    "/upload",
    authMiddleware,
    upload.single("image"),
    uploadImage
);

module.exports = router;