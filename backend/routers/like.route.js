const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controllers = require("../controllers/like.controller");

// ------------------------------------
// ❤️ Like Routes (CRUD-like Actions)
// ------------------------------------

// 🔹 Like hoặc UnLike bài viết
router.post("/LikeUnLike", authMiddleware, controllers.LikeUnLike);

// 🔹 Đếm số lượt like của bài viết
router.post("/count", authMiddleware, controllers.countLike);

// 🔹 Lấy danh sách bài viết user đã like
router.get("/liked", authMiddleware, controllers.getLikedPosts);

module.exports = router;
