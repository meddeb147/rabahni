const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {registerValidation, loginValidation} = require("../middlewares/validation");
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

          
cloudinary.config({ 
  cloud_name: 'dhqqt1nju', 
  api_key: '825414438411693', 
  api_secret: 'Xz3HC1YaOrsSYHaBpGyFkn7hbZQ' 
});
var path = require('path');

const userRegister = async(req,res)=>{
  
  const emailExist = await User.findOne({email : req.body.email});
  if(emailExist){
     return res.status(400).json({message : 'this email already email exists'});
  }
      //
       // creating hashed password 
       const salt = await bcrypt.genSalt(10);
       const hashedPassword= await bcrypt.hash(req.body.password,salt);
       let result = '';
       if (req.file && req.file.path) {
         result = await cloudinary.uploader.upload(req.file.path);
       }
 
       //creating new user 
        const user  = new User({
         email : req.body.email , 
         password : hashedPassword ,
         username : req.body.username,
         uniqueCode : generateUniqueCode(),
         photo: result.secure_url || '',
         
        });
 
       try{
        const saveduser = await user.save(); 
         const token =  jwt.sign({id:user._id}, process.env.token_secret)
         res.header('authtoken', token).json({ token: token, id: user._id, message: 'Login successful' });
       }catch(err){
        console.log("thche")
        console.log(err);
       }
      
 }
 
 const userLogin = async (req, res) => {
  try {
    // checking email existence
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Invalid email');
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      throw new Error('Wrong password');
    }

    const token = jwt.sign({ id: user._id }, process.env.token_secret);
    res.header('authtoken', token).json({ token: token, id: user._id, message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const checkEmail = async(req,res)=>{
  const user = await User.findOne({email : req.body.email });
  if(!user){
    return res.status(400).json({message: 'Email not found'}); 
  } else {
    return res.status(200).json({message: 'Email found'});
  }
}



function generateUniqueCode() {
  const codeLength = 4;
  let code = '';

  for (let i = 0; i < codeLength; i++) {
    code += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
  }

  return code;
}



 
 module.exports = { checkEmail,userLogin , userRegister}