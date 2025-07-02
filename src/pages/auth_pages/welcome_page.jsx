import React from "react";
import { useNavigate } from "react-router-dom";
import welcomeImg from "#/public/logo_transparent.png"; // Add your image here

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6" style={{borderRadius: 13, paddingBottom: 25}}>
      <img src={welcomeImg} alt="Welcome" className="w-60 mb-6" />
      <h1 className="text-2xl font-bold text-logo-800 mb-2">Hello</h1>
      <p className="text-logo-500 text-sm text-center mb-8">
        Welcome to our platform, where you learn something new daily.
      </p>
      <div className="flex flex-col w-full max-w-sm gap-4">
        <button
          className="bg-indigo-500 text-white py-3 rounded-full font-semibold"
          style={{borderRadius: "calc(infinity * 1px)"}}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="border_main_1 txt_color_main border-indigo-600 text-logo-800 py-3 rounded-full font-semibold"
          style={{borderRadius: "calc(infinity * 1px)"}}
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}