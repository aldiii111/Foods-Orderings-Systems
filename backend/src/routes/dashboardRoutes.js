const router = require("express").Router();
const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/", authMiddleware, getDashboard);

module.exports = router;
