import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { getEventByUserIdAndStatus } from "../../api/userEvent.api";
import { convertDate } from "../../utils";
import { useNavigate } from "react-router-dom";

const EventCompleted = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await getEventByUserIdAndStatus("completed");
        setEvents(res.data.events);
      } catch (error) {
        console.error(error.response.data.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);

  const handleWatchDetail = (id) => {
    navigate(`/event/detail/${id}`);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }
  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">Sự kiện đã hoàn thành</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <p className="font-bold text-2xl">Không có sự kiện nào</p>
          ) : (
            events.map((event) => (
              <div
                key={event.eventId._id}
                onClick={() => handleWatchDetail(event.eventId._id)}
                className="relative flex flex-col gap-2 p-4 bg-white shadow rounded-lg border border-gray-200 hover:scale-105 hover:bg-gray-200 transition-all duration-300 cursor-pointer"
              >
                                                {event?.banner ? (
  <img
    src={event.banner}
    alt={event._id}
    className="w-full h-auto rounded-xl object-cover"
  />
) : (
  <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
    Không có ảnh
  </div>
)}
                <div className="flex gap-5 font-bold items-center justify-center">
                  <div>{convertDate(event.eventId.startDate)}</div>
                  <div>
                    <FaArrowRightLong />
                  </div>
                  <div>{convertDate(event.eventId.endDate)}</div>
                </div>
                <div className="font-bold text-[20px]">
                  {event.eventId.title}
                </div>
                <div className="text-[18px]">{event.eventId.description}</div>
                <div className="text-gray-700 text-[16px]">
                  {event.eventId.location}
                </div>
                <div className="text-gray-500 text-[14px]">
                  {event.eventId.category}
                </div>
                <div className="absolute top-1 right-1 flex justify-center items-center mt-auto">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600">
                    Đã hoàn thành
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default EventCompleted;
