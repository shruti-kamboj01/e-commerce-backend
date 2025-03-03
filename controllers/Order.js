const Auth = require("../models/Auth");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Place an Order (Multiple Products)
exports.placeOrder = async (req, res) => {
  try {
    const {products}  = req.body;
    // console.log(products);
    const userId = req.user.id
    if (!userId || !products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order details" });
    }

    let totalAmount = 0;
    let updatedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      console.log("product", product);
      if (!product) {
        return res.status(404).json({
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
      product.totalSold = (product.totalSold || 0) + item.quantity;
      await product.save();
    }

    const newOrder = await Order.create({
      userId,
      products: updatedProducts,
      totalAmount,
    });
    
    await Auth.findByIdAndUpdate(
       userId,
      {$push: {productOrdered: newOrder._id}},
      {new:true}
    )

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" });
  }
};

// View Order History
exports.viewOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ 
          success: false, 
          message: "User ID is required" });
    }
    
    const orders = await Order.find({ userId }).populate("products.productId").exec();
    console.log(orders)
    res.status(200).json({ 
      success: true, 
      orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" });
  }
};