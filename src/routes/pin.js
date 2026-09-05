import express from 'express';
import PinModel from '../models/pinModel.js';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import protectRoutes from "../middleware/middleware.js";

const router = express.Router();



router.post('/createPin', protectRoutes, async (req, res) => {
  
  try {
    const { pin1, pin2 } = req.body;
    const userId = req.user._id;

  const existingPin = await PinModel.findOne({ user: userId });

    if (existingPin) {
      return res.status(400).json({
        field: "all",
        message: "You already have a pin",
      });
    }

    if (!pin1 ) {
      return res.status(400).json({
        field: "pin1",
        message: "Please provide a pin",
      });
    }

    if (!pin2 ) {
      return res.status(400).json({
        field: "pin2",
        message: "Please provide a pin",
      });
    }

    if( pin1.length < 4 ){
      return res.status(400).json({
        field: "pin1",
        message: "Pin must be 4 digits",
      });
    }

    if( pin2.length < 4 ){
      return res.status(400).json({
        field: "pin2",
        message: "Pin must be 4 digits",
      });
    }

    if (pin1 !== pin2) {
      return res.status(400).json({
        field: "all",
        message: "Pins do not match",
      });
    }

  

    const newPin = await PinModel.create({
      user: userId,
      pin: await bcrypt.hash(pin1, 10),
    });

    
    res.status(201).json({
      success: "Pin created successfully",
    });

  } catch (error) {
    console.error("Error creating pin:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});














export default router;