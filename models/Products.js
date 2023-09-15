const array = require("@hapi/joi/lib/types/array");
const mongoose = require("mongoose"); 

const productSchema = new mongoose.Schema({
     
    title:{
        type : String , 
        required : true , 
        unique : true,
    },

    description: {
        type : String , 
        required : true,
    },

    img: {
        type : array , 
        required : true , 
    },

    categories: {
        type : Array , 
    },

    price:{
        type : Number , 
        required: true, 
    }, 
    available : {
        type : Boolean ,
        default : true
    }
    
},

{timestamps:true}

);

module.exports = mongoose.model('Product' , productSchema) ;