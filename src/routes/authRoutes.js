import express from 'express';
import dns from "dns";
import nodemailer from "nodemailer";
console.log("DNS order:", dns.getDefaultResultOrder());

dns.setDefaultResultOrder("ipv4first");

console.log("DNS order after:", dns.getDefaultResultOrder());
import protectRoutes from "../middleware/middleware.js";
const router = express.Router();

import jwt from "jsonwebtoken";
import bcrypt, { compare } from "bcryptjs";


import UserModel from '../models/userModel.js';
import EmailModel from '../models/emailModel.js';


const secret= process.env.JWT_SECRET;
const myEmail =process.env.MY_EMAIL
const appPass =process.env.APP_PASSWORD


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: myEmail,
    pass: appPass,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});










const generateToken = (userid) => { 
 return jwt.sign({userid}, secret, {expiresIn:"14d"} )
}

function generateNumber(){
return  Math.floor(1000000000+Math.random()*9000000000).toString(); 
}

function cardDigit(){
return  Math.floor(1000000000+Math.random()*9000000000).toString(); 
}

function expiredDigit(){
return  Math.floor(1000000000+Math.random()*9000000000).toString(); 
}


router.get('/test-email', async (req, res) => {
  try {

    console.log("Starting email test...");

    const info = await transporter.sendMail({
      from: `"E-Pay" <${myEmail}>`,
      to: "isrealedoho28@gmail.com",
      subject: "E-Pay Test Email",
      text: "If you received this email, Nodemailer is working on Render."
    });

    console.log("Email sent:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Test email sent",
      messageId: info.messageId
    });

  } catch (error) {

    console.error("EMAIL TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



router.post('/verify', async (req, res) => {
 const { email, firstname, lastname, password } = req.body;
 let sender;

    const newEmail = email.toLowerCase().trim();
    const newFirstname = firstname.trim();
    const newLastname = lastname.trim();

  try {
   

    console.log(newEmail)

    if (!newFirstname || !newLastname || !newEmail || !password) {
      return res.status(400).json({
        fields: "all",
        message: "All fields are required"
      });
    }

    if (newFirstname.length < 3 || newLastname.length < 3) {
      return res.status(400).json({
        fields: "firstName",
        message: "names should be at least 3 letters long"
      });
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
      return res.status(400).json({
        fields: "email",
        message: "Invalid email format"
      });
    }

    const existingEmail = await UserModel.findOne({
      email: newEmail
    });

    if (existingEmail) {
      return res.status(400).json({
        fields: "email",
        message: "Email already exist"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        fields: "password",
        message: "password must be at least 6 characters long"
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
  console.log("Trying Gmail SMTP port 465...");

  sender = await transporter.sendMail({
    from: `"E-Pay" <${myEmail}>`,
    to: newEmail,
    subject: "Your E-Pay verification code",
    text: `Here is your 6-digit verification code: ${code}

This code will expire in 10 minutes.

If you did not request this code, you can ignore this email.`
  });

  console.log("Email sent using port 465");

} catch (error465) {

  console.log("Port 465 failed:", error465.message);
  console.log("Trying Gmail SMTP port 587...");
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

    console.error("Server error:", error);

    return res.status(500).json({
      fields: "all",
      message: error.message
    });
  }
});




router.post('/register', async (req, res) => {
 

  try {

    const {email, firstname, lastname, password, code}=req.body; 
    const newEmail=email.toLowerCase().trim(); 
    const newFirstname=firstname.trim();
    const newLastname=lastname.trim();
    const newCode = code.trim()
    let accountNumber;
    let cardNumber;
    let expireDate;

    const checkCode = await EmailModel.findOne({email:newEmail})
    if(checkCode.code===""){
      return res.status(404).json({
        message:"Invalid code / Expired "
      })
    }

    if(checkCode.code!==newCode){
  return res.status(400).json({
    message:"Wrong code"
  })
    }


//get a random avatar
const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${newFirstname}`;

while(true){
  const acNumber= generateNumber();
  const card = cardDigit();
  const expired= expiredDigit()
  const existingUser= await UserModel.findOne({accountNumber:acNumber})

  if(!existingUser){
accountNumber=acNumber;
 cardNumber=card;
 expireDate=expired;
break;
  }
}


const newUser = await UserModel.create({
  firstname:newFirstname,
  lastname:newLastname,
  email:newEmail,
  password:password,
  profileIcon: profileImage,
  accountNumber: accountNumber,
  cardNumber:cardNumber,
  expireDate:expireDate,
})

const token = generateToken(newUser._id)

res.status(201).json({
  token,
  user:{
    _id:newUser._id,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    email:newUser.email,
    profileIcon:newUser.profileIcon,
    balance: newUser.balance,
    accountNumber: newUser.accountNumber,
    cardNumber : newUser.cardNumber,
    expireDate: newUser.expireDate,
    isAdmin: newUser.isAdmin,
  }
})

  } catch (error) {
    console.log(error)
    res.status(400).json({
      message:"Something went wrong"})
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
    profileImage:userExist.profileImage,
  profileIcon:userExist.profileIcon,
    balance: userExist.balance,
    accountNumber: userExist.accountNumber,
    cardNumber: userExist.cardNumber,
    expireDate:userExist.expireDate,
     isAdmin: userExist.isAdmin,
        }
      })
     
   
    
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
});


router.post('/password', async (req, res)=>{

  try {
    const {password, email} = req.body;

    const checkEmail= await UserModel.findOne({email:email})
   
    const comparePass= await bcrypt.compare(password, checkEmail.password)
   
    if (comparePass){
      return res.status(200).json({
        message:"password correct"
      })
    }else{
      return res.status(400).json({
        message:"Password Incorrect"
      })
    }

    
  } catch (error) {
    return res.status(500).json(error.message)
  }




})



router.get('/userData', protectRoutes, async(req, res)=>{
try {
const userId= req.user._id;

const userInfo= await UserModel.findById(userId);

if(!userInfo){
  return res.status(404).json({
    message:"user data not found"
  })
}

return res.status(200).json({
  success:"well done",
user:{
       _id:userInfo._id,
    firstname: userInfo.firstname,
    lastname: userInfo.lastname,
    email:userInfo.email,
    profileIcon:userInfo.profileIcon,
    profileImage:userInfo.profileImage,
    balance: userInfo.balance,
    accountNumber: userInfo.accountNumber,
    cardNumber: userInfo.cardNumber,
    expireDate:userInfo.expireDate,
     isAdmin: userInfo.isAdmin,
        }
})

  
} catch (error) {
  return res.status(500).json({
    message:error.message
  })
}
})
 
export default router;