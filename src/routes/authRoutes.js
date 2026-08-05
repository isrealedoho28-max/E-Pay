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
    const newEmail=email.toLowerCase().trim(); 
    const newFirstname=firstname.trim();
    const newLastname=lastname.trim();
    

  if( !newFirstname || !newLastname || !newEmail || !password){
    return res.status(400).json({
      fields:"all",
      message:"All fields are required"})
  } 


   if (newFirstname.length < 3 || newLastname.length < 3) {
      return res.status(400).json({
        fields:"firstName",
        message:"names should be at least 3 letters long"})
     }


      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      return res.status(400).json({
        fields:"email",
        message:"Invalid email format"})
     }


      const existingEmail=  await UserModel.findOne({email:newEmail})
if(existingEmail){
  return res.status(400).json({
    fields:"email",
    message:"Email already exist"})
}


 
  if (password.length < 6){
    return res.status(400).json({ 
      fields:"password",
      message:"password must be at least 6 characters long"})
     }



//get a random avatar
const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${newFirstname}`;

const newUser = await UserModel.create({
  firstname:newFirstname,
  lastname:newLastname,
  email:newEmail,
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
    res.status(400).json({
      fields:"all",
      message:"Internal serval error"})
  }
});
 
 
router.post('/login',  async(req, res) => {

  try {

     const {email, password}=req.body;
     const newEmail=email.toLowerCase().trim();

      if(!newEmail || !password){
    return res.status(400).json({
      fields:"all",
      message:"All fields are required"})
  } 

  if (password.length < 6){
    return res.status(400).json({message:"password should be at least 6 characters long"})
     }

     const userExist = await UserModel.findOne({email:newEmail});
     if (!userExist) {
      return res.status(400).json({
        fields:"email",
        message:"Account doesn't exist"})
     }

     const confirmPassword = await userExist.comparePassword(password);

     if (!confirmPassword) {
      return res.status(400).json({
        fields:"password",
        message:"Incorrect password"})
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