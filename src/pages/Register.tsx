import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../features/auth/authSlice";
import { registerUser } from "../services/authService";
import { motion } from "framer-motion";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!email.includes("@")) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      dispatch(registerStart());
      const user = await registerUser(username, email, password);
      dispatch(registerSuccess(user));
      navigate("/translate");
    } catch (error) {
      dispatch(
        registerFailure(
          error instanceof Error ? error.message : "Registration failed"
        )
      );
      setErrors({
        form: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-bl from-[#121212] via-[#1E1E1E] to-[#BB86FC] overflow-hidden px-4 md:px-10 flex flex-col lg:flex-row items-center justify-center">
      {/* Sound bars on the LEFT side */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Left wave bars - positioned on the left side */}
        <div className="absolute left-[7.5px] top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[37.5px] top-[380.765px] h-[70.5px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[67.5px] top-[363.5px] h-[105px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[97.5px] top-[380.765px] h-[70.5px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[127.5px] top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute left-[157.5px] top-[413px] h-[13px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>

        {/* Right side minimal bars */}
        <div className="absolute right-[65px] top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute right-[42px] top-[407px] h-[20px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute right-[5px] top-[395px] h-[42px] w-[15px] bg-white bg-opacity-40 rounded-full"></div>
      </div>

      {/* Left Side - Register Form */}
      <div className="w-full lg:w-[60%] bg-[#1E1E1E] rounded-2xl p-8 md:p-10 z-10 lg:ml-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold text-[#BB86FC] text-center mb-8">
            Register
          </h1>

          <form onSubmit={handleRegister} className="space-y-8 p-5">
            <div className="flex flex-col md:flex-row gap-9">
              <TextField
                placeholder="Username"
                value={username}
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
                className="flex-1 border border-white/60 rounded-md"
              />
              <TextField
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                variant="outlined"
                className="flex-1 border border-white/60 rounded-md"
              />
            </div>
            <TextField
              type="password"
              placeholder="Password"
              value={password}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              className="w-full border border-white/60 rounded-md"
            />
            <TextField
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              variant="outlined"
              className="w-full border border-white/60 rounded-md"
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors text-sm font-semibold"
              >
                Forget password?
              </Link>
            </div>

            {errors.form && (
              <p className="text-[#CF6679] text-sm">{errors.form}</p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full bg-[#BB86FC] hover:bg-[#A070DA] text-white py-3 font-semibold mt-8"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center lg:hidden">
            <p className="text-[#F5F5F5]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#BB86FC] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="hidden lg:flex flex-col justify-center items-center ml-auto w-full h-full text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10"
        >
          <h2 className="text-7xl font-bold mb-6">Hello Friend</h2>
          <p className="text-lg font-medium mb-10">Already have an account?</p>
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="px-12 py-3 border border-white rounded-2xl text-[#BB86FC] font-medium hover:bg-[#BB86FC]/10"
            size="xl"          >
            login
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;