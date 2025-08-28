import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/utils/useTranslation.js";
import logo from "@/assets/logos/logo_icon.png";
import logo_t from "@/assets/logos/logo_transparent.png";
import LanguageDropdown from "@/components/basic_ui/lang_dropdown";
import sponserLogo1 from "@/assets/sponsers/buildUp.png";
import sponserLogo2 from "@/assets/sponsers/elida.png";
import sponserLogo3 from "@/assets/sponsers/partners.png";
import sponserLogo4 from "@/assets/sponsers/searchForCommonGround.png";
import sponserLogo5 from "@/assets/sponsers/zeleman.png";

const partners = [
  sponserLogo1,
  sponserLogo2,
  sponserLogo3,
  sponserLogo4,
  sponserLogo5,
  logo_t,
];

const AboutUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
          onClick={() => navigate("/welcome")}
          className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-indigo-600 transition"
          style={{ borderRadius: "999px" }}
        >
          {t("sign_up")}
        </button>
        <LanguageDropdown style_pass={{ maxWidth: 160 }} />
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        style={{ height: 120, marginBottom: 16, cursor: "pointer" }}
        onClick={() => window.location.reload()}
      />

      {/* Hero Section */}
      <div
        className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 mb-6"
        style={{ textAlign: "center" }}
      >
        <h1
          className="text-2xl font-bold text-logo-800 mb-2"
          style={{ fontSize: "180%" }}
        >
          {t("about_us_title") || "Media Literacy for Peace"}
        </h1>
        <p className="text-logo-500 text-sm text-center mb-4">
          {t("about_us_intro") ||
            "Empowering young people with the knowledge and skills to engage responsibly in the digital world. Through focused training in media literacy and peacebuilding, participants learn how to identify misinformation, counter hate speech, and practice ethical storytelling that strengthens unity and resilience in their communities."}
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 mb-6">
        <h2 className="text-xl font-bold text-logo-800 mb-2">
          {t("our_mission") || "Our Mission"}
        </h2>
        <p className="text-logo-500 text-sm mb-4">
          {t("mission_text") ||
            "To expand access to media literacy and peacebuilding training that equips youth with practical skills to create safe and constructive online spaces."}
        </p>
        <h2 className="text-xl font-bold text-logo-800 mb-2">
          {t("our_vision") || "Our Vision"}
        </h2>
        <p className="text-logo-500 text-sm mb-4">
          {t("vision_text") ||
            "A society where every young person—regardless of background or location—has the tools to resist harmful content and contribute to peace, truth, and social cohesion."}
        </p>
      </div>

      {/* Values Section */}
      <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 mb-6">
        <h2 className="text-xl font-bold text-logo-800 mb-4">
          {t("core_values") || "Our Values"}
        </h2>
        <ul className="list-disc pl-6 text-logo-500 text-sm">
          <li>{t("value_1") || "Empowerment"}</li>
          <li>{t("value_2") || "Impact"}</li>
          <li>{t("value_3") || "Peacebuilding"}</li>
        </ul>
      </div>

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
              style={
                src == logo_t
                  ? { maxWidth: "100%", width: "80%",    maxHeight: "100%" }
                  : { maxWidth: "100%", maxHeight: "100%" }
              }
            />
          </div>
        ))}
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 mb-6">
        <h2 className="text-xl font-bold text-logo-800 mb-4">
          {t("contact_us") || "Contact Us"}
        </h2>
        <p className="text-logo-500 text-sm mb-2">
          {t("contact_email") || "Email"}: info@example.com
        </p>
        <p className="text-logo-500 text-sm">
          {t("contact_phone") || "Phone"}: +251-123-456-789
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
