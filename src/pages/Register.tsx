import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../service/auth";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const showConPassword = false;

  const passwordsMatch = conPassword.length > 0 && password === conPassword;
  const passwordsMismatch = conPassword.length > 0 && password !== conPassword;
  const allRulesPassed = passwordRules.every((r) => r.test(password));

  const handleRegister = async () => {
    setError("");

    if (!username.trim() || !email.trim() || !password || !conPassword) {
      setError("FILL IN EVERYTHING!");
      return;
    }

    if (password !== conPassword) {
      setError("PASSWORDS DON'T MATCH!");
      return;
    }

    if (!allRulesPassed) {
      setError("WEAK PASSWORD! CHECK THE RULES!");
      return;
    }

    setIsLoading(true);
    try {
      await register(username.trim(), email.trim().toLowerCase(), password);
      navigate("/login", { state: { registered: true } });
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message;
      setError(msg || "BOOM! REGISTRATION FAILED. TRY AGAIN!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 font-mono antialiased selection:bg-black selection:text-white">
      {/* Halftone / Comic background pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_20%,transparent_20%)] [background-size:16px_16px]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 -rotate-3 hover:rotate-0 transition-transform duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tighter skew-x-[-4deg] drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
            JOIN THE CREW!
          </h1>
          <p className="text-sm font-bold text-black uppercase mt-1">
            Pet Finder needs heroes like you!
          </p>
        </div>

        {/* Card Main Container */}
        <div className="bg-white rounded-none border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          {/* Error Banner styled like a dramatic warning panel */}
          {error && (
            <div className="flex items-start gap-2.5 mb-6 p-4 bg-red-500 text-white border-4 border-black font-bold uppercase tracking-wide rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-0.5 shrink-0 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-1">
                Codename / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="HERO_123"
                autoComplete="username"
                autoFocus
                className="w-full px-3.5 py-2.5 text-sm border-4 border-black rounded-none bg-white font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-1">
                Secure Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="YOU@HEROHQ.COM"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm border-4 border-black rounded-none bg-white font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-1">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="********"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border-4 border-black rounded-none bg-white font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:scale-110 active:scale-95 transition-transform"
                >
                  {showPassword ? (
                    <span className="text-xs font-black bg-black text-white px-1 py-0.5 border border-black">
                      HIDE
                    </span>
                  ) : (
                    <span className="text-xs font-black bg-black text-white px-1 py-0.5 border border-black">
                      SHOW
                    </span>
                  )}
                </button>
              </div>

              {/* Password strength rules — pop-art badge layout */}
              {(passwordFocused || password.length > 0) && (
                <div className="mt-3 p-3 bg-gray-100 border-2 border-black flex flex-col gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 border-2 border-black flex items-center justify-center shrink-0 text-xs font-black ${passed ? "bg-green-400 text-black" : "bg-white"}`}
                        >
                          {passed ? "✓" : "×"}
                        </div>
                        <span
                          className={`text-xs font-bold uppercase tracking-tight ${passed ? "text-green-700 decoration-black" : "text-black"}`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-1">
                Repeat Secret Password
              </label>
              <div className="relative">
                <input
                  type={showConPassword ? "text" : "password"}
                  value={conPassword}
                  onChange={(e) => setConPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="********"
                  autoComplete="new-password"
                  className={`w-full px-3.5 py-2.5 pr-12 text-sm border-4 rounded-none bg-white font-bold text-black placeholder-gray-400 focus:outline-none transition-all duration-150 ${
                    passwordsMismatch
                      ? "border-red-500 bg-red-50 focus:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"
                      : passwordsMatch
                        ? "border-green-500 bg-green-50 focus:shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]"
                        : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                />
                {/* Custom Toggle and Status Container */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {conPassword.length > 0 && (
                    <span
                      className={`text-xs font-black px-1.5 py-0.5 border-2 border-black ${passwordsMatch ? "bg-green-400 text-black" : "bg-red-500 text-white"}`}
                    >
                      {passwordsMatch ? "MATCH" : "ERR"}
                    </span>
                  )}
                </div>
              </div>
              {passwordsMismatch && (
                <p className="text-xs font-black text-red-600 uppercase mt-1.5 tracking-tight animate-pulse">
                  ⚠️ Divergent keys! Re-verify input!
                </p>
              )}
            </div>

            {/* Dramatic Action Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-white text-md font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="animate-pulse tracking-wide">
                  INITIALIZING…
                </span>
              ) : (
                <span className="tracking-wide">CREATE ACCOUNT! BAM!</span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Footer Link */}
        <p className="text-center text-sm font-black uppercase tracking-wide text-black mt-6 drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
          Already part of the squad?{" "}
          <Link
            to="/login"
            className="text-red-600 hover:text-red-700 hover:underline decoration-4 decoration-black transition-colors"
          >
            Sign in here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
