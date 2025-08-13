import Router from "express"
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt, { getRounds } from "bcrypt";
import dotenv from "dotenv"
import { verifyToken } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
const router = Router();
router.post("/login", async(req,res)=>{
    console.log("login route hitt")
    try {
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(404).json("All the credentials are required")
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json("User is not registerd")
    }
    const comparePassword = await bcrypt.compare(password , user.password)
  if(!comparePassword){
    res.status(404).json({message: "Password incorrect"})
  }
    const token = jwt.sign({ // token creation
        id:user._id,
        username:user.username
    } , JWT_SECRET , {expiresIn :"7d"})
    res.status(200).json({message:"Login Succesfull" , user,token})
    } catch (error) {
        res.status(404).json({message:error})
    }
})

router.post("/register", async(req,res)=>{
    try{
    const {username , password , email} = req.body; // will add multer later 
    if(!username || !email || !password){
    res.status(404).json({message: "All fields are required"})
    }
 const user = await User.findOne({email})
   if(user){
    res.status(404).json({message: "Email already exists try login"})
   }
   const hashedPassword = await bcrypt.hash(password ,10)
   const newUser = await User.create({
    username,
    password:hashedPassword,
    email
   })
   return res.status(200).json({message : " New user created" , newUser})


    }
    catch(error){
    res.status(404).json({message:error})

    }
  

})

router.get("/me" ,verifyToken, async(req,res)=>{
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-password");
    res.status(200).json(user)
    } catch (error) {
    res.status(404).json({message:"error",error:error.message})
        
    }
})
router.get("/search/:username", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { username } = req.params;

  try {
    const user = await User.find({
  username: { $regex: username, $options: "i" }
});

    res.status(200).json({ message: "Your user", user });
  } catch (error) {
    res.status(404).json({ message: "error", error: error.message });
  }
});

router.get("/allChatUsers" ,verifyToken, async(req,res)=>{
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-password");
    const messages = await Message.find({
      $or: [{ sender: user.username }, { reciever: user.username }]
    });

    const chatUsersSet = new Set();
    messages.forEach((msg)=>{
        if(msg.sender !== user.username) chatUsersSet.add(msg.sender)
        if(msg.reciever !== user.username) chatUsersSet.add(msg.reciever)
    })
      const chatUsers = Array.from(chatUsersSet);
    res.status(200).json({message:"Your users",chatUsers})
    } catch (error) {
    res.status(404).json({message:"error",error:error.message})
        
    }
})
router.get("/allUsers" ,verifyToken, async(req,res)=>{
    const userId = req.user.id;
    try {
        const user = await User.find({}).select("-password");
      
    res.status(200).json({message:"Your users",user})
    } catch (error) {
    res.status(404).json({message:"error",error:error.message})
        
    }
})

router.put("/update",verifyToken , async(req,res)=>{
    const userId = req.user.id;
    try {
         const updateFields = {
        username:req.body.username,
        email:req.body.email,
        status:req.body.status
    }
    const updatedUser = await User.findByIdAndUpdate(userId,
        updateFields,
        {new:true}
    )
    res.status(200).json({message:"Your updated User",updatedUser})
    } catch (error) {
    res.status(404).json({message:error,error:error.message})
}})
 router.delete("/delete",verifyToken,async(req,res)=>{
    try {
        const userId = req.user.id;
    const user = await User.findById(userId)
     await Message.deleteMany( {
        $or:[{sender:user.username} , {reciever:user.username}]
    })
        await User.findByIdAndDelete(userId);
    res.status(200).json({message:"Your Deleted User",user})
    } catch (error) {
    res.status(404).json({message:error,error:error.message})
    }
    
 })
export default router