import React, { useState } from "react";
import DeleteButton from "../components/DeleteButton";

/**
 * UserListModal component renders a searchable modal with a list of users.
 * It displays user details and action buttons for editing and deleting users,
 * with permissions controlled by the current user's role.
 * 
 * Props:
 * - isOpen: boolean to control modal visibility
 * - onClose: function to close the modal
 * - users: array of user objects to display
 * - role: string indicating current user's role ("superuser" can edit/delete)
 * - currentUsername: string of the logged-in user's username
 * - Cell: React component to render boolean fields (is_active, is_staff, is_superuser)
 * - requestDeleteUser: function called with user object to trigger delete action
 * - openEditUserModal: function called with user object to open edit modal
 */

export default function UserListModal({
  isOpen,
  onClose,
  users,
  role,
  currentUsername,
  Cell,
  requestDeleteUser,
  openEditUserModal,
}) {
  // State to store current search term entered by user
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users by matching username or email with the search term (case-insensitive)
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white max-w-6xl w-full rounded-lg p-6 shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
          aria-label="بستن مودال"
        >
          ✖
        </button>

        {/* Modal title */}
        <h3 className="text-xl font-semibold mb-4 text-blue-700">لیست کامل کاربران</h3>

        {/* Search input */}
        <input
          type="text"
          placeholder="جستجو بر اساس نام کاربری یا ایمیل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Show message if no users found */}
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500">هیچ کاربری یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-sm border border-gray-300 rounded-md">
              <thead className="bg-blue-100 text-gray-800 sticky top-0">
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
                  // Highlight row if this user is the current logged-in user
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

                      {/* Render boolean status cells using the Cell component */}
                      <Cell field="is_active" value={user.is_active} userId={user.id} />
                      <Cell field="is_staff" value={user.is_staff} userId={user.id} />
                      <Cell field="is_superuser" value={user.is_superuser} userId={user.id} />

                      {/* Action buttons with permissions based on role */}
                      <td className="py-2 px-3 border flex justify-center gap-2">
                        <button
                          onClick={() => openEditUserModal(user)}
                          className={`${
                            role === "superuser"
                              ? "bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          } px-3 py-1 rounded text-sm font-semibold`}
                          title={
                            role === "superuser"
                              ? "ویرایش کاربر"
                              : "شما اجازه ویرایش ندارید"
                          }
                          disabled={role !== "superuser"}
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
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
