const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (userPayload) => {
  return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.tokenCookie;
    if (!token) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ seccess: false, message: "Invalid Token" });
  }
};

module.exports = { generateToken, verifyToken };
