
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require("../models/Users");
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;


          
cloudinary.config({ 
  cloud_name: 'dhqqt1nju', 
  api_key: '825414438411693', 
  api_secret: 'Xz3HC1YaOrsSYHaBpGyFkn7hbZQ' 
});
var path = require('path');



// get user by code
const getUserByCode = async (code) => {
  try {
    const user = await User.findOne({ 'uniqueCode': code });
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};



const updateUserByCode = async (req, res) => {
  const uniqueCode = req.params.uniqueCode;
  const newElement = req.body.newElement;

  try {
    const parentUser = await getUserByCode(uniqueCode);
    if (!parentUser) {
      return res.status(404).json({ error: "Parent user not found" });
    }

    const childUser = await User.findById(newElement);
    if (!childUser) {
      return res.status(404).json({ error: "Child user not found" });
    }

    childUser.IdParent = parentUser._id;
    parentUser.childrens.push(newElement);
    parentUser.NbBox = parentUser.NbBox + 1;
    addNotifAddUser(parentUser._id,"New invitee!","Someone accepted your invite and has used your referral code to sign iup in Raba7ni"),


    await childUser.save();
    await parentUser.save();

    return res.json(childUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




async function generatePassword() {
    // Generate a random password with 8 characters
    const password = crypto.randomBytes(4).toString('hex');
    return password;
  }
  
  async function sendNewPassword(req, res) {
    // Generate a new password
    const password = await generatePassword();
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
      return res.status(400).json({ message: 'This email does not exist' });
    }
  
    const filter = { email: req.body.email };
    const update = { $set: { password: hashedPassword } };
    const options = { new: true };
  
    const updatedUser = await User.findOneAndUpdate(filter, update, options);
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rabahnitn@gmail.com',
        pass: 'ghgquodjoztgokqq'
      }
    });
  
    var mailOptions = {
      from: 'rabahnitn@gmail.com',
      to: req.body.email,
      subject: 'New password',
      html: `<p>Your new password is: ${password}</p>`
    };
  
    
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        res.status(400).json(error);
      } else {
        res.status(200).json(updatedUser);
      }
    });
  }
 


// update user by id 
const updateUser = async (req,res)=>{
  
    const salt = await bcrypt.genSalt(10);
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password,salt);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set : req.body}, {new: true});
        res.status(200).json(updatedUser); 

    }catch(err){
        res.status(400).json(err); 
    }
}

// delete user by id 
const deleteUser = async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted"); 

    }catch(err){
        res.status(400).json(err);
    }
}

// get user by id 
const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
  
//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          name: 1,
          points: { $toDouble: "$points" },
          email: "$email",
          username : "$username",
          photo : "$photo"
        }
      },
      {
        $sort: { points: -1 }
      },
      {
        $limit: 100
      }
    ]);

    res.status(200).json({ data: users });
  } catch (err) {
    res.status(400).json(err);
  }
};


//user by email
const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}




const updateUserPhoto = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you have userId in the route params
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let result = '';

    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    user.photo = result.secure_url || '';
    await user.save();

    res.status(200).json({ message: 'User photo updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating user photo' });
  }
};

const addNotif = async (req, res) => {

  const userId = req.params.userId;
  const title = req.body.title;
  const description = req.body.description;

  try {

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.push({
      title: title,
      description: description,
      read: false  
    });
    user.NbNotifNotRead += 1;
    await user.save();

    return res.status(200).json(user);

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: 'Server error' });

  }

}



const markNotificationAsRead = async (req,res) => {
  const userId = req.params.userId;
  const notificationID = req.params.notifId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const notification = user.notifications.id(notificationID);
    if (!notification) {
      throw new Error('Notification not found');
    }

    
    if (!notification.read) {
      notification.read = true;
      user.NbNotifNotRead =0 // Decrement NbNotifNotRead
      await user.save();
    }

    

    return user;
  } catch (error) {
    throw error;
  }
};




const addNotifAddUser = async (userId,title,description) => {


  try {

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.push({
      title: title,
      description: description,
      read: false  
    });
    user.NbNotifNotRead += 1;

    await user.save();

    return "done";

  } catch (error) {

    console.error(error);
    return "error";

  }

}




const sendNewOfferNotificationToAllUsers = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  try {
    const users = await User.find({}, '_id');

    const notificationPromises = users.map(async (user) => {
      const userId = user._id;
      return addNotifAddUser(userId, title, description);
    });

    await Promise.all(notificationPromises);

    return "Notifications sent to all users";
  } catch (error) {
    console.error(error);
    return "Error sending notifications";
  }
};

module.exports = {updateUser, deleteUser, getUser, getAllUsers, sendNewPassword, getUserByEmail,updateUserPhoto,updateUserByCode,
  getUserByCode,addNotif,markNotificationAsRead,sendNewOfferNotificationToAllUsers,addNotifAddUser}