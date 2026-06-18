import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyDetails, login } from "../service/auth";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!username.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(username.trim(), password);

      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        const responseData = await getMyDetails();
        setUser(responseData?.data);
        navigate("/");
      } else {
        setError("Login failed. Check credentials and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Check credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 font-mono antialiased text-black selection:bg-yellow-300">
      <div className="w-full max-w-md my-8">
        {/* Comic Header Brand Block */}
        <div className="text-center mb-8 transform rotate-[-1deg]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-300 border-4 border-black shadow-[4px_4px_0px_0px_#000] mb-4 transform rotate-[4deg]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-black stroke-[2.5]"
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
          <h1 className="text-4xl font-black text-black tracking-tight uppercase bg-yellow-300 border-4 border-black inline-block px-4 py-1 shadow-[4px_4px_0px_0px_#000]">
            Pet Finder
          </h1>
          <p className="text-xs font-black tracking-widest text-black/60 uppercase mt-3">
            -- SECURE ACCESS PORTAL --
          </p>
        </div>

        {/* Main Comic Panel Card */}
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] transform rotate-[0.5deg]">
          {/* Action-style Error Banner */}
          {error && (
            <div className="flex items-start gap-3 mb-6 p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] transform rotate-[-1deg]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black stroke-[3] mt-0.5 shrink-0"
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
              <div>
                <span className="text-xs font-black uppercase bg-black text-white px-1 mr-1">
                  ALERT:
                </span>
                <p className="text-xs font-black uppercase text-black inline">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Username Input Field */}
            <div>
              <label className="inline-block text-xs font-black text-black uppercase tracking-wider mb-2 bg-blue-200 border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                User Identity
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ENTER USERNAME..."
                autoComplete="username"
                autoFocus
                className="w-full px-3.5 py-3 text-xs font-black uppercase border-2 border-black bg-white text-black placeholder:text-black/30 focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_#000] focus:shadow-none transition-all"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="inline-block text-xs font-black text-black uppercase tracking-wider bg-purple-200 border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                  Passkey Secret
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:text-red-500 font-black uppercase underline decoration-2 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ENTER PASSWORD..."
                  autoComplete="current-password"
                  className="w-full px-3.5 py-3 pr-12 text-xs font-black uppercase border-2 border-black bg-white text-black placeholder:text-black/30 focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_#000] focus:shadow-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-blue-600 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 stroke-[2.5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 stroke-[2.5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Comic Action Submit Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-emerald-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              {isLoading ? "CONNECTING..." : "SIGN IN →"}
            </button>
          </div>
        </div>

        {/* Comic Footnote Sign Up Block */}
        <div className="text-center mt-6 transform rotate-[-0.5deg]">
          <p className="inline-block bg-white border-2 border-black px-4 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000]">
            NEW RECRUIT?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-red-500 underline decoration-2 ml-1 transition-colors"
            >
              CREATE AN ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
