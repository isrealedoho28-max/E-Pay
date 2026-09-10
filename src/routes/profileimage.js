import express from "express"
import cloudinary from "../lib/cloudinary.js";
import multer from "multer"
import UserModel from "../models/userModel.js";
import protectRoutes from "../middleware/middleware.js";
const router = express.Router()


const upload = multer({
  storage:multer.memoryStorage()
});


router.put('/photo', protectRoutes, upload.single("image"), async (req, res)=>{

try {
  const userId= req.user._id

if(!req.file){
  return res.status(400).json({
    message:"no Image uploaded"
  })
}

const result = await new Promise((resolve, reject)=>{
  const uploadStream = cloudinary.uploader.upload_stream({
    folder:"e/pay/profile-pictures",},
    (error, result)=>{
      if(error){
        reject(error)
      }else{
        resolve(result)
      }
    }
  );

  uploadStream.end(req.file.buffer);
});

const imageUrl = result.secure_url;

  const updateProfile= await UserModel.findOneAndUpdate({_id:userId}, {profileImage:imageUrl}, {new:true});

  if(!updateProfile){
    return res.status(404).json({
      message:"something went wrong"
    })
  }

  res.status(200).json({
    success:"Profile photo saved successfully",
    user:{
       _id:updateProfile._id,
    firstname: updateProfile.firstname,
    lastname: updateProfile.lastname,
    email:updateProfile.email,
    profileImage:updateProfile.profileImage,
    balance: updateProfile.balance,
    accountNumber: updateProfile.accountNumber,
    cardNumber: updateProfile.cardNumber,
    expireDate:updateProfile.expireDate,
     isAdmin: updateProfile.isAdmin,
    }
  })





} catch (error) {
  return res.status(500).json({
    message:error.message
  })
}


} )




























export default router;
