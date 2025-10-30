import { useEffect, useState } from "react";
import { getAllUser, deleteUser, adminUpdateUser } from "../../api/user.api";
import toast from "react-hot-toast";

const AdminListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    age: "",
    gender: "none",
    role: "user",
    status: "active",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUser();
      if (res.data.success) setUsers(res.data.users);
      else toast.error("Không thể lấy danh sách người dùng");
    } catch (error) {
      console.error(error?.message || error);
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
      age: user.age || "",
      gender: user.gender || "none",
      role: user.role || "user",
      status: user.status || "active",
    });
  };

  useEffect(() => {
    const keywords = search.toLowerCase().trim();
    let filtered = users;

    if (filter !== "all") {
      filtered = filtered.filter((e) => e.role === filter);
    }

    if (keywords) {
      filtered = filtered.filter((e) =>
        e?.name.toLowerCase().includes(keywords)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); 
  }, [search, filter, users]);

  const closeModal = () => setEditingUser(null);

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        location: form.location,
        age: form.age,
        gender: form.gender,
        role: form.role,
        status: form.status,
      };

      const res = await adminUpdateUser(editingUser._id, payload);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === editingUser._id ? { ...u, ...payload } : u
          )
        );
        toast.success("Cập nhật thông tin thành công");
        closeModal();
      } else {
        toast.error(res.data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error?.message || error);
      toast.error("Lỗi khi cập nhật thông tin");
    }
  };

  const handleDelete = async (id) => {
    setConfirmingId(id);
    toast((t) => (
      <div className="text-sm">
        <p className="mb-2">Bạn có chắc muốn xóa người dùng này không?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await deleteUser(id);
                if (res.data.success) {
                  setUsers((prev) => prev.filter((u) => u._id !== id));
                  toast.success("Xóa người dùng thành công");
                } else toast.error(res.data.message || "Xóa thất bại");
              } catch (err) {
                console.error(err);
                toast.error("Lỗi khi xóa người dùng");
              }
              setConfirmingId(null);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Xóa
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setConfirmingId(null);
            }}
            className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    ));
  };

  // ✅ Tính phân trang
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    document.body.style.overflow = editingUser ? "hidden" : "auto";
  }, [editingUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-6">Danh sách người dùng</h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input
          type="text"
          placeholder="Tìm theo tên người dùng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[350px] border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">Tất cả</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4">STT</th>
              <th className="py-3 px-4">Tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 capitalize">{user.status}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={confirmingId === user._id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
                    >
                      {confirmingId === user._id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-gray-500 italic">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
          >
            «
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
          >
            »
          </button>
        </div>
      )}

      {/* MODAL CHỈNH SỬA */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50">
              <h3 className="text-lg font-semibold">✏️ Chỉnh sửa người dùng</h3>
              <button onClick={closeModal} className="text-2xl font-bold hover:text-gray-500">
                ×
              </button>
            </div>

            <div className="p-5 space-y-3">
              <Input
                label="Họ tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  disabled
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <div className="text-xs text-gray-500 mt-1">Email không thể chỉnh sửa.</div>
              </div>

              <Input
                label="Địa chỉ"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <Input
                label="Tuổi"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />

              <Select
                label="Giới tính"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                options={[
                  { value: "none", label: "Không xác định" },
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                ]}
              />

              <Select
                label="Vai trò"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                options={[
                  { value: "user", label: "User" },
                  { value: "manager", label: "Manager" },
                  { value: "admin", label: "Admin" },
                ]}
              />

              <Select
                label="Trạng thái"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={[
                  { value: "active", label: "Active" },
                  { value: "banned", label: "Banned" },
                ]}
              />
            </div>

            <div className="flex justify-end gap-3 px-5 py-3 border-t bg-gray-50">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Hủy
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-400"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default AdminListUser;
