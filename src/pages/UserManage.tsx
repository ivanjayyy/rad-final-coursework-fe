// import { useEffect, useState } from "react";
// import {
//   getAllUsersAdmin,
//   deleteUserAdmin,
//   toggleBanUserAdmin,
// } from "../service/admin";

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   role: "USER" | "MOD" | "ADMIN";
//   isBanned: boolean;
//   postCount: number;
//   createdAt: string;
// }

// // ── Confirm Modal (shared for delete + ban) ───────────────────────────────────
// const ConfirmModal = ({
//   title,
//   description,
//   confirmLabel,
//   confirmClass,
//   isLoading,
//   onConfirm,
//   onCancel,
//   icon,
// }: {
//   title: string;
//   description: React.ReactNode;
//   confirmLabel: string;
//   confirmClass: string;
//   isLoading: boolean;
//   onConfirm: () => void;
//   onCancel: () => void;
//   icon: React.ReactNode;
// }) => (
//   <div
//     className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//     onClick={(e) => {
//       if (e.target === e.currentTarget) onCancel();
//     }}
//   >
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
//       <div className="flex items-start gap-4">
//         <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
//           {icon}
//         </div>
//         <div>
//           <h3 className="text-base font-bold text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-500 mt-1">{description}</p>
//         </div>
//       </div>
//       <div className="flex gap-3 justify-end">
//         <button
//           onClick={onCancel}
//           disabled={isLoading}
//           className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           disabled={isLoading}
//           className={`px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 transition flex items-center gap-2 ${confirmClass}`}
//         >
//           {isLoading && (
//             <svg
//               className="animate-spin h-3.5 w-3.5"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               />
//             </svg>
//           )}
//           {isLoading ? "Please wait…" : confirmLabel}
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ── User Detail Drawer ────────────────────────────────────────────────────────
// const UserDetailDrawer = ({
//   user,
//   onClose,
//   onDelete,
//   onToggleBan,
// }: {
//   user: User;
//   onClose: () => void;
//   onDelete: (user: User) => void;
//   onToggleBan: (user: User) => void;
// }) => {
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   const roleBadgeClass: Record<string, string> = {
//     ADMIN: "bg-purple-100 text-purple-700 border border-purple-200",
//     MOD: "bg-amber-100 text-amber-700 border border-amber-200",
//     USER: "bg-blue-100 text-blue-700 border border-blue-200",
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
//           <h2 className="text-base font-bold text-gray-900">User Details</h2>
//           <button
//             onClick={onClose}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6">
//           {/* Avatar + name */}
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0 select-none">
//               {user.username[0]?.toUpperCase()}
//             </div>
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h3 className="text-lg font-bold text-gray-900">
//                   {user.username}
//                 </h3>
//                 <span
//                   className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${roleBadgeClass[user.role] ?? "bg-gray-100 text-gray-600"}`}
//                 >
//                   {user.role}
//                 </span>
//                 {user.isBanned && (
//                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
//                     Banned
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-gray-50 rounded-xl p-4">
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
//                 Posts
//               </p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {user.postCount}
//               </p>
//             </div>
//             <div className="bg-gray-50 rounded-xl p-4">
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
//                 Member since
//               </p>
//               <p className="text-sm font-semibold text-gray-900">
//                 {new Date(user.createdAt).toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                   year: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Info rows */}
//           <div className="flex flex-col gap-3">
//             {[
//               { label: "User ID", value: user._id, mono: true },
//               { label: "Email", value: user.email },
//               { label: "Role", value: user.role },
//               { label: "Status", value: user.isBanned ? "Banned" : "Active" },
//             ].map(({ label, value, mono }) => (
//               <div
//                 key={label}
//                 className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0"
//               >
//                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
//                   {label}
//                 </span>
//                 <span
//                   className={`text-sm text-gray-800 text-right break-all ${mono ? "font-mono text-xs" : "font-medium"}`}
//                 >
//                   {value}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col gap-2 pt-2">
//             <button
//               onClick={() => onToggleBan(user)}
//               className={`w-full py-2.5 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
//                 user.isBanned
//                   ? "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
//                   : "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
//               }`}
//             >
//               {user.isBanned ? (
//                 <>
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
//                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   Unban User
//                 </>
//               ) : (
//                 <>
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
//                       d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
//                     />
//                   </svg>
//                   Ban User
//                 </>
//               )}
//             </button>
//             <button
//               onClick={() => onDelete(user)}
//               className="w-full py-2.5 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//               Delete User
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Role badge (inline) ───────────────────────────────────────────────────────
// const RoleBadge = ({ role }: { role: string }) => {
//   const styles: Record<string, string> = {
//     ADMIN: "bg-purple-100 text-purple-700",
//     MOD: "bg-amber-100 text-amber-700",
//     USER: "bg-blue-100 text-blue-700",
//   };
//   return (
//     <span
//       className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[role] ?? "bg-gray-100 text-gray-600"}`}
//     >
//       {role}
//     </span>
//   );
// };

// // ── Admin Users Page ──────────────────────────────────────────────────────────
// const AdminUsersPage = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPageCount, setTotalPageCount] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState<
//     "ALL" | "USER" | "MOD" | "ADMIN"
//   >("ALL");

//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);
//   const [userToBan, setUserToBan] = useState<User | null>(null);
//   const [isActioning, setIsActioning] = useState(false);

//   const fetchData = async (pageNumber = 1) => {
//     setIsLoading(true);
//     try {
//       const res = await getAllUsersAdmin(pageNumber, 10);
//       setUsers(res?.data || []);
//       setPage(pageNumber);
//       setTotalPageCount(res?.pagination.totalPages || 0);
//       setTotalCount(res?.pagination.total || 0);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Debounce search
//   useEffect(() => {
//     const t = setTimeout(() => fetchData(1), 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     document.body.style.overflow =
//       selectedUser || userToDelete || userToBan ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [selectedUser, userToDelete, userToBan]);

//   const handleDelete = async () => {
//     if (!userToDelete) return;
//     setIsActioning(true);
//     try {
//       await deleteUserAdmin(userToDelete._id);
//       setUserToDelete(null);
//       setSelectedUser(null);
//       fetchData(page);
//     } finally {
//       setIsActioning(false);
//     }
//   };

//   const handleToggleBan = async () => {
//     if (!userToBan) return;
//     setIsActioning(true);
//     try {
//       const res = await toggleBanUserAdmin(userToBan._id);
//       // Update in place
//       setUsers((prev) =>
//         prev.map((u) =>
//           u._id === userToBan._id ? { ...u, isBanned: res.data.isBanned } : u,
//         ),
//       );
//       if (selectedUser?._id === userToBan._id) {
//         setSelectedUser((prev) =>
//           prev ? { ...prev, isBanned: res.data.isBanned } : prev,
//         );
//       }
//       setUserToBan(null);
//     } finally {
//       setIsActioning(false);
//     }
//   };

//   const openDeleteFromDrawer = (user: User) => {
//     setSelectedUser(null);
//     setTimeout(() => setUserToDelete(user), 50);
//   };

//   const openBanFromDrawer = (user: User) => {
//     setSelectedUser(null);
//     setTimeout(() => setUserToBan(user), 50);
//   };

//   const filteredUsers =
//     roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-5">
//         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 tracking-tight">
//               User Management
//             </h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {isLoading ? "Loading…" : `${totalCount} total users`}
//             </p>
//           </div>

//           {/* Role filter chips */}
//           <div className="flex gap-2 flex-wrap">
//             {[
//               {
//                 label: "All",
//                 value: "ALL",
//                 cls: "bg-gray-100 text-gray-700 border-gray-200",
//               },
//               {
//                 label: "User",
//                 value: "USER",
//                 cls: "bg-blue-50 text-blue-700 border-blue-200",
//               },
//               {
//                 label: "Mod",
//                 value: "MOD",
//                 cls: "bg-amber-50 text-amber-700 border-amber-200",
//               },
//               {
//                 label: "Admin",
//                 value: "ADMIN",
//                 cls: "bg-purple-50 text-purple-700 border-purple-200",
//               },
//             ].map((f) => (
//               <button
//                 key={f.value}
//                 onClick={() => setRoleFilter(f.value as any)}
//                 className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${f.cls} ${roleFilter === f.value ? "ring-2 ring-offset-1 ring-blue-400" : "opacity-70 hover:opacity-100"}`}
//               >
//                 {f.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
//         {/* Search */}
//         <div className="relative max-w-sm">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by username or email…"
//             className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-3.5 w-3.5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           )}
//         </div>

//         {/* Loading skeleton */}
//         {isLoading && (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 animate-pulse"
//               >
//                 <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
//                 <div className="flex-1 flex flex-col gap-2">
//                   <div className="h-3.5 bg-gray-200 rounded w-1/4" />
//                   <div className="h-3 bg-gray-100 rounded w-1/3" />
//                 </div>
//                 <div className="h-5 w-12 bg-gray-200 rounded-full hidden md:block" />
//                 <div className="h-5 w-16 bg-gray-100 rounded hidden md:block" />
//                 <div className="flex gap-2 shrink-0">
//                   <div className="h-8 w-16 bg-gray-200 rounded-lg" />
//                   <div className="h-8 w-8 bg-gray-200 rounded-lg" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty state */}
//         {!isLoading && filteredUsers.length === 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-500 font-medium text-sm">No users found</p>
//             {search && (
//               <p className="text-gray-400 text-xs mt-1">
//                 Try a different search term.
//               </p>
//             )}
//           </div>
//         )}

//         {/* Table */}
//         {!isLoading && filteredUsers.length > 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             {/* Header row */}
//             <div className="hidden md:grid grid-cols-[40px_1fr_100px_80px_90px_120px] items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
//               <div />
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//                 User
//               </p>
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//                 Role
//               </p>
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//                 Posts
//               </p>
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//                 Status
//               </p>
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//                 Actions
//               </p>
//             </div>

//             {filteredUsers.map((user, index) => (
//               <div
//                 key={user._id || index}
//                 className="flex md:grid md:grid-cols-[40px_1fr_100px_80px_90px_120px] items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
//               >
//                 {/* Avatar */}
//                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white select-none shrink-0">
//                   {user.username[0]?.toUpperCase()}
//                 </div>

//                 {/* Name + email */}
//                 <div className="flex-1 min-w-0">
//                   <button
//                     onClick={() => setSelectedUser(user)}
//                     className="text-left group w-full"
//                   >
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
//                         {user.username}
//                       </p>
//                       {user.isBanned && (
//                         <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
//                           Banned
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-400 truncate">
//                       {user.email}
//                     </p>
//                   </button>
//                 </div>

//                 {/* Role */}
//                 <div className="hidden md:block">
//                   <RoleBadge role={user.role} />
//                 </div>

//                 {/* Post count */}
//                 <p className="hidden md:block text-sm text-gray-600 font-medium">
//                   {user.postCount}
//                 </p>

//                 {/* Status */}
//                 <div className="hidden md:block">
//                   <span
//                     className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.isBanned ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
//                   >
//                     <span
//                       className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-red-500" : "bg-green-500"}`}
//                     />
//                     {user.isBanned ? "Banned" : "Active"}
//                   </span>
//                 </div>

//                 {/* Actions */}
//                 <div className="shrink-0 ml-auto md:ml-0 flex items-center gap-1.5">
//                   {/* Ban / Unban */}
//                   <button
//                     onClick={() => setUserToBan(user)}
//                     title={user.isBanned ? "Unban user" : "Ban user"}
//                     className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
//                       user.isBanned
//                         ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
//                         : "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
//                     }`}
//                   >
//                     {user.isBanned ? (
//                       <>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-3.5 w-3.5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                         <span className="hidden sm:inline">Unban</span>
//                       </>
//                     ) : (
//                       <>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-3.5 w-3.5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
//                           />
//                         </svg>
//                         <span className="hidden sm:inline">Ban</span>
//                       </>
//                     )}
//                   </button>

//                   {/* Delete */}
//                   <button
//                     onClick={() => setUserToDelete(user)}
//                     title="Delete user"
//                     className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
//                         d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {!isLoading && totalPageCount > 1 && (
//           <div className="flex items-center justify-between gap-4 pt-2">
//             <p className="text-sm text-gray-500">
//               Page <span className="font-semibold text-gray-700">{page}</span>{" "}
//               of{" "}
//               <span className="font-semibold text-gray-700">
//                 {totalPageCount}
//               </span>
//             </p>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => fetchData(page - 1)}
//                 disabled={page <= 1}
//                 className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 Prev
//               </button>
//               {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
//                 (p) => (
//                   <button
//                     key={p}
//                     onClick={() => fetchData(p)}
//                     className={`w-9 h-9 text-sm font-medium rounded-lg transition ${p === page ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
//                   >
//                     {p}
//                   </button>
//                 ),
//               )}
//               <button
//                 onClick={() => fetchData(page + 1)}
//                 disabled={page >= totalPageCount}
//                 className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//               >
//                 Next
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* User Detail Drawer */}
//       {selectedUser && (
//         <UserDetailDrawer
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onDelete={openDeleteFromDrawer}
//           onToggleBan={openBanFromDrawer}
//         />
//       )}

//       {/* Delete Confirm Modal */}
//       {userToDelete && (
//         <ConfirmModal
//           title="Delete this user?"
//           description={
//             <>
//               <span className="font-medium text-gray-700">
//                 {userToDelete.username}
//               </span>{" "}
//               and all their posts and bookmarks will be permanently removed.
//               This cannot be undone.
//             </>
//           }
//           confirmLabel="Yes, delete"
//           confirmClass="bg-red-600 hover:bg-red-700"
//           isLoading={isActioning}
//           onConfirm={handleDelete}
//           onCancel={() => setUserToDelete(null)}
//           icon={
//             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-red-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//             </div>
//           }
//         />
//       )}

//       {/* Ban / Unban Confirm Modal */}
//       {userToBan && (
//         <ConfirmModal
//           title={userToBan.isBanned ? "Unban this user?" : "Ban this user?"}
//           description={
//             userToBan.isBanned ? (
//               <>
//                 <span className="font-medium text-gray-700">
//                   {userToBan.username}
//                 </span>{" "}
//                 will be able to log in and use the platform again.
//               </>
//             ) : (
//               <>
//                 <span className="font-medium text-gray-700">
//                   {userToBan.username}
//                 </span>{" "}
//                 will be blocked from accessing the platform. You can unban them
//                 at any time.
//               </>
//             )
//           }
//           confirmLabel={userToBan.isBanned ? "Yes, unban" : "Yes, ban"}
//           confirmClass={
//             userToBan.isBanned
//               ? "bg-green-600 hover:bg-green-700"
//               : "bg-amber-600 hover:bg-amber-700"
//           }
//           isLoading={isActioning}
//           onConfirm={handleToggleBan}
//           onCancel={() => setUserToBan(null)}
//           icon={
//             <div
//               className={`w-10 h-10 rounded-full flex items-center justify-center ${userToBan.isBanned ? "bg-green-100" : "bg-amber-100"}`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className={`h-5 w-5 ${userToBan.isBanned ? "text-green-600" : "text-amber-600"}`}
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
//                 />
//               </svg>
//             </div>
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default AdminUsersPage;

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../service/user";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  roles: string[] | string;
  createdAt?: string;
  status?: "ACTIVE" | "SUSPENDED";
}

const parseRolesList = (rolesData: any): string[] => {
  if (!rolesData) return ["USER"];
  if (Array.isArray(rolesData)) return rolesData;
  try {
    return JSON.parse(rolesData);
  } catch {
    return [rolesData.toString()];
  }
};

// ── User Delete Confirmation Modal ─────────────────────────────────────────────
const UserDeleteModal = ({
  user,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  user: UserProfile;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}
  >
    <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm p-6 flex flex-col gap-5 transform rotate-[1deg]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 border-4 border-black bg-red-400 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
            Terminate Agent?
          </h3>
          <p className="text-sm font-bold text-gray-700 mt-2">
            User Account{" "}
            <span className="bg-yellow-300 px-1 border border-black font-extrabold block my-1 text-center">
              @{user.username || "Unknown Submitter"}
            </span>{" "}
            and all corresponding records will be thoroughly purged!
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-black border-4 border-black rounded-none bg-white hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
        >
          ABORT
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-black border-4 border-black rounded-none bg-red-500 text-white hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
        >
          {isDeleting ? "PURGING..." : "YES, EXILE!"}
        </button>
      </div>
    </div>
  </div>
);

// ── User Detailed Profile Inspector Modal ──────────────────────────────────────
const UserDetailInspectorModal = ({
  user,
  onClose,
}: {
  user: UserProfile;
  onClose: () => void;
}) => {
  const parsedRoles = parseRolesList(user.roles);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        {/* Comic Header Title Frame */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-cyan-400">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            🕵️‍♂️ Core Dossier File 🕵️‍♂️
          </h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black rounded-none bg-white text-black hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Dossier Meta Content Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-5 border-4 border-black p-4 bg-purple-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-20 h-20 bg-yellow-300 border-4 border-black overflow-hidden shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-3xl">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                user.username.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-black uppercase bg-black text-white px-1.5 py-0.5 tracking-wider">
                HANDLE
              </span>
              <h3 className="text-2xl font-black text-black truncate mt-1">
                @{user.username}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
                Verified Email Terminal
              </label>
              <p className="text-base font-extrabold text-black bg-white border-2 border-black p-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-all">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
                Dossier Clearance Permissions
              </label>
              <div className="flex flex-wrap gap-2">
                {parsedRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    ⚡ {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="border-2 border-black p-2 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Database ID
                </p>
                <p className="text-xs font-mono font-bold text-black mt-1 truncate">
                  {user._id}
                </p>
              </div>
              <div className="border-2 border-black p-2 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Account Status
                </p>
                <p className="text-xs font-black text-emerald-600 uppercase mt-1">
                  ● ACTIVE USER
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Admin User Management Page Layout Component ───────────────────────────────
const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsersList = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers();
      // Adjust structure path fallback checks if your response wraps records inside a payload block
      const records = Array.isArray(res) ? res : res?.data || [];
      setUsers(records);
    } catch (err) {
      console.error("Failed executing user load sequence pipeline", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  // Handle document structural background locking when modal display targets hit
  useEffect(() => {
    document.body.style.overflow = selectedUser || userToDelete ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedUser, userToDelete]);

  const handleDeleteUserExecution = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete._id);
      setUserToDelete(null);
      await fetchUsersList();
    } catch (err) {
      console.error("Purge operations crashed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return (
      !query ||
      u.username?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u._id?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-amber-50 font-sans antialiased text-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Comic Banner Page Header Section */}
        <div className="bg-cyan-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform rotate-[-0.3deg]">
          <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-4 py-1 uppercase tracking-widest border-b-4 border-l-4 border-black">
            HQ SECURITY
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
              👥 Agent Directory HQ 👥
            </h1>
            <p className="text-sm font-black text-black mt-1 bg-white/70 px-2 py-0.5 border border-black inline-block">
              {isLoading
                ? "POLLING ACTIVE DOSSIERS..."
                : `${users.length} TOTAL USERS RECORDED`}
            </p>
          </div>
        </div>

        {/* Input Interface Search Control Box */}
        <div className="relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH AGENTS BY HANDLE, EMAIL, ID..."
            className="w-full pl-4 pr-10 py-2.5 text-sm font-bold border-4 border-black rounded-none bg-white text-black focus:outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder-gray-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Loading Matrix Skeleton Modules */}
        {isLoading && (
          <div className="border-4 border-black bg-white divide-y-4 divide-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-5 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-300 border-2 border-black rounded-none shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 border border-black w-1/5" />
                  <div className="h-3 bg-gray-200 border border-black w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terminal Result Matrix Match Fallback */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-yellow-300 border-2 border-black flex items-center justify-center mb-4 transform -rotate-12">
              <span className="text-2xl font-black">🛸</span>
            </div>
            <p className="text-xl font-black uppercase text-black">
              Zero Active Signatures Match Query Filter
            </p>
          </div>
        )}

        {/* Neo-brutalist User Table Grid Section */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Table Headers (Desktop Layout Split) */}
            <div className="hidden md:grid grid-cols-[74px_2fr_2fr_2fr_80px] items-center gap-4 px-6 py-3 border-b-4 border-black bg-yellow-300 font-black uppercase tracking-wider text-sm">
              <p className="text-center">Avatar</p>
              <p>Profile Handle</p>
              <p>Email Connection</p>
              <p>Clearance Roles</p>
              <div />
            </div>

            {/* Core Iteration Data Block Row Arrays */}
            <div className="divide-y-4 divide-black">
              {filteredUsers.map((user, idx) => {
                const rolesArray = parseRolesList(user.roles);
                return (
                  <div
                    key={user._id || idx}
                    className="flex flex-col md:grid md:grid-cols-[74px_2fr_2fr_2fr_80px] items-start md:items-center gap-4 px-6 py-4 hover:bg-purple-50 transition-colors bg-white cursor-pointer group"
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* Column 1: Profile Picture Box Frame */}
                    <div
                      className="w-14 h-14 border-2 border-black bg-purple-300 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()} // Keeps profile picture box isolated
                    >
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        user.username.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    {/* Column 2: Profile Interactive Handle Click Trigger */}
                    <div className="min-w-0">
                      <p className="text-lg font-black text-black capitalize group-hover:text-cyan-600 group-hover:underline decoration-2 transition-all truncate">
                        @{user.username || "Anonymous Agent"}
                      </p>
                      <span className="inline-block md:hidden font-mono text-[10px] bg-gray-100 border border-black px-1 mt-0.5">
                        ID: {user._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Column 3: Communication Node Link Info */}
                    <p className="text-sm font-extrabold text-gray-700 break-all truncate max-w-xs md:max-w-none">
                      {user.email || "—"}
                    </p>

                    {/* Column 4: Permission Badges Wrapper */}
                    <div
                      className="flex flex-wrap gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rolesArray.map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 border-2 border-black bg-purple-200 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Column 5: Action Extermination System Processing Button */}
                    <div
                      className="ml-auto md:ml-0 pt-2 md:pt-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-2 border-2 border-black bg-white text-black hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title="Purge user entry file"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Popups & Dialog Overlays Context Framework */}
      {selectedUser && (
        <UserDetailInspectorModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {userToDelete && (
        <UserDeleteModal
          user={userToDelete}
          onConfirm={handleDeleteUserExecution}
          onCancel={() => setUserToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;