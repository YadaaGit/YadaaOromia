import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import registration_illustration from "@/assets/images/login_new.jpg";
import {
  UserCircleIcon,
  IdentificationIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { handleSignUp } from "@/utils/auth_services.js";
import useAdminEmails from "@/hooks/get_admin_emails.js";
import Dropdown from "@/components/basic_ui/options.jsx";
import Loading from "@/components/basic_ui/Loading.jsx";
import { useLanguage } from "@/LanguageContext.jsx";
import { useTranslation } from "@/utils/useTranslation.js";
import { useTelegramInitData } from "@/hooks/get_tg_data.js";
import LanguageDropdown from "@/components/basic_ui/lang_dropdown";
import { getNames as getCountryNames } from "country-list";
import * as countriesCities from "countries-cities";

export default function Register() {
  const { initDataRaw, initDataState } = useTelegramInitData();
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
  const [countries, setCountries] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [autoCountry, setAutoCountry] = useState("");
  const [autoCity, setAutoCity] = useState("");
  const {
    adminEmails,
    loading: adminLoading,
    error: adminError,
  } = useAdminEmails();
  const userId = initDataState.user.id;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    lang: "",
    email: "",
    phone_number: "",
    password: "",
    con_password: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    const allCountries = getCountryNames().sort((a, b) => a.localeCompare(b));
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch("/api/get-location");
        const data = await res.json();
        if (data.country) setAutoCountry(data.country);
        if (data.city) setAutoCity(data.city);

        setFormData((prev) => ({
          ...prev,
          country: prev.country || data.country || "",
          city: prev.city || data.city || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user location:", err);
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    if (errorHere !== "") {
      setShowError(true);
      toast.error(errorHere);
      console.log(`ERROR: ${errorHere}`);
    }
  }, [errorHere]);

  useEffect(() => {
    if (formData.country) {
      const cityArr = countriesCities
        .getCities(formData.country)
        .sort((a, b) => a.localeCompare(b)) || [t("select_country_first")];
      setCitiesList(cityArr);

      setFormData((prev) => ({
        ...prev,
        city:
          cityArr.includes(prev.city) || !autoCity
            ? prev.city
            : cityArr.includes(autoCity)
            ? autoCity
            : "",
      }));
    } else {
      setCitiesList([t("select_country_first")]);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      if (value === "" || countries.includes(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "phone_number") {
      const numericValue = value.replace(/\D/g, ""); // Only keep digits
      setFormData((prev) => ({ ...prev, phone_number: numericValue }));
      return;
    }

    if (name === "city") {
      if (value === "" || citiesList.includes(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = () => {
    if (adminLoading) {
      toast.loading("Loading...");
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
      phone_number: formData.phone_number,
      country: formData.country,
      city: formData.city,
      password: formData.password,
      con_password: formData.con_password,
      role,
      userId,
      navigate,
      setLoading,
      setError,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-white"
      style={{
        borderRadius: 13,
        borderRradius: 13,
        paddingBottom: 25,
        display: "flex",
        justifyContent: "flex-start",
        paddingTop: 25,
        gap: 70,
      }}
    >
      {/* Top Right Buttons */}
      <div className="flex gap-2 lang-toggle">
        <LanguageDropdown
          onUpdateStateChange={(state) => setUpdateState(state)}
          style_pass={{ maxWidth: 200, marginTop: 20 }}
          thisReg={true}
          ifThis={formData.country === ""}
          setThis={setCitiesList}
        />
      </div>

      <div className="flex flex-col justify-center items-center bg-white">
        <div className="mb-6">
          <img
            src={registration_illustration}
            alt={t("registration_illustration")}
            className="h-45 w-auto"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-logo-800">
          {t("register")}
        </h2>
        <p className="text-logo-500 text-sm mb-6">
          {t("register_to_continue")}
        </p>

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
            value={{ m: t("male"), f: t("female") }[formData.sex]}
            onChange={handleChange}
            placeholder={t("select_gender")}
            options={[t("male"), t("female")]}
          />
          <CustomDropdownField
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder={formData.country || autoCountry || t("country")}
            options={countries}
            hasIconPadding={true}
          />
          <CustomDropdownField
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder={formData.city || autoCity || t("city")}
            options={citiesList}
            hasIconPadding={true}
          />
          <CustomDropdownField
            name="lang"
            value={
              { en: t("english"), am: t("amharic"), or: t("oromifa") }[
                formData.lang
              ]
            }
            onChange={handleChange}
            placeholder={t("select_language")}
            options={[t("english"), t("amharic"), t("oromifa")]}
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
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder={t("phone_number")}
            Icon={PhoneIcon}
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
              style={{ textDecoration: "underline" }}
            >
              {t("sign_in")}
            </span>
          </p>
        </form>
      </div>

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
}) => {
  return (
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
};

// Reusable Dropdown Field
const CustomDropdownField = ({
  name,
  placeholder,
  value,
  onChange,
  Icon,
  options,
  hasIconPadding = false,
}) => {
  const langValues = ["en", "am", "or"];
  const sexValues = ["m", "f"];

  const handleChange = (selectedValue) => {
    let finalValue = selectedValue;

    if (name === "lang") {
      const idx = options.indexOf(selectedValue);
      finalValue = idx !== -1 ? langValues[idx] : null;
    }
    if (name === "sex") {
      const idx = options.indexOf(selectedValue);
      finalValue = idx !== -1 ? sexValues[idx] : null;
    }

    onChange({
      target: {
        name,
        value: finalValue,
      },
    });
  };

  return (
    <div className="relative border rounded-full bg-white">
      <div className={hasIconPadding ? "" : ""}>
        <Dropdown
          options={options}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
      {/* {Icon && (
        <Icon className="w-5 h-5 text-logo-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      )} */}
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
