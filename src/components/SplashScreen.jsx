import React from "react";
import logo from "@/assets/logos/logo_transparent.png"; // replace with your actual logo path

export default function SplashScreen() {
  return (
    <div
      className="flex items-center justify-center bg-white"
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-24 h-24 animate-pulse" />

        {/* Loading Text */}
        <div className="flex text-xl font-semibold text-gray-700 space-x-1">
          <span>Loading</span>
          <span className="flex" style={{ alignItems: "flex-end" }}>
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
          </span>
        </div>
      </div>
    </div>
  );
}

// Dot component for animation
const Dot = ({ delay }) => (
  <span
    className="w-2 h-2 bg-gray-700 rounded-full mx-1 animate-bounce"
    style={{ animationDelay: delay }}
  ></span>
);
