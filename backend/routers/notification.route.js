const express = require("express");
const router = express.Router();
const controllers = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my", authMiddleware, controllers.getNotifications);
router.get("/admin", authMiddleware, controllers.getNotificationsByAdmin);
router.put("/:id/read", authMiddleware, controllers.markAsRead);
router.delete("/:id", authMiddleware, controllers.deleteNotification);

router.post("/like", authMiddleware, controllers.createLikeNotification);
router.post("/comment", authMiddleware, controllers.createCommentNotification);

router.post("/new-event", authMiddleware, controllers.createEventNotification);
router.post("/new-post", authMiddleware, controllers.createPostNotification);
router.post("/new-user-register", authMiddleware, controllers.createUserRegisterNotification);

router.post("/approve-event", authMiddleware, controllers.createApproveEventNotification);
router.post("/approve-post", authMiddleware, controllers.createApprovePostNotification);
router.post("/approve-user", authMiddleware, controllers.createApproveUserNotification);

module.exports = router;
