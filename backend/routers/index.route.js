const userRoutes = require("../routers/user.route");
const authRoutes = require("../routers/auth.route");
const eventRoutes = require("../routers/event.route");
const postRoutes = require("../routers/post.route");
const likeRoutes = require("../routers/like.route");
const commentRoutes = require("../routers/comment.route");
const userEventRoutes = require("../routers/userEvent.route");
const notificationRoutes = require("../routers/notification.route");

module.exports = (app) => {
  // ------------------------------------
  // 🎯 API Route Mapping
  // ------------------------------------
  app.use("/auth", authRoutes);               // Đăng nhập, đăng ký
  app.use("/user", userRoutes);               // Quản lý người dùng
  app.use("/event", eventRoutes);             // Quản lý sự kiện
  app.use("/post", postRoutes);               // Quản lý bài viết
  app.use("/like", likeRoutes);               // Like / Unlike
  app.use("/comment", commentRoutes);         // Bình luận
  app.use("/userEvent", userEventRoutes);     // Người tham gia sự kiện
  app.use("/notification", notificationRoutes); // Thông báo
};
