// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { register } from "../service/auth";

// const passwordRules = [
//   { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
//   { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
//   { label: "One number", test: (p: string) => /[0-9]/.test(p) },
// ];

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [conPassword, setConPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConPassword, setShowConPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [passwordFocused, setPasswordFocused] = useState(false);

//   const navigate = useNavigate();

//   const passwordsMatch = conPassword.length > 0 && password === conPassword;
//   const passwordsMismatch = conPassword.length > 0 && password !== conPassword;
//   const allRulesPassed = passwordRules.every((r) => r.test(password));

//   const handleRegister = async () => {
//     setError("");

//     if (!username.trim() || !email.trim() || !password || !conPassword) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     if (password !== conPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (!allRulesPassed) {
//       setError("Password does not meet the requirements.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await register(username.trim(), email.trim().toLowerCase(), password);
//       navigate("/login", { state: { registered: true } });
//     } catch (err: any) {
//       console.error(err);
//       const msg = err?.response?.data?.message;
//       setError(msg || "Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") handleRegister();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans antialiased">
//       <div className="w-full max-w-sm">
//         {/* Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-md mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-7 w-7 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={1.8}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//             Create an account
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">Join Pet Finder today</p>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//           {/* Error banner */}
//           {error && (
//             <div className="flex items-start gap-2.5 mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-red-500 mt-0.5 shrink-0"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           )}

//           <div className="flex flex-col gap-5">
//             {/* Username */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Choose a username"
//                 autoComplete="username"
//                 autoFocus
//                 className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="you@example.com"
//                 autoComplete="email"
//                 className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   onFocus={() => setPasswordFocused(true)}
//                   onBlur={() => setPasswordFocused(false)}
//                   placeholder="Create a password"
//                   autoComplete="new-password"
//                   className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((p) => !p)}
//                   tabIndex={-1}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                 >
//                   {showPassword ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>

//               {/* Password strength rules — shown when field is focused or has value */}
//               {(passwordFocused || password.length > 0) && (
//                 <div className="mt-2.5 flex flex-col gap-1.5">
//                   {passwordRules.map((rule) => {
//                     const passed = rule.test(password);
//                     return (
//                       <div key={rule.label} className="flex items-center gap-2">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className={`h-3.5 w-3.5 shrink-0 transition-colors ${passed ? "text-green-500" : "text-gray-300"}`}
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2.5}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                         <span
//                           className={`text-xs transition-colors ${passed ? "text-green-600" : "text-gray-400"}`}
//                         >
//                           {rule.label}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConPassword ? "text" : "password"}
//                   value={conPassword}
//                   onChange={(e) => setConPassword(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Re-enter your password"
//                   autoComplete="new-password"
//                   className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
//                     passwordsMismatch
//                       ? "border-red-400 focus:ring-red-400"
//                       : passwordsMatch
//                         ? "border-green-400 focus:ring-green-400"
//                         : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                 />
//                 {/* Show/hide toggle */}
//                 <button
//                   type="button"
//                   onClick={() => setShowConPassword((p) => !p)}
//                   tabIndex={-1}
//                   aria-label={
//                     showConPassword ? "Hide password" : "Show password"
//                   }
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                 >
//                   {showConPassword ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   )}
//                 </button>

//                 {/* Match / mismatch icon */}
//                 {conPassword.length > 0 && (
//                   <div className="absolute right-9 top-1/2 -translate-y-1/2">
//                     {passwordsMatch ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4 text-green-500"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4 text-red-400"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                 )}
//               </div>
//               {passwordsMismatch && (
//                 <p className="text-xs text-red-500 mt-1.5">
//                   Passwords do not match.
//                 </p>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               onClick={handleRegister}
//               disabled={isLoading}
//               className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-1"
//             >
//               {isLoading && (
//                 <svg
//                   className="animate-spin h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8H4z"
//                   />
//                 </svg>
//               )}
//               {isLoading ? "Creating account…" : "Create Account"}
//             </button>
//           </div>
//         </div>

//         {/* Login link */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-blue-600 hover:text-blue-800 font-semibold transition"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

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
  const [showConPassword, setShowConPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate();

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