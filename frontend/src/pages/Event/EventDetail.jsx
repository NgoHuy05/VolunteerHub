import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaArrowRightLong, FaS } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { countLike, getLikedPosts, LikeUnLike } from "../../api/like.api";
import { createComment, getCommentByPostId } from "../../api/comment.api";
import { getProfileUser } from "../../api/user.api";
import { createPost, getPostByIdEventApproved } from "../../api/post.api";
import { getEventById } from "../../api/event.api";
import { FaPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDescription } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import {
  countAllUserByEventId,
  countJoiningUserByEventId,
  countPendingUserByEventId,
  createUserEvent,
  getUserEvent,
} from "../../api/userEvent.api";
import { convertDate, getPostTimeAgo } from "../../utils";
import { createLikeNotification, createPostNotification, createUserRegisterNotification } from "../../api/notification.api";

const EvenDetail = () => {
  const [isSelectIntrodution, setIsSelectIntrodution] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [content, setContent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState({});
  const [userEvents, setUserEvents] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const eventId = useParams();
  const location = useLocation(); // 🟢 nhận state
  const { openCommentModal: openFromNotify, postId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [bannerPreview, setBannerPreview] = useState([]); // mảng url preview
  const [form, setForm] = useState({
    content: "",
    images: [], // mảng File
  });
  const [openCreateModel, setOpenCreateModel] = useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const [resEvent, cntAllUser, cntAllPendingUser, cntAllJoiningUser] =
          await Promise.all([
            getEventById(eventId.id),
            countAllUserByEventId(eventId.id),
            countPendingUserByEventId(eventId.id),
            countJoiningUserByEventId(eventId.id),
          ]);

        setEvent({
          ...resEvent.data.event,
          numOfUser: cntAllUser.data.numOfAllUser,
          numOfPendingUser: cntAllPendingUser.data.numOfPendingUser,
          numOfJoiningUser: cntAllJoiningUser.data.numOfJoiningUser,
        });
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (openFromNotify && postId) {
      const post = posts.find((p) => p._id === postId);
      if (post) {
        setCurrentPost(post); // ✅ bây giờ currentPost là object hợp lệ
        setOpenCommentModal(true);
      }
    }
  }, [openFromNotify, postId, posts]);

  const handleOpenCreatePost = () => {
    if (!isJoined) {
      toast.error("⚠️ Vui lòng tham gia sự kiện trước khi tạo bài viết!");
      return;
    }
    setOpenCreateModel(true);
    setForm({
      content: "",
      images: [], // mảng File
    });
    setBannerPreview([]);
  };


  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await getUserEvent();
        setUserEvents(res.data.userEvents);
      } catch (error) {
        console.error(error?.message || "");
      } finally {
        setLoading(false);
      }
    };
    fetchUserEvents();
  }, []);
  // state

  // handle file change: append (không ghi đè) và tạo preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // append files (để người dùng có thể chọn nhiều lần)
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));

    // tạo preview cho các file mới rồi ghép vào preview hiện tại
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setBannerPreview((prev) => [...prev, ...newPreviews]);

    // reset input để người dùng có thể chọn lại cùng file (optional but useful)
    e.target.value = null;
  };

  // dọn object URLs khi component unmount hoặc khi previews thay đổi
  useEffect(() => {
    return () => {
      // cleanup khi component unmount
      bannerPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    return () => {
      bannerPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bannerPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.content) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("eventId", eventId.id);
      formData.append("content", form.content);

      if (form.images && form.images.length > 0) {
        for (const img of form.images) {
          formData.append("images", img);
        }
      }

      const res = await createPost(formData);
      toast.success("🎉 Tạo bài đăng thành công, vui lòng chờ admin duyệt!");

      await createPostNotification(res.data.post._id);
      setOpenCreateModel(false);
      setBannerPreview([]); // ✅ phải là mảng trống, KHÔNG dùng null
      setForm({
        content: "",
        images: [],
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const resUser = await getProfileUser();
        setUser(resUser.data.user);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resPost = await getPostByIdEventApproved(eventId.id);
        const postsData = resPost.data?.posts;
        const resLiked = await getLikedPosts();
        const likedPostIds = resLiked.data.likedPostIds;
        const postsWithDetails = await Promise.all(
          postsData.map(async (p) => {
            try {
              const resCountLike = await countLike(p._id);
              const resCmt = await getCommentByPostId(p._id);
              const resEvent = await getEventById(p.eventId);

              return {
                ...p,
                event: resEvent.data.event,
                comments: resCmt.data.comments,
                likeCount: resCountLike.data.likeCount,
                liked: likedPostIds.includes(p._id),
              };
            } catch {
              return { ...p, event: null, comments: [], likeCount: 0 };
            }
          })
        );

        setPosts(postsWithDetails);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      }
    };

    fetchData();
  }, [eventId]);

  // 🔹 Mở modal bình luận
  const handleOpenModal = (post) => {
    setCurrentPost(post);
    setOpenCommentModal(true);
  };

  const handleLikePost = async (postId) => {
    try {
      // 1️⃣ Like hoặc Unlike bài viết
      const resLike = await LikeUnLike(postId);

      // 2️⃣ Nếu là "Like" → tạo thông báo
      if (resLike.data.liked) {
        await createLikeNotification(postId);
      }

      // 3️⃣ Cập nhật lại số lượt like trong state
      const resCount = await countLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likeCount: resCount.data.likeCount,
                liked: resLike.data.liked,
              }
            : p
        )
      );
    } catch (error) {
      console.error(
        "❌ Lỗi khi like hoặc tạo thông báo:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (!userEvents || !event || !user?._id) return;

    const joined =
      event?.createBy?._id === user._id ||
      userEvents.some(
        (u) =>
          u.eventId?._id?.toString() === event._id && u.status === "joining"
      );

    const pending = userEvents.some(
      (u) => u.eventId?._id?.toString() === event._id && u.status === "pending"
    );

    setIsJoined(joined);
    setIsPending(pending);
  }, [userEvents, event, user]);

  const handleRegisterJoinEvent = async (eventId) => {
    try {
      if (!user) return toast.error("Bạn cần đăng nhập trước khi tham gia!");

      const data = {
        userId: user._id,
        eventId,
        role: "user",
        status: "pending",
        startDay: new Date(),
      };

      const res = await createUserEvent(data);
      toast.success(res.data.message || "Đăng ký tham gia thành công!");
      await createUserRegisterNotification(eventId)
      // Cập nhật lại danh sách userEvents
      const resUserEvent = await getUserEvent();
      setUserEvents(resUserEvent.data.userEvents);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi đăng ký sự kiện");
    }
  };

  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    if (!content) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const res = await createComment({ content, postId });
      toast.success(res?.message || "Tạo bình luận thành công");

      // Update posts state để hiển thị comment mới
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: [...p.comments, { content: content, userId: user }],
              }
            : p
        )
      );

      setCurrentPost((prev) => ({
        ...prev,
        comments: [...prev.comments, { content: content, userId: user }],
      }));
      setContent("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Đăng nhập thất bại"
      );
    }
  };

  // 🔹 Ẩn cuộn khi mở modal
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
    <>
      {event && (
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col gap-5">
            <div className="flex gap-5 items-center text-xl text-red-600">
              <div>{convertDate(event.startDate)}</div>
              <div>
                <FaArrowRightLong />
              </div>
              <div>{convertDate(event.endDate)}</div>
            </div>
            <div className="text-3xl font-bold">{event.title}</div>
            <div className="text-xl text-gray-500">{event.location}</div>
          </div>
          <div className="h-[1px] bg-gray-300 w-full"></div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div
                onClick={() => setIsSelectIntrodution(true)}
                className={`px-2 py-4 hover:bg-gray-200 cursor-pointer transition duration-300 rounded ${
                  isSelectIntrodution
                    ? "text-blue-500 underline underline-offset-10"
                    : ""
                }`}
              >
                Giới thiệu
              </div>
              <div
                onClick={() => setIsSelectIntrodution(false)}
                className={`px-2 py-4 hover:bg-gray-200 cursor-pointer transition duration-300 rounded ${
                  !isSelectIntrodution
                    ? "text-blue-500 underline underline-offset-10"
                    : ""
                }`}
              >
                Thảo luận
              </div>
            </div>
            <div className="flex gap-4 items-center">
              {!isJoined ? (
                isPending ? (
                  <div className="px-4 py-2 w-[180px] text-center bg-amber-200 rounded-2xl hover:bg-amber-300 cursor-pointer transition duration-300">
                    Đang chờ duyệt
                  </div>
                ) : (
                  <div
                    onClick={() => handleRegisterJoinEvent(eventId.id)}
                    className="px-4 py-2 w-[180px] text-center bg-gray-200 rounded-2xl hover:bg-gray-300 cursor-pointer transition duration-300"
                  >
                    Đăng kí tham gia
                  </div>
                )
              ) : (
                <div className="px-4 py-2 w-[180px] text-center bg-green-400 rounded-2xl hover:bg-green-500 cursor-pointer transition duration-300">
                  Đang tham gia
                </div>
              )}

              <div className="relative w-[250px] max-w-sm p-4 items-center">
                <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="w-full pl-10 p-2 border rounded-2xl focus:outline-none bg-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isSelectIntrodution ? (
        <div className="mt-5 pt-15 border-t-1 border-gray-200 grid grid-cols-1 md:grid-cols-[52%_45%] gap-5">
          <div className="flex flex-col gap-4 p-5 border border-gray-300 rounded-2xl">
            <div className="text-2xl font-bold">Chi tiết</div>
            <div className="pl-4 flex flex-col gap-4">
              <div className="flex items-center gap-4 text-[18px]">
                <div>
                  <FaUsers />
                </div>
                <div> {event.numOfUser} người đã tương tác </div>
              </div>
              <div className="flex items-center gap-4 text-[18px]">
                <div>
                  <FaUser />
                </div>
                <div>
                  Sự kiện của
                  <strong> {event?.createBy?.name || "Ẩn danh"}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[18px]">
                <div>
                  <FaLocationDot />
                </div>
                <div>{event.location} </div>
              </div>
              <div className="flex items-center gap-4 text-[18px]">
                <div>
                  <MdDescription />
                </div>
                <div>{event.description} </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 border border-gray-300 rounded-2xl">
            <div className="font-bold text-2xl">Số lượng người</div>
            <div className="flex justify-around items-center">
              <div className="flex flex-col gap-2 items-center">
                <div className="text-2xl font-bold">
                  {event.numOfPendingUser}
                </div>
                <div className="text-[18px]">Người chờ duyệt tham gia</div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <div className="text-2xl font-bold">
                  <div>{(event.numOfJoiningUser || 0) + 1}</div>
                </div>
                <div className="text-[18px]">Người đang tham gia </div>
              </div>
            </div>
            <div className="font-bold text-2xl">Người tổ chức sự kiện</div>
            <div className="flex gap-2 text-[18px]">
              <div>avt</div>
              <div> {event?.createBy?.name} </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={handleOpenCreatePost}
            className="flex gap-2 justify-center w-[200px] items-center my-10 py-5 border border-gray-400 rounded-2xl"
          >
            <div>
              <FaPlus />
            </div>
            <div>Tạo bài viết mới</div>
          </button>

          {openCreateModel && (
            <div className="fixed inset-0 backdrop-blur-[1px] bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-lg flex flex-col relative">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-indigo-50">
                  <h2 className="text-xl font-semibold text-indigo-700">
                    Tạo bài viết mới
                  </h2>
                  <button
                    onClick={() => setOpenCreateModel(false)}
                    className="text-gray-600 hover:text-red-500 transition text-2xl"
                  >
                    <IoClose />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 p-6 overflow-y-auto"
                >
                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      name="content"
                      type="text"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Nhập tiêu đề nội dung..."
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ảnh bìa (Banner)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 border border-gray-300 rounded-xl 
             file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 
             file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    />

                    {bannerPreview && bannerPreview.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {bannerPreview.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`preview-${index}`}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-3 text-white rounded-xl font-medium shadow ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {loading ? "Đang gửi..." : "Xác nhận tạo bài đăng"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="px-4 py-6 min-h-screen flex flex-col gap-6">
            {/* 🔹 Nếu không có bài viết */}
            {posts.length === 0 ? (
              <div className="text-center text-gray-600 text-lg font-medium mt-10">
                Hiện chưa có bài viết nào
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
                      alt="avatar"
                      className="size-15 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                      <div className="font-bold text-[15px]">
                        {post.event?.title || "Chưa có nhóm"}
                      </div>
                      <div className="flex gap-2 items-center text-[13px] text-gray-600">
                        {post?.userId?.avatar ? (
                          <img
                            src={post?.userId?.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="p-1 text-3xl rounded-full">
                            <CgProfile />
                          </div>
                        )}
                        <div>{post?.userId?.name}</div>
                        <div>{getPostTimeAgo(post)}</div>
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
                            key={idx}
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
                      {post.liked ? (
                        <BiSolidLike className="text-blue-500" />
                      ) : (
                        <BiLike />
                      )}
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
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-xl z-10">
                    <div className="text-xl font-semibold">
                      Bài viết của {currentPost.userId?.name}
                    </div>
                    <button
                      onClick={() => setOpenCommentModal(false)}
                      className="text-3xl hover:text-gray-500 font-bold cursor-pointer"
                    >
                      <IoClose />
                    </button>
                  </div>

                  {/* Nội dung bài viết */}
                  <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
                    {/* Header */}
                    <div className="p-4 flex gap-3 items-center border-b border-gray-200">
                      <img
                        src={
                          currentPost?.event?.banner || "/default-banner.png"
                        }
                        alt="avatar"
                        className="size-15 rounded-xl object-cover"
                      />
                      <div className="flex flex-col ">
                        <div
                          className="font-bold text-[2
                
                5px] cursor-pointer hover:text-gray-600 transition duration-300"
                        >
                          {currentPost.event?.title || "Chưa có nhóm"}
                        </div>
                        <div className="flex gap-2 items-center text-[13px] text-gray-600">
                          {currentPost?.userId?.avatar ? (
                            <img
                              src={currentPost?.userId?.avatar}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="p-1 text-3xl rounded-full">
                              <CgProfile />
                            </div>
                          )}
                          <div>{currentPost?.userId?.name}</div>
                          <div>{getPostTimeAgo(currentPost)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[15px]">{currentPost.content}</div>

                    {currentPost.images?.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {currentPost.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`post-img-${idx}`}
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}
                    {/* Like count */}
                    <div className="flex items-center gap-2 p-4 border-t border-b border-gray-200 text-gray-600">
                      <BiSolidLike className="text-blue-500" />
                      <span>{currentPost.likeCount || 0} lượt thích</span>
                    </div>

                    {/* Nút Like & Comment */}
                    <div className="flex border-t">
                      <button
                        onClick={() => handleLikePost(currentPost._id)}
                        className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
                      >
                        {currentPost.liked ? (
                          <BiSolidLike className="text-blue-500" />
                        ) : (
                          <BiLike />
                        )}
                        <span>{currentPost.liked ? "Đã thích" : "Thích"}</span>
                      </button>

                      <button
                        onClick={() => handleOpenModal(currentPost)}
                        className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
                      >
                        <FaRegComment />
                        <span>Bình luận</span>
                      </button>
                    </div>
                    {/* Bình luận */}
                    <div className="space-y-2 mt-4">
                      {currentPost.comments.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {c?.userId?.avatar ? (
                            <img
                              src={c?.userId?.avatar}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="p-1 text-3xl rounded-full">
                              <CgProfile />
                            </div>
                          )}
                          <div className="bg-gray-100 p-2 rounded-xl flex flex-col gap-2 flex-1">
                            <span className="font-semibold text-sm">
                              {c.userId.name}
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
                      value={content || ""}
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
        </>
      )}
    </>
  );
};

export default EvenDetail;
