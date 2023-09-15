const Post = require("../models/HomePage");
const cloudinary = require('cloudinary').v2;


          
cloudinary.config({ 
  cloud_name: 'dhqqt1nju', 
  api_key: '825414438411693', 
  api_secret: 'Xz3HC1YaOrsSYHaBpGyFkn7hbZQ' 
});



const addpost = async (req, res) => {
    if (req.file && req.file.path) {
        result = await cloudinary.uploader.upload(req.file.path);
      }

    const post = new Post({
        photo: result.secure_url || '',
        title: req.body.title,
        desc: req.body.desc,
     
    });
    try {
        const savedpost = await post.save();
        res.status(200).json(savedpost);
    } catch (err) {
        res.status(500).json(err);
    }
}

   

const getLatestPost = async (req, res) => {
    try {
      const latestPost = await Post.findOne().sort({ createdAt: -1 });
  
      if (!latestPost) {
        return res.status(404).json({ message: "No posts found" });
      }
  
      res.status(200).json(latestPost);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  



module.exports = {addpost,getLatestPost}