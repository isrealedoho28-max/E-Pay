import express from "express"

import PinModel from '../models/pinModel.js';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import HistoryModel from "../models/historyModel.js";
import protectRoutes from "../middleware/middleware.js";


const router = express.Router()

router.post('/pay', protectRoutes, async(req, res)=>{
try {
const { firstname, lastname, amount, pin, bankname} = req.body;
const userId= req.user._id
    const newFirstname=firstname.trim();
    const newLastname=lastname.trim();
const newBankname= bankname.trim();

    const newAmount = Number(amount)

if (!Number.isFinite(newAmount) || newAmount <= 0) {
  return res.status(400).json({
    message: "Invalid amount"
  });
}


const centAmount = Math.round(newAmount*100)

const getPin = await PinModel.findOne({user:userId})

if(!getPin){
return res.status(404).json({
  message:"you don't have a pin! please set your pin below"
})
}

const getBalance = await UserModel.findById(userId)

const comparePin= await bcrypt.compare(pin, getPin.pin);

if(!comparePin){
  return res.status(400).json({
    message:"wrong pin"
  })
}

const accBalance = getBalance.balance;

if(accBalance < centAmount){
  return res.status(400).json({
    message:"insufficient funds"
  })
}

const newBalance= Number(accBalance - centAmount);

const updateBal = await UserModel.findOneAndUpdate({_id:userId}, {balance:newBalance},{new:true} )

const histData= await HistoryModel.create({
  user:userId,
  receiver:`${newFirstname}  ${newLastname}`,
  bankName:newBankname,
  amount:newAmount,
  date:Date.now()
})

return res.status(200).json({success:true})

  
} catch (error) {
  return res.status(500).json({
    message:error.message
  })
}
})











export default router