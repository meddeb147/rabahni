const router  = require("express").Router(); 
const orderController = require("../controllers/orderController"); 
const {verifyTokenAndAuth,verifyTokenAndAdmin,verifyToken} = require("../middlewares/verifyToken");

// create order
router.post("/", orderController.createOrder);

// update order : only by admin 
router.put("/", orderController.updateOrder); 

// get order by id 
router.get("/:userId", orderController.getUserOrders);

//get all orders 
router.get("/", orderController.getAllOrders);


//get monthly income stats 
router.get("/income",  orderController.getMonthlyIncome);



//delet order 
router.delete("/:id",  orderController.deleteOrder);




module.exports = router; 