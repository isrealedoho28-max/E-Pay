import express from "express"

import UserModel from "../models/userModel.js";

const router = express.Router()


router.post("/addBalance", async (req, res) => {
  try {
    const { email, amount } = req.body
  const newEmail=email.toLowerCase().trim(); 

    const amountNum= Number(amount)

     if(!Number.isFinite(amountNum)|| amountNum <=0){
      return res.status(400).json({
        message:"Invalid Amount"
      })
    }
    const amountCent=Math.round(amountNum* 100)

    const user = await UserModel.findOne({email:newEmail})

    if(!user){
      return res.status(404).json({
        message:"user not found"
      })
    }

const addBal = await UserModel.findOneAndUpdate({email:newEmail}, {$inc:{balance:amountCent}},{new:true})
   
 return res.status(200).json({
  success:"balance added successfully",
  balance:addBal.balance
})

  }catch (error){

return res.status(500).json({
  message:error.message
})

  }})














export default router