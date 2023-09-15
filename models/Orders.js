const mongoose = require("mongoose"); 

const orderSchema = new mongoose.Schema({
     
    userId:{
        type: String, 
        required : true
    },

    productID: {
        type : String ,
        required : true,
    },
     

    amount:{
        type: String ,
        default : "1"
    },

    rue :{
        type: String, 
        required: true,
    },

    mo3tamdia :{
        type: String, 
        required: true,
    },

    wileya :{
        type: String, 
        required: true,
    },

    code_postal :{
        type: String, 
        required: true,
    },

    phone :{
        type: String, 
        required: true,
    },

    nameUser :{
        type: String, 
        required: true,
    },

    lastName :{
        type: String, 
        required: true,
    },


    status:{
        type: String, 
        default : "pending",
    },

    namep:{
        type: String,   
    },
    pricep:{
        type: String, 
        
    },
    url:{
        type: String, 
        
    },
    
},

{timestamps:true}

);

module.exports = mongoose.model('Order' , orderSchema) ;