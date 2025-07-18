import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";
import DeleteButton from "../components/DeleteButton";
import DeleteModal from "../components/ConfirmDeleteModal";
import UserListModal from "../components/UserListModal";
import EditUserModal from "../components/UserEditModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserListModal, setShowUserListModal] = useState(false);

  // For edit modal
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState(null);

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

  // Open edit user modal
  const openEditUserModal = (user) => {
    setEditUserId(user.id);
    setEditUserData(user);
    setShowEditUserModal(true);
  };

  // Close edit user modal
  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    setEditUserId(null);
    setEditUserData(null);
  };

  // Save user changes, update server and update state
  const handleSaveUser = async (updatedData) => {
    try {
      const res = await api.put(`users/${editUserId}/`, updatedData);
      toast.success("کاربر با موفقیت به‌روزرسانی شد");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUserId ? { ...user, ...res.data } : user
        )
      );

      closeEditUserModal();
    } catch (error) {
      console.error("خطا در به‌روزرسانی کاربر:", error);
      toast.error("خطا در به‌روزرسانی کاربر");
    }
  };

  // Request to delete a user
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
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch (error) {
      console.error("خطا در حذف کاربر:", error);
      toast.error("خطا در حذف کاربر");
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Toggle permissions
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

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, [field]: !currentValue } : user
        )
      );
    } catch (error) {
      console.error("خطا در تغییر دسترسی:", error);
      toast.error("خطا در تغییر دسترسی");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topUsers = filteredUsers.slice(0, 3);

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
        Current role:{" "}
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
              {topUsers.map((user) => {
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

                    <td className="py-2 px-3 border flex justify-center gap-2">
                      <button
                        onClick={() => {
                          if (role === "superuser") {
                            openEditUserModal(user);
                          } 
                        }}
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          role === "superuser"
                            ? "bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        title={
                          role === "superuser"
                            ? "ویرایش کاربر"
                            : "فقط سوپریوزرها می‌توانند کاربر را ویرایش کنند"
                        }
                        aria-label="ویرایش کاربر"
                      >
                        ویرایش
                      </button>
                      <DeleteButton
                        onClick={() => requestDeleteUser(user)}
                        disabled={role !== "superuser"}
                        title={
                          role === "superuser"
                            ? "حذف کاربر"
                            : "شما اجازه حذف ندارید"
                        }
                        aria-label="حذف کاربر"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredUsers.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowUserListModal(true)}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            مشاهده همه کاربران ({filteredUsers.length})
          </button>
        </div>
      )}

      {/* Modal for showing full user list */}
      <UserListModal
        isOpen={showUserListModal}
        onClose={() => setShowUserListModal(false)}
        users={filteredUsers}
        role={role}
        currentUsername={currentUsername}
        Cell={Cell}
        requestDeleteUser={requestDeleteUser}
        openEditUserModal={openEditUserModal} // pass the edit modal open function
      />

      {/* Confirm delete modal */}
      {userToDelete && (
        <DeleteModal
          itemName={`کاربر "${userToDelete.username}"`}
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Edit user modal */}
      {showEditUserModal && editUserData && (
        <EditUserModal
          isOpen={showEditUserModal}
          onClose={closeEditUserModal}
          userData={editUserData}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
