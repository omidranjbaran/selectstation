import React from "react";

export default function ConfirmDeleteModal({ 
  itemName, 
  isOpen, 
  onCancel, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black pb-50 bg-opacity-40 z-50"
      onClick={onCancel}
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* خط باریک قرمز بالا */}
        <div className="h-1 w-20 mx-auto rounded-full bg-red-500 mb-4"></div>

        <h3 className="text-lg font-bold mb-4 text-red-600">تایید حذف</h3>

        <p className="mb-6 text-gray-700 text-sm">
          آیا مطمئن هستید که می‌خواهید <span className="font-semibold text-red-600">{itemName}</span> را حذف کنید؟
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
