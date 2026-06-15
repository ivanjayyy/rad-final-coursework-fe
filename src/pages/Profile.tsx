import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { updateUser, sendEmailOtp, verifyEmailOtp } from "../service/user";
import { getMyDetails } from "../service/auth";

// Fix leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ── Types ─────────────────────────────────────────────────────────────────────

interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    suburb?: string;
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    country?: string;
  };
}

// ── Map subcomponents ─────────────────────────────────────────────────────────

const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const MapClickHandler = ({
  onPick,
}: {
  onPick: (coords: [number, number], label: string) => void;
}) => {
  useMapEvents({
    async click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        );
        const data: NominatimResponse = await res.json();
        onPick([lat, lng], buildAddress(data));
      } catch {
        onPick([lat, lng], `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    },
  });
  return null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildAddress = (data: NominatimResponse): string => {
  const addr = data.address;
  if (!addr) return data.display_name.split(",").slice(0, 3).join(", ");
  const parts: string[] = [];
  const local = addr.village || addr.town || addr.suburb || addr.city;
  if (local) parts.push(local);
  if (addr.county) parts.push(addr.county.replace(/\sDistrict$/i, ""));
  if (addr.country) parts.push(addr.country);
  return parts.length
    ? parts.join(", ")
    : data.display_name.split(",").slice(0, 3).join(", ");
};

// ── OTP input component ───────────────────────────────────────────────────────

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
    <div className="flex gap-2 justify-center">
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
          className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-gray-900 caret-transparent"
        />
      ))}
    </div>
  );
};

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

// ── Main Component ────────────────────────────────────────────────────────────

const Profile = () => {
  const navigate = useNavigate();

  // Profile fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [mapCoords, setMapCoords] = useState<[number, number]>([
    6.9271, 79.8612,
  ]);
  const [locationSuggestions, setLocationSuggestions] = useState<
    NominatimResponse[]
  >([]);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Original values (to detect email change)
  const [originalEmail, setOriginalEmail] = useState("");

  // Email OTP flow
  const [otpStep, setOtpStep] = useState<
    "idle" | "sending" | "verifying" | "verified"
  >("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch profile ───────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyDetails();
        const u = data.data;
        setUsername(u.username ?? "");
        setEmail(u.email ?? "");
        setOriginalEmail(u.email ?? "");
        if (u.location) {
          setLocation(u.location);
          // Try to geocode saved location
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(u.location)}&limit=1`,
          )
            .then((r) => r.json())
            .then((res: NominatimResponse[]) => {
              if (res[0])
                setMapCoords([parseFloat(res[0].lat), parseFloat(res[0].lon)]);
            })
            .catch(() => {});
        }
      } catch {
        alert("Session expired. Redirecting to login…");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // ── Location autocomplete ───────────────────────────────────────────────────

  useEffect(() => {
    if (!isEditing || location.trim().length < 3) {
      setLocationSuggestions([]);
      return;
    }
    const already = locationSuggestions.some(
      (s) => buildAddress(s) === location,
    );
    if (already) return;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(location)}`,
        );
        setLocationSuggestions(await res.json());
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [location, isEditing]);

  // ── Countdown timer ─────────────────────────────────────────────────────────

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

  useEffect(
    () => () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    },
    [],
  );

  // ── OTP flow ────────────────────────────────────────────────────────────────

  const handleRequestOtp = async () => {
    setOtpStep("sending");
    setOtpError("");
    try {
      await sendEmailOtp(originalEmail); // sends OTP to the current/old email
      setOtpStep("verifying");
      startCountdown();
    } catch {
      setOtpError("Failed to send OTP. Please try again.");
      setOtpStep("idle");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.replace(/\s/g, "").length < 6) {
      setOtpError("Enter all 6 digits.");
      return;
    }
    setOtpError("");
    try {
      await verifyEmailOtp(originalEmail, otp.replace(/\s/g, ""));
      setOtpStep("verified");
    } catch {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  const emailChanged = email !== originalEmail;

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      alert("Username and email are required.");
      return;
    }
    if (emailChanged && otpStep !== "verified") {
      alert("Please verify your new email with the OTP first.");
      return;
    }
    setSaving(true);
    try {
      await updateUser(username, email, location);
      setOriginalEmail(email);
      setIsEditing(false);
      setOtpStep("idle");
      setOtp("");
    } catch {
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setOtpStep("idle");
    setOtp("");
    setOtpError("");
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(0);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
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
          <p className="text-sm text-gray-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your account details
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition"
              >
                {saving && (
                  <svg
                    className="animate-spin h-3.5 w-3.5"
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
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Avatar + name card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0 select-none">
            {username ? username[0].toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{username || "—"}</p>
            <p className="text-sm text-gray-500">{email || "—"}</p>
            {location && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </p>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Account Details
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={username}
                disabled={!isEditing}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Reset OTP state if email is edited again
                    if (otpStep === "verified") {
                      setOtpStep("idle");
                      setOtp("");
                    }
                  }}
                  placeholder="you@example.com"
                  className={`${inputClass} ${isEditing && emailChanged && otpStep !== "verified" ? "border-amber-400 focus:ring-amber-400" : ""} ${otpStep === "verified" ? "border-green-400 focus:ring-green-400 pr-10" : ""}`}
                />
                {otpStep === "verified" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* OTP trigger */}
              {isEditing && emailChanged && otpStep === "idle" && (
                <div className="mt-2 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <svg
                    className="h-4 w-4 text-amber-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-amber-700 flex-1">
                    Email changed — verify with a one-time code sent to your
                    current email.
                  </p>
                  <button
                    onClick={handleRequestOtp}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 whitespace-nowrap transition"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {/* Sending spinner */}
              {otpStep === "sending" && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-blue-500"
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
                  Sending code to{" "}
                  <span className="font-medium text-gray-700 ml-0.5">
                    {originalEmail}
                  </span>
                  …
                </div>
              )}

              {/* OTP entry */}
              {otpStep === "verifying" && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      Enter verification code
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sent to{" "}
                      <span className="font-medium text-gray-700">
                        {originalEmail}
                      </span>
                    </p>
                  </div>

                  <OtpInput value={otp} onChange={setOtp} />

                  {otpError && (
                    <p className="text-xs text-red-500 text-center">
                      {otpError}
                    </p>
                  )}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.replace(/\s/g, "").length < 6}
                    className="w-full py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
                  >
                    Verify Code
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    {countdown > 0 ? (
                      <>
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Resend in {countdown}s
                      </>
                    ) : (
                      <button
                        onClick={handleRequestOtp}
                        className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 transition"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Verified badge */}
              {otpStep === "verified" && (
                <div className="mt-2 flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <svg
                    className="h-4 w-4 text-green-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-green-700 font-medium">
                    Email verified — save changes to apply.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Location
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="relative">
              <label className={labelClass}>Your Area</label>
              <input
                type="text"
                value={location}
                disabled={!isEditing}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search for your city or town…"
                className={inputClass}
              />
              {isEditing && locationSuggestions.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
                  {locationSuggestions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        const label = buildAddress(item);
                        setLocation(label);
                        setMapCoords([
                          parseFloat(item.lat),
                          parseFloat(item.lon),
                        ]);
                        setLocationSuggestions([]);
                      }}
                      className="px-3 py-2.5 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-gray-800">
                        {buildAddress(item)}
                      </span>
                      <span className="block text-xs text-gray-400 truncate">
                        {item.display_name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Map */}
            <div
              className={`rounded-lg overflow-hidden border border-gray-200 transition-opacity ${!isEditing ? "opacity-70 pointer-events-none" : ""}`}
              style={{ height: "240px", position: "relative", zIndex: 0 }}
            >
              <MapContainer
                center={mapCoords}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCoords} />
                {isEditing && (
                  <MapClickHandler
                    onPick={(coords, label) => {
                      setMapCoords(coords);
                      setLocation(label);
                      setLocationSuggestions([]);
                    }}
                  />
                )}
                <ChangeMapCenter center={mapCoords} />
              </MapContainer>
            </div>

            {isEditing && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Search above or click the map to set your location.
              </p>
            )}
          </div>
        </div>

        {/* Save footer (mobile-friendly sticky) */}
        {isEditing && (
          <div className="flex gap-3 pb-8">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 text-sm font-semibold text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (emailChanged && otpStep !== "verified")}
              className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition flex items-center justify-center gap-2"
            >
              {saving && (
                <svg
                  className="animate-spin h-4 w-4"
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
              {saving
                ? "Saving…"
                : emailChanged && otpStep !== "verified"
                  ? "Verify email first"
                  : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
