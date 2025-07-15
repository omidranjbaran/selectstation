import React, { useState, useEffect } from "react";
import {
  register,
  checkUsernameAvailability,
  checkEmailAvailability,
} from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showToastBox, setShowToastBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setShowToastBox(true);
    setTimeout(() => setShowToastBox(false), 3000);
    setTimeout(() => setToast({ message: "", type: "" }), 3300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    // Validate fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        errors[key] = "اینجا باید پر شود.";
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "ایمیل وارد شده معتبر نیست.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("لطفاً همه فیلدها را صحیح پر کنید.", "error");
      return;
    }

    setIsSubmitting(true);
    setToast({ message: "", type: "" });

    try {
      // Check if username is available
      const isUsernameAvailable = await checkUsernameAvailability(
        formData.username
      );
      if (!isUsernameAvailable) {
        setFieldErrors((prev) => ({
          ...prev,
          username: "این نام کاربری قبلاً استفاده شده است.",
        }));
        showToast("لطفاً نام کاربری دیگری انتخاب کنید.", "error");
        setIsSubmitting(false);
        return;
      }

      // Check if email is available
      const isEmailAvailable = await checkEmailAvailability(formData.email);
      if (!isEmailAvailable) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "این ایمیل قبلاً استفاده شده است.",
        }));
        showToast("لطفاً ایمیل دیگری وارد کنید.", "error");
        setIsSubmitting(false);
        return;
      }

      // Register the user
      await register(formData);
      showToast("ثبت‌نام با موفقیت انجام شد!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      showToast("ثبت‌نام انجام نشد. لطفاً اطلاعات را بررسی کنید.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Back button outside the form, on the left side of the page */}
      <button
        onClick={() => navigate("/login")}
        className="fixed top-6 left-6 bg-white text-blue-600 font-semibold py-2 px-5 rounded-md shadow-sm hover:bg-blue-50 transition cursor-pointer"
      >
        ← بازگشت به لاگین
      </button>

      {/* Toast message */}
      <div
        className={`toast-container ${showToastBox ? "show" : ""} ${
          toast.type === "success" ? "toast-success" : "toast-error"
        }`}
      >
        {toast.message}
      </div>

      <div
        className="min-h-screen bg-gradient-to-br from-emerald-200 to-blue-300 flex justify-center items-start pt-20 px-4"
        dir="rtl"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-7 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-blue-300"
          noValidate
        >
          <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-5">
            ثبت‌نام در سایت
          </h2>

          {[
            { label: "نام کاربری", name: "username", type: "text" },
            { label: "ایمیل", name: "email", type: "email" },
            { label: "نام", name: "first_name", type: "text" },
            { label: "نام خانوادگی", name: "last_name", type: "text" },
            { label: "رمز عبور", name: "password", type: "password" },
          ].map(({ label, name, type }) => (
            <div key={name} className="mb-4">
              <label className="block mb-1 text-gray-700 font-medium">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50
                  ${fieldErrors[name] ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors[name] && (
                <p className="text-red-600 mt-1 text-sm">{fieldErrors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full bg-green-600 text-white cursor-pointer py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95 active:shadow-inner
              ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 250px;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-family: Vazir, Tahoma, sans-serif;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transform: translateX(100%);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
          z-index: 9999;
        }
        .toast-container.show {
          transform: translateX(0);
          opacity: 1;
        }
        .toast-success {
          background-color: #16a34a;
        }
        .toast-error {
          background-color: #dc2626;
        }
      `}</style>
    </>
  );
}
