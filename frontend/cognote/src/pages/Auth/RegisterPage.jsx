import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.register(username, email, password);
      toast.success("Registration successful! PLease login.");
      navigate("/login");
    } catch (error) {
      setError(error.message || "Failed to register. Please try again.");
      toast.error(error.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />
      <div className="relative w-full max-w-md px-6">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-xl p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg violet-500/25 mb-6">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-medium text-white tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-slate-400 text-sm">
              Register to start your journey
            </p>
          </div>

          {/*Form*/}
          <div className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "username" ? "text-violet-600" : "text-slate-400"}`}
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-violet-600 focus:bg-slate-900  focus:shadow-lg focus:shadow-violet-600/10"
                  placeholder="yourusername"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-violet-600" : "text-slate-400"}`}
                >
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-violet-600 focus:bg-slate-900  focus:shadow-lg focus:shadow-violet-600/10"
                  placeholder="yourname@gmail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-violet-600" : "text-slate-400"}`}
                >
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-violet-600 focus:bg-slate-900  focus:shadow-lg focus:shadow-violet-600/10"
                  placeholder="**********"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-600 p-3">
                <p className="text-sm text-red-600 font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 group relative w-full bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-600 hover:to-purple-400 active:scale-[0.98] text-white text-sm font-semibold rounded-xl h-12 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg violet-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-6 border-t border-slate-700/60">
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-purple-400 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
          {/* Subtext of footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
