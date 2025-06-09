import React from "react";
import { useNavigate } from "react-router-dom";
import useTelegramUser from "@/hooks/get_tg_data.js";
import welcomeImg from "@/assets/images/welcome.jpg"; // Add your image here

import {
  UserCircleIcon,
  IdentificationIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const tgUser = useTelegramUser();

  const [formData, setFormData] = React.useState({
    name: tgUser.name || "",
    age: "",
    sex: "",
    email: tgUser.email || "",
    username: tgUser.username || "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-white" style={{ borderRadius: 13, paddingBottom: "10px" }}>
      
      {/* Illustration */}
      <div className="mb-6">
        <img
          src={welcomeImg} // Replace with actual path or import
          alt="Register Illustration"
          className="h-40 w-auto"
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Register</h2>
      <p className="text-gray-500 text-sm mb-6">Please register to login.</p>

      {/* Form */}
      <form className="w-full max-w-sm space-y-4">
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <IdentificationIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Age */}
        <div className="relative">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Gender */}
        <div className="relative">
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full border rounded-full px-12 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <UserGroupIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Username */}
        <div className="relative">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition"
          onClick={() => navigate("/courses")}
        >
          Sign Up
        </button>

        {/* Navigation */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            type="button"
            className="txt_color_main font-medium"
            onClick={() => navigate("/login")}
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
