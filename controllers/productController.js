const Product = require("../models/Products");

//create product 
const createProduct = async (req,res)=>{
    const newproduct = new Product(req.body); 


    try{
        const savedproduct = await newproduct.save();
        res.status(200).json(savedproduct);

    }catch(err){
        res.status(400).json(err);

    }
}

//get all products and products by query 
const getProducts = async(req,res)=>{
    const categoryQuery = req.query.category; 
    try{
        let products ; 
        if(categoryQuery){
            products = await Product.find(
                {
                    categories:{
                         $in:[categoryQuery]
                        }
                }
                );
            
        }
        else{
            products = await Product.find(); 
        }
        res.status(200).json({data : products}); 


    }catch(err){
        res.status(400).json(err);

    }
}

// get product by id 
const getProduct = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id); 
        res.status(200).json(product);
    }catch(err){
        res.status(400).json(err); 
    }
}

//update product 

const updateProduct = async (req,res)=>{

    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set : req.body}, {new: true});
        res.status(200).json(updatedProduct); 

    }catch(err){
        res.status(400).json(err); 

    }

}


//delete product by id 
const deleteProduct = async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Product has been deleter"); 

    }catch(err){
        res.status(400).json(err);
    }
}




module.exports = {createProduct, getProducts, updateProduct, deleteProduct, getProduct}; 