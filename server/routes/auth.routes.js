import Router from "express"
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt, { getRounds } from "bcrypt";
import dotenv from "dotenv"
import { verifyToken } from "../middleware/authMiddleware.js";

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
    res.status(200).json({message:"error",error:error.message})
        
    }
})



router.get("/allUsers" ,verifyToken, async(req,res)=>{
    // const userId = req.user.id;
    try {
        const user = await User.find({}).select("-password");
    res.status(200).json({message:"Your users",user})
    } catch (error) {
    res.status(200).json({message:"error",error:error.message})
        
    }
})



export default router