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
import { getProfileUser } from "../api/user.api";
import { BiEdit } from "react-icons/bi";
import { getNotificationsById } from "../api/notification.api";
import { FaCrown } from "react-icons/fa";

const navItems = [
  { path: "/", label: "Dashboard", icon: <FaHome /> },
  { path: "/event/home", label: "Sự kiện", icon: <MdEventNote /> },
];

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await getProfileUser();
        setUser(resUser.data.user);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      }
    };

    fetchData();
  }, []);

  console.log(notification);
  
const handleClickNotification = (n) => {
  navigate(`/event/detail/${n.eventId._id}`, {
    state: {
      openCommentModal: !!n.postId,
      postId: n.postId?._id || null, // ✅ chỉ truyền ID
    },
  });
};



  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const resNotification = await getNotificationsById();

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

      <div className="hidden md:flex items-center gap-10">
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
            to="/manage/your-event"
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
        {( user?.role === "admin") && (
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
            {( user.role === "admin") && (
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
          className="p-2 text-[20px] font-bold bg-gray-300 rounded-full transition-all hover:scale-105 hover:bg-gray-400 duration-300 cursor-pointer"
        >
          <IoMdNotifications />
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
                    onClick={() => handleClickNotification(n)}
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
    </div>
  );
};

export default Header;
