
export const events = [
  {
    id: 1,
    title: "Chiến dịch trồng 1000 cây xanh",
    description: "Chung tay phủ xanh công viên và khu dân cư.",
    location: "Công viên Thống Nhất, Hà Nội",
    category: "Môi trường & bảo vệ thiên nhiên",
    startDate: "2025-10-15",
    endDate: "2025-10-15",
    banner: "https://placehold.co/600x300",
  },
  {
    id: 2,
    title: "Ngày hội hiến máu nhân đạo",
    description: "Hãy chia sẻ giọt máu đào để cứu người.",
    location: "Viện Huyết học Truyền máu TW, Hà Nội",
    category: "Y tế & chăm sóc sức khỏe",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    banner: "https://placehold.co/600x300",
  },
  {
    id: 3,
    title: "Dạy kèm miễn phí cho trẻ em khó khăn",
    description: "Chương trình hỗ trợ học tập cho học sinh nghèo.",
    location: "Nhà Văn hóa thiếu nhi, TP.HCM",
    category: "Giáo dục & đào tạo",
    startDate: "2025-11-05",
    endDate: "2025-11-30",
    banner: "https://placehold.co/600x300",
  },
  {
    id: 4,
    title: "Thăm hỏi và tặng quà người già neo đơn",
    description: "Chia sẻ yêu thương đến các cụ già tại viện dưỡng lão.",
    location: "Viện dưỡng lão Bình Mỹ, TP.HCM",
    category: "Hoạt động cộng đồng",
    startDate: "2025-12-01",
    endDate: "2025-12-01",
    banner: "https://placehold.co/600x300",
  },
  {
    id: 5,
    title: "Dọn rác bãi biển Vũng Tàu",
    description: "Chung tay bảo vệ môi trường biển trong lành.",
    location: "Bãi Sau, Vũng Tàu",
    category: "Môi trường & bảo vệ thiên nhiên",
    startDate: "2025-12-10",
    endDate: "2025-12-10",
    banner: "https://placehold.co/600x300",
  },
];

export const users = [
  { id: 1, name: "Nguyễn Văn A", email: "vana@example.com" },
  { id: 2, name: "Trần Thị B", email: "thib@example.com" },
  { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
];

export const eventParticipants = [
  {
    id: 1,
    userId: 1,
    eventId: 1,
    status: "pending", // đang chờ duyệt
    registeredAt: "2025-10-01T10:00:00Z",
  },
  {
    id: 2,
    userId: 2,
    eventId: 1,
    status: "joined", // đã tham gia
    registeredAt: "2025-09-28T08:30:00Z",
    approvedAt: "2025-09-29T09:00:00Z",
  },
  {
    id: 3,
    userId: 1,
    eventId: 2,
    status: "rejected", // bị từ chối
    registeredAt: "2025-09-25T14:20:00Z",
  },
  {
    id: 4,
    userId: 3,
    eventId: 3,
    status: "joined",
    registeredAt: "2025-10-02T12:00:00Z",
    approvedAt: "2025-10-03T09:15:00Z",
  },
  {
    id: 5,
    userId: 2,
    eventId: 3,
    status: "completed",
    registeredAt: "2025-10-02T12:00:00Z",
    approvedAt: "2025-10-03T09:15:00Z",
  },
];
