const userRoutes = require("../routers/user.route");
const authRoutes = require("../routers/auth.route");
const eventRoutes = require("../routers/event.route");
const postRoutes = require("../routers/post.route");
const likeRoutes = require("../routers/like.route");
const commentRoutes = require("../routers/comment.route");
const userEventRoutes = require("../routers/userEvent.route");

module.exports = (app) => {
    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/event", eventRoutes);
    app.use("/post", postRoutes);
    app.use("/like", likeRoutes);
    app.use("/comment", commentRoutes);
    app.use("/userEvent", userEventRoutes);
}