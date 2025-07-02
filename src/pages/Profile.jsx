import "@/style/Dashboard_user.css";
import "@/style/general.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "@/assets/images/portrait.jpg";
import useUserData from "@/hooks/get_user_data.js";
import Dropdown from "@/components/basic_ui/options.jsx";
import PopUp from "@/components/basic_ui/pop_up.jsx";
import Loading from "@/components/basic_ui/Loading.jsx";
import LanguageDropdown from "@/components/basic_ui/lang_dropdown";
import ConfirmModal from "@/components/basic_ui/confirm_modal.jsx";
import { handleLogout } from "@/utils/auth_services";

const tabs = ["Info", "Scores"];

const translations = {
  en: {
    Info: "Info",
    Scores: "Scores",
    Name: "Name",
    Email: "Email",
    Country: "Country",
    Username: "Username",
    Joined: "Joined",
    Edit: "Edit",
    Save: "Save",
    Cancel: "Cancel",
  },
  am: {
    Info: "መረጃ",
    Scores: "ውጤቶች",
    Name: "ስም",
    Email: "ኢሜይል",
    Country: "አገር",
    Username: "የተጠቃሚ ስም",
    Joined: "ቀን ተቀላቀለ",
    Edit: "አርትዕ",
    Save: "አስቀምጥ",
    Cancel: "ይቅር",
  },
  om: {
    Info: "Odeeffannoo",
    Scores: "Bu'aa",
    Name: "Maqaa",
    Email: "Imeelii",
    Country: "Biyya",
    Username: "Maqaa fayyadamtoota",
    Joined: "Guyyaa Makamu",
    Edit: "Gulaali",
    Save: "Oolchi",
    Cancel: "Haqi",
  },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Info");
  const [editMode, setEditMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState({ updating: false, error: null });

  const { user, loading, error } = useUserData();

  const [loadingLogout, setLoadingLogout] = useState(false);
  const [errorLogout, setErrorLogout] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLangChange = (newLangCode) => {
    // Optional: update local user context or state
    console.log("New language selected:", newLangCode);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const t = (key) => {
    const dict = translations[language];
    return dict && dict[key] ? dict[key] : key;
  };

  const handleChange = (field, value) => {
    setUserEdit((user) => ({ ...user, [field]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    console.log("Saved user data:", userEdit); // Replace with API call
  };

  const confirmLogout = () => {
    handleLogout({
      loading: setLoadingLogout,
      error: setErrorLogout,
      navigate: navigate,
      redirectTo: "/ww",
    });
  };

  return (
    <div
      className="flex flex-col items-center px-4 py-6 pb-28 bg-gray-50 min-h-screen text-center text-gray-800"
      style={{ borderRadius: 10 }}
    >
      {/* Top Right Buttons */}
      <div className="flex gap-2 lang-toggle">
        <LanguageDropdown
          value={user?.lang}
          onChange={handleLangChange}
          onUpdateStateChange={(state) => setStatus(state)}
          style_pass={{maxWidth: 200}}
        />
      </div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white mb-4">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name & XP */}
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p
        className="text-gray-500 text-sm mb-6"
        style={{ overflow: "scroll", maxWidth: 230 }}
      >
        {user.email}
      </p>

      {/* Tab Switcher */}
      <div
        className="flex justify-center gap-2 bg-white shadow mb-4"
        style={{ padding: 12, borderRadius: 10 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm font-medium border transition-all duration-200 ${
              activeTab === tab
                ? "bg-indigo-500 text-white border-indigo-500"
                : "text-gray-500 border-transparent"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {activeTab === "Info" && (
        <>
          <div className="w-full max-w-md text-left bg-white rounded-xl shadow px-6 py-5 space-y-4">
            <EditableField
              label={t("Name")}
              value={user.name}
              editable={editMode}
              onChange={(v) => handleChange("name", v)}
            />
            <EditableField
              label={t("Email")}
              value={user.email}
              editable={editMode}
              onChange={(v) => handleChange("email", v)}
            />
            <EditableField
              label={t("Country")}
              value={user.country}
              editable={editMode}
              onChange={(v) => handleChange("country", v)}
            />
            <InfoRow label={t("Username")} value={user.username} />
            <InfoRow label={t("Joined")} value={user.joined} />
            <InfoRow label={t("Role")} value={user.role} />

            <div className="flex justify-end gap-2 pt-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-sm text-gray-500 px-3 py-1 border rounded"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm bg-indigo-500 text-white px-3 py-1 rounded"
                  >
                    {t("Save")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-sm txt_color_main bg-indigo-100 text-indigo-600 px-3 py-1 rounded"
                >
                  {t("Edit")}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full max-w-md text-sm bg-indigo-500 text-white px-3 py-1 rounded"
            style={{ marginTop: 35 }}
          >
            Log Out
          </button>

          <ConfirmModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={confirmLogout}
            message="Are you sure you want to logout?"
            confirmText="Log Out"
            cancelText="Cancel"
          />
        </>
      )}

      {activeTab !== "Info" && (
        <div className="text-center text-gray-400 text-sm mt-8">
          No content yet for <strong>{t(activeTab)}</strong>.
        </div>
      )}
    </div>
  );
}

// Editable field component
function EditableField({ label, value, editable, onChange }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm mb-1">{label}</span>
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

// Non-editable info row
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-gray-500 text-sm">{label}</span>
      <span
        className="text-gray-700 text-sm font-medium"
        style={{ width: 100, textAlign: "right", overflow: "scroll" }}
      >
        {value}
      </span>
    </div>
  );
}
