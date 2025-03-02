const { Product } = require("../models/Product");

// Sales category-wise
exports.salesByCategory = async (req, res) => {
  try {
    const sales = await Product.aggregate([
      { $group: { _id: "$category", totalSales: { $sum: "$totalSold" } } },
      { $sort: { totalSales: -1 } },
    ]);

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching category-wise sales:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Top-selling products
exports.topSellingProducts = async (req, res) => {
  try {
    const topProducts = await Product.find().sort({ totalSold: -1 }).limit(5);

    res.status(200).json({ success: true, data: topProducts });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Worst-selling products
exports.worstSellingProducts = async (req, res) => {
  try {
    const worstProducts = await Product.find().sort({ totalSold: 1 }).limit(5);

    res.status(200).json({ success: true, data: worstProducts });
  } catch (error) {
    console.error("Error fetching worst-selling products:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
