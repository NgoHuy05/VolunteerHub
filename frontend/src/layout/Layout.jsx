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
import { getAllPostFull } from "../api/post.api";
import { getProfileUser } from "../api/user.api";
import { getEventByUserIdAndStatus } from "../api/userEvent.api";
import { FaArrowUp } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

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
        setLoading(true);
        const resEventJoining = await getEventByUserIdAndStatus("joining");
        setEventJoining(resEventJoining?.data?.events);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventJoing();
  }, []);
  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    let filtered = posts;

    if (keyword) {
      filtered = filtered.filter(
        (p) =>
          p.content?.toLowerCase().includes(keyword) ||
          p.event.title?.toLowerCase().includes(keyword)
      );
    }
    setFilteredPosts(filtered);
  }, [search, posts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resPost = await getAllPostFull(selectedSort);
        const postsData = resPost.data?.posts || [];
        setPosts(postsData);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSort]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getProfileUser();
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        console.error(error.message || "Chưa login hoặc token hết hạn");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-[20%_60%_20%] text-gray-900 bg-gray-200">
        <div>
          <div className="hidden lg:flex flex-col min-h-screen overflow-y px-2 py-4">
            <NavLink
              to="profile"
              className="flex flex-wrap items-center  ml-4 mr-1 p-2 rounded gap-2 transition-all hover:bg-gray-300 duration-300 cursor-pointer"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover "
                />
              ) : (
                <div className="p-1 text-3xl rounded-full">
                  <CgProfile />
                </div>
              )}

              <div className="text-[18px] ">
                {user?.name || "Default name"}{" "}
              </div>
            </NavLink>
            <NavLink
              to="/event/home"
              className="flex items-center ml-4 mr-1 p-4 rounded gap-2 transition-all hover:bg-gray-300 duration-300 cursor-pointer"
            >
              <div className="text-[25px] ">
                <MdEventNote />
              </div>
              <div className="text-[18px]">Sự kiện</div>
            </NavLink>

            <div className="w-full h-[1px] bg-gray-500 mt-5"></div>
            <div className="mt-5 mb-5">Sự kiện đang tham gia</div>
            <div className="flex flex-col gap-2">
              {eventJoining
                .filter((ev) => ev)
                .map((ev) => (
                  <NavLink
                    key={ev._id}
                    to={`/event/detail/${ev._id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-100 transition-all duration-300 "
                  >
                    <div
                      style={{
                        backgroundImage: `url(${
                          ev.banner ? ev.banner : "/default-banner.jpg"
                        })`,
                      }}
                      className="size-[60px] bg-cover bg-center rounded-md flex-shrink-0"
                    />

                    <h3 className="text-base font-medium text-gray-800">
                      {ev.title}
                    </h3>
                  </NavLink>
                ))}
            </div>
          </div>
        </div>
        <div className="px-[32px] py-4 min-h-screen">
          <Outlet context={{ posts: filteredPosts, setPosts, user, loading }} />
          <button
            onClick={handleScrollToTop}
            className="hidden md:block fixed bottom-5 right-5 text-[25px] border rounded-full p-2 z-50 hover:bg-white transition duration-300 cursor-pointer"
          >
            <FaArrowUp />
          </button>
        </div>
        <div className="p-4 ">
          <div className="fixed flex flex-col gap-5 w-[20%]">
            <div className="relative w-full max-w-sm items-center">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px] pl-10 bg-white border border-gray-300 rounded-2xl px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
            </div>
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
