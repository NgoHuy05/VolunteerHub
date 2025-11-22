import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth.api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    samePassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.samePassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.password !== form.samePassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không trùng khớp");
      return;
    }

    try {
      const res = await register(form);
      toast.success(res?.message || "Đăng ký thành công");
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Đăng ký thất bại"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Đăng Ký
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Tạo tài khoản mới và bắt đầu trải nghiệm
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@gmail.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="********"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={form.samePassword}
              onChange={(e) =>
                setForm({ ...form, samePassword: e.target.value })
              }
              placeholder="********"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg transition duration-200"
          >
            Đăng Ký
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-700" />
          <span className="px-3 text-gray-500 text-sm">Hoặc</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Đã có tài khoản?{" "}
          <a href="login" className="text-indigo-400 hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
