const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const getProfileUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin người dùng thành công.",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy thông tin người dùng." });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công.",
      users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách người dùng." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }
    return res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công.",
      userId: id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi xóa người dùng." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, location, age, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, location, age, gender },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin người dùng thành công.",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật thông tin người dùng." });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, role, status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công.",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật người dùng." });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu xác nhận không trùng khớp." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không chính xác." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi khi đổi mật khẩu." });
  }
};



module.exports = {
  getProfileUser,
  getAllUser,
  deleteUser,
  updateUser,
  adminUpdateUser,
  changePassword,
};
