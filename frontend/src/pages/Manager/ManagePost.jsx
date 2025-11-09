import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  approvePost,
  getEventApprovedWithPostByIdEventPending,
} from "../../api/post.api";
import { convertDate } from "../../utils";
import { IoClose } from "react-icons/io5";
import { createApprovePostNotification } from "../../api/notification.api";

const ManagePost = () => {
  const [events, setEvents] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isWatchDetail, setIsWatchDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await getEventApprovedWithPostByIdEventPending();
      setEvents(res.data.events);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (post, event) => {
    setCurrentPost({ ...post, event });
    setIsWatchDetail(true);
  };

  const handleApprovedPost = async (postId, status) => {
    try {
      const res = await approvePost(postId, status);
      if (status === "approved") {
        toast.success(res.data.message || "Đã duyệt bài viết");
        await createApprovePostNotification(postId);
      } else {
        toast.success(res.data.message || "Đã từ chối bài viết");
      }
      setIsWatchDetail(false);

      await fetchPost();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi duyệt bài viết");
    }
  };

  useEffect(() => {
    if (isWatchDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
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
      {events.length === 0 ? (
        <div className="text-center text-gray-600 text-lg font-medium mt-10">
          ✅ Tất cả bài viết đã được duyệt
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            📝 Danh sách bài viết đang chờ duyệt
          </h2>

          <div className="space-y-5">
            {events.filter(ev => ev).map((event) =>
              event?.posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-200 p-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[18%_38%_22%_17%] gap-2 items-center">
                    {/* Người đăng */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
                        Người đăng
                      </div>
                      <div className="font-medium text-gray-800">
                        {post.userId.name}
                      </div>
                    </div>

                    {/* Sự kiện */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
                        Sự kiện
                      </div>
                      <div className="font-medium text-gray-800">
                        {event?.title}
                      </div>
                    </div>

                    {/* Thời gian */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-sm uppercase text-gray-500 font-semibold mb-1">
                        Thời gian đăng bài viết
                      </div>
                      <div className="font-medium text-gray-800">
                        {convertDate(post.createdAt)}
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex flex-col gap-3 items-center justify-center">
                      <button
                        onClick={() => handleOpenModal(post, event)}
                        className="w-[110px] py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition duration-300 cursor-pointer"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleApprovedPost(post._id, "approved")}
                        className="w-[110px] py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition duration-300 cursor-pointer"
                      >
                        Duyệt
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Modal xem chi tiết */}
            {isWatchDetail && currentPost && (
              <div className="fixed inset-0 backdrop-blur-[2px] bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                    <div className="text-lg font-semibold text-gray-800">
                      🧾 Chi tiết bài đăng
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
                    {/* Thông tin cơ bản + nút duyệt */}
                    <div className="grid grid-cols-1 md:grid-cols-[85%_10%] gap-5">
                      {/* Cột thông tin */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-gray-500 text-sm uppercase font-semibold">
                            Người đăng
                          </div>
                          <div className="font-medium text-gray-800">
                            {currentPost.userId?.name}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-500 text-sm uppercase font-semibold">
                            Sự kiện
                          </div>
                          <div className="font-medium text-gray-800">
                            {currentPost.event?.title || "Không có sự kiện"}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-500 text-sm uppercase font-semibold">
                            Thời gian đăng
                          </div>
                          <div className="font-medium text-gray-800">
                            {convertDate(currentPost.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Cột nút duyệt / từ chối */}
                      <div className="flex flex-col items-center justify-center gap-5">
                        <button
                          onClick={() =>
                            handleApprovedPost(currentPost._id, "approved")
                          }
                          className="w-[80px] py-2 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 shadow-sm transition duration-300 cursor-pointer"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() =>
                            handleApprovedPost(currentPost._id, "rejected")
                          }
                          className="w-[80px] py-2 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition duration-300 cursor-pointer"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>

                    {/* Nội dung bài viết */}
                    <div className="border-t pt-3">
                      <div className="text-gray-700 font-medium mb-2">
                        Nội dung bài viết:
                      </div>
                      <p className="text-gray-800 whitespace-pre-line">
                        {currentPost.content}
                      </p>
                    </div>

                    {/* Hình ảnh */}
                    {currentPost.images?.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {currentPost.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`post-img-${idx}`}
                            className="w-full h-auto object-cover rounded-xl shadow-sm"
                          />
                        ))}
                      </div>
                    )}
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

export default ManagePost;
