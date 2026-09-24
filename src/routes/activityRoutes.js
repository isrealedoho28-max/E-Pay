import express from "express"
import cloudinary from "../lib/cloudinary.js";
import UserModel from "../models/userModel.js";
import HistoryModel from "../models/historyModel.js";
import protectRoutes from "../middleware/middleware.js";
import NotificationModel from "../models/notifyModel.js";
const router = express.Router()



const historyData = [
  {
    id: 1,
    receiver: "DFAS Salary Deposit",
    bankName: "Citibank",
    amount: 5600000,
    status: "received",
    date: new Date("2025-11-14"),
  },
  {
    id: 2,
    receiver: "Michael Anderson",
    bankName: "Wells Fargo",
    amount: 685000,
    status: "sent",
    date: new Date("2025-10-29"),
  },
  {
    id: 3,
    receiver: "Sophia Williams",
    bankName: "Chase",
    amount: 920000,
    status: "sent",
    date: new Date("2025-10-11"),
  },
  {
    id: 4,
    receiver: "David Harris",
    bankName: "Bank of America",
    amount: 430000,
    status: "received",
    date: new Date("2025-09-26"),
  },
  {
    id: 5,
    receiver: "DFAS Salary Deposit",
    bankName: "Wells Fargo",
    amount: 5600000,
    status: "received",
    date: new Date("2025-09-15"),
  },
  {
    id: 6,
    receiver: "Olivia Martinez",
    bankName: "PayPal",
    amount: 475000,
    status: "sent",
    date: new Date("2025-09-04"),
  },
  {
    id: 7,
    receiver: "Daniel Thompson",
    bankName: "Citibank",
    amount: 540000,
    status: "sent",
    date: new Date("2025-08-21"),
  },
  {
    id: 8,
    receiver: "Robert Carter",
    bankName: "Bank of America",
    amount: 365000,
    status: "received",
    date: new Date("2025-08-07"),
  },
  {
    id: 9,
    receiver: "Emma Johnson",
    bankName: "Chase",
    amount: 780000,
    status: "sent",
    date: new Date("2025-07-24"),
  },
  {
    id: 10,
    receiver: "DFAS Salary Deposit",
    bankName: "Chase",
    amount: 5600000,
    status: "received",
    date: new Date("2025-07-15"),
  },
  {
    id: 11,
    receiver: "James Wilson",
    bankName: "Wells Fargo",
    amount: 325000,
    status: "sent",
    date: new Date("2025-06-28"),
  },
  {
    id: 12,
    receiver: "Christopher Lewis",
    bankName: "Citibank",
    amount: 615000,
    status: "received",
    date: new Date("2025-06-17"),
  },
  {
    id: 13,
    receiver: "DFAS Salary Deposit",
    bankName: "Citibank",
    amount: 5600000,
    status: "received",
    date: new Date("2025-06-13"),
  },
  {
    id: 14,
    receiver: "Isabella Davis",
    bankName: "PayPal",
    amount: 420000,
    status: "sent",
    date: new Date("2025-05-26"),
  },
  {
    id: 15,
    receiver: "Benjamin Taylor",
    bankName: "Chase",
    amount: 875000,
    status: "sent",
    date: new Date("2025-05-09"),
  },
  {
    id: 16,
    receiver: "DFAS Salary Deposit",
    bankName: "Bank of America",
    amount: 5600000,
    status: "received",
    date: new Date("2025-04-15"),
  },
  {
    id: 17,
    receiver: "Ava Miller",
    bankName: "Wells Fargo",
    amount: 510000,
    status: "sent",
    date: new Date("2025-03-28"),
  },
  {
    id: 18,
    receiver: "Charlotte Moore",
    bankName: "PayPal",
    amount: 690000,
    status: "sent",
    date: new Date("2025-03-11"),
  },
  {
    id: 19,
    receiver: "DFAS Salary Deposit",
    bankName: "Wells Fargo",
    amount: 5600000,
    status: "received",
    date: new Date("2025-02-14"),
  },
  {
    id: 20,
    receiver: "Matthew Clark",
    bankName: "Citibank",
    amount: 395000,
    status: "sent",
    date: new Date("2025-01-30"),
  },
  {
    id: 21,
    receiver: "Robert Carter",
    bankName: "Chase",
    amount: 450000,
    status: "received",
    date: new Date("2025-01-17"),
  },
  {
    id: 22,
    receiver: "Daniel Thompson",
    bankName: "Bank of America",
    amount: 735000,
    status: "sent",
    date: new Date("2024-12-28"),
  },
  {
    id: 23,
    receiver: "DFAS Salary Deposit",
    bankName: "Citibank",
    amount: 5600000,
    status: "received",
    date: new Date("2024-12-13"),
  },
];



router.post('/addHistory', async (req, res)=>{

try {
  const {email} =req.body;

const newEmail=email.toLowerCase().trim(); 

  if(!newEmail){
    return res.status(400).json({
      message:"Please provide user email"
    })
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      return res.status(400).json({
        message:"Invalid email format"})
     }

  const user = await UserModel.findOne({email:newEmail});

  if (!user) {
    return res.status(404).json({
      message:"user not found"
    })
  }

  const existHistory = await HistoryModel.findOne({user:user._id})

  if (existHistory) {
    return res.status(400).json({
      message:"this user already has transfer history"
    })
  }

const historyWithUser = historyData.map((item)=>({
  ...item,
  user:user._id
}))

const history = await HistoryModel.insertMany(historyWithUser);

res.status(200).json({
  success:"History Added Successfully"
})


} catch (error) {


  
res.status(500).json({
      message: "Internal server error", error,
    });


}


})




router.get('/history', protectRoutes, async (req, res)=>{
try {
  const history = await HistoryModel.find({
    user: req.user._id,
  }).sort({date:-1});

  return res.status(200).json({
    success:true,
    history,
  })


} catch (error) {
  
  return res.status(500).json({
    message:"internal server error",
  })
}

})



export default router