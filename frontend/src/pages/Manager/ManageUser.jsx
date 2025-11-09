import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertDate } from "../../utils";
import { IoClose } from "react-icons/io5";
import {
  approveUserJoinEvent,
  getPendingUsersWithApprovedEvents,
} from "../../api/userEvent.api";
import { createApproveUserNotification } from "../../api/notification.api";

const ManageUser = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isWatchDetail, setIsWatchDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await getPendingUsersWithApprovedEvents();
      setUserEvents(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item) => {    
    setCurrent(item);
    setIsWatchDetail(true);
  };
  const handleApprovedUser = async (item, status) => {
    try {
      const res = await approveUserJoinEvent(item._id, status);

      if (status === "joining") {
        await createApproveUserNotification({
          eventId: item.eventId._id,
          userId: item.userId._id,
        });
        toast.success(res.data.message || "Đã duyệt người dùng");
      } else {
        toast.success(res.data.message || "Đã từ chối người dùng");
      }

      setIsWatchDetail(false);
      await fetchPendingUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi duyệt người dùng");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isWatchDetail ? "hidden" : "auto";
  }, [isWatchDetail]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {userEvents.length === 0 ? (
        <>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Danh sách người dùng đang chờ duyệt
          </h2>
        <div className="text-center text-gray-600 text-lg font-medium mt-10">
          Tất cả người dùng đã được duyệt
        </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Danh sách người dùng đang chờ duyệt
          </h2>

          <div className="space-y-5">
            {userEvents.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-200 p-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-[18%_38%_22%_17%] gap-2 items-center">
                  {/* Người đăng ký */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
                      Người đăng ký
                    </div>
                    <div className="font-medium text-gray-800">
                      {item.userId?.name || "Ẩn danh"}
                    </div>
                  </div>

                  {/* Sự kiện */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
                      Sự kiện
                    </div>
                    <div className="font-medium text-gray-800">
                      {item.eventId?.title || "Không có sự kiện"}
                    </div>
                  </div>

                  {/* Thời gian đăng ký */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
                      Thời gian đăng ký
                    </div>
                    <div className="font-medium text-gray-800">
                      {convertDate(item.createdAt)}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex flex-col gap-3 items-center justify-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="w-[110px] py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition duration-300 cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleApprovedUser(item, "joining")}
                      className="w-[110px] py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition duration-300 cursor-pointer"
                    >
                      Duyệt
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Modal xem chi tiết */}
            {isWatchDetail && current && (
              <div className="fixed inset-0 backdrop-blur-[2px] bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white w-full max-w-3xl h-[50%] rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                    <div className="text-lg font-semibold text-gray-800">
                      🧾 Chi tiết đăng ký sự kiện
                    </div>
                    <button
                      onClick={() => setIsWatchDetail(false)}
                      className="text-3xl hover:text-gray-500 font-bold cursor-pointer"
                    >
                      <IoClose />
                    </button>
                  </div>

                  {/* Nội dung */}
                  <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-500 text-sm uppercase font-semibold">
                          Người đăng ký
                        </div>
                        <div className="font-medium text-gray-800">
                          {current.userId?.name}
                        </div>
                        <div className="font-medium text-gray-800">
                          {`${current.userId?.age} tuổi`}
                        </div>
                        <div className="font-medium text-gray-800">
                          {`Địa chỉ: ${current.userId?.location}`}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 text-sm uppercase font-semibold">
                          Sự kiện
                        </div>
                        <div className="font-medium text-gray-800">
                          {current.eventId?.title}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 text-sm uppercase font-semibold">
                          Thời gian đăng ký
                        </div>
                        <div className="font-medium text-gray-800">
                          {convertDate(current.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-center gap-5 mt-5">
                      <button
                        onClick={() => handleApprovedUser(current, "joining")}
                        className="w-[100px] py-2 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 shadow-sm transition duration-300 cursor-pointer"
                      >
                        Duyệt
                      </button>

                      <button
                        onClick={() => handleApprovedUser(current, "rejected")}
                        className="w-[100px] py-2 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition duration-300 cursor-pointer"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUser;
