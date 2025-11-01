const Post = require("../models/Post.model");
const Like = require("../models/Like.model");
const Comment = require("../models/Comment.model");
const Event = require("../models/Event.model");
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
const getAllPostFull = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sort } = req.query; // 🟢 nhận loại sort từ client: "Tất cả" | "Mới nhất" | "Cũ nhất" | "Top"

    // 1️⃣ Lấy bài viết theo điều kiện sort
    let sortOption = { approvedAt: -1 }; // mặc định: mới nhất

    if (sort === "Cũ nhất") sortOption = { approvedAt: 1 };
    else if (sort === "Top") sortOption = { likeCount: -1 }; // tạm thời sort theo số like
    else if (sort === "Tất cả" || !sort) sortOption = { approvedAt: -1 };

    // 2️⃣ Query bài viết
    const posts = await Post.find({ status: "approved" })
      .populate("userId", "name avatar")
      .sort(sortOption)
      .lean();

    if (!posts.length)
      return res.status(200).json({ success: true, posts: [] });

    // 3️⃣ Gom id
    const postIds = posts.map((p) => p._id);
    const eventIds = posts.map((p) => p.eventId).filter(Boolean);

    // 4️⃣ Chạy song song
    const [likes, comments, events, likedDocs] = await Promise.all([
      Like.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      Comment.find({ postId: { $in: postIds } })
        .populate("userId", "name avatar")
        .lean(),
      Event.find({ _id: { $in: eventIds } }).lean(),
      Like.find({ userId }).select("postId").lean(),
    ]);

    // 5️⃣ Map nhanh
    const likeCountMap = new Map(likes.map((l) => [l._id.toString(), l.count]));
    const commentMap = new Map();
    comments.forEach((c) => {
      const pid = c.postId.toString();
      if (!commentMap.has(pid)) commentMap.set(pid, []);
      commentMap.get(pid).push(c);
    });
    const eventMap = new Map(events.map((e) => [e._id.toString(), e]));
    const likedIds = new Set(likedDocs.map((l) => l.postId.toString()));

    // 6️⃣ Merge
    const fullPosts = posts.map((p) => ({
      ...p,
      likeCount: likeCountMap.get(p._id.toString()) || 0,
      liked: likedIds.has(p._id.toString()),
      comments: commentMap.get(p._id.toString()) || [],
      event: eventMap.get(p.eventId?.toString()) || null,
    }));

    // 7️⃣ Nếu sort === "Top", sort lại theo likeCount
    if (sort === "Top") {
      fullPosts.sort((a, b) => b.likeCount - a.likeCount);
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài đăng đầy đủ thành công",
      posts: fullPosts,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy toàn bộ bài đăng đầy đủ:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi server khi lấy danh sách bài đăng",
    });
  }
};


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

const getPostByIdEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const posts = await Post.find({ eventId }).populate("userId", "avatar name");
    return res.status(200).json({ success: true, message: "Lấy danh sách bài đăng theo eventId", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

const getPostByIdUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    return res.status(200).json({ success: true, message: "Lấy danh sách bài đăng của user", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name").populate("eventId").populate("userId", "avatar name");
    return res.status(200).json({ success: true, message: "Lấy danh sách tất cả bài đăng", posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
  getAllPostFull, 
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
