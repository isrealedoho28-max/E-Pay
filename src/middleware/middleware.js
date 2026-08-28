import jwt from "jsonwebtoken"
import UserModel from "../models/userModel.js"
const secret = process.env.JWT_SECRET




const protectRoutes = async (req, res, next)=>{

  try {
    
   const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({message:"unauthorized user"})
    }
   
    const decodeToken = jwt.verify(token, secret);

    const user= await UserModel.findById(decodeToken.userid).select("-password")
   
    if(!user){
      return res.status(401).json({message:"token is invalid"})
    }

    req.user= user

    next()

  } catch (error) {

    console.log(error.message)
    res.status(401).json({message:"token is not valid"});
  
  }
}

export default protectRoutes