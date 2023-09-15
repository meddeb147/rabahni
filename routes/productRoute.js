const router = require("express").Router(); 
const productController = require('../controllers/productController')
const {verifyTokenAndAuth,verifyTokenAndAdmin,verifyToken} = require("../middlewares/verifyToken");



//creatre product : works
router.post("/", productController.createProduct);

//get all products 
router.get("/",  productController.getProducts);


// get product by id 
router.get("/:id", productController.getProduct);

// update product by id  : works
router.put("/:id",  productController.updateProduct);


// delete product by id : 
router.delete("/:id", productController.deleteProduct);



module.exports = router; 