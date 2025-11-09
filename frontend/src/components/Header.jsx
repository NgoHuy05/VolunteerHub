import { FaHome } from "react-icons/fa";
import { IoMdMenu, IoMdNotifications } from "react-icons/io";
import { MdEventNote } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { CiLogout } from "react-icons/ci";
import { MdOutlineContactPage } from "react-icons/md";
import { logout } from "../api/auth.api";
import { BiEdit } from "react-icons/bi";
import { FaCrown } from "react-icons/fa";
import { getNotificationsById, markAsRead } from "../api/notification.api";
import toast from "react-hot-toast";
import { socket } from "../socket/index";
import { getProfileUser } from "../api/user.api";

const navItems = [
  { path: "/", label: "Dashboard", icon: <FaHome /> },
  { path: "/event/home", label: "Sự kiện", icon: <MdEventNote /> },
];

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState("unread"); // unread, read, all
  const [notificationUnread, setNotificationUnread] = useState([]);
  const [notificationRead, setNotificationRead] = useState([]);
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfileUser();
        setUser(res.data.user);
      } catch (error) {
        console.error(error.message || "Chưa login hoặc token hết hạn");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      socket.emit("register", user._id);
    });
    socket.on("new_notification", (noti) => {
      if (noti.userId === user._id) {
        setNotificationUnread((prev) => [noti, ...prev]);
        toast.success("🔔 Bạn có thông báo mới!");
      }
    });
    return () => {
      socket.off("connect");
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [user?._id]);

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

    if (n.type === "new_user_register") {
      navigate(`/manage/user`, {
        state: {
          isWatchDetail: !!n.userId,
          senderId: n.senderId?._id || null,
        },
      });
    } else if (n.type === "approve_post") {
      navigate(`/event/detail/${n.postId.eventId}`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    } else if (n.type === "approve_event") {
      navigate(`/event/detail/${n.postId.eventId}`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    } else if (n.type === "new_post") {
      navigate(`/manage/post`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    } else {
      navigate(`/event/detail/${n.postId.eventId}`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await getNotificationsById();
        const unread = res.data.notifications.filter((n) => !n.isRead);
        const read = res.data.notifications.filter((n) => n.isRead);
        setNotificationUnread(unread);
        setNotificationRead(read);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      }
    };
    fetchNotification();
  }, []);

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  return (
    <div className="sticky top-0 z-50 w-full flex justify-between font-bold bg-white text-gray-900 shadow py-2 px-4">
      <Link
        to="/"
        className="flex justify-center items-center gap-3 cursor-pointer"
      >
        <div
          className="w-10 h-10 bg-cover"
          style={{ backgroundImage: `url(${logo})` }}
        />
        <div className="bg-gradient-to-r from-green-500 to-red-500 text-transparent bg-clip-text text-xl">
          VolunteerHub
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex gap-2 items-center p-2 rounded hover:bg-gray-200 transition duration-300 cursor-pointer ${
                isActive ? "border-b-3   rounded-none" : ""
              }`
            }
          >
            <div>{item.icon}</div>
            <div> {item.label}</div>
          </NavLink>
        ))}
        {(user?.role === "manager" || user?.role === "admin") && (
          <NavLink
            key="/manage"
            to="/manage/approved"
            className={({ isActive }) =>
              `flex gap-2 items-center p-2 rounded hover:bg-gray-200 transition duration-300 cursor-pointer ${
                isActive ? "border-b-3   rounded-none" : ""
              }`
            }
          >
            <div className="flex items-center gap-2">
              <div>
                <BiEdit />
              </div>
              <div>Quản lí</div>
            </div>
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink
            key="/admin"
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex gap-2 items-center p-2 rounded hover:bg-gray-200 transition duration-300 cursor-pointer ${
                isActive ? "border-b-3   rounded-none" : ""
              }`
            }
          >
            <div className="flex items-center gap-2">
              <div>
                <FaCrown className="text-yellow-400 text-2xl" />
              </div>
              <div>Admin</div>
            </div>
          </NavLink>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 relative">
        <button
          onClick={() => toggleDropdown("menu")}
          className="md:hidden p-2 text-[20px] font-bold bg-gray-300 rounded-full transition-all hover:scale-105 hover:bg-gray-400 duration-300 cursor-pointer"
        >
          <IoMdMenu />
        </button>
        {openDropdown === "menu" && (
          <div className="absolute top-full right-0 mt-2 bg-gray-200 shadow border p-4 rounded ">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpenDropdown(null)}
                className="block py-2 px-3 hover:bg-gray-100 rounded"
              >
                <div className="flex items-center gap-2">
                  <div>{item.icon} </div>
                  <div>{item.label}</div>
                </div>
              </NavLink>
            ))}

            {(user.role === "manager" || user.role === "admin") && (
              <NavLink
                key="/manage/your-event"
                to="/manage/your-event"
                onClick={() => setOpenDropdown(null)}
                className="block py-2 px-3 hover:bg-gray-100 rounded"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <BiEdit />{" "}
                  </div>
                  <div>Quản lí</div>
                </div>
              </NavLink>
            )}
            {user.role === "admin" && (
              <NavLink
                key="/admin"
                to="/admin/dashboard"
                onClick={() => setOpenDropdown(null)}
                className="block py-2 px-3 hover:bg-gray-100 rounded"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <FaCrown className="text-yellow-400 text-2xl" />
                  </div>
                  <div>Admin</div>
                </div>
              </NavLink>
            )}
          </div>
        )}

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

        <button
          onClick={() => toggleDropdown("avatar")}
          className="rounded-full transition-all hover:scale-105 duration-300 cursor-pointer"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="p-1 text-3xl rounded-full">
              <CgProfile />
            </div>
          )}
        </button>
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
    </div>
  );
};

export default Header;
