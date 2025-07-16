import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const EditUserModal = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 bg-black bg-opacity-60">
        <Dialog.Panel className="bg-white text-gray-900 rounded-2xl p-8 max-w-md w-full shadow-xl transform transition-all duration-300">
          <Dialog.Title className="text-3xl font-extrabold mb-7 text-center tracking-wide">
            ویرایش اطلاعات کاربری
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2">
                نام کاربری
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-3 focus:ring-blue-400 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="first_name" className="block text-sm font-semibold mb-2">
                نام
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-3 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-semibold mb-2">
                نام خانوادگی
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-3 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                ایمیل
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-3 focus:ring-blue-400 transition"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-semibold"
              >
                لغو
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
              >
                ذخیره
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditUserModal;
