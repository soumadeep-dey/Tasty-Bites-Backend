const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cartItems: {
    type: Array,
    default: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
  },
  otp: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hassedPwd = await bcrypt.hash(this.password, salt);
    this.password = hassedPwd;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (userPwd) {
  try {
    const isMatch = await bcrypt.compare(this.password, userPwd);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("user", userSchema);
module.exports = User;
