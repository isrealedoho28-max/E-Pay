import express from 'express';

const router = express.Router();

import jwt from "jsonwebtoken"

import UserModel from '../models/userModel.js';

const secret= process.env.JWT_SECRET

const generateToken = (userid) => { 
 return jwt.sign({userid}, secret, {expiresIn:"15d"} )
}



router.post('/register', async (req, res) => {
 
  try {

    const {email, firstname, lastname, password}=req.body;  

  if( !firstname || !lastname || !email || !password){
    return res.status(400).json({message:"All fields are required"})
  } 
 
  if (password.length < 6){
    return res.status(400).json({message:"password should be at least 6 characters long"})
     }

     if (firstname.length < 4 || lastname.length < 4) {
      return res.status(400).json({message:"your both names should be at least 4 characters long"})
     }

 const existingEmail=  await UserModel.findOne({email:email})
if(existingEmail){
  return res.status(400).json({message:"Account already exist"})
}


//get a random avatar
const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${firstname}`;

const newUser = await UserModel.create({
  firstname:firstname,
  lastname:lastname,
  email:email,
  password:password,
  profileImage: profileImage
})

const token = generateToken(newUser._id)

res.status(201).json({
  token,
  user:{
    _id:newUser._id,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    email:newUser.email,
    profileImage:newUser.profileImage
  }
})

  } catch (error) {
    console.log(error)
    res.status(400).json({message:"Internal serval error"})
  }
});
 
 
router.post('/login',  async(req, res) => {

  try {

     const {email, password}=req.body;

      if(!email || !password){
    return res.status(400).json({message:"All fields are required"})
  } 

  if (password.length < 6){
    return res.status(400).json({message:"password should be at least 6 characters long"})
     }

     const userExist = await UserModel.findOne({email:email});
     if (!userExist) {
      return res.status(400).json({message:"Account doesn't exist"})
     }

     const confirmPassword = await userExist.comparePassword(password);

     if (!confirmPassword) {
      return res.status(400).json({message:"password Incorrect"})
     }

      const token = generateToken(userExist._id);

      res.status(201).json({
        token,
        user:{
       _id:userExist._id,
    firstname: userExist.firstname,
    lastname: userExist.lastname,
    email:userExist.email,
    profileImage:userExist.profileImage
        }
      })
     
   
    
  } catch (error) {
    console.log(error)
    res.status(400).json({message:"internal server error"})
  }
});

 
export default router;