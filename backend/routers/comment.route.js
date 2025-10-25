const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controllers = require("../controllers/comment.controller");

// -------------------------
// 💬 Comment Routes (CRUD)
// -------------------------

// Tạo bình luận mới
router.post("/create", authMiddleware, controllers.createComment);

// Lấy tất cả bình luận theo bài viết
router.get("/:postId", authMiddleware, controllers.getCommentByPostId);

module.exports = router;
