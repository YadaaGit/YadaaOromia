import React from "react";
import "@/style/Dashboard_user.css";
import "@/style/general.css";

export default function ConfirmModal({ show, onClose, onConfirm, message = "Are you sure?", confirmText = "Yes", cancelText = "Cancel" }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" style={{    background: "#0000009c",
    padding: 20,
    zIndex: 99,}}>
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{message}</h2>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
          className="text-sm bg-indigo-500 text-white px-3 py-1 rounded"

          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
