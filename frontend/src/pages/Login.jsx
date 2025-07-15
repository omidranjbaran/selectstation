import React, { useState } from "react";
import { login } from "../lib/api";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      showToast("نام کاربری نمی‌تواند خالی باشد.", "error");
      return;
    }

    if (!password.trim()) {
      showToast("رمز عبور نمی‌تواند خالی باشد.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(username, password);

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);

      showToast("ورود با موفقیت انجام شد!", "success");

      setTimeout(() => {
        if (
          response.data.role === "superuser" ||
          response.data.role === "staff"
        ) {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/student";
        }
      }, 1500);
    } catch (err) {
      showToast(
        "ورود ناموفق بود. لطفاً نام کاربری و رمز عبور را بررسی کنید.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-200 flex justify-center items-start pt-24 px-4"
      style={{ fontFamily: "Vazir, Tahoma, sans-serif" }}
      dir="rtl"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-7 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-blue-300"
      >
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-5">
          ورود به حساب کاربری
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">
            نام کاربری
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 text-gray-700 font-medium">
            رمز عبور
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-3 top-9 flex items-center px-2 text-gray-600 hover:text-gray-900"
            tabIndex={-1}
            disabled={isSubmitting}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.566-4.433m1.744-1.708A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.964 9.964 0 01-4.651 5.659M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-between text-sm mb-4 text-blue-600">
          <a
            href="http://127.0.0.1:8000/password_reset/"
            className="hover:underline"
          >
            فراموشی رمز عبور
          </a>
          <Link to="/register/" className="hover:underline">
            ثبت‌نام
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full
            bg-blue-600
            text-white
            cursor-pointer
            py-2
            rounded-lg
            font-semibold
            hover:bg-blue-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            active:scale-95
            active:shadow-inner
            transition
            duration-150
            ease-in-out
            transform
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {isSubmitting ? "در حال ارسال..." : "ورود"}
        </button>
      </form>

      {toast.message && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded shadow-md text-white animate-fade-in-right ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ minWidth: "250px", fontWeight: "bold", fontSize: "1rem" }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes fadeInRight {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          50% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(0);
          }
        }

        .animate-fade-in-right {
          animation: fadeInRight 2s ease forwards;
        }
      `}</style>
    </div>
  );
}
