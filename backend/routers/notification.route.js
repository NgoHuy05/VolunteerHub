const express = require("express");
const router = express.Router();
const controllers = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/authMiddleware");

// -------------------------
// 🔹 CRUD thông báo người dùng
// -------------------------
router.get("/", authMiddleware, controllers.getNotifications);
router.get("/my", authMiddleware, controllers.getNotificationsByIdUser);
router.get("/admin", authMiddleware, controllers.getNotificationsByIdAdmin);
router.put("/:id/read", authMiddleware, controllers.markAsRead);
router.delete("/:id", authMiddleware, controllers.deleteNotification);

// -------------------------
// 🔹 Tạo thông báo hành động
// -------------------------
router.post("/like", authMiddleware, controllers.createLikeNotification);
router.post("/comment", authMiddleware, controllers.createCommentNotification);

// -------------------------
// 🔹 Tạo thông báo chờ duyệt (admin)
// -------------------------
router.post("/new-event", authMiddleware, controllers.createEventNotification);
router.post("/new-post", authMiddleware, controllers.createPostNotification);

// -------------------------
// 🔹 Tạo thông báo duyệt (admin)
// -------------------------
router.post("/approve-event", authMiddleware, controllers.createApproveEventNotification);
router.post("/approve-post", authMiddleware, controllers.createApprovePostNotification);
router.post("/approve-user", authMiddleware, controllers.createApproveUserNotification);

module.exports = router;
