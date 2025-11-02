const Event = require("../models/Event.model");
const UserEvent = require("../models/UserEvent.model");
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      startDate,
      endDate,
    } = req.body;

    const bannerUrl = req.file?.path || ""; 

    const event = await Event.create({
      title,
      description,
      location,
      category,
      startDate,
      endDate,
      banner: bannerUrl,
      createBy: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Tạo sự kiện thành công, vui lòng chờ duyệt",
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sự kiện." });

    return res.status(200).json({
      success: true,
      message: "Xóa sự kiện thành công.",
      eventId: id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sự kiện.",
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("createBy", "name avatar");

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sự kiện." });

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin sự kiện thành công.",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sự kiện.",
    });
  }
};

const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find().populate("createBy", "name avatar");
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện.",
    });
  }
};


const getApprovedEventsUserNotJoined = async (req, res) => {
  try {
    const userId = req.user.id; 

    const joinedEvents = await UserEvent.find({
      userId,
      status: { $ne: "none" },
    }).distinct("eventId");

    const events = await Event.find({
      status: "approved",
      _id: { $nin: joinedEvents }, 
      createBy: { $nin: userId}
    }).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      message: "Danh sách sự kiện user chưa tham gia",
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const getAllEventCreatedBy = async (req, res) => {
  try {
    const id = req.user.id
    const events = await Event.find({createBy: id});
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện của người tạo thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện.",
    });
  }
};

const getAllEventCreatedByAndStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let events = [];

    if (status) {
      events = await Event.find({ createBy: userId, status });
    } else {
      events = await Event.find({ createBy: userId });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện của người tạo thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện.",
      error: error.message,
    });
  }
};


const getAllEventApprovedByUserId = async (req, res) => {
  try {
    const id = req.user.id;
    const events = await Event.find({createBy: id, status: "approved" });
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện đã phê duyệt thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện đã phê duyệt.",
    });
  }
};

const getAllEventRejectedByUserId = async (req, res) => {
  try {
       const id = req.user.id;
    const events = await Event.find({createBy: id, status: "rejected" });
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện đã bị từ chối thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện đã bị từ chối.",
    });
  }
};
const getAllEventCompletedByUserId = async (req, res) => {
  try {
       const id = req.user.id;
    const events = await Event.find({createBy: id, status: "completed" });
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện đã hoàn thành thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện đã hoàn thành.",
    });
  }
};
const getAllEventPendingByUserId = async (req, res) => {
  try {
       const id = req.user.id;
    const events = await Event.find({createBy: id, status: "pending" });
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sự kiện đang chờ thành công.",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện đang chờ.",
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, startDate, endDate, status } = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { title, description, location, startDate, endDate, status },
      { new: true }
    );

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sự kiện." });

    return res.status(200).json({
      success: true,
      message: "Cập nhật sự kiện thành công.",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sự kiện.",
    });
  }
};

const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sự kiện." });

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Phê duyệt sự kiện thành công."
          : "Từ chối sự kiện thành công.",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi phê duyệt sự kiện.",
    });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  getEventById,
  getAllEvent,
  updateEvent,
  approveEvent,
  getAllEventCreatedBy,
  getAllEventApprovedByUserId,
  getAllEventRejectedByUserId, 
  getAllEventCompletedByUserId,
  getAllEventPendingByUserId,
  getApprovedEventsUserNotJoined,
  getAllEventCreatedByAndStatus
};
