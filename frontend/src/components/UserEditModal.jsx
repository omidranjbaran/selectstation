import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const EditUserModal = ({ isOpen, onClose, userData, onSave }) => {
  // Initialize form state with default values including booleans for checkboxes
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
  });

  // When userData changes, update form state with new values or defaults
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        is_active: !!userData.is_active,   // Ensure boolean type
        is_staff: !!userData.is_staff,
        is_superuser: !!userData.is_superuser,
      });
    }
  }, [userData]);

  // Handle both text inputs and checkbox inputs dynamically
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // On submit, trigger onSave with current form data and close the modal
  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 bg-black bg-opacity-60">
        <Dialog.Panel className="bg-white text-gray-900 rounded-2xl p-8 max-w-md w-full shadow-xl transform transition-all duration-300">
          <Dialog.Title className="text-3xl font-extrabold mb-7 text-center tracking-wide">
            ویرایش اطلاعات کاربر
          </Dialog.Title>

          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission reload
              handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Username input */}
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

            {/* Email input */}
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

            {/* User status checkboxes */}
            <fieldset className="pt-3 border-t border-gray-200">
              <legend className="text-md font-semibold text-gray-700 mb-4">
                وضعیت کاربر
              </legend>

              <div className="flex justify-between items-center gap-6">
                {/* Active user checkbox */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 rounded focus:ring-green-400 focus:ring-2"
                  />
                  <span className="text-gray-800 font-medium">فعال</span>
                </label>

                <div className="h-6 border-l border-gray-300"></div> {/* Separator line */}

                {/* Staff user checkbox */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={formData.is_staff}
                    onChange={handleChange}
                    className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <span className="text-gray-800 font-medium">ادمین (Staff)</span>
                </label>

                <div className="h-6 border-l border-gray-300"></div> {/* Separator line */}

                {/* Superuser checkbox */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_superuser"
                    checked={formData.is_superuser}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 rounded focus:ring-red-400 focus:ring-2"
                  />
                  <span className="text-gray-800 font-medium">سوپریوزر</span>
                </label>
              </div>
            </fieldset>

            {/* Action buttons */}
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
