import { useEffect, useState } from "react";
import Header from "../components/Header";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdEdit, MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  changePassword,
  getProfileUser,
  updateUser,
  updateUserAvatar,
} from "../api/user.api";
import { BsUpload } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isSelectAccount, setIsSelectAccount] = useState(true);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    name: "",
    location: "",
    gender: "none",
    age: "",
    email: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔹 Lấy thông tin user
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        setLoading(true);
        const res = await getProfileUser();
        const data = res?.data?.user || {};
        setUser(data);
        setForm({
          name: data.name || "",
          location: data.location || "",
          age: data.age || "",
          gender: data.gender || "none",
          email: data.email || "",
          avatar: data.avatar || "", // ← thêm dòng này
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Không thể tải thông tin người dùng"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfileUser();
  }, []);

  // 🔹 Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý file avatar
  const handleChangeAvt = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    // Gọi API update avatar
    updateUserAvatar(formData)
      .then((res) => {
        setUser(res.data.user);
        setForm((prev) => ({ ...prev, avatar: res.data.user.avatar }));
        toast.success("Cập nhật avatar thành công!");
      })

      .catch((err) => {
        toast.error(err?.response?.data?.message || "Lỗi khi cập nhật avatar!");
      });
  };

  // 🔹 Cập nhật thông tin người dùng
  const handleSave = async () => {
    try {
      await updateUser(form);

      setUser((prev) => ({ ...prev, ...form }));
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi cập nhật!");
    } finally {
      setIsDisabled(true);
    }
  };

  // 🔹 Hủy chỉnh sửa
  const handleCancel = () => {
    setIsDisabled(true);
    setForm({
      name: user.name || "",
      location: user.location || "",
      age: user.age || "",
      gender: user.gender || "none",
      email: user.email || "",
    });
  };

  // 🔹 Đổi mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận chưa trùng nhau");
      return;
    }
    try {
      await changePassword(passwordForm);
      toast.success("Đổi mật khẩu thành công!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại!");
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
    <>
      <Header />
      <div className="grid grid-cols-[20%_70%] gap-10 bg-gray-200 min-h-[92vh]">
        {/* Sidebar */}
        <div className="bg-white flex flex-col gap-5 p-5">
          <div
            onClick={() => setIsSelectAccount(true)}
            className={`flex gap-2 items-center w-full p-2 rounded-2xl cursor-pointer ${
              isSelectAccount
                ? "bg-sky-400 text-white"
                : "hover:bg-gray-200 transition duration-300"
            }`}
          >
            <FaUser />
            <div>Tài khoản</div>
          </div>

          <div
            onClick={() => setIsSelectAccount(false)}
            className={`flex gap-2 items-center w-full p-2 rounded-2xl cursor-pointer ${
              !isSelectAccount
                ? "bg-sky-400 text-white"
                : "hover:bg-gray-200 transition duration-300"
            }`}
          >
            <IoMdSettings />
            <div>Bảo mật</div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white mt-5 p-5 rounded-2xl">
          {isSelectAccount ? (
            // 🧾 Thông tin tài khoản
            <>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="p-1 text-3xl rounded-full">
                                        <CgProfile />
                  </div>
                )}

                <label className="flex gap-2 bg-sky-400 text-white p-2 rounded-2xl items-center cursor-pointer hover:bg-sky-600 transition duration-300">
                  <BsUpload />
                  <span>Đổi ảnh đại diện</span>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChangeAvt}
                    className="hidden"
                  />
                </label>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="flex flex-col gap-5"
              >
                <div className="font-bold text-3xl">Thông tin tài khoản</div>

                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    <label>Họ và tên</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className={`w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-700 focus:outline-none ${
                        isDisabled ? "bg-gray-300 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label>Email</label>
                    <input
                      value={form.email || ""}
                      disabled
                      className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-700 bg-gray-300 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label>Địa chỉ</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className={`w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-700 focus:outline-none ${
                        isDisabled ? "bg-gray-300 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label>Tuổi</label>
                    <input
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className={`w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-700 focus:outline-none ${
                        isDisabled ? "bg-gray-300 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Giới tính */}
                <div className="flex flex-col gap-2 mt-10">
                  <label className="font-medium">Giới tính</label>
                  <div className="flex items-center gap-4">
                    {["male", "female", "none"].map((g) => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          disabled={isDisabled}
                          checked={form.gender === g}
                          onChange={handleChange}
                          className={isDisabled ? "cursor-not-allowed" : ""}
                        />
                        {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nút thao tác */}
                {isDisabled ? (
                  <button
                    type="button"
                    onClick={() => setIsDisabled(false)}
                    className="flex gap-2 w-[120px] bg-sky-400 text-white p-2 rounded-2xl items-center transition duration-300 hover:bg-sky-600 cursor-pointer"
                  >
                    <MdEdit />
                    <div>Chỉnh sửa</div>
                  </button>
                ) : (
                  <div className="flex gap-5">
                    <button
                      type="submit"
                      className="flex justify-center gap-2 w-[80px] bg-green-500 text-white p-2 rounded-2xl items-center transition duration-300 hover:bg-green-600 cursor-pointer"
                    >
                      <FaSave />
                      <div>Lưu</div>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex justify-center gap-2 w-[80px] bg-gray-500 text-white p-2 rounded-2xl items-center transition duration-300 hover:bg-gray-600 cursor-pointer"
                    >
                      <MdCancel />
                      <div>Hủy</div>
                    </button>
                  </div>
                )}
              </form>
            </>
          ) : (
            <form onSubmit={handleSavePassword} className="flex flex-col gap-6">
              <input
                type="text"
                name="username"
                value={user?.email || ""}
                autoComplete="username"
                hidden
                readOnly
              />

              <div className="font-bold text-3xl">Thay đổi mật khẩu</div>

              {[
                {
                  label: "Mật khẩu cũ",
                  name: "oldPassword",
                  auto: "current-password",
                },
                {
                  label: "Mật khẩu mới",
                  name: "newPassword",
                  auto: "new-password",
                },
                {
                  label: "Xác nhận mật khẩu mới",
                  name: "confirmPassword",
                  auto: "new-password",
                },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-4">
                  <label>{item.label}</label>
                  <input
                    type="password"
                    name={item.name}
                    value={passwordForm[item.name]}
                    onChange={handlePasswordChange}
                    autoComplete={item.auto}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-700 focus:outline-none"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="flex justify-center gap-2 w-[100px] bg-sky-400 text-white p-2 rounded-2xl items-center transition duration-300 hover:bg-sky-500 cursor-pointer"
              >
                <FaSave />
                <div>Lưu</div>
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
