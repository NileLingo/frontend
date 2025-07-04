import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/authSlice";
import { loginUser } from "../services/authService";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t("errors.invalidCredentials"));
      return;
    }

    try {
      dispatch(loginStart());
      const user = await loginUser(email, password);
      dispatch(loginSuccess(user));
      navigate("/translate");
    } catch (error) {
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Login failed")
      );
      setError(
        error instanceof Error ? error.message : t("errors.invalidCredentials")
      );
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-bl from-[#121212] via-[#2A2A2A] to-[#BB86FC] overflow-hidden px-4 md:px-10 flex flex-col lg:flex-row items-center justify-center">
      {/* Sound bars on the LEFT side */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Left wave bars - positioned on the left side */}
        <div className="absolute left-[7.5px] rtl:right-[7.5px] rtl:left-auto top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[37.5px] rtl:right-[37.5px] rtl:left-auto top-[380.765px] h-[70.5px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[67.5px] rtl:right-[67.5px] rtl:left-auto top-[363.5px] h-[105px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[97.5px] rtl:right-[97.5px] rtl:left-auto top-[380.765px] h-[70.5px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[127.5px] rtl:right-[127.5px] rtl:left-auto top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[157.5px] rtl:right-[157.5px] rtl:left-auto top-[413px] h-[13px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>

        {/* Right side minimal bars */}
        <div className="absolute right-[65px] rtl:left-[65px] rtl:right-auto top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute right-[42px] rtl:left-[42px] rtl:right-auto top-[407px] h-[20px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute right-[5px] rtl:left-[5px] rtl:right-auto top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
      </div>

      {/* Left Side - Welcome Back */}
      <div className="hidden lg:flex flex-col justify-center items-center ml-auto rtl:mr-auto rtl:ml-0 w-full h-full text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10"
        >
          <h2 className="text-7xl font-bold mb-6">{t("common.welcomeBack")}</h2>
          <p className="text-lg font-medium mb-10">
            {t("common.dontHaveAccount")}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/register")}
            className="px-12 py-3 border border-white rounded-2xl text-[#BB86FC] font-medium hover:bg-[#BB86FC]/10"
            size="xl"
          >
            {t("common.signUp")}
          </Button>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[60%] bg-[#1E1E1E] rounded-2xl p-8 md:p-10 z-10 lg:ml-20 rtl:lg:mr-20 rtl:lg:ml-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold text-[#BB86FC] text-center mb-8">
            {t("common.login")}
          </h1>

          <form onSubmit={handleLogin} className="space-y-6 p-5">
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("common.email")}
              fullWidth
              variant="outlined"
              className="border border-white/60 rounded-md"
            />

            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("common.password")}
              fullWidth
              variant="outlined"
              className="border border-white/60 rounded-md"
            />

            <div className="flex justify-end rtl:justify-start">
              <Link
                to="/forgot-password"
                className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors text-sm font-semibold"
              >
                {t("common.forgotPassword")}
              </Link>
            </div>

            {error && (
              <p className="text-[#CF6679] text-sm text-start rtl:text-right">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="rounded-full bg-[#BB86FC] hover:bg-[#A070DA] text-white py-3 font-semibold"
            >
              {t("common.login")}
            </Button>
          </form>

          <div className="mt-8 text-center lg:hidden">
            <p className="text-[#F5F5F5]">
              {t("common.dontHaveAccount")}{" "}
              <Link to="/register" className="text-[#BB86FC] hover:underline">
                {t("common.signUp")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
