const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const controllers = require("../controllers/post.controller");
const upload = require("../middleware/upload");

// ------------------------------------
// 📝 Post Routes (CRUD + Filter + Approve)
// ------------------------------------

// 🔹 Lấy tất cả bài viết
router.get("/all", authMiddleware, controllers.getAllPost);

// 🔹 Lấy tất cả bài viết đã duyệt
router.get("/all/approved", authMiddleware, controllers.getAllPostApproved);

// 🔹 Lấy bài viết đã duyệt theo ID sự kiện
router.get("/event/approved/:eventId", authMiddleware, controllers.getPostByIdEventApproved);

// 🔹 Lấy sự kiện đã duyệt có bài viết đang chờ duyệt
router.get("/event/post-pending", authMiddleware, controllers.getEventApprovedWithPostByIdEventPending);

// 🔹 Lấy bài viết theo ID sự kiện
router.get("/event/:eventId", authMiddleware, controllers.getPostByIdEvent);

// 🔹 Lấy bài viết theo ID người dùng
router.get("/user/:userId", authMiddleware, controllers.getPostByIdUser);

// 🔹 Lấy chi tiết bài viết theo ID
router.get("/:id", authMiddleware, controllers.getPostById);

// 🔹 Tạo bài viết mới (có upload hình)
router.post("/create", authMiddleware, upload.array("images"), controllers.createPost);

// 🔹 Lọc bài viết
router.post("/filter", authMiddleware, controllers.filterPost);

// 🔹 Xóa bài viết
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin", "manager"]), controllers.deletePost);

// 🔹 Cập nhật bài viết
router.patch("/update/:id", authMiddleware, controllers.updatePost);

// 🔹 Duyệt bài viết (Admin)
router.patch("/approve/:id", authMiddleware, roleMiddleware(["admin"]), controllers.approvePost);

module.exports = router;
