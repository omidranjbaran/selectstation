import React from "react";

export default function ConfirmDeleteModal({ 
  itemName,     // Name of the item to be deleted
  isOpen,       // Modal visibility flag
  onCancel,     // Function to call when user cancels
  onConfirm     // Function to call when user confirms deletion
}) {
  if (!isOpen) return null;  // Do not render anything if modal is closed

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black pb-50 bg-opacity-40 z-50"
      onClick={onCancel} // Clicking outside the modal closes it
    >
      <div
        className="
          relative 
          bg-white 
          rounded-lg 
          shadow-lg 
          border 
          border-red-300 
          p-6 
          max-w-md 
          w-full 
          text-center
          transition-transform 
          duration-200 
          hover:scale-105
          hover:shadow-xl
        "
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Red line at the top for visual cue */}
        <div className="h-1 w-20 mx-auto rounded-full bg-red-500 mb-4"></div>

        {/* Modal title */}
        <h3 className="text-lg font-bold mb-4 text-red-600">تایید حذف</h3>

        {/* Warning message with item name */}
        <p className="mb-6 text-gray-700 text-sm">
          آیا مطمئن هستید که می‌خواهید <span className="font-semibold text-red-600">{itemName}</span> را حذف کنید؟
        </p>

        {/* Action buttons: Cancel and Confirm */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel} // Trigger cancel function
            className="cursor-pointer px-4 py-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm} // Trigger confirm (delete) function
            className="cursor-pointer px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
