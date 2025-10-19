import { TbCategoryFilled } from "react-icons/tb";
import { IoTime } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaTree, FaBookOpen, FaHeartbeat, FaUsers } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { useClickOutside } from "../../hook";
import {
  convertDate,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  isTomorrow,
} from "../../utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getApprovedEventsUserNotJoined } from "../../api/event.api";
import { getProfileUser } from "../../api/user.api";
import { createUserEvent } from "../../api/userEvent.api";
const eventCategories = [
  {
    id: 0,
    category: "Tất cả",
    icon: <BiCategory />,
  },
  {
    id: 1,
    category: "Giáo dục & đào tạo",
    icon: <FaBookOpen />,
  },
  {
    id: 2,
    category: "Y tế & chăm sóc sức khỏe",
    icon: <FaHeartbeat />,
  },
  {
    id: 3,
    category: "Môi trường & bảo vệ thiên nhiên",
    icon: <FaTree />,
  },
  {
    id: 4,
    category: "Văn hóa – nghệ thuật",
    icon: <FaUsers />,
  },
  {
    id: 5,
    category: "Thể thao & giải trí",
    icon: <MdOutlineSportsSoccer />,
  },
  {
    id: 6,
    category: "Hoạt động cộng đồng",
    icon: <FaUsers />,
  },
];

const timeCategories = [
  {
    id: 1,
    time: "Tất cả",
  },
  {
    id: 2,
    time: "Hôm nay",
  },
  {
    id: 3,
    time: "Ngày mai",
  },
  {
    id: 4,
    time: "Trong tuần",
  },
  {
    id: 5,
    time: "Trong tháng",
  },
  {
    id: 6,
    time: "Trong năm",
  },
];

const EventList = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTime, setSelectedTime] = useState("Tất cả");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const categoryRef = useRef(null);
  const timeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventApproved();
    fetchUser();
  }, []);

  const fetchEventApproved = async () => {
    try {
      const res = await getApprovedEventsUserNotJoined();
      setEvents(res.data.events);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getProfileUser();
      setUser(res.data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error?.response?.data?.message || error.message);
    }
  }

const handleRegisterJoinEvent = async (eventId) => {
  try {
    if (!user) return toast.error("Bạn cần đăng nhập trước khi tham gia!");

    const data = {
      userId: user._id,
      eventId,
      role: "user",
      status: "pending",
      startDay: new Date(),
    };

    const res = await createUserEvent(data);
    toast.success(res.data.message || "Đăng ký tham gia thành công!");
    fetchEventApproved(); // 🔄 Cập nhật lại danh sách
  } catch (error) {
    toast.error(error?.response?.data?.message || "Lỗi khi đăng ký sự kiện");
  }
};



  useClickOutside(categoryRef, () => {
    if (openDropdown === "category") setOpenDropdown(null);
  });
  useClickOutside(timeRef, () => {
    if (openDropdown === "time") setOpenDropdown(null);
  });

  const handleToggle = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };
  const handleChangeSelectedCategory = (type) => {
    setSelectedCategory(type);
    setOpenDropdown(null);
  };
  const handleChangeSelectedTime = (type) => {
    setSelectedTime(type);
    setOpenDropdown(null);
  };
  const handleWatchDetail = (id) => {
    navigate(`/event/detail/${id}`);
  };
  const filteredEvents = events.filter((event) => {
    let passCategory =
      selectedCategory === "Tất cả" || event.category === selectedCategory;

    let passTime = true;
    if (selectedTime === "Hôm nay") passTime = isToday(event.startDate);
    else if (selectedTime === "Ngày mai")
      passTime = isTomorrow(event.startDate);
    else if (selectedTime === "Trong tuần")
      passTime = isThisWeek(event.startDate);
    else if (selectedTime === "Trong tháng")
      passTime = isThisMonth(event.startDate);
    else if (selectedTime === "Trong năm")
      passTime = isThisYear(event.startDate);

    return passCategory && passTime;
  });
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="font-bold text-3xl">Khám phá sự kiện</div>
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2 justify-between">
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => handleToggle("category")}
                className="flex p-2 gap-2 items-center text-[18px] bg-gray-200 rounded-2xl cursor-pointer transition focus:bg-amber-200 hover:bg-gray-300 duration-300"
              >
                <div>
                  <TbCategoryFilled />
                </div>
                <div>Danh mục</div>
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
                <div className="flex flex-col p-5 gap-2 absolute top-full mt-2 w-[300px] rounded-xl shadow-lg border border-gray-200 shadow-gray-400 bg-white z-50">
                  {eventCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        handleChangeSelectedCategory(item.category)
                      }
                      className="flex gap-2 items-center text-[14px] p-2 hover:bg-gray-200 transition duration-300 cursor-pointer rounded"
                    >
                      <div> {item.icon} </div>
                      <div> {item.category} </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" ref={timeRef}>
              <button
                onClick={() => handleToggle("time")}
                className="flex p-2 gap-2 items-center text-[18px] bg-gray-200 rounded-2xl  cursor-pointer transition focus:bg-amber-200 hover:bg-gray-300 duration-300"
              >
                <div>
                  <IoTime />
                </div>
                <div>Thời gian</div>
                {openDropdown === "time" ? (
                  <div>
                    <IoIosArrowUp />
                  </div>
                ) : (
                  <div>
                    <IoIosArrowDown />
                  </div>
                )}
              </button>
              {openDropdown === "time" && (
                <div className="flex flex-col p-5 gap-2 absolute top-full mt-2 w-[300px] rounded-xl shadow-lg shadow-gray-400 border border-gray-200 bg-white z-50">
                  {timeCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChangeSelectedTime(item.time)}
                      className="flex gap-2 items-center text-[14px] p-2 hover:bg-gray-200 transition duration-300 cursor-pointer rounded"
                    >
                      <div> {item.time} </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {(selectedCategory !== "Tất cả" || selectedTime !== "Tất cả") && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedCategory !== "Tất cả" && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition">
                  {selectedCategory}
                  <span onClick={() => setSelectedCategory("Tất cả")}>✕</span>
                </div>
              )}
              {selectedTime !== "Tất cả" && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm cursor-pointer hover:bg-green-200 transition">
                  {selectedTime}
                  <span onClick={() => setSelectedTime("Tất cả")}>✕</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.length === 0 ? (
            <p className="font-bold text-2xl">Không có sự kiện nào</p>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => handleWatchDetail(event._id)}
                className="flex flex-col gap-2 p-4 bg-white shadow rounded-lg border border-gray-200 hover:scale-105 hover:bg-gray-200 transition-all duration-300 cursor-pointer"
              >
                <div>
                  <img src={event.banner} alt={event.id} />
                </div>
                <div className="flex gap-5 font-bold items-center justify-center">
                  <div>{convertDate(event.startDate)}</div>
                  <div>
                    <FaArrowRightLong />
                  </div>
                  <div>{convertDate(event.endDate)}</div>
                </div>
                <div className="font-bold text-[20px]">{event.title}</div>
                <div className="text-[18px]">{event.description}</div>
                <div className="text-gray-700 text-[16px]">
                  {event.location}
                </div>
                <div className="text-gray-500 text-[14px]">
                  {event.category}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegisterJoinEvent(event._id)
                  }}
                  className="p-2 bg-green-500 text-white rounded-2xl mt-auto hover:bg-green-600 transition-all hover:scale-105 duration-300 cursor-pointer"
                >
                  Đăng kí tham gia
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default EventList;
