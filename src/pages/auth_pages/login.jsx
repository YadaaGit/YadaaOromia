import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import welcomeImg from "@/assets/images/welcome.jpg"; // Add your image here

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-white" style={{ borderRadius: 13, paddingBottom: "10px" }}>
      
      {/* Illustration Placeholder */}
      <div className="mb-6">
        <img
          src={welcomeImg} // <-- Replace with your actual image path
          alt="Login Illustration"
          className="h-40 w-auto"
        />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Login</h2>
      <p className="text-gray-500 text-sm mb-6">Please sign in to continue.</p>

      {/* Form */}
      <form className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Remember Me */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" /> Remember me next time
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition"
          onClick={() => navigate("/courses")}
        >
          Sign In
        </button>

        {/* Navigation Link */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <a
            className="txt_color_main font-medium"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
