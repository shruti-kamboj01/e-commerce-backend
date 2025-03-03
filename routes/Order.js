const express = require("express");
const router = express.Router();
const { placeOrder, viewOrderHistory } = require("../controllers/Order");

router.post("/place-order", placeOrder);
router.get("/order-history/:userId", viewOrderHistory);

module.exports = router;