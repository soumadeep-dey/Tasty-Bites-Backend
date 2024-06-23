const Food = require("../models/Food");
const User = require("../models/User");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const featureController = {
  addToCart: async (req, res) => {
    const userId = req.params.id;
    const { id, name, price, rating, image, quantity } = req.body;
    try {
      // Existing Item
      const existingItem = await Food.findOne({ id, userId });
      if (existingItem) {
        const updatedItem = await Food.findByIdAndUpdate(
          existingItem.id,
          {
            quantity: existingItem.quantity + 1,
            totalPrice: existingItem.price * (existingItem.quantity + 1),
          },
          {
            upsert: true,
            new: true,
          }
        );

        if (!updatedItem) {
          return res.status(403).json({
            success: false,
            message: "Failed to add to cart",
          });
        }
        res.status(200).json({
          success: true,
          message: "Item quantity updated in cart",
          data: updatedItem,
        });
      }
      // New item
      else {
        const newCartItem = new Food({
          id,
          name,
          price,
          rating,
          image,
          userId,
          quantity: 1, // Start with quantity 1
          totalPrice: price,
        });
        const savedCartItem = await newCartItem.save();
        // User update
        const user = await User.findByIdAndUpdate(userId, {
          $push: {
            cartItems: savedCartItem._id,
          },
        });

        if (!user) {
          return res.status(403).json({
            success: false,
            message: "Failed to add to cart",
          });
        }
        res.status(201).json({
          success: true,
          message: "Item added to cart",
          data: savedCartItem,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal Server error: ${error.message}`,
      });
    }
  },
  getCart: async (req, res) => {
    const userId = req.params.id;
    try {
      const cartItems = await Food.find({ userId });
      if (!cartItems)
        return res
          .status(404)
          .json({ success: false, message: "No items found" });

      res.status(200).json({ success: true, data: cartItems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  removeFromCart: async (req, res) => {
    const foodId = req.params.id;
    try {
      const food = await Food.findByIdAndDelete({ foodId });
      if (!food)
        return res
          .status(404)
          .json({ success: false, message: "Food not found" });

      res
        .status(201)
        .json({ success: true, message: "Food item removed from cart" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  incrementQuantity: async (req, res) => {
    const foodId = req.params.id;
    try {
      const food = await Food.findByIdAndUpdate(
        foodId,
        {
          $set: {
            quantity: food.quantity + 1,
            totalPrice: food.price * (food.quantity + 1),
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      if (!food)
        return res
          .status(404)
          .json({ success: false, message: "Food item not found" });

      res
        .status(201)
        .json({ success: true, message: "Food item quantity updated" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  decrementQuantity: async (req, res) => {
    const foodId = req.params.id;
    try {
      const food = await Food.findByIdAndUpdate(
        { foodId, quantity: { $gt: 0 } },
        {
          $set: {
            quantity: food.quantity - 1,
            totalPrice: food.price * (food.quantity - 1),
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      if (!food)
        return res
          .status(404)
          .json({ success: false, message: "Food item not found" });

      res
        .status(201)
        .json({ success: true, message: "Food item quantity updated" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  checkout: async (req, res) => {
    const userId = req.id;
    try {
      const cartItems = await Food.find({ userId });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cartItems.map((item) => {
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name,
                images: [item.image],
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          };
        }),
        success_url: "https://localhost:3000/success",
        cancel_url: "https://localhost:3000/",
      });
      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  clearCart: async (req, res) => {
    const userId = req.id;
    try {
      const deleteItems = await Food.deleteMany({ userId });
      const deletedList = await User.findOneAndUpdate(userId, {
        cartItems: [],
      });
      if (!deleteItems)
        return res
          .status(404)
          .json({ success: false, message: "Failed to clear cart" });

      res.status(200).json({ succes: true, message: "Order Confirmed" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = featureController;
