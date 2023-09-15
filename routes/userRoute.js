const router = require("express").Router(); 
const { verifyTokenAndAuth,verifyTokenAndAdmin, verifyToken} = require("../middlewares/verifyToken");
const userController = require("../controllers/userController"); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });



// updating user info : works
router.put("/:id", verifyToken, userController.updateUser);


//deleting a user by id : works
router.delete("/:id", verifyTokenAndAuth, userController.deleteUser);

//get user by id  : works
router.get("/:id",  userController.getUser);


//get all users  : works
router.get("/", userController.getAllUsers);


//send newPass
router.post('/send-new-password', async (req, res) => {
   // const { email } = req.body;
  
    try {
      await userController.sendNewPassword(req,res);
      
    } catch (error) {
     
    }
  });


//user by email
router.get('/email/:email', userController.getUserByEmail);


// --------------------------------------- UpdateUserPhto --------------------------------------------------- //
router.put('/updateUserPhoto/:userId',upload.single('photo'),userController.updateUserPhoto);



//update user by code
router.put("/users/:uniqueCode", userController.updateUserByCode ); 


// get user by code 
router.get("/:code", userController.getUserByCode);


//add notif
router.post('/users/:userId/notif', userController.addNotif); 

// mark notif as read
router.post('/users/:userId/notif/:notifId', userController.markNotificationAsRead);



// send notif to all useres
router.post('/notif', userController.sendNewOfferNotificationToAllUsers);




module.exports = router ; 