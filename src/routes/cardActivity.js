import express from "express"
import UserModel from "../models/userModel.js";
import CardModel from "../models/cardModel.js";
import protectRoutes from "../middleware/middleware.js";
const router = express.Router()

const cardActivityData = [
  {
    name: "Transport",
    amount: 23.45,
    status: "Completed",
    date: new Date("2025-11-18"),
  },

  {
    name: "TV Subscription",
    amount: 45.99,
    status: "Completed",
    date: new Date("2025-11-12"),
  },

  {
    name: "Grocery Mall",
    amount: 156.80,
    status: "Completed",
    date: new Date("2025-10-29"),
  },

  {
    name: "Quick Recharge",
    amount: 19.50,
    status: "Cancelled",
    date: new Date("2025-10-17"),
  },

  {
    name: "Fuel Station",
    amount: 72.35,
    status: "Completed",
    date: new Date("2025-09-28"),
  },

  {
    name: "Restaurant",
    amount: 38.75,
    status: "Completed",
    date: new Date("2025-09-14"),
  },

  {
    name: "Internet Subscription",
    amount: 64.99,
    status: "Completed",
    date: new Date("2025-08-30"),
  },

  {
    name: "Pharmacy",
    amount: 31.40,
    status: "Completed",
    date: new Date("2025-07-22"),
  },

  {
    name: "Transport",
    amount: 18.25,
    status: "Completed",
    date: new Date("2025-06-11"),
  },

  {
    name: "Grocery Store",
    amount: 94.60,
    status: "Completed",
    date: new Date("2025-05-24"),
  },
];



router.post('/cardHistory', protectRoutes, async (req, res)=>{

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

  const existHistory = await CardModel.findOne({user:user._id})

  if (existHistory) {
    return res.status(400).json({
      message:"this user already has card history"
    })
  }

const historyWithUser = historyData.map((item)=>({
  ...item,
  user:user._id
}))

const history = await CardModel.insertMany(historyWithUser);

res.status(200).json({
  success:"History Added Successfully"
})


} catch (error) {


  
res.status(500).json({
      message: "Internal server error", error,
    });


}


})




router.get('/cardHistory', protectRoutes, async (req, res)=>{
try {
  const history = await CardModel.find({
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