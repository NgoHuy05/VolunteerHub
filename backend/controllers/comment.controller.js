const Comment = require("../models/Comment.model");

const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, content } = req.body;

    const comment = await Comment.create({
      userId,
      postId,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo bình luận thành công.",
      comment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi tạo bình luận." });
  }
};

const getCommentByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách bình luận thành công.",
      comments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách bình luận." });
  }
};

module.exports = { createComment, getCommentByPostId };
