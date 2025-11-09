const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const Event = require("../models/Event.model");
const Post = require("../models/Post.model");

const createLikeNotification = async (req, res) => {
  try {
    const { postId } = req.body;
    const senderId = req.user.id;

    const post = await Post.findById(postId).populate("userId");
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

    if (post.userId._id.toString() === senderId)
      return res.status(200).json({ success: true, message: "Không tạo thông báo cho chính mình" });

    const sender = await User.findById(senderId).select("name");
    const content = `${sender.name} đã thích bài viết của bạn.`;

    const notification = await Notification.create({
      userId: post.userId._id,
      senderId,
      postId,
      type: "like_post",
      content,
    });

    res.status(201).json({ success: true, notification });

    global.sendToUser(post.userId._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error("❌ Lỗi tạo thông báo like:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const createCommentNotification = async (req, res) => {
  try {
    const { postId } = req.body;
    const senderId = req.user.id;
    const sender = await User.findById(senderId).select("name");

    const post = await Post.findById(postId).populate("userId");
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

    if (post.userId._id.toString() === senderId)
      return res.status(200).json({ success: true, message: "Không tạo thông báo cho chính mình" });

    const content = `${sender.name} đã bình luận bài viết của bạn.`;
    const notification = await Notification.create({
      userId: post.userId._id,
      senderId,
      postId,
      type: "comment_post",
      content,
    });

    res.status(201).json({ success: true, notification });

    global.sendToUser(post.userId._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error("❌ Lỗi tạo thông báo comment:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const createApproveUserNotification = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện" });

    if (userId.toString() === managerId.toString())
      return res.status(200).json({ success: true, message: "Không tạo thông báo cho chính mình" });

    const manager = await User.findById(managerId);
    const content = `${manager.name} đã chấp nhận bạn tham gia sự kiện "${event.title}".`;

    const notification = await Notification.create({
      userId,
      senderId: managerId,
      eventId,
      type: "approve_user",
      content,
    });

    res.status(201).json({ success: true, notification });
    global.sendToUser(userId.toString(),"new_notification", notification);
  } catch (error) {
    console.error("❌ Lỗi tạo thông báo duyệt người tham gia:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi tạo thông báo duyệt người tham gia" });
  }
};

const createApprovePostNotification = async (req, res) => {
  try {
    const { postId } = req.body;
    const adminId = req.user.id;

    const post = await Post.findById(postId).populate("userId");
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

    const content = `Bài viết của bạn "${post.content.slice(0, 30)}..." đã được duyệt.`;
    const notification = await Notification.create({
      userId: post.userId._id,
      senderId: adminId,
      postId,
      type: "approve_post",
      content,
    });

    res.status(201).json({ success: true, notification });
    global.sendToUser(post.userId._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error("❌ Lỗi tạo thông báo duyệt bài:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const createApproveEventNotification = async (req, res) => {
  try {
    const { eventId } = req.body;
    const adminId = req.user.id;

    const event = await Event.findById(eventId).populate("createBy");
    if (!event) return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện" });

        if (event.createBy._id.toString() === adminId.toString())
      return res.status(200).json({ success: true, message: "Không tạo thông báo cho chính mình" });
    
    const content = `Sự kiện "${event.title}" của bạn đã được duyệt.`;
    const notification = await Notification.create({
      userId: event.createBy._id,
      senderId: adminId,
      eventId,
      type: "approve_event",
      content,
    });

    res.status(201).json({ success: true, notification });
    global.sendToUser(event.createBy._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error("❌ Lỗi tạo thông báo duyệt sự kiện:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const createUserRegisterNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const event = await Event.findById(eventId).populate("createBy");
    if (!event)
      return res.status(404).json({ success: false, message: "Không tìm thấy sự kiện" });

    const user = await User.findById(userId);
    let receiver = await User.findOne({ role: "manager" });
    if (!receiver) receiver = await User.findOne({ role: "admin" });

    if (!receiver)
      return res.status(404).json({ success: false, message: "Không tìm thấy người nhận thông báo" });

    const content = `${user.name} đã đăng ký tham gia sự kiện "${event.title}".`;

    const notification = await Notification.create({
      userId: receiver._id,
      senderId: userId,
      eventId,
      type: "new_user_register",
      content,
    });

    res.status(201).json({ success: true, notification });
    global.sendToUser(receiver._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error(" Lỗi tạo thông báo user đăng ký:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const createEventNotification = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId).populate("createBy");
    const admin = await User.findOne({ role: "admin" });

    const content = `Sự kiện "${event.title}" của ${event.createBy.name} đang chờ duyệt.`;
    const notification = await Notification.create({
      userId: admin._id,
      senderId: event.createBy._id,
      eventId,
      type: "new_event",
      content,
    });

    res.status(201).json({ success: true, notification });
    global.sendToUser(admin._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error(" Lỗi tạo thông báo sự kiện mới:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const createPostNotification = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId).populate("userId");
    const admin = await User.findOne({ role: "admin" });

    const content = `Bài viết của ${post.userId.name} đang chờ duyệt.`;
    const notification = await Notification.create({
      userId: admin._id,
      senderId: post.userId._id,
      postId,
      type: "new_post",
      content,
    });

    res.status(201).json({ success: true, notification });
    global.sendToUser(admin._id.toString(),"new_notification", notification);
  } catch (err) {
    console.error(" Lỗi tạo thông báo bài viết mới:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
const notifications = await Notification.find({
  userId,
  type: { $ne: "new_event" }
})
     .populate("senderId", "name avatar")
      .populate("eventId")
      .populate("postId")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error(" Lỗi lấy danh sách thông báo:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getNotificationsByAdmin = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ type: "new_event" }, { type: "new_post" }],
    })
      .populate("userId")
      .populate("senderId")
      .populate("eventId")
      .populate("postId")
      .sort({ createdAt: -1 })
.lean();
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("❌ Lỗi lấy thông báo admin:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true, message: "Đã đánh dấu đã đọc" });
  } catch (err) {
    console.error("❌ Lỗi đánh dấu đã đọc:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Xóa thông báo thành công" });
  } catch (err) {
    console.error(" Lỗi xóa thông báo:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = {
  createLikeNotification,
  createCommentNotification,
  createApprovePostNotification,
  createApproveEventNotification,
  createApproveUserNotification,
  createUserRegisterNotification,
  createEventNotification,
  createPostNotification,
  getNotifications,
  getNotificationsByAdmin,
  markAsRead,
  deleteNotification,
};
