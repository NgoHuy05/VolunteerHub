import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { convertDate } from "../../utils";
import { useNavigate } from "react-router-dom";
import { getEventByUserIdAndStatus } from "../../api/userEvent.api";

const EventJoining = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventByUserIdAndStatus("joining");
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
        <h2 className="text-xl font-bold mb-4">Sự kiện đang tham gia</h2>
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
                  <div className="absolute top-1 right-1 flex justify-center items-center mt-auto">
                    <div className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-600">
                      Đang tham gia
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

export default EventJoining;
