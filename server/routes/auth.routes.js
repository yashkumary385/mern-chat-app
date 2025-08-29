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
    res.status(404).json({message: "Password is incorrect"})
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
    const {username , password , email, name} = req.body;
    if(!username || !email || !password){
        return res.status(404).json({message: "All fields are required"})
    }
    // if(password.length < 6){
    //     return res.status(404).json({message: "Password must be atleast 6 characters"})
    // }
    // if(!email.includes("@")){
    //     return res.status(404).json({message: "Enter a valid email"})
    // }   
    // if(name && name.length < 3){    
    //     return res.status(404).json({message: "Name must be atleast 3 characters"})
    // }

    const user = await User.findOne({email})
    const username1 = await User.findOne({username})
    if(username1){
        // Generate 3 recommended usernames
        const recommendations = [];
        for(let i=0; i<3; i++){
            recommendations.push(username + Math.floor(Math.random()*1000));
        }
        return res.status(404).json({
            message: "Username already exists, try a different one or login",
            recommendations
        })
    }
    if(user){
        return res.status(404).json({message: "Email already exists, try login"})
    }
    const hashedPassword = await bcrypt.hash(password ,10)
    const newUser = await User.create({
        username,
        password:hashedPassword,
        email,
        name
    })
    return res.status(200).json({message : "New user created", newUser})
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
  const user = await User.findById(userId).select("-password");
  if (user.username.toLowerCase() === username.toLowerCase()) {
    return res.status(400).json({ message: "You cannot search for yourself" });
  }

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
        name:req.body.name,
        email:req.body.email,
        status:req.body.status
    }
  const user =   await User.findOne({email:updateFields.email})
    if(user && user._id.toString() !== userId){
        return res.status(404).json({message:"Email already exists, try a different one"})
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


router.post("/changePassword", async (req, res) => {

  const {email , password,password1}= req.body;
  console.log(email)
  try {
    if(password != password1){
      return res.status(400).json({message: "entered password needs to be same"})
  
    }
    if(!email){
       return res.status(400).json({message: "email is required"})
    }
    const user = await User.findOne({email})
    if(!user){
       return res.status(400).json({message:"user not found"})
    }
    const userId = user._id;
  const  hashedPassword = await bcrypt.hash(password, 10);
  
     await User.findByIdAndUpdate(userId , 
      { password: hashedPassword },   // <-- update object
      { new: true } 
    )
     return res.status(200).json({message:"Password Updated Succesfully"})  
  } catch (error) {
    return res.status(400).json({message:error})
    
  }
 


})





export default router