const express = require("express");
const router = express.Router();
const { placeOrder, viewOrderHistory } = require("../controllers/Order");
const { isUser, auth } = require("../middleware/auth");

router.post("/place-order", auth, isUser, placeOrder);
router.get("/order-history", auth, isUser, viewOrderHistory);

module.exports = router;