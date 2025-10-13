import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { convertDate } from "../../utils";
import { useNavigate } from "react-router-dom";
import { getAllEventCreatedBy } from "../../api/event.api";

const ManageYourEvent = () => {
    const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getAllEventCreatedBy();
        console.log(res);
        setEvents(res.data.events);
      } catch (error) {
        console.error(error.response.data.message || error.message);
      }
    };
    fetchEvent();
  }, []);
  const handleWatchDetail = (id) => {
    navigate(`/event/detail/${id}`);
  };
  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">Các sự kiện của bạn tạo</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <p className="font-bold text-2xl">Không có sự kiện nào</p>
          ) : (
            events
              .map((event) => (
                <div
                  key={event._id}
                  onClick={() => handleWatchDetail(event._id)}
                  className="relative flex flex-col gap-2 p-4 bg-white shadow rounded-lg border border-gray-200 hover:scale-105 hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    <img src={event.banner} alt={event._id} />
                  </div>
                  <div className="flex gap-5 font-bold items-center justify-center">
                    <div>{convertDate(event.startDate)}</div>
                    <div>
                      <FaArrowRightLong />
                    </div>
                    <div>{convertDate(event.endDate)}</div>
                  </div>
                  <div className="font-bold text-[20px]">
                    {event.title}
                  </div>
                  <div className="text-[18px]">{event.description}</div>
                  <div className="text-gray-700 text-[16px]">
                    {event.location}
                  </div>
                  <div className="text-gray-500 text-[14px]">
                    {event.category}
                  </div>
                  <div className="absolute top-1 right-1 flex justify-center items-center">
                    {event.status === "pending" ? (
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-600">
                        Đang chờ duyệt
                      </div>
                    ) : event.status === "approved" ? (
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-600">
                        Đã được duyệt
                      </div>
                    ) : event.status === "rejected" ? (
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600">
                        Bị từ chối 
                      </div>
                    ) : event.status === "completed" ? (
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600">
                        Đã hoàn thành
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default ManageYourEvent;
