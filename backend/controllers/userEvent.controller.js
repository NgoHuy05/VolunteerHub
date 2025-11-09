const UserEvent = require("../models/UserEvent.model");
const Event = require("../models/Event.model");

const createUserEvent = async (req, res) => {
  try {
    const { userId, eventId, role, status } = req.body;

    const existing = await UserEvent.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký sự kiện này rồi!",
      });
    }

    const userEvent = await UserEvent.create({
      userId,
      eventId,
      role,
      startDay: Date.now(),
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký tham gia sự kiện thành công!",
      userEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUserEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId hoặc eventId!",
      });
    }

    const userEvent = await UserEvent.findOneAndDelete({ userId, eventId });

    if (!userEvent) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đăng ký sự kiện để hủy!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hủy đăng ký tham gia sự kiện thành công!",
      userEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi hủy đăng ký!",
    });
  }
};

const getUserEvent = async (req, res) => {
  try {
    const userId = req.user.id; 

    const userEvents = await UserEvent.find({ userId: userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Lấy thành công danh sách sự kiện của user",
      userEvents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  const getAllUsersByEventId = async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event không tồn tại" });
      }

      // Chỉ chủ sự kiện, admin hoặc manager mới xem được
      if (
        event.createBy.toString() !== userId &&
        req.user.role !== "admin" &&
        req.user.role !== "manager"
      ) {
        return res.status(403).json({ success: false, message: "Bạn không có quyền xem danh sách người tham gia" });
      }

      const users = await UserEvent.find({ eventId }).populate("userId", "name avatar");

      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };


const getPendingUsersWithApprovedEvents = async (req, res) => {
  try {
    const pendingUserEvents = await UserEvent.find({ status: "pending" })
      .populate({
        path: "eventId",
        match: { status: "approved", createBy: req.user.id }, // Chỉ lấy sự kiện do người hiện tại tạo
        select: "title category startDate endDate location status createBy",
      })
      .populate("userId", "-password");

    const filtered = pendingUserEvents.filter((ue) => ue.eventId !== null);

    return res.status(200).json({
      success: true,
      message:
        "Lấy danh sách người dùng đang chờ duyệt với sự kiện do bạn tạo thành công.",
      data: filtered,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách người dùng đang chờ duyệt.",
      error: error.message,
    });
  }
};


const getEventByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const joinedEvents = await UserEvent.find({ userId })
      .populate("eventId")
      .populate("userId", "-password");

    const createdEvents = await Event.find({ createBy: userId });

    const allEvents = [
      ...joinedEvents.map(e => e.eventId),
      ...createdEvents
    ];

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện người dùng liên quan thành công",
      events: allEvents,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEventByUserIdAndStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    let events = [];

    const now = new Date();

    if (status === "joining") {
      // Lấy các UserEvent status = joining
      let joinedList = await UserEvent.find({ userId, status: "joining" })
        .populate("eventId")
        .populate("userId", "-password");

      // Cập nhật status nếu event đã kết thúc
      for (const record of joinedList) {
        if (
          record.eventId &&
          record.eventId.endDate &&
          new Date(record.eventId.endDate) < now &&
          record.status !== "completed"
        ) {
          record.status = "completed";
          await record.save();
        }
      }

      // Lấy lại danh sách sau khi update
      joinedList = await UserEvent.find({ userId, status: "joining" })
        .populate("eventId")
        .populate("userId", "-password");

      // Lọc null và map ra eventId
      events = joinedList.filter((item) => item.eventId).map((item) => item.eventId);
    } else if (status) {
      // Nếu status khác "joining"
      const list = await UserEvent.find({ userId, status })
        .populate("eventId")
        .populate("userId", "-password");
      events = list.filter((item) => item.eventId).map((item) => item.eventId);
    } else {
      // Nếu không có status, lấy tất cả
      const list = await UserEvent.find({ userId })
        .populate("eventId")
        .populate("userId", "-password");
      events = list.filter((item) => item.eventId).map((item) => item.eventId);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện người dùng thành công",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const countAllUserByEventId = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserEvent.find({ eventId: id });
    return res.status(200).json({
      success: true,
      message: "Lấy tổng số người tham gia sự kiện thành công",
      numOfAllUser: users.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const countPendingUserByEventId = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserEvent.find({ eventId: id, status: "pending" });
    return res.status(200).json({
      success: true,
      message: "Lấy số lượng người dùng chờ duyệt thành công",
      numOfPendingUser: users.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const countJoiningUserByEventId = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserEvent.find({ eventId: id, status: "joining" });
    return res.status(200).json({
      success: true,
      message: "Lấy số lượng người đang tham gia sự kiện thành công",
      numOfJoiningUser: users.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approveUserJoinEvent = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

    if (!["joining", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ!",
      });
    }

    const updateData = { status };
    if (status === "joining") updateData.approvedAt = new Date();
    if (status === "rejected") updateData.rejectedAt = new Date();

    const userEvent = await UserEvent.findByIdAndUpdate(id, updateData, { new: true })
      .populate("userId", "-password")
      .populate("eventId");

    if (!userEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu tham gia sự kiện" });
    }

    const message =
      status === "joining"
        ? "Đã duyệt người dùng tham gia sự kiện"
        : "Đã từ chối yêu cầu tham gia sự kiện";

    return res.status(200).json({ success: true, message, userEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUserEvent,
  deleteUserEvent,
  getEventByUserIdAndStatus,
  getAllUsersByEventId,
  countAllUserByEventId,
  countPendingUserByEventId,
  countJoiningUserByEventId,
  getEventByUserId,
  getPendingUsersWithApprovedEvents,
  approveUserJoinEvent,
  getUserEvent
};
