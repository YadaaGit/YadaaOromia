import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
const DeleteConfirmation = ({ type, onConfirm, onCancel }) => {
  const [code, setCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    setDisabled(userInput !== code);
  }, [userInput, code]); // Generate a random 5-8 letter code
  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = Math.floor(Math.random() * 4) + 5; // 5 to 8 letters
    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    setCode(generated);
  }, []);
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {" "}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {" "}
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          {" "}
          Delete {type}{" "}
        </h2>{" "}
        <p className="mb-4 text-gray-700">
          {" "}
          This action is <strong>permanent</strong> and cannot be undone.{" "}
        </p>{" "}
        <p className="mb-2 text-gray-800">
          {" "}
          Type the following code to confirm deletion:{" "}
        </p>{" "}
        <div className="mb-4 font-mono bg-gray-100 p-2 rounded">
          {code}
        </div>{" "}
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type code here..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />{" "}
        <div className="flex justify-end gap-2">
          {" "}
          <button className="btn btnSecondary" onClick={onCancel}>
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            className="btn btnDanger"
            disabled={disabled}
            onClick={onConfirm}
          >
            {" "}
            Confirm Delete{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>,
    document.body
  );
};
export default DeleteConfirmation;
