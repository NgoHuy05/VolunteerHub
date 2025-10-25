import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState } from "react";
import { FaSearch, FaHome, FaUser, FaArrowUp } from "react-icons/fa";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import ScrollToTop from "../components/ScrollToTop";

const EventLayout = () => {
  const [isOpenYourEvent, setIsOpenYourEvent] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <ScrollToTop />
      <Header />

      <div className="bg-gray-200 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[25%_70%] text-black gap-4">
          {/* 🧭 Sidebar (desktop) */}
          <div>
            <div className="hidden lg:flex flex-col bg-white min-h-screen fixed w-[25%]">
              <div className="font-bold text-2xl pl-4 mt-2">Sự kiện</div>

              {/* Tìm kiếm */}
              <div className="relative w-full max-w-sm p-4 items-center">
                <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện"
                  className="w-full pl-10 p-2 border rounded-2xl focus:outline-none bg-gray-200"
                />
              </div>

              {/* Trang chủ */}
              <NavLink
                to="home"
                className={({ isActive }) =>
                  `flex items-center ml-1 mr-1 p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <FaHome className="text-[20px] text-red-500" />
                <div className="text-[18px]">Trang chủ</div>
              </NavLink>

              {/* Sự kiện của bạn */}
              <div>
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
                      to="joining"
                      className={({ isActive }) =>
                        `flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200 duration-300 cursor-pointer ${
                          isActive ? "bg-gray-200" : ""
                        }`
                      }
                    >
                      <FaCheckCircle className="text-green-500 text-[20px]" />
                      <div className="text-[16px]">Đang tham gia</div>
                    </NavLink>

                    <NavLink
                      to="pending-join"
                      className={({ isActive }) =>
                        `flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200 duration-300 cursor-pointer ${
                          isActive ? "bg-gray-200" : ""
                        }`
                      }
                    >
                      <FaHourglassHalf className="text-yellow-500 text-[20px]" />
                      <div className="text-[16px]">Chờ duyệt</div>
                    </NavLink>

                    <NavLink
                      to="rejected"
                      className={({ isActive }) =>
                        `flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200 duration-300 cursor-pointer ${
                          isActive ? "bg-gray-200" : ""
                        }`
                      }
                    >
                      <MdCancel className="text-red-500 text-[20px]" />
                      <div className="text-[16px]">Bị từ chối</div>
                    </NavLink>

                    <NavLink
                      to="completed"
                      className={({ isActive }) =>
                        `flex items-center ml-5 mr-1 p-4 rounded gap-2 hover:bg-gray-200 duration-300 cursor-pointer ${
                          isActive ? "bg-gray-200" : ""
                        }`
                      }
                    >
                      <FaRegCalendarCheck className="text-blue-500 text-[20px]" />
                      <div className="text-[16px]">Đã hoàn thành</div>
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 📄 Nội dung chính */}
          <div className="bg-white p-5 m-5 mr-10 rounded-2xl min-h-screen relative">
            <Outlet />

            {/* Nút lên đầu */}
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

export default EventLayout;
