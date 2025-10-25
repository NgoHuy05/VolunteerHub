import {Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdOutlineEventNote,
  MdMenu,
  MdArticle,
  MdSettings,
} from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaUser, FaCrown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProfileUser } from "../api/user.api";
import { getNotificationsByIdAdmin } from "../api/notification.api";
import { logout } from "../api/auth.api";
import { CgProfile } from "react-icons/cg";
import { MdOutlineContactPage } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

const AdminLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notification, setNotification] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const resNotification = await getNotificationsByIdAdmin();

        setNotification(resNotification.data.notifications);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      }
    };

    fetchNotification();
  }, []);
  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  console.log(notification);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getProfileUser();
      setUser(res.data.user);
    } catch (error) {
      console.error(error?.response?.data?.message || error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // chạy 1 lần khi load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }
  return (
    <div className="flex bg-gray-200 min-h-screen">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-[18%]" : "w-[80px]"
        } transition-all duration-300 bg-[#0F1A34] text-white flex flex-col`}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="bg-[#182444] flex items-center gap-3 justify-center py-6 cursor-pointer"
        >
          <FaCrown className="text-yellow-400 text-2xl" />
          {sidebarOpen && <span className="text-2xl font-semibold">Admin</span>}
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col text-[17px]">
          {/* Dashboard */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                isActive ? "bg-[#0c1324]" : ""
              }`
            }
          >
            <MdSpaceDashboard className="text-xl" />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          {/* Quản lý người dùng */}
          <NavLink
            to="/admin/list/users"
            className={({ isActive }) =>
              `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                isActive ? "bg-[#0c1324]" : ""
              }`
            }
          >
            <FaUser className="text-xl" />
            {sidebarOpen && <span>Quản lý người dùng</span>}
          </NavLink>

          {/* Quản lý sự kiện */}
          <NavLink
            to="/admin/list/events"
            className={({ isActive }) =>
              `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                isActive ? "bg-[#0c1324]" : ""
              }`
            }
          >
            <MdOutlineEventNote className="text-xl" />
            {sidebarOpen && <span>Quản lý sự kiện</span>}
          </NavLink>

          {/* Quản lý bài đăng */}
          <NavLink
            to="/admin/list/posts"
            className={({ isActive }) =>
              `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                isActive ? "bg-[#0c1324]" : ""
              }`
            }
          >
            <MdArticle className="text-xl" />
            {sidebarOpen && <span>Quản lý bài đăng</span>}
          </NavLink>

          {/* Cấu hình hệ thống */}
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                isActive ? "bg-[#0c1324]" : ""
              }`
            }
          >
            <MdSettings className="text-xl" />
            {sidebarOpen && <span>Cài đặt</span>}
          </NavLink>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="relative flex justify-between items-center bg-white shadow p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-2xl text-gray-600 hover:text-black cursor-pointer"
            >
              <MdMenu />
            </button>
            <h1 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <MdSpaceDashboard className="text-blue-600" />
              Admin Dashboard
            </h1>
          </div>

          <div className=" flex items-center gap-6 transition-all hover:scale-105 duration-300 cursor-pointer">
            <button
              onClick={() => toggleDropdown("notification")}
              className="p-2 text-[20px] font-bold bg-gray-300 rounded-full transition-all hover:scale-105 hover:bg-gray-400 duration-300 cursor-pointer"
            >
              <IoMdNotifications />
            </button>{" "}
            <div className="flex items-center gap-3"
            onClick={() => toggleDropdown("avatar")}>
              
              <img
                src={
                  user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="font-medium text-gray-700">{user.name}</span>
            </div>
          </div>
          {openDropdown === "notification" && (
            <div className="absolute top-full w-[340px] right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-xl max-h-[400px] overflow-y-auto">
              {Array.isArray(notification) && notification.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {notification.map((n) => (
                    <li
                      key={n._id}
                      className={`p-3 hover:bg-gray-100 transition-all cursor-pointer ${
                        !n.isRead ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {n.senderId?.avatar ? (
                          <img
                            src={n.senderId.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <CgProfile className="text-gray-600 text-2xl" />
                          </div>
                        )}

                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{n.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm text-center py-3">
                  Chưa có thông báo mới
                </p>
              )}
            </div>
          )}
          {openDropdown === "avatar" && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg border border-gray-200 p-3 rounded-xl w-[200px]">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                <MdOutlineContactPage className="text-green-600" />
                <span className="text-gray-800 font-medium">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition duration-200 text-red-600 cursor-pointer"
              >
                <CiLogout className="text-red-500 cursor-pointer" />
                <div className="w-full text-left">Logout</div>
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div className="bg-white p-5 rounded-2xl shadow min-h-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
