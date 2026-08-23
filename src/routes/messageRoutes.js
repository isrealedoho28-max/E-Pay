import express from "express"
import cloudinary from "../lib/cloudinary.js";
import HistoryModel from "../models/historyModel.js";
import protectRoutes from "../middleware/middleware.js";
import {Resend} from "resend";
const router = express.Router()

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/contact', async (req, res)=>{

  try {

    const {email, message}=req.body;

     const newEmail=email.toLowerCase().trim(); 


    if (!newEmail) {
      return res.status(400).json({
        fields:"email",
        err:"Please provide your email"
      })
    }

    

      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      return res.status(400).json({
        fields:"email",
        err:"Invalid email format"})
     }

     if (message) {
      return res.status(400).json({
        fields:"message",
        err:"Please provide a message"
      })
    }


    const {data, error} = await resend.email.send({
      from:"onboarding@resend.dev",
      to:process.env.MY_EMAIL,
      replyTo:newEmail,
      subject:"transfer issue",
      text:`User Email: ${newEmail}
      message: ${message}`,
    })

    if (error) {
      console.log("resend error")
      return res.status(500).json({
        err:"message not sent try again."
      })
    }

    return res.status(200).json({
      message:"Message sent successfully"
    })
    
  } catch (error) {
    return res.status(500).json(
      {
        err:"Something went wrong"
      }
    )

  }



})














export default router;