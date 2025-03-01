const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    requried: true,
  },
  productDescription: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Product", productSchema);
