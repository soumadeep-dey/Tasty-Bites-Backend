const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (userPayload) => {
  return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const jwtAuthMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Token not found" });
    }
    const token = authorization.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });
    req.userPayload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ seccess: false, message: "Invalid Token" });
  }
};

module.exports = { generateToken, jwtAuthMiddleware };
