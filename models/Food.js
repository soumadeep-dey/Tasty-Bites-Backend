const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("food", foodSchema);
module.exports = Food;
