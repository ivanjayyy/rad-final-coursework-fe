import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "../service/auth";

// ── COMIC OTP INPUT ───────────────────────────────────────────────────────────

const OtpInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const next = digits
        .map((d, idx) => (idx === i ? " " : d))
        .join("")
        .trimEnd();
      onChange(next);
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const next = digits
      .map((d, idx) => (idx === i ? ch || " " : d))
      .join("")
      .trimEnd();
    onChange(next);
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center my-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-black border-4 border-black bg-white text-black focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_#000] transition-all caret-transparent uppercase"
        />
      ))}
    </div>
  );
};

// ── SHARED UTILS / CONSTANTS ──────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-3 text-xs font-black uppercase border-2 border-black bg-white text-black placeholder:text-black/30 focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_#000] focus:shadow-none transition-all";

const labelBaseCls =
  "inline-block text-xs font-black text-black uppercase tracking-wider mb-2 border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]";

// ── STEP INDICATOR PANEL ──────────────────────────────────────────────────────

const Steps = ({ current }: { current: 1 | 2 | 3 }) => (
  <div className="flex items-center justify-center gap-1 mb-8 transform rotate-[0.5deg]">
    {[
      { n: 1, label: "EMAIL" },
      { n: 2, label: "VERIFY" },
      { n: 3, label: "RESET" },
    ].map(({ n, label }, i) => (
      <div key={n} className="flex items-center gap-1">
        {i > 0 && (
          <div
            className={`h-1 w-6 border-y-2 border-black transition-colors ${n <= current ? "bg-black" : "bg-gray-300"}`}
          />
        )}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-8 h-8 border-2 border-black text-xs font-black flex items-center justify-center transition-all ${
              n < current
                ? "bg-emerald-400 text-black shadow-[2px_2px_0px_0px_#000]"
                : n === current
                  ? "bg-yellow-300 text-black shadow-[3px_3px_0px_0px_#000] scale-105"
                  : "bg-white text-gray-400"
            }`}
          >
            {n < current ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              n
            )}
          </div>
          <span
            className={`text-[9px] font-black tracking-wider ${n <= current ? "text-black" : "text-gray-400"}`}
          >
            {label}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// ── COMIC BANNER PANEL ────────────────────────────────────────────────────────

const ErrorBanner = ({ message }: { message: string }) => (
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
        {message}
      </p>
    </div>
  </div>
);

const passwordRules = [
  { label: "MINIMUM 8 CHARACTERS", test: (p: string) => p.length >= 8 },
  { label: "ONE UPPERCASE LETTER", test: (p: string) => /[A-Z]/.test(p) },
  { label: "ONE NUMERIC DIGIT", test: (p: string) => /[0-9]/.test(p) },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    },
    [],
  );

  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetOtp(email.trim().toLowerCase());
      setStep(2);
      startCountdown();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to send OTP. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtp("");
    setIsLoading(true);
    try {
      await sendPasswordResetOtp(email.trim().toLowerCase());
      startCountdown();
    } catch {
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    if (otp.replace(/\s/g, "").length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyPasswordResetOtp(
        email.trim().toLowerCase(),
        otp.replace(/\s/g, ""),
      );
      setStep(3);
    } catch (err: any) {
      setOtpError(
        err?.response?.data?.message || "Incorrect OTP. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const allRulesPassed = passwordRules.every((r) => r.test(newPassword));
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (!allRulesPassed) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(
        email.trim().toLowerCase(),
        otp.replace(/\s/g, ""),
        newPassword,
      );
      navigate("/login", { state: { passwordReset: true } });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 font-mono antialiased text-black selection:bg-yellow-300">
      <div className="w-full max-w-md my-8">
        {/* Comic Header Brand Block */}
        <div className="text-center mb-8 transform rotate-[-1deg]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-300 border-4 border-black shadow-[4px_4px_0px_0px_#000] mb-4 transform rotate-[4deg]">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight uppercase bg-yellow-300 border-4 border-black inline-block px-4 py-1 shadow-[4px_4px_0px_0px_#000]">
            RECOVERY MODE
          </h1>
          <p className="text-xs font-black tracking-widest text-black/60 uppercase mt-3 px-4 max-w-xs mx-auto leading-relaxed">
            {step === 1 && "[ STEP 1: TRANSMIT VERIFICATION KEY ]"}
            {step === 2 && "[ STEP 2: FIELD CODE CONFIRMATION ]"}
            {step === 3 && "[ STEP 3: ESTABLISH NEW CIPHER ]"}
          </p>
        </div>

        {/* Step Indicator Panel Layout */}
        <Steps current={step} />

        {/* Main Comic Panel Card */}
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] transform rotate-[0.5deg]">
          {/* ── STEP 1: EMAIL PANEL ───────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              {error && <ErrorBanner message={error} />}

              <div>
                <label className={`${labelBaseCls} bg-blue-200`}>
                  Registered Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendOtp();
                  }}
                  placeholder="YOU@EXAMPLE.COM"
                  autoFocus
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 bg-cyan-300 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
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
                {isLoading ? "SENDING..." : "DISPATCH CODE →"}
              </button>
            </div>
          )}

          {/* ── STEP 2: OTP VERIFY PANEL ──────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="text-center bg-amber-100 border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] transform rotate-[-0.5deg]">
                <p className="text-xs font-black uppercase leading-tight text-black">
                  CODE ISSUED TO: <br />
                  <span className="text-blue-600 underline bg-white px-1 border border-black inline-block mt-1 font-mono">
                    {email}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setOtpError("");
                  }}
                  className="text-[10px] text-red-500 hover:text-black font-black uppercase mt-2 block mx-auto underline tracking-wider"
                >
                  [ CHANGE TARGET EMAIL ]
                </button>
              </div>

              <div>
                <label className="block text-center text-xs font-black uppercase tracking-wider mb-2">
                  -- ENTER 6-DIGIT INTERCEPT KEY --
                </label>
                <OtpInput value={otp} onChange={setOtp} />
              </div>

              {otpError && (
                <div className="p-2 bg-red-100 border-2 border-black text-center text-xs font-black uppercase text-red-600">
                  ⚠️ {otpError}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.replace(/\s/g, "").length < 6}
                className="w-full py-3 bg-emerald-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
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
                {isLoading ? "VERIFYING..." : "AUTHORIZE KEY ✓"}
              </button>

              {/* Comic Box Countdown / Resend Panel */}
              <div className="flex items-center justify-center p-2.5 bg-gray-100 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                {countdown > 0 ? (
                  <div className="flex items-center gap-2 text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 stroke-[2.5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>RESEND LOCKED: {countdown}S</span>
                  </div>
                ) : (
                  <div className="text-black">
                    SIGNAL LOST?{" "}
                    <button
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-red-500 font-black underline decoration-2 ml-1 disabled:opacity-50"
                    >
                      REQUEST NEW CODE
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: RESET CIPHER PANEL ────────────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              {error && <ErrorBanner message={error} />}

              {/* New password input block */}
              <div>
                <label className={`${labelBaseCls} bg-purple-200`}>
                  New Password Cipher
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleResetPassword();
                    }}
                    placeholder="NEW CRYPTO SECRET..."
                    autoComplete="new-password"
                    autoFocus
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-blue-600 p-1"
                  >
                    {showNew ? (
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

                {/* Comic Requirement Checklist */}
                {(passwordFocused || newPassword.length > 0) && (
                  <div className="mt-3 p-3 bg-stone-50 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex flex-col gap-2 transform rotate-[-0.5deg]">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(newPassword);
                      return (
                        <div
                          key={rule.label}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-4 h-4 border-2 border-black flex items-center justify-center text-[10px] font-black ${passed ? "bg-emerald-400 text-black" : "bg-white text-transparent"}`}
                          >
                            ✓
                          </div>
                          <span
                            className={`text-[10px] font-black tracking-wide ${passed ? "text-emerald-700 line-through decoration-2" : "text-black/50"}`}
                          >
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm password input block */}
              <div>
                <label className={`${labelBaseCls} bg-orange-200`}>
                  Re-Type Cipher
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleResetPassword();
                    }}
                    placeholder="CONFIRM CRYPTO SECRET..."
                    className={`w-full px-3.5 py-3 pr-16 text-xs font-black uppercase border-2 border-black text-black placeholder:text-black/30 focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_#000] focus:shadow-none transition-all ${
                      passwordsMismatch
                        ? "bg-red-50 border-red-500"
                        : passwordsMatch
                          ? "bg-emerald-50 border-emerald-500"
                          : "bg-white"
                    }`}
                  />

                  {/* Absolute control buttons wrapper */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-transparent">
                    {confirmPassword.length > 0 && (
                      <div className="font-black text-xs">
                        {passwordsMatch ? (
                          <span className="bg-emerald-400 text-black border-2 border-black px-1 shadow-[1px_1px_0px_0px_#000]">
                            OK
                          </span>
                        ) : (
                          <span className="bg-red-400 text-black border-2 border-black px-1 shadow-[1px_1px_0px_0px_#000]">
                            ERR
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      tabIndex={-1}
                      className="text-black hover:text-blue-600 p-0.5"
                    >
                      {showConfirm ? (
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
                {passwordsMismatch && (
                  <p className="text-[11px] font-black uppercase text-red-600 mt-2 pl-1">
                    Mismatch detected! Match strings perfectly.
                  </p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading || !allRulesPassed || !passwordsMatch}
                className="w-full py-3 bg-yellow-300 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
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
                {isLoading ? "OVERWRITING..." : "OVERWRITE PASSPHRASE ⚡"}
              </button>
            </div>
          )}
        </div>

        {/* Comic Footnote Back to Login */}
        <div className="text-center mt-6 transform rotate-[-0.5deg]">
          <p className="inline-block bg-white border-2 border-black px-4 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000]">
            MEMORIES RETURNED?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-red-500 underline decoration-2 ml-1 transition-colors"
            >
              ABORT AND SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
