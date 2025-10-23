import { useEffect, useState } from "react";
import { FaUsers, FaRegNewspaper, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { getAllUser } from "../../api/user.api";
import { getAllEvent } from "../../api/event.api";
import { getAllPost } from "../../api/post.api";
import { getTimeAgo } from "../../utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);

  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [usersRes, eventsRes, postsRes] = await Promise.all([
        getAllUser(),
        getAllEvent(),
        getAllPost(),
      ]);

      const users = usersRes.data.users || [];
      const events = eventsRes.data.events || [];
      const posts = postsRes.data.posts || [];

      setStats({
        users: users.length,
        events: events.length,
        posts: posts.length,
      });

      // tạo danh sách hoạt động gần đây
      const latestEvents = events
        .slice(-3)
        .reverse()
        .map(
          (e) =>
            `📅 Sự kiện "${e.title}" vừa được thêm lúc ${getTimeAgo(
              e.createdAt
            )}.`
        );
      const latestPosts = posts
        .slice(-3)
        .reverse()
        .map(
          (p) =>
            `📰 Bài viết "${p.content}" vừa được đăng ${getTimeAgo(
              p.createdAt
            )}.`
        );
      const latestUsers = users
        .slice(-3)
        .reverse()
        .map((u) => `👤 Người dùng mới: ${u.name} vừa tham gia ${getTimeAgo(
              u.createdAt
            )}.`);

      setRecentActivities([...latestEvents, ...latestPosts, ...latestUsers]);

      // dữ liệu chart demo
      setChartData([
        { name: "Người dùng", value: users.length },
        { name: "Sự kiện", value: events.length },
        { name: "Bài đăng", value: posts.length },
      ]);
    } catch (error) {
      console.error(error.message);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        📊 Bảng điều khiển tổng quan
      </h2>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Tổng người dùng</p>
            <p className="text-xl font-semibold">{stats.users}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
          <FaCalendarAlt className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Tổng sự kiện</p>
            <p className="text-xl font-semibold">{stats.events}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
          <FaRegNewspaper className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Tổng bài đăng</p>
            <p className="text-xl font-semibold">{stats.posts}</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ tổng quan */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Biểu đồ thống kê
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Hoạt động gần đây
        </h3>

        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-sm">Không có hoạt động mới.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sự kiện */}
            <div>
              <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                <FaCalendarAlt /> Sự kiện
              </h4>
              <ul className="text-gray-700 text-sm space-y-2">
                {recentActivities
                  .filter((a) => a.startsWith("📅"))
                  .map((a, i) => (
                    <li key={i} className="border-b border-gray-100 pb-1">
                      {a}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Bài viết */}
            <div>
              <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                <FaRegNewspaper /> Bài viết
              </h4>
              <ul className="text-gray-700 text-sm space-y-2">
                {recentActivities
                  .filter((a) => a.startsWith("📰"))
                  .map((a, i) => (
                    <li key={i} className="border-b border-gray-100 pb-1">
                      {a}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Người dùng */}
            <div>
              <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                <FaUsers /> Người dùng
              </h4>
              <ul className="text-gray-700 text-sm space-y-2">
                {recentActivities
                  .filter((a) => a.startsWith("👤"))
                  .map((a, i) => (
                    <li key={i} className="border-b border-gray-100 pb-1">
                      {a}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
