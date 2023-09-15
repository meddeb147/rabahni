const router = require("express").Router(); 
const homeController = require("../controllers/homeController"); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




// --------------------------------------- add poste --------------------------------------------------- //
router.post('/addPoste/',upload.single('photo'),homeController.addpost);


// --------------------------------------- get latest poste --------------------------------------------------- //
router.get('/getLatestPost/',homeController.getLatestPost);





module.exports = router ; 