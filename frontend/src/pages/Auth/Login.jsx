import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await login(form);

      localStorage.setItem("token", res.data.token);

      toast.success(res?.message || "Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Đăng nhập thất bại"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Đăng Nhập
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Chào mừng trở lại! Hãy đăng nhập để tiếp tục
        </p>

        {/* form có autoComplete */}
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@gmail.com"
              name="username"
              autoComplete="username"
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
              name="password"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-indigo-500" />
              Ghi nhớ tôi
            </label>
            <a href="#" className="hover:text-indigo-400 transition">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg transition duration-200"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-700" />
          <span className="px-3 text-gray-500 text-sm">Hoặc</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Chưa có tài khoản?{" "}
          <a href="register" className="text-indigo-400 hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
