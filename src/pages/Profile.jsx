import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "@/utils/auth_services";
import { useTranslation } from "@/utils/useTranslation.js";
import { useLanguage } from "@/LanguageContext.jsx";
import { useTelegramInitData } from "@/hooks/get_tg_data.js";
import { updateUserProfile } from "@/utils/updateUserProfile.js";
import useUserData from "@/hooks/get_user_data.js";
import ConfirmModal from "@/components/basic_ui/confirm_modal.jsx";
import LanguageDropdown from "@/components/basic_ui/lang_dropdown";
import avatarFallback from "@/assets/images/portrait.jpg";
import { Skeleton } from "@mui/material";
import "@/style/Dashboard_user.css";
import "@/style/general.css";

// Tab labels
const tabKeys = ["info", "achivments"];

export default function ProfilePage() {
  const { t } = useTranslation();
  const { initDataState } = useTelegramInitData();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { user, loading, error } = useUserData();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userEdit, setUserEdit] = useState({});
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [errorLogout, setErrorLogout] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updateState, setUpdateState] = useState({
    updating: false,
    error: null,
  });

  const handleChange = (field, value) => {
    setUserEdit((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSave() {
    try {
      setUpdateState({ updating: true, error: null });
      await updateUserProfile(
        userEdit,
        (loading) => {
          setUpdateState((prev) => ({ ...prev, updating: loading }));
        },
        (error) => {
          setUpdateState((prev) => ({ ...prev, error }));
        }
      );
      setEditMode(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setUpdateState((prev) => ({ ...prev, updating: false }));
    }
  }

  const confirmLogout = () => {
    handleLogout({
      loading: setLoadingLogout,
      error: setErrorLogout,
      navigate,
      redirectTo: "/about_us",
    });
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center px-4 py-6 pb-28 bg-gray-50 min-h-screen text-center text-logo-800">
        <div className="flex gap-2 lang-toggle w-full max-w-md justify-end mb-4">
          <Skeleton variant="rectangular" width={120} height={36} />
        </div>
        <Skeleton variant="circular" width={96} height={96} className="mb-4" />
        <Skeleton variant="text" height={28} width={160} />
        <Skeleton variant="text" height={20} width={200} className="mb-6" />
        <Skeleton
          variant="rectangular"
          width={240}
          height={40}
          className="mb-4 rounded"
        />
        <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-5 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="text" height={24} width="100%" />
          ))}
          <div className="flex justify-end gap-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={70} height={32} />
            ))}
          </div>
        </div>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          className="mt-8 max-w-md"
        />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="flex flex-col items-center px-4 py-6 pb-28 bg-gray-50 min-h-screen text-center text-logo-800"
      style={{ borderRadius: 10 }}
    >
      {/* Language Dropdown */}
      <div className="flex gap-2 lang-toggle">
        <LanguageDropdown
          onUpdateStateChange={(state) => setUpdateState(state)}
          style_pass={{ maxWidth: 200 }}
        />
      </div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white mb-4">
        <img
          src={initDataState.user?.profile || avatarFallback}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & Email */}
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p
        className="text-logo-500 text-sm mb-6"
        style={{ overflow: "scroll", maxWidth: 230 }}
      >
        {user.email}
      </p>

      {/* Tab Switcher */}
      <div
        className="flex justify-center gap-2 bg-white shadow mb-4"
        style={{ padding: 12, borderRadius: 10 }}
      >
        {tabKeys.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTabIndex(index)}
            className={`px-4 py-1 text-sm font-medium border transition-all duration-200 ${
              activeTabIndex === index
                ? "bg-indigo-500 text-white border-indigo-500"
                : "text-logo-500 border-transparent"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {activeTabIndex === 0 ? (
        <>
          <div className="w-full max-w-md text-left bg-white rounded-xl shadow px-6 py-5 space-y-4">
            <EditableField
              label={t("name")}
              value={editMode ? userEdit.name ?? user.name : user.name}
              editable={editMode}
              onChange={(v) => handleChange("name", v)}
            />
            <EditableField
              label={t("age")}
              value={editMode ? userEdit.age ?? user.age : user.age}
              editable={editMode}
              onChange={(v) => handleChange("age", v)}
            />
            <div className="flex flex-col">
              <span className="text-logo-500 text-sm mb-1">{t("gender")}</span>
              {editMode ? (
                <select
                  value={userEdit.gender ?? user.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="m">{t("male")}</option>
                  <option value="f">{t("female")}</option>
                </select>
              ) : (
                <span className="text-gray-700 text-sm font-medium">
                  {user.gender === "m"
                    ? t("male")
                    : user.gender === "f"
                    ? t("female")
                    : user.gender}
                </span>
              )}
            </div>
            <InfoRow label={t("joined")} value={user.joined} />
            <InfoRow
              label={t("location")}
              value={`${user.city} ${user.country}`}
            />
            <InfoRow
              label={t("Streak")}
              value={user.streak > 2 ? `${user.streak} 🔥` : user.streak}
            />
            <InfoRow label={t("role")} value={user.role} />

            <div className="flex justify-end gap-2 pt-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-sm text-logo-500 px-3 py-1 border rounded"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm bg-indigo-500 text-white px-3 py-1 rounded"
                  >
                    {t("save")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-sm txt_color_main bg-indigo-100 text-logo-400 px-3 py-1 rounded"
                >
                  {t("edit")}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full max-w-md text-sm bg-indigo-500 text-white px-3 py-1 rounded"
            style={{ marginTop: 35 }}
          >
            {t("log_out")}
          </button>
          <ConfirmModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={confirmLogout}
            message={t("logout_confirm")}
            confirmText={t("log_out")}
            cancelText={t("cancel")}
          />
        </>
      ) : (
        <div className="text-center text-logo-400 text-sm mt-8">
          {t("no_content_yet_for")}{" "}
          <strong>{t(tabKeys[activeTabIndex])}</strong>.
        </div>
      )}
    </div>
  );
}

function EditableField({ label, value, editable, onChange }) {
  return (
    <div className="flex flex-col">
      <span className="text-logo-500 text-sm mb-1">{label}</span>
      {editable ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        />
      ) : (
        <span
          className="text-gray-700 text-sm font-medium"
          style={{ overflow: "scroll" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
EditableField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editable: PropTypes.bool,
  onChange: PropTypes.func,
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-logo-500 text-sm">{label}</span>
      <span
        className="text-gray-700 text-sm font-medium"
        style={{ width: 100, textAlign: "right", overflow: "scroll" }}
      >
        {value}
      </span>
    </div>
  );
}
InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
