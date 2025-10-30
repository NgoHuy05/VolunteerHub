const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    type: {
      type: String,
      enum: [
        "approve_event", 
        "approve_user",
        "approve_post",
        "like_post",
        "comment_post",
        "new_event",
        "new_user_register",
        "new_post",
        "system",
      ],
      required: true,
    },
    content: {
      type: String,
      required: true, 
    },
    isRead: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
