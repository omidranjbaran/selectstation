import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

function DeleteUserModal({ username, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full translate-y-[-100px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">تایید حذف کاربر</h3>
        <p className="mb-6">
          آیا مطمئن هستید که می‌خواهید کاربر{" "}
          <span className="font-semibold">{username}</span> را حذف کنید؟
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const role = localStorage.getItem("role");
  const currentUsername = localStorage.getItem("username");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("users/");
      setUsers(res.data);
    } catch (error) {
      console.error("خطا در دریافت کاربران:", error);
      toast.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const requestDeleteUser = (user) => {
    if (role !== "superuser") {
      toast.error("شما اجازه حذف کاربر را ندارید");
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`users/${userToDelete.id}/delete/`);
      toast.success("کاربر با موفقیت حذف شد");
      fetchUsers();
    } catch (error) {
      console.error("خطا در حذف کاربر:", error);
      toast.error("خطا در حذف کاربر");
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const togglePermission = async (userId, field, currentValue) => {
    if (role !== "superuser") {
      toast.error("شما اجازه تغییر دسترسی‌ها را ندارید");
      return;
    }

    try {
      await api.patch(`users/${userId}/`, {
        [field]: !currentValue,
      });
      toast.success("دسترسی با موفقیت تغییر کرد");
      fetchUsers();
    } catch (error) {
      console.error("خطا در تغییر دسترسی:", error);
      toast.error("خطا در تغییر دسترسی");
    }
  };

  // فیلتر کاربران بر اساس searchTerm
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-blue-600 text-lg animate-pulse">
        در حال بارگذاری کاربران...
      </div>
    );
  }

  const Cell = ({ field, value, userId }) => (
    <td
      className={`py-2 px-3 border cursor-pointer select-none ${
        role === "superuser" ? "hover:bg-gray-100" : ""
      }`}
      onClick={() => togglePermission(userId, field, value)}
      title={role === "superuser" ? "برای تغییر کلیک کنید" : ""}
    >
      <span className={value ? "text-green-600 font-bold" : "text-red-500"}>
        {value ? "✔️" : "❌"}
      </span>
    </td>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">مدیریت کاربران</h2>

      <div className="mb-4 text-gray-600">
        نقش فعلی:{" "}
        <span
          className={`font-semibold ${
            role === "superuser"
              ? "text-green-600"
              : role === "staff"
              ? "text-yellow-600"
              : "text-gray-600"
          }`}
        >
          {role === "superuser"
            ? "سوپریوزر"
            : role === "staff"
            ? "ادمین"
            : "دانشجو"}
        </span>
      </div>

      <input
        type="text"
        placeholder="جستجو بر اساس نام کاربری یا ایمیل..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">هیچ کاربری یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 rounded-md">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="py-2 px-3 border">نام کاربری</th>
                <th className="py-2 px-3 border">ایمیل</th>
                <th className="py-2 px-3 border">فعال</th>
                <th className="py-2 px-3 border">ادمین</th>
                <th className="py-2 px-3 border">سوپریوزر</th>
                <th className="py-2 px-3 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isCurrentUser = user.username === currentUsername;

                return (
                  <tr
                    key={user.id}
                    className={`text-center ${
                      isCurrentUser ? "bg-yellow-50 font-medium" : ""
                    }`}
                  >
                    <td className="py-2 px-3 border">{user.username}</td>
                    <td className="py-2 px-3 border">{user.email}</td>

                    <Cell
                      field="is_active"
                      value={user.is_active}
                      userId={user.id}
                    />
                    <Cell
                      field="is_staff"
                      value={user.is_staff}
                      userId={user.id}
                    />
                    <Cell
                      field="is_superuser"
                      value={user.is_superuser}
                      userId={user.id}
                    />

                    <td className="py-2 px-3 border">
                      <button
                        onClick={() => requestDeleteUser(user)}
                        disabled={role !== "superuser"}
                        className={`px-3 py-1 rounded cursor-pointer flex items-center gap-2 mx-auto ${
                          role === "superuser"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        title={
                          role === "superuser"
                            ? "حذف کاربر"
                            : "شما اجازه حذف ندارید"
                        }
                      >
                        <FaTrash />
                        حذف
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && userToDelete && (
        <DeleteUserModal
          username={userToDelete.username}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
