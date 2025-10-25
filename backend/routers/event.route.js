const express = require("express");
const router = express.Router();
const controllers = require("../controllers/event.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// ------------------------------------
// 📅 Event Routes (CRUD + Extra Logic)
// ------------------------------------

// 🔹 Lấy tất cả sự kiện (admin)
router.get("/all", authMiddleware, roleMiddleware(["admin"]), controllers.getAllEvent);

// 🔹 Lấy sự kiện đã duyệt mà user chưa tham gia
router.get("/available", authMiddleware, controllers.getApprovedEventsUserNotJoined);

// 🔹 Lấy sự kiện theo trạng thái của user
router.get("/all/approved", authMiddleware, controllers.getAllEventApprovedByUserId);
router.get("/all/rejected", authMiddleware, controllers.getAllEventRejectedByUserId);
router.get("/all/completed", authMiddleware, controllers.getAllEventCompletedByUserId);
router.get("/all/pending", authMiddleware, controllers.getAllEventPendingByUserId);

// 🔹 Lấy sự kiện do user tạo
router.get("/all/createdBy", authMiddleware, controllers.getAllEventCreatedBy);
router.get("/all/createdByAndStatus", authMiddleware, controllers.getAllEventCreatedByAndStatus);

// 🔹 Lấy chi tiết sự kiện
router.get("/:id", authMiddleware, controllers.getEventById);

// 🔹 Tạo mới sự kiện
router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  upload.single("banner"),
  controllers.createEvent
);

// 🔹 Xóa sự kiện
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  controllers.deleteEvent
);

// 🔹 Cập nhật sự kiện
router.patch(
  "/update/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  controllers.updateEvent
);

// 🔹 Duyệt sự kiện (chỉ admin)
router.patch(
  "/approve/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  controllers.approveEvent
);

module.exports = router;
