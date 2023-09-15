const mongoose = require("mongoose"); 

const homeSchema = new mongoose.Schema({
    photo : {
        type : String ,
        default : ""
    },
    title : {
        type : String , 
     
    },
    desc : {
        type : String , 
        
    },
    

},

{timestamps:true}

);

module.exports = mongoose.model('Home' , homeSchema) ;
