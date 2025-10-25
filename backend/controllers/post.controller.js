const Post = require("../models/Post.model");
const Like = require("../models/Like.model");
const Event = require("../models/Event.model");
// [POST] /post
const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, content, images: bodyImages } = req.body;

    // Nếu có upload file thật thì lấy từ req.files, 
    // còn không thì lấy từ body.images (link Cloudinary sẵn)
    const images =
      req.files && req.files.length > 0
        ? req.files.map(file => file.path)
        : Array.isArray(bodyImages)
        ? bodyImages
        : bodyImages
        ? [bodyImages]
        : [];

    const post = await Post.create({
      eventId,
      userId,
      content,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo bài đăng thành công, vui lòng chờ duyệt",
      post,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo bài đăng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi tạo bài đăng",
    });
  }
};

// [PUT] /post/:id
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, images } = req.body;

    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ success: false, message: "Bài đăng không tồn tại" });

    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      req.user._id.toString() !== post.userId.toString()
    ) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền sửa bài đăng này" });
    }

    post.content = content ?? post.content;
    post.images = images ?? post.images;

    await post.save();
    return res.status(200).json({ success: true, message: "Cập nhật bài đăng thành công", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// [DELETE] /post/:id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ success: false, message: "Không tìm thấy bài đăng" });

    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      req.user._id.toString() !== post.userId.toString()
    ) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền xóa bài đăng này" });
    }

    await post.deleteOne();
    return res.status(200).json({ success: true, message: "Xóa bài đăng thành công", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /post/:id
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("userId", "avatar name");
    if (!post)
      return res.status(404).json({ success: false, message: "Không tìm thấy bài đăng" });

    return res.status(200).json({ success: true, message: "Lấy bài đăng thành công", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /post/event/:eventId
const getPostByIdEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const posts = await Post.find({ eventId }).populate("userId", "avatar name");
    return res.status(200).json({ success: true, message: "Lấy danh sách bài đăng theo eventId", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /post/event/approved/:eventId
const getPostByIdEventApproved = async (req, res) => {
  try {
    const { eventId } = req.params;
    const posts = await Post.find({ eventId, status: "approved" }).populate("userId", "name avatar");
    return res.status(200).json({ success: true, message: "Lấy danh sách bài đăng đã duyệt theo eventId", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getEventApprovedWithPostByIdEventPending = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });

    const eventsWithAllPosts = await Promise.all(
      events.map(async (event) => {
        const posts = await Post.find({
          eventId: event._id,
          status: "pending",
        }).populate("userId", "name avatar");

        return {
          ...event.toObject(),
          posts,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách bài đăng đang chờ duyệt theo eventId thành công",
      events: eventsWithAllPosts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// [GET] /post/user/:userId
const getPostByIdUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    return res.status(200).json({ success: true, message: "Lấy danh sách bài đăng của user", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /post
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name").populate("eventId").populate("userId", "avatar name");
    return res.status(200).json({ success: true, message: "Lấy danh sách tất cả bài đăng", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /post/approved
const getAllPostApproved = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved", approvedAt: { $exists: true } }).populate("userId", "name avatar");
    return res.status(200).json({ success: true, message: "Lấy danh sách tất cả bài đăng đã duyệt", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approvePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData = { status };

    if (status === "approved") updateData.approvedAt = Date.now();
    if (status === "rejected") updateData.rejectedAt = Date.now();

    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài đăng không tồn tại" });
    }

    const message =
      status === "approved"
        ? " Đã duyệt bài đăng"
        : " Đã từ chối bài đăng";

    return res.status(200).json({ success: true, message, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// [POST] /post/filter
const filterPost = async (req, res) => {
  try {
    const { title } = req.body;
    let query = Post.find({ status: "approved", approvedAt: { $exists: true } }).populate("userId", "name avatar");

    if (title === "Top") query = query.sort({ approvedAt: -1 });
    else if (title === "Mới nhất") query = query.sort({ approvedAt: -1 });
    else if (title === "Cũ nhất") query = query.sort({ approvedAt: 1 });

    const posts = await query;
    const postsWithLike = await Promise.all(
      posts.map(async (p) => {
        const countLike = await Like.countDocuments({ postId: p._id });
        return { ...p.toObject(), countLike };
      })
    );

    if (title === "Top") postsWithLike.sort((a, b) => b.countLike - a.countLike);

    return res.status(200).json({ success: true, message: "Sắp xếp thành công", posts: postsWithLike });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getPostByIdEvent,
  getPostByIdEventApproved,
  getPostByIdUser,
  getAllPost,
  approvePost,
  filterPost,
  getAllPostApproved,
  getEventApprovedWithPostByIdEventPending
};
