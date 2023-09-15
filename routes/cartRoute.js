const router = require("express").Router(); 
const cartController = require("../controllers/cartController"); 
const {verifyTokenAndAuth,verifyTokenAndAdmin,verifyToken} = require("../middlewares/verifyToken");


// create cart 
router.post("/", cartController.createProduct); 

// update cart 

router.put("/:id", verifyTokenAndAuth, cartController.updateCart); 

// delete Cart 
router.delete("/:id", verifyTokenAndAuth, cartController.deleteCart);

//get cart  for user

router.get("/find/:userId", cartController.getUserCart);

// get all carts for admin 

router.get("/", cartController.getAllCarts);

//delet product from cart






module.exports= router ;