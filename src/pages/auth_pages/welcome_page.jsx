import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/utils/useTranslation.js";
import { useLanguage } from "@/LanguageContext.jsx";
import useUserData from "@/hooks/get_user_data.js";
import welcomeImg from "@/assets/logos/logo_transparent.png"; 
import LanguageDropdown from "@/components/basic_ui/lang_dropdown";

export default function Welcome() {
  const navigate = useNavigate();
  const { user, loading, error } = useUserData();
  const { dict, lang } = useLanguage();
  const [updateState, setUpdateState] = useState({
    updating: false,
    error: null,
  });

  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-white px-6"
      style={{ borderRadius: 13, paddingBottom: 25 }}
    >
      {/* Top Right Buttons */}
      <div className="flex gap-2 lang-toggle">
        <LanguageDropdown
          onUpdateStateChange={(state) => setUpdateState(state)}
          style_pass={{maxWidth: 200}}
        />
      </div>

      <img
        src={welcomeImg}
        alt={t("welcome_illustration")}
        className="w-60 mb-6"
      />
      <h1 className="text-2xl font-bold text-logo-800 mb-2">{t("hello")}</h1>
      <p className="text-logo-500 text-sm text-center mb-8">
        {t("welcome_message_auth")}
      </p>
      <div className="flex flex-col w-full max-w-sm gap-4">
        <button
          className="bg-indigo-500 text-white py-3 rounded-full font-semibold"
          style={{ borderRadius: "calc(infinity * 1px)" }}
          onClick={() => navigate("/login")}
        >
          {t("login")}
        </button>
        <button
          className="border_main_1 txt_color_main border-indigo-600 text-logo-800 py-3 rounded-full font-semibold"
          style={{ borderRadius: "calc(infinity * 1px)" }}
          onClick={() => navigate("/register")}
        >
          {t("sign_up")}
        </button>
      </div>
    </div>
  );
}
