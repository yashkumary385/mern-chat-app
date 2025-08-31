import jwt from "jsonwebtoken"
import dotenv from "dotenv"
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
}
const jwt_secret = process.env.JWT_SECRET
console.log("jwt secret" , jwt_secret)
export const verifyToken = async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(404).json("Invalid");
}
const token = authHeader.split(" ")[1];
const decodedId = jwt.verify(
    token , jwt_secret
)
req.user = decodedId
next()
    } catch (error) {
    return res.status(404).json({message:"some error " ,error:error.message})
    }

}