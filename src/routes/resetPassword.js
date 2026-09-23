import express from 'express';
const router = express.Router();
import UserModel from '../models/userModel.js';
import EmailModel from '../models/emailModel.js';
import bcrypt, { compare } from "bcryptjs";


const emailUrl =process.env.EMAIL_URL
const emailSecret =process.env.EMAIL_SECRET


async function sendEmail(to, subject, text) {
  const response = await fetch(emailUrl, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      secret: emailSecret,
      to: to,
      subject: subject,
      text: text
    })
  });


  const result = await response.json();


  if (!result.success) {
    throw new Error(result.message || "Email sending failed");
  }


  return result;
}


router.post('/checkEmail', async(req, res)=>{
  let sender;
  try {
const {email} = req.body;

const newEmail = email.toLowerCase().trim();

if(!newEmail){
  return res.status(400).json({
    message:"please provide your email address"
  })
}

if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

       const existingEmail = await UserModel.findOne({
      email: newEmail
    });

    if (!existingEmail) {
      return res.status(400).json({
        message: "Email doesn't exist"
      });
    }

      const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await EmailModel.deleteMany({
      email: newEmail
    });

    const createEmail= await EmailModel.create({
      email: newEmail,
      code: code,
      expiresAt: expiresAt
    });




try {
  console.log("Sending verification email...");

  sender = await sendEmail(
    newEmail,
    "E-Pay Password reset code",
    `We received your request to reset your password
    
    Please use this code to reset your password: ${code}

This code will expire in 10 minutes.

If you did not request this code, you can ignore this email.` 
  );

  console.log("Verification email sent successfully");

} catch (emailError) {

  throw emailError

}





      if(!sender){
        return res.status(400).json({
          fields:"all",
          message:"error sending verify code"
        })
      }

    return res.status(200).json({
      success: "Email sent"
    });

    
  } catch (error) {

    await EmailModel.deleteOne({
            email: newEmail
          });

    return res.status(500).json({
      message:error.message
    })
  }
})



router.post('/checkCode', async (req, res)=>{
  try {
    const {email, code}=req.body
    const newEmail = email.toLowerCase().trim();
  const newCode = code.trim()
   
        const checkCode = await EmailModel.findOne({email:newEmail})
    if(!checkCode.code){
      return res.status(404).json({
        message:"Invalid code / Expired "
      })
    }

    if(!newCode){
      return res.status(400).json({
        message:"please input code"
      })
    }

    if(checkCode.code!==newCode){
  return res.status(400).json({
    message:"Wrong code"
  })
    }

    return res.status(200).json({
      success:"email correct and succeeded"
    })

  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
})





router.post('/newPass', async (req, res)=>{
  try {
    const {email, password, confirmPass}=req.body;
    const newEmail = email.toLowerCase().trim();

   if(!password){
    return res.status(400).json({
      fields:"password",
      message:"password field is required"})
  } 

     if(!confirmPass){
    return res.status(400).json({
      fields:"confirmPassword",
      message:"please confrim your password"})
  } 

      if (password.length < 6) {
      return res.status(400).json({
        fields: "password",
        message: "password must be at least 6 characters long"
      });
    }

     if(confirmPass!==password){
    return res.status(400).json({
      fields:"confirmPassword",
      message:"password do not match"})
  } 

    const salt = await bcrypt.genSalt(10);
  
    const harshedPass = await bcrypt.hash(password, salt)

  await UserModel.findOneAndUpdate({email:newEmail}, {password:harshedPass});

return res.status(200).json({
  success:"reset password completed"
})

  } catch (error) {
    return res.status(500).json({
      fields:"all",
      message:error.message
    })
  }
})














export default router