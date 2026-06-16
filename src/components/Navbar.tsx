// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const isLoggedIn = !!user;

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     setUser(null);
//     setMobileMenuOpen(false);
//     navigate("/login");
//   };

//   const navLinks = [
//     {
//       to: "/home",
//       label: "Home",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//           />
//         </svg>
//       ),
//     },
//     {
//       to: "/bookmarks",
//       label: "Bookmarks",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//           />
//         </svg>
//       ),
//     },
//     {
//       to: "/profile",
//       label: "Profile",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//           />
//         </svg>
//       ),
//     },
//   ];

//   const activeLinkClass =
//     "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50";
//   const inactiveLinkClass =
//     "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors";

//   return (
//     <>
//       <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Brand */}
//             <NavLink to="/home" className="flex items-center gap-2.5 shrink-0">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4\.5 w-4\.5 text-white h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={1.8}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                   />
//                 </svg>
//               </div>
//               <span className="text-base font-bold text-gray-900 tracking-tight">
//                 Pet Finder
//               </span>
//             </NavLink>

//             {/* Desktop nav links */}
//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map((link) => (
//                 <NavLink
//                   key={link.to}
//                   to={link.to}
//                   className={({ isActive }) =>
//                     isActive ? activeLinkClass : inactiveLinkClass
//                   }
//                 >
//                   {link.icon}
//                   {link.label}
//                 </NavLink>
//               ))}
//             </div>

//             {/* Desktop auth button + avatar */}
//             <div className="hidden md:flex items-center gap-3">
//               {isLoggedIn ? (
//                 <>
//                   {/* Avatar */}
//                   <NavLink
//                     to="/profile"
//                     className="flex items-center gap-2 group"
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white select-none group-hover:ring-2 group-hover:ring-blue-300 transition">
//                       {user?.username?.[0]?.toUpperCase() ?? "U"}
//                     </div>
//                     <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition">
//                       {user?.username}
//                     </span>
//                   </NavLink>

//                   {/* Logout */}
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
//                   >
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
//                         d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                       />
//                     </svg>
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <NavLink
//                   to="/login"
//                   className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
//                     />
//                   </svg>
//                   Login
//                 </NavLink>
//               )}
//             </div>

//             {/* Mobile: avatar + hamburger */}
//             <div className="flex md:hidden items-center gap-2">
//               {isLoggedIn && (
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white select-none">
//                   {user?.username?.[0]?.toUpperCase() ?? "U"}
//                 </div>
//               )}
//               <button
//                 onClick={() => setMobileMenuOpen((o) => !o)}
//                 aria-label="Toggle menu"
//                 className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
//               >
//                 {mobileMenuOpen ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M4 6h16M4 12h16M4 18h16"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
//             {/* User info */}
//             {isLoggedIn && (
//               <div className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-gray-50 rounded-xl">
//                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
//                   {user?.username?.[0]?.toUpperCase() ?? "U"}
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-gray-900 truncate">
//                     {user?.username}
//                   </p>
//                   <p className="text-xs text-gray-500 truncate">
//                     {user?.email}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Nav links */}
//             {navLinks.map((link) => (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={({ isActive }) =>
//                   isActive ? activeLinkClass : inactiveLinkClass
//                 }
//               >
//                 {link.icon}
//                 {link.label}
//               </NavLink>
//             ))}

//             {/* Divider */}
//             <div className="border-t border-gray-100 my-1" />

//             {/* Auth */}
//             {isLoggedIn ? (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                   />
//                 </svg>
//                 Logout
//               </button>
//             ) : (
//               <NavLink
//                 to="/login"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors justify-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
//                   />
//                 </svg>
//                 Login
//               </NavLink>
//             )}
//           </div>
//         )}
//       </nav>
//     </>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const Icon = {
  home: (
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
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  bookmarks: (
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
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  ),
  profile: (
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  dashboard: (
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
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  posts: (
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
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  users: (
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
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  roles: (
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
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  logout: (
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
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  login: (
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
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    </svg>
  ),
  menu: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  close: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

// ── Nav config per role ───────────────────────────────────────────────────────

const USER_LINKS: NavItem[] = [
  { to: "/home", label: "Home", icon: Icon.home },
  { to: "/bookmarks", label: "Bookmarks", icon: Icon.bookmarks },
  { to: "/profile", label: "Profile", icon: Icon.profile },
];

const MOD_LINKS: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Icon.dashboard },
  { to: "/admin/posts", label: "Posts", icon: Icon.posts },
  { to: "/admin/users", label: "Users", icon: Icon.users },
];

const ADMIN_LINKS: NavItem[] = [
  ...MOD_LINKS,
  { to: "/admin/roles", label: "Roles", icon: Icon.roles },
];

const getNavLinks = (role?: string[]): NavItem[] => {
  if (role?.includes("ADMIN")) return ADMIN_LINKS;
  if (role?.includes("MODERATOR")) return MOD_LINKS;
  if (role?.includes("USER")) return USER_LINKS;
  return [];
};

// ── Role badge ────────────────────────────────────────────────────────────────

const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 border border-purple-200",
    MOD: "bg-amber-100 text-amber-700 border border-amber-200",
    USER: "bg-blue-100 text-blue-700 border border-blue-200",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[role] ?? "bg-gray-100 text-gray-600"}`}
    >
      {role}
    </span>
  );
};

// ── Shared link classes ───────────────────────────────────────────────────────

const activeCls =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50";
const inactiveCls =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors";

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const role: string[] | undefined = user?.roles;
  const isLoggedIn = !!user;
  const navLinks = getNavLinks(role);
  const isAdminSide =
    role?.includes("ADMIN") || role?.includes("MODERATOR");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink
            to={isAdminSide ? "/admin/dashboard" : "/home"}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-900 tracking-tight">
                Pet Finder
              </span>
              {isAdminSide && (
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  Admin
                </span>
              )}
            </div>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
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
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <NavLink
                  to={role?.includes("USER") ? "/profile" : "/admin/dashboard"}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white select-none group-hover:ring-2 group-hover:ring-blue-300 transition shrink-0">
                    {user?.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition leading-none">
                      {user?.username}
                    </span>
                    {role && <RoleBadge role={role[0]} />}
                  </div>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  {Icon.logout}
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm"
              >
                {Icon.login}
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile: avatar + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white select-none shrink-0">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? Icon.close : Icon.menu}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {/* User info */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              {role && <RoleBadge role={role[0]} />}
            </div>
          )}

          {/* Nav links */}
          {navLinks.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-3 pt-1 pb-0.5">
                Navigation
              </p>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? activeCls : inactiveCls
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </>
          )}

          <div className="border-t border-gray-100 my-1.5" />

          {/* Auth */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              {Icon.logout}
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {Icon.login}
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
