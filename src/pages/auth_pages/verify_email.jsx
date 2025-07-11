import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "#/firebase-config.js";
import { sendEmailVerification } from "firebase/auth";
import mailImg from "@/assets/images/emailVerification.jpg";
import { EnvelopeOpenIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@/utils/useTranslation.js";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const [coolDown, setCoolDown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Keep user up-to-date reactively
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) {
        navigate("/auth");
      } else if (u.emailVerified) {
        navigate("/courses");
      }
    });
    return unsubscribe;
  }, [navigate]);

  // ✅ Countdown timer
  useEffect(() => {
    if (coolDown <= 0) return;
    const timer = setInterval(() => {
      setCoolDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [coolDown]);

  const handleSendEmail = async () => {
    if (!user) {
      setError(t("user_not_logged_in"));
      return;
    }
    try {
      await sendEmailVerification(user);
      setMessage(t("check_inbox"));
      setError("");
      setCoolDown(60); // start cooldown after successful send
    } catch (err) {
      console.error("Send email error:", err);
      if (err.code === "auth/too-many-requests") {
        setError(t("many_attempts"));
      } else {
        setError(t("email_send_failed"));
      }
    }
  };

  const handleCheckVerification = async () => {
    if (!user) {
      setError(t("user_not_logged_in"));
      return;
    }
    await user.reload();
    if (user.emailVerified) {
      navigate("/courses");
    } else {
      setError(t("email_not_verified"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-white">
      <img src={mailImg} alt={t("mail_illustration")} className="h-40 mb-6" />
      <h2 className="text-2xl font-bold mb-2 text-logo-800">
        {t("verify_email")}
      </h2>
      <p className="text-logo-500 text-sm mb-6 text-center">
        {t("email_sent")} <br />
        <span className="font-semibold text-logo-600">{user?.email}</span>
      </p>

      {/* ✅ Status messages */}
      {message && <p className="text-green-600 mb-2 text-sm">{message}</p>}
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleCheckVerification}
          className="w-full bg-indigo-500 text-white py-3 rounded-full font-semibold hover:bg-indigo-600 transition"
        >
          {t("I_verified_email")}
        </button>

        <button
          onClick={handleSendEmail}
          disabled={coolDown > 0}
          className={`w-full border py-3 rounded-full font-semibold transition ${
            coolDown > 0
              ? "border-gray-300 text-logo-400 cursor-not-allowed"
              : "border-indigo-500 text-logo-500 hover:bg-indigo-50"
          }`}
        >
          {coolDown > 0
            ? `${t("resend_in")} ${coolDown}`
            : `${t("resend_email")}`}
        </button>
      </div>
    </div>
  );
}
