const router = require("express").Router();
const { jwtAuthMiddleware } = require("../middlewares/jwtMiddleware");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.put("/reset-password", authController.restPassword);
router.put("/verify-otp", authController.verifyOtp);
router.get("/get-user", authController.getUser);

module.exports = router;
