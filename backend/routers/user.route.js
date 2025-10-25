const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// ------------------------------------
// 👤 User Routes (CRUD + Profile + Password)
// ------------------------------------

// 🔹 Lấy danh sách tất cả người dùng (Admin)
router.get("/all", authMiddleware, roleMiddleware(["admin"]), controllers.getAllUser);

// 🔹 Lấy thông tin người dùng hiện tại
router.get("/profile", authMiddleware, controllers.getProfileUser);

// 🔹 Xóa người dùng (Admin)
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), controllers.deleteUser);

// 🔹 Cập nhật thông tin người dùng (Self)
router.patch("/update", authMiddleware, controllers.updateUser);

// 🔹 Cập nhật avatar
router.patch("/update/avatar", authMiddleware, upload.single("avatar"), controllers.updateUserAvatar);

// 🔹 Admin cập nhật thông tin người dùng khác
router.patch("/update/:id", authMiddleware, roleMiddleware(["admin"]), controllers.adminUpdateUser);

// 🔹 Đổi mật khẩu
router.put("/changePassword", authMiddleware, controllers.changePassword);

module.exports = router;
