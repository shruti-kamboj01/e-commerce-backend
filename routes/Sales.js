const express = require("express");
const router = express.Router();
const { salesByCategory, topSellingProducts, worstSellingProducts } = require("../controllers/Sales");

router.get("/sales-by-category", salesByCategory);
router.get("/top-selling-products", topSellingProducts);
router.get("/worst-selling-products", worstSellingProducts);

module.exports = router;
