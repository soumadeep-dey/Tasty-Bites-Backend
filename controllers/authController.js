const { findOne } = require("../models/Food");
const User = require("../models/User");
const { generateToken } = require("../middlewares/jwtMiddleware");
const nodemailer = require("nodemailer");

const authController = {
  signup: async (req, res) => {
    const data = req.body;
    try {
      const user = await findOne(data.email);
      if (user) {
        res
          .status(400)
          .json({ success: false, message: "User already exists" });
      } else {
        const newUser = new User(data);
        const savedUser = await newUser.save();
        res.status(201).json({
          success: true,
          message: "Signup successfull!",
          data: savedUser,
        });
      }
    } catch (err) {
      console.log("⛔️ Internal Server Error:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await findOne(email);
      if (!user || !user.comparePassword(password)) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid email or password" });
      } else {
        // Generate Token
        const userPayload = {
          id: savedUser.id,
        };
        const token = await generateToken(userPayload);
        // Set Cookie
        res
          .cookie("tokenCookie", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .status(201)
          .json({ success: true, message: "User logged in" });
      }
    } catch (err) {
      console.log("⛔️ Internal Server Error:", err);
      res.status(500).json({
        success: false,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  },
  logout: async (req, res) => {
    try {
      res
        .clearCookie("tokenCookie")
        .status(201)
        .json({ success: true, message: "User Logged Out" });
    } catch (error) {
      console.log("⛔️ Internal Server Error:", err);
      res.status(500).json({
        success: false,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  },
  getUser: async (req, res) => {
    const reqId = req.id;
    try {
      const user = await User.findById(reqId).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "User Found", data: user });
    } catch (error) {
      console.log("⛔️ Internal Server Error:", err);
      res.status(500).json({
        success: false,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  },
  restPassword: async (req, res) => {
    const { email } = req.body;
    try {
      // Generate OTP
      const generateOtp = Math.floor(Math.random() * 10000);

      const user = User.findOne(email);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "254d2ad1b2d0d6",
          pass: "c905cc257b3c1b",
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "contactsoumadeepdey@gmail.com", // sender address
        to: email, // list of receivers
        subject: "New OTP has been generated", // Subject line
        html: `<h3>Your generated OTP is : <b><i>${generateOtp}</i></b></h3>`, // html body
      });

      if (info.messageId) {
        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              generateOtp,
            },
          }
        );
        return res
          .status(200)
          .json({ success: true, message: "OTP has been sent to email" });
      }
    } catch (error) {
      console.log("⛔️ Internal Server Error:", err);
      res.status(500).json({
        success: false,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  },
  verifyOtp: async (req, res) => {
    const { otp, newPassword } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { otp },
        { $set: { password: newPassword, otp: 0 } }
      );
      if (!user)
        return res.status(404).json({ success: false, message: "Invalid OTP" });
      res
        .status(201)
        .json({ success: true, message: "Password has been updated" });
    } catch (error) {
      console.log("⛔️ Internal Server Error:", err);
      res.status(500).json({
        success: false,
        message: `Internal Server Error: ${err.message}`,
      });
    }
  },
};

module.exports = authController;
