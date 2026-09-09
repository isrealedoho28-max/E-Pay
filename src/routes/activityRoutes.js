import express from "express"
import cloudinary from "../lib/cloudinary.js";
import UserModel from "../models/userModel.js";
import HistoryModel from "../models/historyModel.js";
import protectRoutes from "../middleware/middleware.js";
const router = express.Router()

const historyData = [
  {
    id: 1,
    receiver: "DFAS Salary Deposit",
    bankName: "Citibank",
    amount: 5600000,
    status: "received",
    date: new Date("2025-08-12"),
  },

  {
    id: 2,
    receiver: "Michael Anderson",
    bankName: "Wells Fargo",
    amount: 780000,
    status: "sent",
    date: new Date("2025-07-28"),
  },

  {
    id: 3,
    receiver: "Sophia Williams",
    bankName: "Chase",
    amount: 420000,
    status: "received",
    date: new Date("2025-07-11"),
  },

  {
    id: 4,
    receiver: "Olivia Martinez",
    bankName: "PayPal",
    amount: 650000,
    status: "sent",
    date: new Date("2025-06-24"),
  },

  {
    id: 5,
    receiver: "DFAS Salary Deposit",
    bankName: "Bank of America",
    amount: 3600000,
    status: "received",
    date: new Date("2025-06-03"),
  },

  {
    id: 6,
    receiver: "Daniel Thompson",
    bankName: "Citibank",
    amount: 920000,
    status: "sent",
    date: new Date("2025-05-19"),
  },

  {
    id: 7,
    receiver: "Emma Johnson",
    bankName: "Wells Fargo",
    amount: 530000,
    status: "received",
    date: new Date("2025-05-02"),
  },

  {
    id: 8,
    receiver: "James Wilson",
    bankName: "Chase",
    amount: 1180000,
    status: "sent",
    date: new Date("2025-04-17"),
  },

  {
    id: 9,
    receiver: "DFAS Salary Deposit",
    bankName: "Payoneer",
    amount: 5600000,
    status: "received",
    date: new Date("2025-04-01"),
  },

  {
    id: 10,
    receiver: "Isabella Davis",
    bankName: "Citibank",
    amount: 740000,
    status: "sent",
    date: new Date("2025-03-14"),
  },

  {
    id: 11,
    receiver: "William Brown",
    bankName: "PayPal",
    amount: 460000,
    status: "received",
    date: new Date("2025-02-26"),
  },

  {
    id: 12,
    receiver: "Ava Miller",
    bankName: "Bank of America",
    amount: 1250000,
    status: "sent",
    date: new Date("2025-02-08"),
  },

  {
    id: 13,
    receiver: "Benjamin Taylor",
    bankName: "Wells Fargo",
    amount: 680000,
    status: "sent",
    date: new Date("2025-01-21"),
  },

  {
    id: 14,
    receiver: "DFAS Salary Deposit",
    bankName: "Chase",
    amount: 3600000,
    status: "received",
    date: new Date("2024-11-29"),
  },

  {
    id: 15,
    receiver: "Charlotte Moore",
    bankName: "Citibank",
    amount: 870000,
    status: "sent",
    date: new Date("2024-11-07"),
  },

  {
    id: 16,
    receiver: "Henry Jackson",
    bankName: "Payoneer",
    amount: 520000,
    status: "sent",
    date: new Date("2024-10-16"),
  },

  {
    id: 17,
    receiver: "Amelia White",
    bankName: "Wells Fargo",
    amount: 390000,
    status: "received",
    date: new Date("2024-09-23"),
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