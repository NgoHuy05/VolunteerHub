import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdOutlineEventNote,
  MdMenu,
  MdArticle,
  MdOutlineContactPage,
} from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaUser, FaCrown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import { getProfileUser } from "../api/user.api";
import { logout } from "../api/auth.api";
import { getNotificationsByIdAdmin } from "../api/notification.api";
import { markAsRead } from "../api/notification.api";
import { socket } from "../socket/index";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notificationUnread, setNotificationUnread] = useState([]);
  const [notificationRead, setNotificationRead] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unread");
  const navigate = useNavigate();

  //  Khi socket connect hoặc user có id → đăng ký
  useEffect(() => {
    if (!user?._id) return;

    // connect
    if (!socket.connected) socket.connect();

    //  khi connect xong mới register
    socket.on("connect", () => {
      socket.emit("register", user._id);
    });

    //  nhận thông báo realtime
    socket.on("new_notification", (noti) => {
      if (noti.userId === user._id) {
        setNotificationUnread((prev) => [noti, ...prev]);
        toast.success("🔔 Bạn có thông báo mới!");
      }
    });

    // cleanup
    return () => {
      socket.off("connect");
      socket.off("new_notification");
    };
  }, [user?._id]);

  // Fetch user profile
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

  // Fetch notifications
  const fetchNotification = async () => {
    try {
      const res = await getNotificationsByIdAdmin();
      const unread = res.data.notifications.filter((n) => !n.isRead);
      const read = res.data.notifications.filter((n) => n.isRead);
      setNotificationUnread(unread);
      setNotificationRead(read);
    } catch (error) {
      console.error(error?.response?.data?.message || error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotification();
  }, []);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleClickNotification = async (n) => {
    setOpenDropdown(null);

    if (!n.isRead) {
      try {
        await markAsRead(n._id);
        setNotificationUnread((prev) =>
          prev.filter((item) => item._id !== n._id)
        );
        setNotificationRead((prev) => [n, ...prev]);
        n.isRead = true;
      } catch (err) {
        console.error(err?.response?.data?.message || err);
      }
    }

    // Điều hướng
    if (n.type === "new_event") {
      navigate(`/admin/list/events`, {
        state: { isModalOpen: n.eventId?._id, eventId: n.eventId?._id || null },
        replace: true,
      });
    } else if (n.type === "new_post") {
      navigate(`/admin/list/posts`, {
        state: { isWatchDetail: n.postId?._id, postId: n.postId?._id || null },
        replace: true,
      });
    }
  };

  if (!user) return null;

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );

  return (
    <div className="flex bg-gray-200 min-h-screen">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-[18%]" : "w-[80px]"
        } transition-all duration-300 bg-[#0F1A34] text-white flex flex-col`}
      >
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="bg-[#182444] flex items-center gap-3 justify-center py-6 cursor-pointer"
        >
          <FaCrown className="text-yellow-400 text-2xl" />
          {sidebarOpen && <span className="text-2xl font-semibold">Admin</span>}
        </div>

        <div className="flex flex-col text-[17px]">
          {[
            {
              to: "/admin/dashboard",
              icon: MdSpaceDashboard,
              label: "Dashboard",
            },
            {
              to: "/admin/list/users",
              icon: FaUser,
              label: "Quản lý người dùng",
            },
            {
              to: "/admin/list/events",
              icon: MdOutlineEventNote,
              label: "Quản lý sự kiện",
            },
            {
              to: "/admin/list/posts",
              icon: MdArticle,
              label: "Quản lý bài đăng",
            },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex gap-3 py-4 px-8 items-center cursor-pointer transition duration-200 hover:bg-[#0c1324] ${
                  isActive ? "bg-[#0c1324]" : ""
                }`
              }
            >
              <item.icon className="text-xl" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
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

          <div className="flex items-center gap-6">
            {/* Notification Button */}
            <button
              onClick={() => toggleDropdown("notification")}
              className="p-2 text-[20px] font-bold bg-gray-300 rounded-full hover:scale-105 hover:bg-gray-400 transition-all cursor-pointer relative"
            >
              <IoMdNotifications />
              {notificationUnread.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {notificationUnread.length}
                </span>
              )}
            </button>

            {/* Avatar */}
            <div
              className="flex items-center gap-3"
              onClick={() => toggleDropdown("avatar")}
            >
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

          {/* DROPDOWN THÔNG BÁO */}
          {openDropdown === "notification" && (
            <div className="absolute top-full right-0 mt-2 w-[340px] bg-white shadow-lg border border-gray-200 rounded-xl max-h-[400px] overflow-hidden">
              <div className="px-4 py-2 border-b flex justify-between">
                <span className="font-semibold text-gray-700">Thông báo</span>
                <span className="text-xs text-gray-400">Mới nhất</span>
              </div>

              {/* TAB */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === "unread"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Chưa đọc ({notificationUnread.length})
                </button>
                <button
                  onClick={() => setActiveTab("read")}
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === "read"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Đã đọc ({notificationRead.length})
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === "all"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Tất cả
                </button>
              </div>

              {/* LIST */}
              <ul className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                {(() => {
                  let list = [];
                  if (activeTab === "unread") list = notificationUnread;
                  else if (activeTab === "read") list = notificationRead;
                  else list = [...notificationUnread, ...notificationRead];
                  if (list.length === 0)
                    return (
                      <p className="text-gray-500 text-sm text-center py-3">
                        Chưa có thông báo
                      </p>
                    );
                  return list.map((n) => (
                    <li
                      key={n._id}
                      onClick={() => handleClickNotification(n)}
                      className={`p-3 flex items-start gap-3 cursor-pointer ${
                        n.isRead
                          ? "opacity-60 hover:bg-gray-100"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
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
                        <p
                          className={`text-sm ${
                            n.isRead ? "text-gray-500 " : "text-gray-800"
                          }`}
                        >
                          {n.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          )}

          {/* DROPDOWN AVATAR */}
          {openDropdown === "avatar" && (
            <div className="absolute top-full right-0 mt-2 w-[200px] bg-white shadow-lg border border-gray-200 p-3 rounded-xl">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <MdOutlineContactPage className="text-green-600" />
                <span className="text-gray-800 font-medium">Profile</span>
              </Link>
              <button
                onClick={logout}
                className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition"
              >
                <CiLogout className="text-red-500" />
                <span>Logout</span>
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
