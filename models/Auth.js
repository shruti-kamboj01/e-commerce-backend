const mongoose = require("mongoose");
const Order = require("./Order");

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  productOrdered: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Order,
    },
  ],
  roles: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
  },
});

module.exports = mongoose.model("Auth", authSchema);
