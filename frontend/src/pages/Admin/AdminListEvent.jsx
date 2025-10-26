import { useEffect, useState } from "react";
import {
  getAllEvent,
  getEventById,
  approveEvent,
  deleteEvent,
} from "../../api/event.api";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { createApproveEventNotification } from "../../api/notification.api";
import { useLocation } from "react-router-dom";

const AdminListEvent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [loading, setLoading] = useState(true);
 const location = useLocation(); // 🟢 nhận state
  const { isModalOpen: openFromNotify, eventId } = location.state || {};
  const eventsPerPage = 8;
  useEffect(() => {
    if (openFromNotify && eventId) {
      const event = events.find((e) => e._id === eventId);
      if (event) {
        setCurrentEvent(event); 
        setIsModalOpen(true);
      }
    }
  }, [openFromNotify, eventId, events]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    let filtered = events;

    if (filter !== "all") {
      filtered = filtered.filter((e) => e.status === filter);
    }

    if (keyword) {
      filtered = filtered.filter(
        (e) =>
          e.createBy?.name?.toLowerCase().includes(keyword) ||
          e.title?.toLowerCase().includes(keyword)
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [search, filter, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await getAllEvent();
      setEvents(res.data.events || []);
    } catch (error) {
      console.log(error.message);
      toast.error("Lỗi khi tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (id) => {
    try {
      const res = await getEventById(id);
      setCurrentEvent(res.data.event);
      setIsModalOpen(true);
    } catch {
      toast.error("Không thể tải chi tiết sự kiện");
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await approveEvent(id, status);
      await createApproveEventNotification(id);
      toast.success(
        status === "approved"
          ? "Duyệt sự kiện thành công!"
          : "Từ chối sự kiện thành công!"
      );
      fetchEvents();
      setIsModalOpen(false);
    } catch {
      toast.error("Không thể cập nhật trạng thái sự kiện");
    }
  };
  const handleDelete = async (id) => {
    setConfirmingId(id);
    toast((t) => (
      <div className="text-sm">
        <p className="mb-2">Bạn có chắc muốn xóa sự kiện này không?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await deleteEvent(id);
                if (res.data.success) {
                  setEvents((prev) => prev.filter((p) => p._id !== id));
                  setIsModalOpen(false);
                  toast.success("Xóa sự kiện thành công");
                } else toast.error(res.data.message || "Xóa thất bại");
              } catch {
                toast.error("Lỗi khi xóa sự kiện");
              }
              setConfirmingId(null);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Xóa
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setConfirmingId(null);
            }}
            className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Danh sách sự kiện</h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input
          type="text"
          placeholder="Tìm theo tên sự kiện hoặc tên người đăng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[350px] border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">Tất cả</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Đang chờ</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>
      {currentEvents.length === 0 ? (
        <div className="text-center text-gray-500">Không có sự kiện nào</div>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Tên sự kiện</th>
              <th className="border p-2">Người tạo</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event, index) => (
              <tr key={event._id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">
                  {indexOfFirst + index + 1}
                </td>
                <td className="border p-2">{event.title}</td>
                <td className="border p-2">
                  {event.createBy?.name || "Ẩn danh"}
                </td>
                <td className="border p-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : event.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : event.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>

                <td className="border p-2 text-center">
                  <button
                    onClick={() => openModal(event._id)}
                    className="w-[110px] py-2 text-sm font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-xl transition duration-300 cursor-pointer"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center mt-5 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            »
          </button>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {isModalOpen && currentEvent && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-gray-50 sticky top-0">
              <h3 className="text-lg font-semibold text-gray-800">
                Chi tiết sự kiện
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-3xl hover:text-gray-500 font-bold cursor-pointer"
              >
                <IoClose />
              </button>
            </div>

            {/* Nội dung */}
            <div className="p-5 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-[75%_25%] gap-5">
              {/* Cột trái */}
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-sm uppercase font-semibold">
                    Tên sự kiện
                  </div>
                  <div className="font-medium text-gray-800">
                    {currentEvent.title}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm uppercase font-semibold">
                    Người tạo
                  </div>
                  <div className="font-medium text-gray-800">
                    {currentEvent.createBy?.name || "Ẩn danh"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm uppercase font-semibold">
                    Mô tả
                  </div>
                  <div className="text-gray-800 whitespace-pre-line">
                    {currentEvent.description || "Không có mô tả"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm uppercase font-semibold">
                    Địa điểm
                  </div>
                  <div className="text-gray-800">{currentEvent.location}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold">
                      Ngày bắt đầu
                    </div>
                    <div className="text-gray-800">
                      {new Date(currentEvent.startDate).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  {currentEvent.endDate && (
                    <div>
                      <div className="text-gray-500 text-sm uppercase font-semibold">
                        Ngày kết thúc
                      </div>
                      <div className="text-gray-800">
                        {new Date(currentEvent.endDate).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-gray-500 text-sm uppercase font-semibold">
                    Danh mục
                  </div>
                  <div className="text-gray-800">{currentEvent.category}</div>
                </div>

                {currentEvent.banner && (
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold mb-2">
                      Ảnh bìa
                    </div>
                    <img
                      src={currentEvent.banner}
                      alt="banner"
                      className="rounded-lg shadow-sm max-h-60 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Cột phải */}
              <div className="flex flex-col items-center justify-center gap-3">
                {currentEvent.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleApprove(currentEvent._id, "approved")
                      }
                      className="w-[100px] py-2 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 shadow-sm transition"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() =>
                        handleApprove(currentEvent._id, "rejected")
                      }
                      className="w-[100px] py-2 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(currentEvent._id)}
                  className="w-[100px] py-2 rounded-xl font-semibold text-white bg-gray-500 hover:bg-gray-600 shadow-sm transition"
                >
                  {confirmingId === currentEvent._id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListEvent;
