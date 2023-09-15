const Order = require("../models/Orders"); 

//create order
const createOrder = async (req,res)=>{
    const newOrder = new Order(req.body); 
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    }catch(err){
        res.status(400).json(err);
    }
}

// update order 
const updateOrder = async(req, res)=>{
    try{
      const  updatedOrder =  await Order.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
       res.status(200).json(updatedOrder); 

    }catch(err){
        res.status(400).json(err)
    }
}

//get order 
const getUserOrders = async(req,res)=>{

    try{
        const orders = await Order.find({userId : req.params.userId}); 
        res.status(200).json({data:orders});
    }catch(err){
        res.status(400).json(err); 
    }

}

//get all orders 
const getAllOrders = async (req,res)=>{
    try{
        const allOrders = await Order.find(); 
        res.status(200).json(allOrders);

    }catch(err){
        res.status(400).json(err);
    }
}

//stats  : get monthly income
const getMonthlyIncome =  async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  const deleteOrder = async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      res.status(200).json(`Order with ID ${req.params.id} has been deleted`);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
module.exports= {createOrder, updateOrder, getUserOrders, getAllOrders, getMonthlyIncome, deleteOrder}