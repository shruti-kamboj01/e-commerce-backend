const express = require("express");
const router = express.Router();
const { salesByCategory, topSellingProducts, worstSellingProducts } = require("../controllers/Sales");
const { auth, isAdmin } = require("../middleware/auth");

//admin apis
router.get("/sales-by-category", auth, isAdmin, salesByCategory);
router.get("/top-selling-products", auth, isAdmin, topSellingProducts);
router.get("/worst-selling-products", auth, isAdmin,worstSellingProducts);

module.exports = router;