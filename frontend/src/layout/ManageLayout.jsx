import Header from "../components/Header";
import { FaSearch, FaUser, FaArrowUp } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { getAllEventCreatedBy } from "../api/event.api";
import { IoMenu } from "react-icons/io5";
import toast from "react-hot-toast";

const ManageLayout = () => {
  const [isOpenYourEvent, setIsOpenYourEvent] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await getAllEventCreatedBy();
        setEvents(res.data.events);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);
  const handleLinkClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return setFilteredEvents(events);
    setFilteredEvents(
      events.filter((e) => e.title?.toLowerCase().includes(keyword))
    );
  }, [search, events]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ScrollToTop />
      <Header />

      {/* Toggle mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-16 right-2 z-50 bg-green-500 p-2 rounded-md shadow"
      >
        <IoMenu className="text-2xl" />
      </button>

      <div className="bg-gray-200 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[20%_70%] text-black gap-4">
          {/* Sidebar */}
          <div
            className={`fixed lg:static  left-0 h-full bg-white shadow-lg transition-transform duration-300 z-40
                        ${
                          sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:translate-x-0`}
          >
            <div className="font-bold text-2xl pl-4 mt-2">Quản lí sự kiện</div>

            {/* Tìm kiếm */}
            <div className="relative w-full max-w-sm p-4 items-center">
              <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 p-2 border rounded-2xl focus:outline-none bg-gray-200"
              />
            </div>

            {/* Link sidebar */}
            <NavLink
              onClick={handleLinkClick}
              to="/manage/create"
              className={({ isActive }) =>
                `flex items-center ml-1 mr-1 justify-between p-4 rounded gap-2 hover:bg-gray-200 transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-gray-200" : ""
                }`
              }
            >
              <div className="flex items-center gap-2">
                <IoCreate className="text-[20px] text-red-500" />
                <div className="text-[18px]">Tạo sự kiện mới</div>
              </div>
            </NavLink>

            <NavLink
              onClick={handleLinkClick}
              to="/manage/post"
              className={({ isActive }) =>
                `flex items-center ml-1 mr-1 justify-between p-4 rounded gap-2 hover:bg-gray-200 transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-gray-200" : ""
                }`
              }
            >
              <div className="flex items-center gap-2">
                <FaHourglassHalf className="text-[20px] text-sky-500" />
                <div className="text-[18px]">Bài viết chờ duyệt</div>
              </div>
            </NavLink>

            <NavLink
              onClick={handleLinkClick}
              to="/manage/user"
              className={({ isActive }) =>
                `flex items-center ml-1 mr-1 justify-between p-4 rounded gap-2 hover:bg-gray-200 transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-gray-200" : ""
                }`
              }
            >
              <div className="flex items-center gap-2">
                <FaHourglassHalf className="text-[20px] text-amber-500" />
                <div className="text-[18px]">Người dùng chờ duyệt</div>
              </div>
            </NavLink>

            {/* Sự kiện của bạn */}
            <div className="cursor-pointer">
              <div
                onClick={() => setIsOpenYourEvent(!isOpenYourEvent)}
                className="flex items-center justify-between ml-1 mr-1 p-4 rounded gap-2 hover:bg-gray-200 duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FaUser className="text-[20px] text-gray-500" />
                  <div className="text-[18px]">Sự kiện của bạn</div>
                </div>
                {isOpenYourEvent ? (
                  <IoIosArrowUp className="text-[20px]" />
                ) : (
                  <IoIosArrowDown className="text-[20px]" />
                )}
              </div>

              {isOpenYourEvent && (
                <div className="flex flex-col">
                  <NavLink
                    onClick={handleLinkClick}
                    to="approved"
                    className="flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200"
                  >
                    <FaCheckCircle className="text-green-500 text-[20px]" />
                    <div className="text-[16px]">Đã được duyệt</div>
                  </NavLink>
                  <NavLink
                    onClick={handleLinkClick}
                    to="pending"
                    className="flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200"
                  >
                    <FaHourglassHalf className="text-yellow-500 text-[20px]" />
                    <div className="text-[16px]">Chờ duyệt</div>
                  </NavLink>
                  <NavLink
                    onClick={handleLinkClick}
                    to="rejected"
                    className="flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200"
                  >
                    <MdCancel className="text-red-500 text-[20px]" />
                    <div className="text-[16px]">Bị từ chối</div>
                  </NavLink>
                  <NavLink
                    onClick={handleLinkClick}
                    to="completed"
                    className="flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200"
                  >
                    <FaRegCalendarCheck className="text-blue-500 text-[20px]" />
                    <div className="text-[16px]">Hoàn thành</div>
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="bg-white p-5 m-5 mr-15 rounded-2xl min-h-screen relative ">
            <Outlet context={{ events: filteredEvents, loading }} />
            <button
              onClick={handleScrollToTop}
              className="hidden lg:block fixed bottom-5 right-5 text-[25px] border rounded-full p-2 z-50 hover:bg-white transition duration-300 cursor-pointer"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageLayout;
