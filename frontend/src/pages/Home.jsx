import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { createComment } from "../api/comment.api";
import { LikeUnLike } from "../api/like.api";
import { getPostTimeAgo } from "../utils";
import toast from "react-hot-toast";
import {
  createCommentNotification,
  createLikeNotification,
} from "../api/notification.api";

const Home = () => {
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const { posts, setPosts, user, loading } = useOutletContext();
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // Mở modal bình luận
  const handleOpenModal = (post) => {
    setCurrentPost(post);
    setOpenCommentModal(true);
  };

  // Like / Unlike bài viết
  const handleLikePost = async (postId) => {
    try {
      const res = await LikeUnLike(postId);
      if (res.data.liked) {
        createLikeNotification(postId); // chạy song song
      }
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, liked: res.data.liked, likeCount: res.data.likeCount }
            : p
        )
      );
    } catch (error) {
      console.error("Lỗi khi like:", error.response?.data?.message || error.message);
    }
  };

  // Gửi bình luận
  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      const res = await createComment({ content, postId });
      toast.success(res?.data?.message || "Bình luận thành công");

      await createCommentNotification(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: [...p.comments, { content, userId: user, _id: Date.now() }],
              }
            : p
        )
      );

      setCurrentPost((prev) => ({
        ...prev,
        comments: [...prev.comments, { content, userId: user, _id: Date.now() }],
      }));

      setContent("");
    } catch (error) {
      console.error("❌ Lỗi khi bình luận:", error);
      toast.error(error.response?.data?.message || error.message || "Lỗi khi bình luận");
    }
  };

  // Ẩn cuộn khi mở modal
  useEffect(() => {
    document.body.style.overflow = openCommentModal ? "hidden" : "auto";
  }, [openCommentModal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-gray-100 min-h-screen flex flex-col gap-6">
      {posts.length === 0 ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col bg-white rounded-xl border border-gray-300 shadow-md shadow-gray-200"
          >
            {/* Header */}
            <div className="p-4 flex gap-3 items-center border-b border-gray-200">
              <img
                src={post?.event?.banner || "/default-banner.png"}
                alt="banner"
                className="size-15 rounded-xl object-cover"
              />
              <div className="flex flex-col">
                <div
                  onClick={() => navigate(`/event/detail/${post.event._id}`)}
                  className="font-bold text-[25px] cursor-pointer hover:text-gray-600 transition duration-300"
                >
                  {post.event?.title || "Chưa có nhóm"}
                </div>
                <div className="flex gap-2 items-center text-[13px] text-gray-600 mt-1">
                  {post.userId?.avatar ? (
                    <img
                      src={post.userId.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="p-1 text-3xl rounded-full">
                      <CgProfile />
                    </div>
                  )}
                  <span>{post.userId?.name || "Người dùng"}</span>
                  <span>{getPostTimeAgo(post)}</span>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-4 flex flex-col gap-2">
              <div className="text-[15px]">{post.content}</div>
              {post.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {post.images.map((img, idx) => (
                    <img
                      key={`${post._id}--${idx}`}
                      src={img}
                      alt={`post-img-${idx}`}
                      className="w-full h-[250px] object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Like count */}
            <div className="flex items-center gap-2 p-4 border-t border-b border-gray-200 text-gray-600">
              <BiSolidLike className="text-blue-500" />
              <span>{post.likeCount || 0} lượt thích</span>
            </div>

            {/* Nút Like & Comment */}
            <div className="flex border-t">
              <button
                onClick={() => handleLikePost(post._id)}
                className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
              >
                {post.liked ? <BiSolidLike className="text-blue-500" /> : <BiLike />}
                <span>{post.liked ? "Đã thích" : "Thích"}</span>
              </button>

              <button
                onClick={() => handleOpenModal(post)}
                className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
              >
                <FaRegComment />
                <span>Bình luận</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal bình luận */}
      {openCommentModal && currentPost && (
        <div className="fixed inset-0 backdrop-blur-[1px] bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-lg flex flex-col relative">
            {/* Header modal */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="text-xl font-semibold">
                Bài viết của {currentPost.userId?.name || "Người dùng"}
              </div>
              <button
                onClick={() => setOpenCommentModal(false)}
                className="text-3xl hover:text-gray-500 font-bold cursor-pointer"
              >
                <IoClose />
              </button>
            </div>

            {/* Nội dung modal */}
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
              {/* Header post */}
              <div className="flex gap-3 items-center border-b border-gray-200">
                <img
                  src={currentPost?.event?.banner || "/default-banner.png"}
                  alt="banner"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <div className="font-bold cursor-pointer hover:text-gray-600 transition duration-300">
                    {currentPost.event?.title || "Chưa có nhóm"}
                  </div>
                  <div className="flex gap-2 items-center text-[13px] text-gray-600 mt-1">
                    {currentPost.userId?.avatar ? (
                      <img
                        src={currentPost.userId.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="p-1 text-3xl rounded-full">
                        <CgProfile />
                      </div>
                    )}
                    <span>{currentPost.userId?.name || "Người dùng"}</span>
                  </div>
                </div>
              </div>

              {/* Nội dung text */}
              <div className="text-[15px] mt-2">{currentPost.content}</div>

              {/* Hình ảnh */}
              {currentPost.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {currentPost.images.map((img, idx) => (
                    <img
                      key={`${currentPost._id}--${idx}`}
                      src={img}
                      alt={`post-img-${idx}`}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}

              {/* Danh sách comment */}
              <div className="space-y-2 mt-4">
                {(currentPost.comments || []).map((c, idx) => (
                  <div
                    key={`${c._id || "temp"}-${c.userId?._id || "user"}-${idx}`}
                    className="flex items-start gap-2"
                  >
                    {c.userId?.avatar ? (
                      <img
                        src={c.userId.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="p-1 text-3xl rounded-full">
                        <CgProfile />
                      </div>
                    )}
                    <div className="bg-gray-100 p-2 rounded-xl flex flex-col gap-1 flex-1">
                      <span className="font-semibold text-sm">
                        {c.userId?.name || "Người dùng"}
                      </span>
                      <div>{c.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input comment */}
            <form
              className="flex gap-2 p-4 border-t border-gray-200"
              onSubmit={(e) => handleSubmitComment(e, currentPost._id)}
            >
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết bình luận..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-500 cursor-pointer">
                Gửi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
