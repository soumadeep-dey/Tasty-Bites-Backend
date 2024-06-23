const router = require("express").Router();
const featureController = require("../controllers/featureController");
const { verifyToken } = require("../middlewares/jwtMiddleware");

router.post("/add-to-cart/:id", featureController.addToCart);
router.get("/get-cart/:id", featureController.getCart);
router.delete("/remove-from-cart/:id", featureController.removeFromCart);
router.put("/increment-quantity/:id", featureController.incrementQuantity);
router.put("/decrement-quantity/:id", featureController.decrementQuantity);
router.get("/checkout", verifyToken, featureController.checkout);
router.get("/clear-cart", verifyToken, featureController.clearCart);

module.exports = router;
