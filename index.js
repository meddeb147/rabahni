const express = require("express");

const app = express(); 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); 
const bodyParser = require("body-parser"); 
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const User = require("./models/Users");

dotenv.config() ;

// http headers security
app.use(helmet());
 // limit requests from same api : prevents dos and bruteforce attacks

//parsing data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
//data sanitization against noSQL injection 
app.use(mongoSanitize()); 
 // Data sanitization againt XSS 
 app.use(xss());
 //preventing http parameter pollution 
 app.use(hpp());
 // cors 
 app.use(cors());


// importing routes
const authRoute = require("./routes/authRoute");
const userRoute = require('./routes/userRoute');
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const HomeRoute = require("./routes/homeRoute");
const { Console } = require("console");

//routes
app.use("/api/auth", authRoute);
app.use('/api/user', userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute); 
app.use("/api/order", orderRoute); 
app.use("/api/home", HomeRoute);

app.get("/", async(req,res)=>{res.json("jawek seta zit")} )


// DB connection 
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB, 
  
    {  useNewUrlParser : true }  
  );

  
// server connection 
app.listen(process.env.PORT || 3000,()=>{
    console.log("lintening on port ", process.env.PORT || 3000);
} );





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




async function ResetSpins() {
  try {
    const users = await User.find({});
    // 30 seconds from now
    for (const user of users) {
 
      user.spins = 10;
      if (user.dailyIncome > 0) {
        console.log(user.dailyIncome);
        await addNotifAddUser(user._id,"Commision of yesterday",user.dailyIncome);
        user.dailyIncome = 0;
      }
      
      
      await user.save();
    }
  } catch (err) {
    console.error(err);
  }
}






//const intervalTime = 10 * 1000; // 10 seconds in milliseconds

const intervalTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

setInterval(ResetSpins, intervalTime);
