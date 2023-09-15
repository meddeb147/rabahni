const router = require('express').Router() ; 
const authController = require("../controllers/authController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




// --------------------------------------- REGISTER --------------------------------------------------- //
router.post('/register',upload.single('photo'),authController.userRegister );


// --------------------------------------- LOGIN --------------------------------------------------- //
router.post('/login',authController.userLogin);


// --------------------------------------- chekEmail --------------------------------------------------- //
router.post('/checkEmail',authController.checkEmail);












module.exports = router ; 