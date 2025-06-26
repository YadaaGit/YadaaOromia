import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import login_illustration from "@/assets/images/login.jpg";
import { handleSignIn, handleForgotPassword } from "@/utils/auth_service.js";
import PopUp from "@/components/basic_ui/pop_up.jsx";
import Loading from "@/components/basic_ui/Loading.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error != "") {
      setShowError(true);
      console.log(`ERROR: ${error}`);
    }
  }, [error]);
  useEffect(() => {
    if (success != "") {
      setShowSuccess(true);
    }
  }, [success]);

  const onLogin = () => {
    handleSignIn({
      email,
      password,
      navigate,
      setLoading,
      setError,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword(value);
  };

  const onForgotPassword = () => {
    handleForgotPassword(email, setError, setSuccess);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-white"
      style={{ borderRadius: 13, paddingBottom: "20px" }}
    >
      <div className="mb-6">
        <img
          src={login_illustration}
          alt="Login Illustration"
          className="h-45 w-auto"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2 text-gray-800">Login</h2>
      <p className="text-gray-500 text-sm mb-6">Please sign in to continue.</p>

      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        <PasswordField
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          show={showPassword}
          setShow={setShowPassword}
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {success && (
          <p className="text-sm text-green-500 text-center">{success}</p>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-full font-semibold shadow-md transition ${
            loading
              ? "bg-gray-400"
              : "bg-indigo-500 hover:bg-indigo-700 text-white"
          }`}
          onClick={onLogin}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-indigo-600 underline w-full text-center"
        >
          Forgot password?
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            className="txt_color_main font-medium cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
        <PopUp
          show={showError}
          onClose={() => {
            setShowError(false);
          }}
          message={error}
          type="error"
        />
        <PopUp
          show={showSuccess}
          onClose={() => {
            setShowSuccess(false);
          }}
          message={success}
          type="success"
        />
      </form>
      {loading && <Loading />}
    </div>
  );
}

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
      <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      <Icon
        className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShow(!show)}
      />
    </div>
  );
};
