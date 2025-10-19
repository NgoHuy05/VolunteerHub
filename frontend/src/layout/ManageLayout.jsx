import Header from "../components/Header";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useState } from "react";
const ManageLayout = () => {
  const [isOpenYourEvent, setIsOpenYourEvent] = useState(true);
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />
      <div className="bg-gray-200 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[20%_75%] text-black gap-4">
          <div>
            <div className="hidden lg:flex flex-col bg-white min-h-screen fixed w-[20%]">
              <div className="font-bold text-2xl pl-4 mt-2">
                Quản lí sự kiện
              </div>
              <div className="relative w-full max-w-sm p-4 items-center">
                <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện"
                  className="w-full pl-10 p-2 border rounded-2xl focus:outline-none bg-gray-200"
                />
              </div>

              <NavLink
                to="/manage/post"
                className={({ isActive }) =>
                  `flex items-center ml-1 mr-1 justify-between p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <div className="text-[20px] text-sky-500">
                    <FaHourglassHalf />
                  </div>
                  <div className="text-[18px]">
                    Danh sách bài viết chờ duyệt
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/manage/user"
                className={({ isActive }) =>
                  `flex items-center ml-1 mr-1 justify-between p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <div className="text-[20px] text-amber-500">
                    <FaHourglassHalf />
                  </div>
                  <div className="text-[18px]">
                    Danh sách người dùng chờ duyệt tham gia sự kiện
                  </div>
                </div>
              </NavLink>

              <NavLink
                to="/manage/your-event"
                onClick={() => setIsOpenYourEvent(!isOpenYourEvent)}
                className={({ isActive }) =>
                  `flex items-center ml-1 mr-1 justify-between p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <div className="text-[20px] text-gray-500">
                    <FaUser />
                  </div>
                  <div className="text-[18px]">Sự kiện của bạn</div>
                </div>
                {isOpenYourEvent ? (
                  <div className="text-[20px]">
                    <IoIosArrowUp />
                  </div>
                ) : (
                  <div className="text-[20px]">
                    <IoIosArrowDown />
                  </div>
                )}
              </NavLink>
              {isOpenYourEvent && (
                <div className="flex flex-col">
                  <NavLink
                    to="approved"
                    className={({ isActive }) =>
                      `flex items-center mr-1 ml-5 p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer  ${
                        isActive ? "bg-gray-200" : ""
                      }`
                    }
                  >
                    <FaCheckCircle className="text-green-500 text-[20px]" />
                    <div className="text-[16px]">
                      Đã được duyệt tạo sự kiện<nav></nav>
                    </div>
                  </NavLink>
                  <NavLink
                    to="pending"
                    className={({ isActive }) =>
                      `flex items-center mr-1 ml-5 p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                        isActive ? "bg-gray-200" : ""
                      }`
                    }
                  >
                    <FaHourglassHalf className="text-yellow-500 text-[20px]" />
                    <div className="text-[16px]">Chờ duyệt tạo sự kiện</div>
                  </NavLink>
                  <NavLink
                    to="rejected"
                    className={({ isActive }) =>
                      `flex items-center mr-1 ml-5 p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                        isActive ? "bg-gray-200" : ""
                      }`
                    }
                  >
                    <MdCancel className="text-red-500 text-[20px]" />
                    <div className="text-[16px]">Bị từ chối tạo sự kiện</div>
                  </NavLink>
                  <NavLink
                    to="completed"
                    className={({ isActive }) =>
                      `flex items-center mr-1 ml-5 p-4 rounded gap-2 transition-all hover:bg-gray-200 duration-300 cursor-pointer ${
                        isActive ? "bg-gray-200" : ""
                      }`
                    }
                  >
                    <FaRegCalendarCheck className="text-blue-500 text-[20px]" />
                    <div className="text-[16px]">Đã Hoàn thành sự kiện</div>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-5 m-5 mr-10 rounded-2xl min-h-screen">
            <Outlet />
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
