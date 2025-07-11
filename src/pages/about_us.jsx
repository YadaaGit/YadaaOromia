import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo_icon.png";
import partner1 from "../assets/partners/partner1.png";
import partner2 from "../assets/partners/partner2.png";
import partner3 from "../assets/partners/partner3.png";

const partners = [partner1, partner2, partner3];

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
            padding: "8px 20px",
            backgroundColor: "#6366f1",
            color: "white",
            fontWeight: 600,
            border: "none",
            borderRadius: 20,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Header */}
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1e3a8a",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Empowering Education, One Line of Code at a Time
      </h1>

      {/* Description */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: 600,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <p style={{ color: "#4b5563", fontSize: 15, lineHeight: 1.6 }}>
          At our company, we create simple, powerful, and accessible digital
          tools to help learners and educators around the world thrive. From
          intuitive interfaces to intelligent progress tracking, our goal is to
          make learning effective and enjoyable.
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
