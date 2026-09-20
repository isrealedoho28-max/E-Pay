import express from "express";

import NotificationModel from "../models/notificationModel.js";
import protectRoutes from "../middleware/middleware.js";

const router = express.Router();


// GET ALL NOTIFICATIONS
router.get("/", protectRoutes, async (req, res) => {
  try {
    const notifications = await NotificationModel.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      notifications,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});


// GET UNREAD NOTIFICATION COUNT
router.get("/unread-count", protectRoutes, async (req, res) => {
  try {
    const count = await NotificationModel.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      count,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});


// MARK ALL NOTIFICATIONS AS READ
router.patch("/read-all", protectRoutes, async (req, res) => {
  try {
    await NotificationModel.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});


export default router;