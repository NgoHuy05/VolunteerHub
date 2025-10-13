const UserEvent = require("../models/UserEvent.model");
const Event = require("../models/Event.model");
const createUserEvent = async (req, res) => {
  try {
    const { userId, eventId, role, status } = req.body;

    // 🔒 Kiểm tra user đã đăng ký sự kiện này chưa
    const existing = await UserEvent.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký sự kiện này rồi!",
      });
    }

    // ✅ Tạo mới
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


const getPendingUsersWithApprovedEvents = async (req, res) => {
  try {
    const pendingUserEvents = await UserEvent.find({ status: "pending" })
      .populate({
        path: "eventId",
        match: { status: "approved" }, 
        select: "title category startDate endDate location status createBy", 
      })
      .populate("userId", "-password");

    const filtered = pendingUserEvents.filter(
      (ue) => ue.eventId !== null
    );

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng đang chờ duyệt với sự kiện đã được phê duyệt thành công.",
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

    // 1️⃣ Lấy các sự kiện mà user tham gia
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

    if (status) {

      if (status === "joining") {
        const eventsUserJoined = await UserEvent.find({ userId, status: "joining" })
          .populate("eventId")
          .populate("userId", "-password");

        const eventsUserCreated = await Event.find({ createBy: userId, status: "approved" });

        events = [
          ...eventsUserJoined.map(item => item.eventId), 
          ...eventsUserCreated,
        ];
      } else {
 
        events = await UserEvent.find({ userId, status })
          .populate("eventId")
          .populate("userId", "-password");
      }
    } else {
      events = await UserEvent.find({ userId })
        .populate("eventId")
        .populate("userId", "-password");
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
    const { id } = req.params; // id của document trong UserEvent
    const { status } = req.body; // joining | rejected

    if (!["joining", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ!",
      });
    }

    const updateData = { status };
    if (status === "joining") updateData.approvedAt = new Date();
    if (status === "rejected") updateData.rejectedAt = new Date();

    // Cập nhật trạng thái trong UserEvent
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
  getEventByUserIdAndStatus,
  countAllUserByEventId,
  countPendingUserByEventId,
  countJoiningUserByEventId,
  getEventByUserId,
  getPendingUsersWithApprovedEvents,
  approveUserJoinEvent
};
