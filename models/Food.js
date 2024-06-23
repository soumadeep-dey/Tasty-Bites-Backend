const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({});

const Food = mongoose.model("food", foodSchema);
module.exports = Food;
