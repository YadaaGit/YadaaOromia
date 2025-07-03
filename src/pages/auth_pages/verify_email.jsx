import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "#/firebase-config.js";
import { sendEmailVerification } from "firebase/auth";
import mailImg from "@/assets/images/emailVerification.jpg"; // Use your own image
import { EnvelopeOpenIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@/utils/useTranslation.js";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [cooldown, setCooldown] = useState(60);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Send verification email on mount
  useEffect(() => {
    if (user && !user.emailVerified) {
      sendEmail();
    } else if (!user) {
      navigate("/auth");
    } else if (user.emailVerified) {
      navigate("/courses");
    }
  }, []);
  useEffect(() => {
    // Countdown timer for resend cooldown
    const timer =
      cooldown > 0 &&
      setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendEmail = async () => {
    try {
      await sendEmailVerification(user);
      setMessage({text: t("check_inbox")}); // Use translation for check inbox
      setCooldown(60); // Start 1 minute cooldown
      setError("");
    } catch (err) {
      if (err.code === "auth/too-many-requests") {
        setError(
          t("many_attempts") // Use translation for too many requests
        );
      } else {
        setError(t("email_send_failed")); // Use translation for email send failure
      }
    }
  };

  const checkVerification = async () => {
    await user.reload();
    if (user.emailVerified) {
      navigate("/courses");
    } else {
      setError(t("email_not_verified")); // Use translation for email not verified
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

      {/* Status Message */}
      {message && <p className="text-green-600 mb-2 text-sm">{message}</p>}
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={checkVerification}
          className="w-full bg-indigo-500 text-white py-3 rounded-full font-semibold hover:bg-indigo-600 transition"
        >
          {t("I_verified_email")}
        </button>

        <button
          onClick={sendEmail}
          disabled={cooldown > 0}
          className={`w-full border py-3 rounded-full font-semibold transition ${
            cooldown > 0
              ? "border-gray-300 text-logo-400 cursor-not-allowed"
              : "border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          }`}
        >
          {cooldown > 0
            ? t("resend_in", { seconds: cooldown })
            : t("resend_verification_email")}
        </button>
      </div>
    </div>
  );
}
