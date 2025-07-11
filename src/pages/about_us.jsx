import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo_icon.png";
const partners = [
  "https://via.placeholder.com/120x80?text=Partner+1",
  "https://via.placeholder.com/120x80?text=Partner+2",
  "https://via.placeholder.com/120x80?text=Partner+3"
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fa",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ height: 40, cursor: "pointer" }}
          onClick={() => window.location.reload()}
        />
        <button
          onClick={() => navigate("/auth")}
          style={{
            padding: "10px 24px",
            backgroundColor: "#6366f1",
            color: "white",
            fontWeight: 600,
            border: "none",
            borderRadius: 20,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Hero Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 18,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          maxWidth: 600,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1e3a8a",
            marginBottom: 12,
          }}
        >
          Empowering Education, One Line of Code at a Time
        </h1>
        <p style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.7 }}>
          We are a passionate team of developers, designers, and educators who
          believe in transforming learning through technology. We build powerful
          and intuitive tools that help learners stay engaged and teachers track
          progress effortlessly.
        </p>
      </div>

      {/* Mission and Vision */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 20,
          maxWidth: 600,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: "#1e40af" }}>
          Our Mission
        </h2>
        <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
          To democratize access to quality education through smart, efficient,
          and scalable digital platforms.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: "#1e40af" }}>
          Our Vision
        </h2>
        <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.6 }}>
          A world where every learner, regardless of location, has the tools
          they need to succeed.
        </p>
      </div>

      {/* Partners Carousel */}
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          overflowX: "auto",
          display: "flex",
          gap: 20,
          paddingBottom: 10,
        }}
      >
        {partners.map((src, index) => (
          <div
            key={index}
            style={{
              minWidth: 120,
              minHeight: 80,
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <img
              src={src}
              alt={`Partner ${index + 1}`}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
