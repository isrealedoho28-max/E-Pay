import express from "express";

import UserModel from "../models/userModel.js";

import protectRoutes from "../middleware/middleware.js";

const router = express.Router();

router.put(
  "/token",
  protectRoutes,
  async (req, res) => {
    try {
      const { pushToken } = req.body;

      if (!pushToken) {
        return res.status(400).json({
          message: "Push token is required",
        });
      }

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          pushToken: pushToken,
        },
        {
          new: true,
        }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Push token saved",
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;