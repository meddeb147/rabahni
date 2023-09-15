const { number } = require("@hapi/joi");
const mongoose = require("mongoose"); 





const NotifSchema = new mongoose.Schema({
  title: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
 
  read: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
     
    email:{
        type : String , 
        required : true , 
        unique : true,

    },
  
    username: {
        type : String , 
        trim: true ,
        
    },

    NbNotifNotRead : {
      type : Number,
      default : 0
    },
   

    notifications: [NotifSchema],
   

    password: {
        type : String , 
        required : true , 

    },

    isAdmin : {
        type : Boolean,
        default : false , 
    }, 

    points : {
        type : String , 
        default : "0"
    },

    photo : {
        type : String ,
        default : ""
    },

    spins : {
        type : String ,
        default : "10" 
    },

    childrens: {
        type: [String],
        default: []
      },
     
      IdParent: {
        type: String,
        default: ""
      },
      uniqueCode: {
        type: String,
        
        index: { unique: true }
      },
      NbBox : {
        type : Number,
        default : 0
      },
      bio : {
        type : String,
        default : ""
      },
      dailyIncome : {
        type : Number,
        default : 0
      },
   
},

{ timestamps:true }

);

module.exports = mongoose.model('User' , userSchema) ;