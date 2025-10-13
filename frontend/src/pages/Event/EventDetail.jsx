import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { countLike, getLikedPosts, LikeUnLike } from "../../api/like.api";
import { createComment, getCommentByPostId } from "../../api/comment.api";
import { getProfileUser } from "../../api/user.api";
import { getPostByIdEventApproved } from "../../api/post.api";
import { getEventById } from "../../api/event.api";
import { FaPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDescription } from "react-icons/md";
import {
  countAllUserByEventId,
  countJoiningUserByEventId,
  countPendingUserByEventId,
} from "../../api/userEvent.api";
import { convertDate, getTimeAgo } from "../../utils";

const EvenDetail = () => {
  const [isSelectIntrodution, setIsSelectIntrodution] = useState(true);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [content, setContent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState({});
  const eventId = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
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
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await getProfileUser();
        setUser(resUser.data.user);

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

  // 🔹 Like / Unlike
  const handleLikeUnLike = async (postId) => {
    try {
      const resLike = await LikeUnLike(postId);
      const res = await countLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likeCount: res.data.likeCount, liked: resLike.data.liked }
            : p
        )
      );
    } catch (error) {
      console.error(
        "Lỗi khi like/unlike:",
        error.response?.data?.message || error.message
      );
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
              <div className="px-4 py-2 w-[180px] text-center bg-gray-200 rounded-2xl hover:bg-gray-300 cursor-pointer transition duration-300">
                Đăng kí tham gia
              </div>
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
                  Sự kiện của <strong>{event?.createBy?.name || "Ẩn danh"}</strong>
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
                <div className="text-2xl font-bold"> {event.numOfPendingUser} </div>
                <div className="text-[18px]">Người đăng kí tham gia</div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <div className="text-2xl font-bold">{event.numOfJoiningUser}</div>
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
          <div className="flex gap-2 justify-center w-[200px] items-center my-10 py-5 border border-gray-400 rounded-2xl">
            <div>
              <FaPlus />
            </div>
            <div>Tạo bài viết mới</div>
          </div>
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
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      AV
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-[15px]">
                        {post.event?.title || "Chưa có nhóm"}
                      </div>
                      <div className="flex gap-2 text-[13px] text-gray-600">
                        <div>{post?.userId?.name}</div>
                        <div>{getTimeAgo(post)}</div>
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
                            className="w-full h-auto object-cover rounded-xl"
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
                      onClick={() => handleLikeUnLike(post._id)}
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
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white rounded-xl z-10">
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
                    <div className="font-bold text-[15px]">
                      {currentPost.event?.title || "Chưa có nhóm"}
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

                    {/* Bình luận */}
                    <div className="space-y-2 mt-4">
                      {currentPost.comments.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                            AV
                          </div>
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
