import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdOutlineEventNote,
  MdMenu,
  MdNotifications,
  MdArticle,
  MdBarChart,
  MdSettings,
} from "react-icons/md";
import { FaUser, FaCrown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProfileUser } from "../api/user.api";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getProfileUser();
      setUser(res.data.user);
    } catch (error) {
      console.error(error?.response?.data?.message || error);
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

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

          {/* Báo cáo & Thống kê */}
          <NavLink
            to="/admin/statistic"
            className={({ isActive }) =>
              `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                isActive ? "bg-[#0c1324]" : ""
              }`
            }
          >
            <MdBarChart className="text-xl" />
            {sidebarOpen && <span>Báo cáo & Thống kê</span>}
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
            {sidebarOpen && <span>Cấu hình hệ thống</span>}
          </NavLink>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white shadow p-4">
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

          <div className="flex items-center gap-6">
            <MdNotifications className="text-2xl text-gray-600 cursor-pointer hover:text-black" />
            <div className="flex items-center gap-3">
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
