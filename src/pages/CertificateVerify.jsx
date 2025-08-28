import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "@/assets/logos/logo_icon.png";
import sponserLogo1 from "@/assets/sponsers/buildUp.png";
import sponserLogo2 from "@/assets/sponsers/elida.png";
import sponserLogo3 from "@/assets/sponsers/partners.png";
import sponserLogo4 from "@/assets/sponsers/searchForCommonGround.png";
import sponserLogo5 from "@/assets/sponsers/zeleman.png";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const partners = [
  sponserLogo1,
  sponserLogo2,
  sponserLogo3,
  sponserLogo4,
  sponserLogo5,
];

const CertificateVerify = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { certId } = useParams();
  const [certData, setCertData] = useState({});

  const baseUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetch(`${baseUrl}/api/certificates/${certId}`)
      .then((res) => res.json())
      .then(setCertData);
  }, []);

  // Duplicate partners for seamless looping

  const scrollingPartners = [...partners, ...partners];

  useEffect(() => {
    const scrollSpeed = 1;
    let animationFrame;

    function scroll() {
      if (!carouselRef.current || isHovered) return;
      const carousel = carouselRef.current;
      carousel.scrollLeft += scrollSpeed;
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        carousel.scrollLeft -= carousel.scrollWidth / 2;
      }
      animationFrame = requestAnimationFrame(scroll);
    }

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-white px-6"
      style={{
        borderRadius: 13,
        paddingBottom: 25,
        background: "#f4f7fa",
        paddingTop: 20,
      }}
    >
      {/* Top Bar with Language Dropdown and Sign Up Button */}
      <div className="flex w-full max-w-md justify-between items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-indigo-600 transition"
          style={{ borderRadius: "999px" }}
        >
          ← Home
        </button>
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        style={{ height: 120, marginBottom: 16, cursor: "pointer" }}
        onClick={() => window.location.reload()}
      />

      {/* Hero Section */}
      {certData != {} ? (
        <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 mb-6">
          <div className="certificate-verification ">
            <p
              style={{
                display: "flex",
                gap: 10,
                fontSize: 20,
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <CheckCircleIcon
                className="w-5 h-5 text-green-800"
                style={{ fontWeight: "bolder" }}
              />
              Certificate Verified
            </p>
            <br />
            <p>
              This certificate was officially issued by our platform, below are
              the details:
            </p>
            <br />
            <p>
              <strong>Student Name:</strong> {certData.userName}
            </p>
            <p>
              <strong>Course:</strong> {certData.courseTitle}
            </p>
            <p>
              <strong>Final Score:</strong> {certData.score}%
            </p>
            <p>
              <strong>Issued on:</strong>{" "}
              {new Date(certData.issueDate).toDateString()}
            </p>
            <br />
            <br />
            <p
              style={{
                fontSize: 12,
                color: "rgb(234 65 65 / 71%)",
                fontWeight: 600,
              }}
            >
              <strong>NOTE:</strong> If the details on the certificate and on
              this site doesnt match then the certificate is not valid
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 mb-6">
          <div className="certificate-verification">
            <p
              style={{
                display: "flex",
                gap: 10,
                fontSize: 20,
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <XCircleIcon
                className="w-5 h-5 text-red-800"
                style={{ fontWeight: "bolder" }}
              />
              This certificate is not knowen!!
            </p>
            <br />
            <p
              style={{
                fontSize: 14,
                color: "#ea4141",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              <strong>NOTE:</strong> Our platform never issued a certificate
              with this ID
            </p>
          </div>
        </div>
      )}

      {/* Partners Carousel */}
      <div
        ref={carouselRef}
        className="w-full max-w-md flex overflow-hidden whitespace-nowrap mb-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderRadius: 16,
          // boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          // background: "#fff",
          padding: 16,
        }}
      >
        {scrollingPartners.map((src, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 auto",
              width: 120,
              height: 80,
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              marginRight: 20,
            }}
          >
            <img
              src={src}
              alt={`Partner ${(index % partners.length) + 1}`}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateVerify;
