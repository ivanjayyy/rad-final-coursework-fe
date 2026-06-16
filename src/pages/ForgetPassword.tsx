import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetOtp, verifyPasswordResetOtp, resetPassword } from "../service/auth";

// ── OTP Input ─────────────────────────────────────────────────────────────────

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
      const next = digits.map((d, idx) => (idx === i ? " " : d)).join("").trimEnd();
      onChange(next);
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, idx) => (idx === i ? ch || " " : d)).join("").trimEnd();
    onChange(next);
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-gray-900 caret-transparent"
        />
      ))}
    </div>
  );
};

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";

// ── Step indicator ────────────────────────────────────────────────────────────

const Steps = ({ current }: { current: 1 | 2 | 3 }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[
      { n: 1, label: "Email" },
      { n: 2, label: "Verify" },
      { n: 3, label: "Reset" },
    ].map(({ n, label }, i) => (
      <div key={n} className="flex items-center gap-2">
        {i > 0 && (
          <div className={`h-px w-8 transition-colors ${n <= current ? "bg-blue-500" : "bg-gray-200"}`} />
        )}
        <div className="flex flex-col items-center gap-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            n < current
              ? "bg-blue-600 text-white"
              : n === current
              ? "bg-blue-600 text-white ring-4 ring-blue-100"
              : "bg-gray-100 text-gray-400"
          }`}>
            {n < current ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : n}
          </div>
          <span className={`text-[10px] font-medium ${n <= current ? "text-blue-600" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// ── Error banner ──────────────────────────────────────────────────────────────

const ErrorBanner = ({ message }: { message: string }) => (
  <div className="flex items-start gap-2.5 mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-sm text-red-700">{message}</p>
  </div>
);

// ── Password strength ─────────────────────────────────────────────────────────

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

// ── ForgotPassword ────────────────────────────────────────────────────────────

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Steps: 1 = enter email, 2 = enter OTP, 3 = new password
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [email, setEmail] = useState("");

  // Step 2
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Step 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Shared
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }

    setIsLoading(true);
    try {
      await sendPasswordResetOtp(email.trim().toLowerCase());
      setStep(2);
      startCountdown();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
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

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────

  const handleVerifyOtp = async () => {
    setOtpError("");
    if (otp.replace(/\s/g, "").length < 6) { setOtpError("Please enter all 6 digits."); return; }

    setIsLoading(true);
    try {
      await verifyPasswordResetOtp(email.trim().toLowerCase(), otp.replace(/\s/g, ""));
      setStep(3);
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || "Incorrect OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset password ────────────────────────────────────────────────

  const allRulesPassed = passwordRules.every((r) => r.test(newPassword));
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) { setError("Please fill in both password fields."); return; }
    if (!allRulesPassed) { setError("Password does not meet the requirements."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase(), otp.replace(/\s/g, ""), newPassword);
      navigate("/login", { state: { passwordReset: true } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-md mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reset password</h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 && "We'll send a verification code to your email."}
            {step === 2 && "Enter the code we sent to your email."}
            {step === 3 && "Choose a new password for your account."}
          </p>
        </div>

        {/* Step indicator */}
        <Steps current={step} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* ── Step 1: Email ─────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {error && <ErrorBanner message={error} />}

              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendOtp(); }}
                  placeholder="you@example.com"
                  autoFocus
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isLoading ? "Sending…" : "Send verification code"}
              </button>
            </div>
          )}

          {/* ── Step 2: OTP ───────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Code sent to{" "}
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <button
                  onClick={() => { setStep(1); setOtp(""); setOtpError(""); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-0.5 transition"
                >
                  Change email
                </button>
              </div>

              <OtpInput value={otp} onChange={setOtp} />

              {otpError && (
                <p className="text-xs text-red-500 text-center">{otpError}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.replace(/\s/g, "").length < 6}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isLoading ? "Verifying…" : "Verify code"}
              </button>

              {/* Resend */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                {countdown > 0 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    Didn't receive it?{" "}
                    <button
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 transition disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: New password ──────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              {error && <ErrorBanner message={error} />}

              {/* New password */}
              <div>
                <label className={labelCls}>New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleResetPassword(); }}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    autoFocus
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showNew ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Strength checklist */}
                {(passwordFocused || newPassword.length > 0) && (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(newPassword);
                      return (
                        <div key={rule.label} className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 shrink-0 transition-colors ${passed ? "text-green-500" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-xs transition-colors ${passed ? "text-green-600" : "text-gray-400"}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className={labelCls}>Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleResetPassword(); }}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    className={`${inputCls} pr-10 ${
                      passwordsMismatch ? "border-red-400 focus:ring-red-400" : passwordsMatch ? "border-green-400 focus:ring-green-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Match icon */}
                  {confirmPassword.length > 0 && (
                    <div className="absolute right-9 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {passwordsMismatch && (
                  <p className="text-xs text-red-500 mt-1.5">Passwords do not match.</p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading || !allRulesPassed || !passwordsMatch}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isLoading ? "Resetting…" : "Reset password"}
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered it?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;