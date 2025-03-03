const { Product, Order } = require("../models/Product");

// Place an Order (Multiple Products)
exports.placeOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order details" });
    }

    let totalAmount = 0;
    let updatedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
      }

      totalAmount += product.price * item.quantity;
      updatedProducts.push({
        productId: product._id,
        quantity: item.quantity,
      });

      // Update totalSold for the product
      product.totalSold += item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId,
      products: updatedProducts,
      totalAmount,
    });

    await newOrder.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// View Order History
exports.viewOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const orders = await Order.find({ userId }).populate("products.productId");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};