import jwt from "jsonwebtoken"
export const verifyToken = async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(404).json("Invalid");
}
const token = authHeader.split(" ")[1];
const decodedId = jwt.verify(
    token , process.env.JWT_SECRET
)
req.user = decodedId
next()
    } catch (error) {
    return res.status(404).json({message:"some error " ,error:error.message})
    }

}