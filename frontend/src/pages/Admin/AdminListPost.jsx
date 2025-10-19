import { useEffect, useState } from "react";
import { getAllPost, deletePost, approvePost } from "../../api/post.api";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { convertDate } from "../../utils";

const AdminListPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [isWatchDetail, setIsWatchDetail] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      const res = await getAllPost();
      if (res.data.success) setPosts(res.data.posts);
      else toast.error("Không thể lấy danh sách bài đăng");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Duyệt / từ chối
  const handleApprove = async (id, status) => {
    try {
      const res = await approvePost(id, status);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p))
        );
        toast.success(
          status === "approved"
            ? "✅ Đã duyệt bài viết"
            : "❌ Đã từ chối bài viết"
        );
      } else toast.error("Không thể cập nhật trạng thái bài viết");
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Xóa bài viết
  const handleDelete = async (id) => {
    setConfirmingId(id);
    toast((t) => (
      <div className="text-sm">
        <p className="mb-2">Bạn có chắc muốn xóa bài viết này không?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await deletePost(id);
                if (res.data.success) {
                  setPosts((prev) => prev.filter((p) => p._id !== id));
                  toast.success("Xóa bài viết thành công");
                } else toast.error(res.data.message || "Xóa thất bại");
              } catch {
                toast.error("Lỗi khi xóa bài viết");
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

  const openDetailModal = (post) => {
    setCurrentPost(post);
    setIsWatchDetail(true);
  };

  // Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    let filtered = posts;

    if (filter !== "all") {
      filtered = filtered.filter((e) => e.eventId.status === filter);
    }

    if (keyword) {
      filtered = filtered.filter(
        (e) =>
          e.userId?.name?.toLowerCase().includes(keyword) ||
          e.eventId.title?.toLowerCase().includes(keyword)
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [search, filter, posts]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  console.log(posts);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-6">Danh sách bài đăng</h2>

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
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4">STT</th>
              <th className="py-3 px-4">Người đăng</th>
              <th className="py-3 px-4">Sự kiện</th>
              <th className="py-3 px-4">Ngày tạo</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length > 0 ? (
              currentPosts.map((post, index) => (
                <tr
                  key={post._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    {(currentPage - 1) * postsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-4">
                    {post.userId?.name || "Không rõ"}
                  </td>
                  <td className="py-3 px-4  max-w-[200px] ">
                    {post.eventId?.title || "Không có sự kiện"}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {convertDate(post.createdAt)}
                  </td>

                  <td className="py-3 px-4 text-center capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : post.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openDetailModal(post)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={confirmingId === post._id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition disabled:opacity-50"
                      >
                        {confirmingId === post._id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-5 text-gray-500 italic"
                >
                  Không có bài đăng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
              <div className="grid grid-cols-1 md:grid-cols-[85%_10%] gap-5">
                {/* Thông tin */}
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
                      {currentPost.eventId?.title || "Không có sự kiện"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold">
                      Trạng thái
                    </div>
                    <div className="font-medium text-gray-800 capitalize">
                      {currentPost.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold">
                      Ngày tạo
                    </div>
                    <div className="font-medium text-gray-800">
                      {convertDate(currentPost.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Nút duyệt / từ chối */}
                {/* Nút duyệt / từ chối */}
                {currentPost.status === "pending" && (
                  <div className="flex flex-col items-center justify-center gap-5">
                    <button
                      onClick={() => handleApprove(currentPost._id, "approved")}
                      className="w-[80px] py-2 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 shadow-sm transition duration-300 cursor-pointer"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleApprove(currentPost._id, "rejected")}
                      className="w-[80px] py-2 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition duration-300 cursor-pointer"
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>

              {/* Nội dung */}
              <div className="border-t pt-3">
                <div className="text-gray-700 font-medium mb-2">
                  Nội dung bài viết:
                </div>
                <p className="text-gray-800 whitespace-pre-line">
                  {currentPost.content}
                </p>
              </div>

              {/* Ảnh */}
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
  );
};

export default AdminListPost;
