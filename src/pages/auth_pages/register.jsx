import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import registration_illustration from "@/assets/images/login_new.jpg";
import {
  UserCircleIcon,
  IdentificationIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { handleSignUp } from "@/utils/auth_services.js";
import useAdminEmails from "@/hooks/get_admin_emails.js";
import Dropdown from "@/components/basic_ui/options.jsx";
import PopUp from "@/components/basic_ui/pop_up.jsx";
import Loading from "@/components/basic_ui/Loading.jsx";
import { useTranslation } from "@/utils/useTranslation.js";
import { useLanguage } from "@/LanguageContext.jsx";
import LanguageDropdown from "@/components/basic_ui/lang_dropdown";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dict, lang } = useLanguage();
  const [updateState, setUpdateState] = useState({
    updating: false,
    error: null,
  });
  const [loadingHere, setLoading] = useState(false);
  const [errorHere, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    adminEmails,
    loading: adminLoading,
    error: adminError,
  } = useAdminEmails();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    lang: "",
    email: "",
    username: "",
    password: "",
    con_password: "",
  });

  useEffect(() => {
    if (errorHere !== "") {
      setShowError(true);
      console.log(`ERROR: ${errorHere}`);
    }
  }, [errorHere]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = () => {
    if (adminLoading) {
      setShowWarning(true);
      return;
    }

    const isAdmin = adminEmails.includes(formData.email.trim().toLowerCase());
    const role = isAdmin ? "admin" : "user";

    handleSignUp({
      name: formData.name,
      age: formData.age,
      sex: formData.sex,
      lang: formData.lang,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      con_password: formData.con_password,
      role,
      navigate,
      setLoading,
      setError,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-white"
      style={{ borderRadius: 13, paddingBottom: "20px" }}
    >
      {/* Top Right Buttons */}
      <div className="flex gap-2 lang-toggle">
        <LanguageDropdown
          onUpdateStateChange={(state) => setUpdateState(state)}
          style_pass={{maxWidth: 200, marginTop: 20}}
        />
      </div>

      <div className="mb-6">
        <img
          src={registration_illustration}
          alt={t("registration_illustration")}
          className="h-45 w-auto"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2 text-logo-800">{t("register")}</h2>
      <p className="text-logo-500 text-sm mb-6">{t("register_to_continue")}</p>

      <form className="w-full max-w-sm space-y-4">
        <InputField
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("name")}
          Icon={IdentificationIcon}
        />
        <InputField
          name="age"
          type="number"
          value={formData.age}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setFormData((prev) => ({ ...prev, age: value }));
            }
          }}
          placeholder={t("age")}
          Icon={CalendarIcon}
        />
        <CustomDropdownField
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          placeholder={t("select_gender")}
          options={[t("male"), t("female")]}
        />
        <InputField
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("email")}
          Icon={EnvelopeIcon}
        />
        <InputField
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder={t("username")}
          Icon={UserCircleIcon}
        />
        <CustomDropdownField
          name="lang"
          value={formData.lang}
          onChange={handleChange}
          placeholder={t("select_language")}
          options={[t("english"), t("amharic"), t("oromifa")]}
        />
        <PasswordField
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t("password")}
          show={showPassword}
          setShow={setShowPassword}
        />
        <PasswordField
          name="con_password"
          value={formData.con_password}
          onChange={handleChange}
          placeholder={t("confirm_password")}
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
        />

        {/* Error Pop-up */}
        <PopUp
          show={showError}
          onClose={() => setShowError(false)}
          message={errorHere}
          type="error"
        />

        {/* Warning Pop-up if admin list is still loading */}
        <PopUp
          show={showWarning}
          onClose={() => setShowWarning(false)}
          message={t("admin_loading_warning")}
          type="error"
        />

        <button
          type="button"
          className="w-full bg-indigo-500 text-white py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition"
          onClick={handleRegister}
        >
          {t("sign_up")}
        </button>

        <p className="text-center text-sm text-gray-500">
          {t("had_acc")}{" "}
          <span
            className="txt_color_main font-medium cursor-pointer"
            onClick={() => navigate("/login")}
          >
            {t("sign_in")}
          </span>
        </p>
      </form>

      {loadingHere && <Loading />}
    </div>
  );
}

// Reusable Input component
const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  Icon,
  type = "text",
}) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <Icon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
  </div>
);

// Reusable Dropdown Field
const CustomDropdownField = ({
  name,
  placeholder,
  value,
  onChange,
  Icon,
  options,
}) => {
  const handleChange = (selectedValue) => {
    onChange({
      target: {
        name,
        value: selectedValue,
      },
    });
  };

  return (
    <div className="relative border rounded-full bg-white">
      <Dropdown
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {Icon && (
        <Icon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  );
};

// Reusable Password Field
const PasswordField = ({
  name,
  value,
  onChange,
  placeholder,
  show,
  setShow,
}) => {
  const Icon = show ? EyeSlashIcon : EyeIcon;

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <LockClosedIcon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      <Icon
        className="w-5 h-5 text-logo-400 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShow(!show)}
      />
    </div>
  );
};
