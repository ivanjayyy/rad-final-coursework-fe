import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ── Avatar Component ──────────────────────────────────────────────────────────
const Avatar = ({ src, username }: { src?: string; username?: string }) => {
  const [imgError, setImgError] = useState(false);
  const initial = username?.[0]?.toUpperCase() ?? "?";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={username ?? "Profile"}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-none object-cover border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-none bg-yellow-400 flex items-center justify-center text-sm font-black text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none uppercase tracking-tighter">
      {initial}
    </div>
  );
};

// ── Admin Sidebar Navbar ──────────────────────────────────────────────────────
const AdminNavbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile context window when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const adminLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: (
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
    {
      to: "/admin/posts",
      label: "Posts Manage",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      to: "/admin/users",
      label: "User Manage",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  const activeCls =
    "flex items-center gap-3 px-4 py-3 rounded-none text-sm font-black uppercase tracking-tight text-white bg-red-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 transition-all w-full text-left";

  const inactiveCls =
    "flex items-center gap-3 px-4 py-3 rounded-none text-sm font-black uppercase tracking-tight text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full text-left";

  return (
    <>
      {/* ── MOBILE HEADER (Visible only on mobile/tablet) ────────────────── */}
      <div className="md:hidden flex items-center justify-between bg-cyan-300 border-b-4 border-black h-16 px-4 fixed top-0 left-0 right-0 z-40 font-mono text-black">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="text-base font-black uppercase tracking-tighter skew-x-[-4deg] bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Paw<span className="text-red-500">HQ!</span>
          </span>
        </NavLink>

        <button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── DESKTOP SIDEBAR / MOBILE DRAWER CONTAINER ────────────────── */}
      <nav
        className={`
        fixed left-0 top-0 z-30 h-screen w-64 bg-cyan-300 font-mono text-black flex flex-col justify-between p-4 box-border transition-transform duration-200 ease-in-out
        md:translate-x-0 md:border-r-8 md:border-black
        ${mobileMenuOpen ? "translate-x-0 pt-20 border-r-8 border-black shadow-[10px_0px_0px_0px_rgba(0,0,0,0.3)]" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Top Stack: Brand Header (Hidden on Mobile view) + Navigation Items */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          {/* Brand Identity Accent Card - Hidden on Mobile panel since it's already in top bar */}
          <NavLink
            to="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="hidden md:flex items-center gap-3 group mt-2 self-start"
          >
            <div className="w-10 h-10 bg-red-500 border-4 border-black rounded-none flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform duration-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="text-lg font-black text-black uppercase tracking-tighter skew-x-[-4deg] bg-white border-2 border-black px-2 py-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Paw<span className="text-red-500">HQ!</span>
            </span>
          </NavLink>

          <div className="hidden md:block w-full h-1 bg-black" />

          {/* Action Link Stack */}
          <div className="flex flex-col gap-4 w-full">
            <p className="text-[11px] font-black uppercase tracking-widest text-black/60 px-1">
              Admin Core Engine
            </p>
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeCls : inactiveCls
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom Stack: Popover Confirm Controls + Anchor Profile Card */}
        <div className="relative w-full" ref={dropdownRef}>
          {/* Floating Identity Context Menu Panel */}
          {dropdownOpen && (
            <div className="absolute left-0 bottom-full mb-3 w-full bg-white border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-0 z-50 overflow-hidden animate-fade-in">
              {/* User credentials banner layout */}
              <div className="flex items-center gap-3 px-3 py-2.5 bg-yellow-400 border-b-4 border-black">
                <Avatar src={user?.profilePic} username={user?.username} />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-black uppercase tracking-tight text-black truncate">
                    {user?.username ?? "Admin Root"}
                  </p>
                  <p className="text-[10px] font-bold text-black/70 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Direct Profile Link Option */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setMobileMenuOpen(false);
                  navigate("/admin/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-tight text-black hover:bg-cyan-300 border-b-2 border-black transition-colors text-left cursor-pointer"
              >
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Profile
              </button>

              {/* Interactive Inline Safe Logout Block */}
              {!showLogoutConfirm ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-tight text-white bg-red-500 hover:bg-red-600 transition-colors text-left cursor-pointer"
                >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout Account
                </button>
              ) : (
                <div className="bg-yellow-400 p-2 flex flex-col gap-1.5 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-center text-black">
                    Confirm Workspace Exit?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 text-center py-1 text-[10px] font-black uppercase bg-red-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 text-center py-1 text-[10px] font-black uppercase bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Master Account Profile Access Trigger */}
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full flex items-center gap-3 bg-white border-2 border-black p-2 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer focus:outline-none"
            aria-label="Admin configuration options"
            aria-expanded={dropdownOpen}
          >
            <Avatar src={user?.profilePic} username={user?.username} />
            <div className="flex flex-col items-start text-left leading-none min-w-0 flex-1">
              <span className="text-xs font-black uppercase tracking-tight text-black truncate w-full">
                {user?.username ?? "Admin Root"}
              </span>
              <span className="text-[9px] font-bold text-gray-500 mt-0.5 truncate w-full">
                Workspace Manager
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-black stroke-[3] transition-transform duration-100 shrink-0 ${dropdownOpen ? "rotate-0" : "rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Backdrop overlay for mobile drawer layer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
};

export default AdminNavbar;
