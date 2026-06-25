import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ── Avatar ────────────────────────────────────────────────────────────────────

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

  // Placeholder — Hard high-contrast comic fill
  return (
    <div className="w-10 h-10 rounded-none bg-yellow-400 flex items-center justify-center text-sm font-black text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none uppercase tracking-tighter">
      {initial}
    </div>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setShowLogoutConfirm(false); // <-- Reset confirm state here
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

  const navLinks = [
    {
      to: "/posts",
      label: "Posts",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      to: "/bookmarks",
      label: "Bookmarks",
      icon: (
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
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
    },
    {
      to: "/my-posts",
      label: "My Posts",
      icon: (
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
      ),
    },
  ];

  // Active styles: Red comic background with 3D black shadow
  const activeCls =
    "flex items-center gap-2 px-4 py-2 rounded-none text-sm font-black uppercase tracking-tight text-white bg-red-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 transition-all";

  // Inactive styles: Flat, minimal, heavy color highlight on hover
  const inactiveCls =
    "flex items-center gap-2 px-4 py-2 rounded-none text-sm font-black uppercase tracking-tight text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all";

  return (
    <nav className="bg-cyan-300 border-b-8 border-black sticky top-0 z-40 font-mono text-black">
      {/* Decorative top strip */}
      <div className="h-1 bg-black w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Brand — left */}
          <NavLink
            to="/"
            className="flex items-center gap-3 shrink-0 mr-auto group"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-black text-black uppercase tracking-tighter skew-x-[-4deg] bg-white border-2 border-black px-2.5 py-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hidden sm:block">
              Paw<span className="text-red-500">Link!</span>
            </span>
          </NavLink>

          {/* Desktop — nav links + avatar */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? activeCls : inactiveCls
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}

            {/* Heavy Mechanical Divider */}
            <div className="w-1.5 h-8 bg-black mx-1" />

            {/* Avatar Selector Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-3 bg-white border-2 border-black p-1.5 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer focus:outline-none"
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
              >
                <Avatar src={user?.profilePic} username={user?.username} />
                <div className="hidden lg:flex flex-col items-start text-left leading-none">
                  <span className="text-sm font-black uppercase tracking-tight text-black">
                    {user?.username ?? "Account"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 mt-0.5 truncate max-w-[110px]">
                    {user?.email}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-black stroke-[3] transition-transform duration-100 ${dropdownOpen ? "rotate-180" : ""}`}
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

              {/* Dropdown menu panel */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-0 z-50 overflow-hidden animate-fade-in">
                  {/* User info panel wrapper */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-yellow-400 border-b-4 border-black">
                    <Avatar src={user?.profilePic} username={user?.username} />
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-black uppercase tracking-tight text-black truncate">
                        {user?.username}
                      </p>
                      <p className="text-[10px] font-bold text-black/70 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Options Stack */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-tight text-black hover:bg-cyan-300 border-b-2 border-black transition-colors text-left"
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

                  {!showLogoutConfirm ? (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-tight text-white bg-red-500 hover:bg-red-600 transition-colors text-left cursor-pointer"
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
                      Logout
                    </button>
                  ) : (
                    <div className="bg-yellow-400 border-t-2 border-black p-2 flex flex-col gap-1.5 transition-all">
                      <p className="text-[11px] font-black uppercase tracking-tighter text-center text-black">
                        Are you sure you want to exit?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleLogout}
                          className="flex-1 text-center py-1 text-xs font-black uppercase bg-red-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 text-center py-1 text-xs font-black uppercase bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu controller */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="p-2.5 bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black focus:outline-none"
              aria-label="Toggle menu"
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
        </div>
      </div>

      {/* Mobile Menu Panel Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-black bg-yellow-400 px-4 py-4 flex flex-col gap-2 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]">
          {/* User profile details header card */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
            <Avatar src={user?.profilePic} username={user?.username} />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-base font-black uppercase tracking-tight text-black truncate">
                {user?.username}
              </p>
              <p className="text-xs font-bold text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <p className="text-[11px] font-black uppercase tracking-widest text-black/60 px-1 pt-1">
            Navigation Core
          </p>

          {/* Nav links block */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => (isActive ? activeCls : inactiveCls)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <div className="border-t-2 border-black my-2" />

          {/* Profile operations buttons context */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/profile");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-sm font-black uppercase tracking-tight text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-full text-left hover:bg-cyan-300"
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

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 border-2 border-black text-sm font-black uppercase tracking-tight text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-full text-left hover:bg-red-600"
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
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
