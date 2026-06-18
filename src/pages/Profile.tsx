import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser, changeProfileImage } from "../service/user"; // Imported changeProfileImage
import { getMyDetails } from "../service/auth";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // ── Fetch profile ───────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyDetails();
        const u = data.data;
        setUsername(u.username ?? "");
        setEmail(u.email ?? "");
        setProfilePic(u.profilePic ?? null); // Assuming backend returns profilePic field

        if (u.roles.includes("ADMIN")) {
          setRole("ADMIN");
        } else if (u.roles.includes("MOD")) {
          setRole("MOD");
        } else if (u.roles.includes("USER")) {
          setRole("USER");
        }
      } catch {
        alert("Session expired. Redirecting to login…");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // ── Profile Picture Upload Handler ──────────────────────────────────────────

  const handleAvatarClick = () => {
    // Only allow uploading if we are in edit mode
    if (!isEditing) {
      alert("Click 'Edit Profile' first to change your profile picture!");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional client-side verification
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setUploadingImg(true);
    try {
      // Call service function just like the post creation page
      await changeProfileImage(file);

      // Update local state to preview the uploaded image instantly
      const localUrl = URL.createObjectURL(file);
      setProfilePic(localUrl);
    } catch {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImg(false);
    }
  };

  // ── Save Details ────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      alert("Username and email are required.");
      return;
    }
    setSaving(true);
    try {
      await updateUser(username, email);
      setIsEditing(false);
    } catch {
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="bg-white border-4 border-black p-6 font-mono font-black text-xl tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
          Loading profile...
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-yellow-50 font-mono antialiased p-4 sm:p-8 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Header Hero Box */}
        <div className="bg-purple-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform -rotate-1">
          <div className="absolute right-0 top-0 bg-yellow-400 border-b-4 border-l-4 border-black px-4 py-1 font-black uppercase tracking-tight text-xs sm:text-sm">
            ID: ACCOUNT_PANEL
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase [text-shadow:2px_2px_0_#fff]">
            My Profile
          </h1>
          <p className="text-black font-bold mt-1 text-sm bg-white inline-block px-2 border-2 border-black">
            Manage your credentials below
          </p>
        </div>

        {/* Big Profile Picture Box */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
          {/* Avatar Thumbnail Wrapper */}
          <div
            onClick={handleAvatarClick}
            className={`w-40 h-40 sm:w-48 sm:h-48 border-4 border-black bg-cyan-300 flex items-center justify-center text-6xl sm:text-7xl font-black text-black shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none uppercase relative overflow-visible ${
              isEditing ? "cursor-pointer hover:bg-cyan-200 group" : ""
            }`}
          >
            {uploadingImg ? (
              <span className="text-sm font-black animate-pulse tracking-tighter">
                UPLOADING...
              </span>
            ) : profilePic ? (
              <img
                src={profilePic}
                alt="Profile Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : username ? (
              username[0]
            ) : (
              "?"
            )}

            {/* Hover overlay for edit indicator */}
            {isEditing && !uploadingImg && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs font-black bg-black border-2 border-white px-2 py-1 uppercase tracking-tight scale-90 group-hover:scale-100 transition-transform">
                  Change Pic
                </span>
              </div>
            )}

            {/* Neo-brutalist Role Badge */}
            <div className="absolute -bottom-3 -right-3 bg-red-500 border-2 border-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-tight rotate-12 shadow-[2px_2px_0px_#000]">
              {role}
            </div>
          </div>

          {/* Account Identity Labels */}
          <div className="flex-1 w-full space-y-3">
            <div className="bg-yellow-300 border-2 border-black p-2 font-black text-xl sm:text-2xl truncate text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {username || "—"}
            </div>
            <div className="bg-gray-100 border-2 border-black p-2 font-bold text-sm sm:text-md truncate text-gray-700">
              {email || "—"}
            </div>
          </div>
        </div>

        {/* Account Details Form Block */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black text-white px-6 py-3 font-black uppercase tracking-wider text-sm flex items-center justify-between">
            <span>Account Details</span>
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block border border-white"></span>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                disabled={!isEditing}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="YOUR USERNAME"
                className="w-full px-4 py-3 text-base border-4 border-black bg-white text-black placeholder-gray-400 font-bold tracking-wide focus:outline-none focus:bg-yellow-50 transition disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed shadow-[inset_4px_4px_0px_rgba(0,0,0,0.05)]"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOU@EXAMPLE.COM"
                className="w-full px-4 py-3 text-base border-4 border-black bg-white text-black placeholder-gray-400 font-bold tracking-wide focus:outline-none focus:bg-yellow-50 transition disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed shadow-[inset_4px_4px_0px_rgba(0,0,0,0.05)]"
              />
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-4 text-md font-black text-black border-4 border-black bg-cyan-400 hover:bg-cyan-300 transition uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={saving || uploadingImg}
                className="w-full sm:flex-1 py-4 text-md font-black text-black border-4 border-black bg-white hover:bg-gray-100 transition uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingImg}
                className="w-full sm:flex-1 py-4 text-md font-black text-white border-4 border-black bg-red-500 hover:bg-red-600 transition uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
