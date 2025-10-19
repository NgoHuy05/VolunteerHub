import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { FaSort } from "react-icons/fa";
import { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useClickOutside } from "../hook";
import { MdEventNote } from "react-icons/md";
import { useEffect } from "react";
import { filterPost, getAllPostApproved } from "../api/post.api";
import { getProfileUser } from "../api/user.api";
import { countLike, getLikedPosts } from "../api/like.api";
import { getCommentByPostId } from "../api/comment.api";
import { getEventById } from "../api/event.api";
import { getEventByUserId } from "../api/userEvent.api";
import { FaArrowUp } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const sortCategories = [
  { id: 1, title: "Tất cả" },
  { id: 2, title: "Mới nhất" },
  { id: 3, title: "Cũ nhất" },
  { id: 4, title: "Top" },
];

const Layout = () => {
  const [posts, setPosts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedSort, setSelectedSort] = useState("Tất cả");
  const [user, setUser] = useState(null);
  const [eventJoining, setEventJoining] = useState([]);
  const navigate = useNavigate();
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setOpenDropdown(null);
  });
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleChangeSelectedSort = (type) => {
    handleScrollToTop();
    setSelectedSort(type);
    setOpenDropdown(null);
  };
  const handleToggle = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  useEffect(() => {
    const fetchEventJoing = async () => {
      try {
        const resEventJoining = await getEventByUserId();
        setEventJoining(resEventJoining?.data?.events);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
      }
    };
    fetchEventJoing();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await getProfileUser();
        setUser(resUser.data.user);

        let resPost;
        if (selectedSort === "Tất cả") {
          resPost = await getAllPostApproved();
        } else {
          resPost = await filterPost(selectedSort);
        }
        const postsData = resPost.data?.posts || resPost.posts;

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
  }, [selectedSort]); // 🔹 mỗi lần đổi category sort sẽ fetch lại posts

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfileUser();
        setUser(res.data.user);
      } catch (error) {
        console.error(error.message || "Chưa login hoặc token hết hạn");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);


  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-[20%_60%_20%] text-gray-900 bg-gray-200">
        <div>
          <div className="hidden md:flex flex-col min-h-screen overflow-y px-2 py-4">
            <NavLink
              to="profile"
              className="flex items-center ml-1 mr-1 p-4 rounded gap-2 transition-all hover:bg-gray-300 duration-300 cursor-pointer"
            >
              <div className="p-2 text-[25px] font-bold bg-gray-300 rounded-full ">
                <CgProfile />
              </div>
              <div className="text-[18px]">{user?.name || "Huy"} </div>
            </NavLink>
            <NavLink
              to="/event/home"
              className="flex items-center ml-1 mr-1 p-4 rounded gap-2 transition-all hover:bg-gray-300 duration-300 cursor-pointer"
            >
              <div className="text-[25px] p-2">
                <MdEventNote />
              </div>
              <div className="text-[18px]">Sự kiện</div>
            </NavLink>

            <div className="w-full h-[1px] bg-gray-500 mt-5"></div>
            <div className="mt-5 mb-5">Sự kiện đang tham gia</div>
            <div className="flex flex-col gap-2">
              {eventJoining
                .map((ev) => (
                  <NavLink
                    key={ev._id}
                    to={`/event/detail/${ev._id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-100 transition-all duration-300 "
                  >
                    <div
                      style={{ backgroundImage: `url(${ev.banner})` }}
                      className="size-[60px] bg-cover bg-center rounded-md flex-shrink-0"
                    ></div>
                    <h3 className="text-base font-medium text-gray-800">
                      {ev.title}
                    </h3>
                  </NavLink>
                ))}
            </div>
          </div>
        </div>
        <div className="px-[32px] py-4 min-h-screen">
          <Outlet context={{ posts, setPosts, user }} />
          <button
            onClick={handleScrollToTop}
            className="hidden md:block fixed bottom-5 right-5 text-[25px] border rounded-full p-2 z-50 hover:bg-white transition duration-300 cursor-pointer"
          >
            <FaArrowUp />
          </button>
        </div>
        <div className="p-4 ">
          <div className="fixed w-[20%]">
            <div className="relative " ref={ref}>
              <button
                onClick={() => handleToggle("category")}
                className="flex p-2 gap-2 items-center text-[18px] bg-white shadow-lg shadow-gray-300  rounded-2xl cursor-pointer transition focus:bg-amber-200 hover:bg-gray-300 duration-300"
              >
                <div>
                  <FaSort />
                </div>
                <div>{selectedSort}</div>
                {openDropdown === "category" ? (
                  <div>
                    <IoIosArrowUp />
                  </div>
                ) : (
                  <div>
                    <IoIosArrowDown />
                  </div>
                )}
              </button>
              {openDropdown === "category" && (
                <div className="flex flex-col p-5 gap-2 absolute top-full mt-2 w-[150px] rounded-xl shadow-lg border border-gray-200 shadow-gray-400 bg-white z-50">
                  {sortCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChangeSelectedSort(item.title)}
                      className="flex gap-2 items-center text-[14px] p-2 hover:bg-gray-200 transition duration-300 cursor-pointer rounded"
                    >
                      <div> {item.title} </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
