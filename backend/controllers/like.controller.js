const Like = require("../models/Like.model");

const LikeUnLike = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { postId } = req.body;
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu postId"
            });
        }
        const existing = await Like.findOne({ userId, postId });
        if (existing) {
            const like = await Like.findOneAndDelete({ userId, postId });
            return res.status(201).json({
                success: true,
                message: "Bỏ thích thành công",
                liked: false,
                like
            });
        } else {
            const like = await Like.create({ userId, postId });
            return res.status(201).json({
                success: true,
                message: "Thích thành công",
                                liked: true,
                like
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const countLike = async (req, res) => {
    try {
        const { postId } = req.body;
        const like = await Like.find({ postId });
        if (!like) {
            res.status(404).json({ success: false, message: "Khong tim thay bai dang" });
        }
        const likeCount = like.length;
        return res.status(200).json({ success: true, message: "lay so luong like bai viet thanh cong", likeCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const likes = await Like.find({ userId }).select("postId");
    const likedPostIds = likes.map((l) => l.postId.toString());
    return res.status(200).json({
      success: true,
      likedPostIds,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { LikeUnLike, countLike, getLikedPosts };
