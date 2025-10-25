const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controllers = require("../controllers/userEvent.controller");

// ------------------------------------
// 🎯 User-Event Routes (CRUD + Thống kê + Duyệt)
// ------------------------------------

// 🔹 Đếm số người tham gia theo sự kiện
router.get("/all/:id", authMiddleware, controllers.countAllUserByEventId);
router.get("/pending/:id", authMiddleware, controllers.countPendingUserByEventId);
router.get("/joining/:id", authMiddleware, controllers.countJoiningUserByEventId);

// 🔹 Lấy thông tin user-event
router.get("/all", authMiddleware, controllers.getUserEvent);
router.get("/events", authMiddleware, controllers.getEventByUserId);
router.get("/events-status", authMiddleware, controllers.getEventByUserIdAndStatus);
router.get("/pending-user", authMiddleware, controllers.getPendingUsersWithApprovedEvents);

// 🔹 Tạo & duyệt user tham gia sự kiện
router.post("/create", authMiddleware, controllers.createUserEvent);
router.post("/approve/:id", authMiddleware, controllers.approveUserJoinEvent);

module.exports = router;
